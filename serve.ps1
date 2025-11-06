Param(
    [int]$Port = 8000
)

# Load core System assembly so HttpListener is available
Add-Type -AssemblyName System
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Static server running at $prefix"
} catch {
    Write-Error ("Failed to start server on port {0}. Error: {1}" -f $Port, $_.Exception.Message)
    exit 1
}

function Get-ContentType($path) {
    switch ([System.IO.Path]::GetExtension($path).ToLower()) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css' }
        '.js'   { 'application/javascript' }
        '.json' { 'application/json' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.svg'  { 'image/svg+xml' }
        default { 'application/octet-stream' }
    }
}

function Sanitize-Path($localPath) {
    $trimmed = $localPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($trimmed)) { return 'index.html' }
    # Prevent directory traversal
    $trimmed = $trimmed -replace '\\.\\.', ''
    return $trimmed
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = Sanitize-Path $request.Url.LocalPath
        $fullPath = Join-Path (Resolve-Path .) $relPath

        if (Test-Path $fullPath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.StatusCode = 200
                $response.ContentType = Get-ContentType $fullPath
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error")
                $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            }
        } elseif (Test-Path $fullPath -PathType Container) {
            # If directory requested, try index.html inside
            $indexPath = Join-Path $fullPath 'index.html'
            if (Test-Path $indexPath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                $response.StatusCode = 200
                $response.ContentType = 'text/html; charset=utf-8'
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 403
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }

        $response.Close()
    } catch {
        # Log and continue
        Write-Host "Request error: $_"
    }
}

trap {
    try { $listener.Stop() } catch {}
    try { $listener.Close() } catch {}
}