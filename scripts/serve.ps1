Param(
  [int]$Port = 8000
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $((Get-Location).Path) at $prefix"

function Get-ContentType($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLower()) {
    '.html' { 'text/html' }
    '.htm' { 'text/html' }
    '.css' { 'text/css' }
    '.js' { 'application/javascript' }
    '.json' { 'application/json' }
    '.png' { 'image/png' }
    '.jpg' { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.gif' { 'image/gif' }
    '.svg' { 'image/svg+xml' }
    '.ico' { 'image/x-icon' }
    default { 'application/octet-stream' }
  }
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $path = $request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $file = Join-Path (Get-Location) $path
    if (-not (Test-Path $file)) {
      # fallback: if path refers to directory, try index.html
      if (Test-Path (Join-Path (Get-Location) $path) -PathType Container) {
        $file = Join-Path (Join-Path (Get-Location) $path) 'index.html'
      }
    }
    if (-not (Test-Path $file)) {
      $context.Response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $context.Response.Close()
      continue
    }
    $contentType = Get-ContentType $file
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}