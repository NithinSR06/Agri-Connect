@echo off
echo Starting Farm Connect...

start "Farm Connect Server" cmd /k "cd server && npm start"
start "Farm Connect Client" cmd /k "cd client && npm run dev"

echo Backend and Frontend started in separate windows.
