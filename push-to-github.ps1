# Macramumu — Push to GitHub
# Run this script from the Macramumu root folder

$root = "C:\Users\csmit\OneDrive\Desktop\Kiro_porject\Macramumu"

Write-Host "Removing any nested .git folders..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$root\apps\web\.git" -ErrorAction SilentlyContinue

Write-Host "Initialising git at root..." -ForegroundColor Yellow
Set-Location $root
git init

Write-Host "Setting up remote..." -ForegroundColor Yellow
git remote add origin https://github.com/ckky123/macramumu.git

Write-Host "Staging all files..." -ForegroundColor Yellow
git add .

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Initial commit: Macramumu e-commerce website"

Write-Host "Pushing to main..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host "Done! Check https://github.com/ckky123/macramumu" -ForegroundColor Green
