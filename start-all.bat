@echo off
echo Iniciando backend...
start cmd /k "cd backend && node app.js"

timeout /t 2

echo Iniciando microservicio ML...
start cmd /k "cd ml_service && python main.py"

timeout /t 2

echo Iniciando frontend...
start cmd /k "cd frontend && npm start"

echo Todo está corriendo. Presiona cualquier tecla para salir de esta ventana.
pause >nul
