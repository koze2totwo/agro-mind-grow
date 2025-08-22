@echo off
echo Adding changes to git...
git add .
echo.
echo Committing changes...
git commit -m "Fix weather module import issue by updating .gitignore"
echo.
echo Pushing to GitHub...
git push
echo.
echo Done!
pause
