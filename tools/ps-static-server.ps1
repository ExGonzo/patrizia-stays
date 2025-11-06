param(
    [string]$Root = ".",
    [int]$Port = 8000
)

# HttpListener is available in .NET; explicit Add-Type is unnecessary in PowerShell 5

function Get-ContentType($path) {
    switch ([System.IO.Path]::GetExtension($path).ToLower()) {
        ".html" { return "text/html" }
        ".htm" { return "text/html" }
        ".css" { return "text/css" }
        ".js" { return "application/javascript" }
        ".json" { return "application/json" }
        ".jpg" { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".png" { return "image/png" }
        ".gif" { return "image/gif" }
        ".svg" { return "image/svg+xml" }
        ".ico" { return "image/x-icon" }
        ".webmanifest" { return "application/manifest+json" }
        default { return "application/octet-stream" }
    }
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Static server running at $prefix serving '$Root'" -ForegroundColor Green
} catch {
    Write-Error "Failed to start server: $_"
    exit 1
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) { $localPath = 'index.html' }

        $fullPath = [System.IO.Path]::Combine($Root, $localPath)

        if (-Not (Test-Path $fullPath)) {
            # Try directory index
            if (Test-Path ([System.IO.Path]::Combine($fullPath, 'index.html'))) {
                $fullPath = [System.IO.Path]::Combine($fullPath, 'index.html')
            }
        }

        if (Test-Path $fullPath) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $res.ContentType = Get-ContentType $fullPath
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.StatusCode = 200
            } catch {
                $res.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }

        $res.OutputStream.Close()
    } catch {
        # Swallow errors to keep server alive
        Start-Sleep -Milliseconds 50
    }
}