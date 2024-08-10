@echo off
setlocal enabledelayedexpansion

:: Definir o diretório onde estão os arquivos
set "target_dir=/"

:: Navegar para o diretório alvo
cd /d "%target_dir%"

set /a count=1

:: Adicionar e comitar arquivos não rastreados
for /f "tokens=*" %%f in ('git ls-files --others --exclude-standard') do (
    echo Adding untracked file %%f
    git add "%%f"
    git commit -m "commit !count! - %%f"
    set /a count+=1
)

:: Adicionar e comitar arquivos modificados
for /f "tokens=*" %%f in ('git diff --name-only') do (
    echo Adding modified file %%f
    git add "%%f"
    git commit -m "commit !count! - %%f"
    set /a count+=1
)

pause
