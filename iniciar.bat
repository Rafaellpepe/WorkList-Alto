@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  call npm install || goto erro
)
if not exist web\dist (
  call npm run build || goto erro
)
start "" http://localhost:3333
call npm start
goto fim
:erro
echo Ocorreu um erro. Veja a mensagem acima.
pause
:fim
