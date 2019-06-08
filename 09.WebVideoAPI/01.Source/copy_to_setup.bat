echo. 
echo copy video_view

echo %~dp0

md %~dp0\..\02.Setup
md %~dp0\..\02.Setup\layui

cd %~d0
xcopy %~dp0\layui\*  ..\02.Setup\layui /s /e /k /y
copy  %~dp0\web_config.ini  ..\02.Setup
copy  %~dp0\jquery-1.12.4.min.js  ..\02.Setup
copy  %~dp0\index.html  ..\02.Setup
copy %~dp0\video_view.css  ..\02.Setup
copy %~dp0\video_view.js  ..\02.Setup
copy  %~dp0\video_view.php  ..\02.Setup
copy  %~dp0\vsplayer.js ..\02.Setup

pause
