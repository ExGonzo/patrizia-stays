param(
  [int]$Port = 8000,
  [string]$Root = (Resolve-Path "$PSScriptRoot\..\").Path
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
try {
  $listener.Start()
  Write-Host "Static server running at $prefix serving '$Root'" -ForegroundColor Green
} catch {
  Write-Error ("Failed to start HttpListener on {0}: {1}" -f $prefix, $_.Exception.Message)
  exit 1
}

function Get-ContentType($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLower()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.jpg'  { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.png'  { 'image/png' }
    '.gif'  { 'image/gif' }
    '.webp' { 'image/webp' }
    '.svg'  { 'image/svg+xml' }
    '.ico'  { 'image/x-icon' }
    '.woff' { 'font/woff' }
    '.woff2'{ 'font/woff2' }
    '.ttf'  { 'font/ttf' }
    '.map'  { 'application/json; charset=utf-8' }
    '.txt'  { 'text/plain; charset=utf-8' }
    '.xml'  { 'application/xml; charset=utf-8' }
    default { 'application/octet-stream' }
  }
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $localPath = $req.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($localPath)) { $localPath = 'index.html' }
    $fsPath = Join-Path $Root $localPath
    Write-Host ("{0} {1}" -f $req.HttpMethod, $localPath) -ForegroundColor DarkGray
    if (Test-Path $fsPath -PathType Container) {
      # Serve index.html for directory requests
      $indexPath = Join-Path $fsPath 'index.html'
      if (Test-Path $indexPath -PathType Leaf) {
        try {
          $bytes = [System.IO.File]::ReadAllBytes($indexPath)
          $res.ContentType = Get-ContentType $indexPath
          $res.StatusCode = 200
          $res.ContentLength64 = $bytes.Length
          $res.Headers.Add('Cache-Control','no-cache')
          $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
          $res.StatusCode = 500
          $msg = [Text.Encoding]::UTF8.GetBytes("Internal Server Error")
          $res.ContentType = 'text/plain; charset=utf-8'
          $res.OutputStream.Write($msg, 0, $msg.Length)
          Write-Warning ("Error serving file '{0}': {1}" -f $indexPath, $_)
        }
      } else {
        $res.StatusCode = 404
        $msg = [Text.Encoding]::UTF8.GetBytes("Not Found: $localPath")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Warning ("404 Not Found: {0}" -f $localPath)
      }
    } elseif (Test-Path $fsPath -PathType Leaf) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($fsPath)
        $res.ContentType = Get-ContentType $fsPath
        $res.StatusCode = 200
        $res.ContentLength64 = $bytes.Length
        $res.Headers.Add('Cache-Control','no-cache')
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $res.StatusCode = 500
        $msg = [Text.Encoding]::UTF8.GetBytes("Internal Server Error")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Warning ("Error serving file '{0}': {1}" -f $fsPath, $_)
      }
    } else {
      $res.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes("Not Found: $localPath")
      $res.ContentType = 'text/plain; charset=utf-8'
      $res.OutputStream.Write($msg, 0, $msg.Length)
      Write-Warning ("404 Not Found: {0}" -f $localPath)
    }
    $res.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}