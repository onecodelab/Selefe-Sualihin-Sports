# Zip the source code for MobSF analysis
$zipFile = "mobsf_scan_source.zip"
if (Test-Path $zipFile) { Remove-Item $zipFile }
Compress-Archive -Path "src", "public", "index.html", "package.json" -DestinationPath $zipFile
Write-Host "Project source code zipped to $zipFile"
Write-Host "You can now upload this file to MobSF for Static Analysis."
Write-Host "To run MobSF in Docker:"
Write-Host "docker pull opensecurity/mobile-security-framework-mobsf:latest"
Write-Host "docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest"
