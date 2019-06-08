<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="layui/css/layui.css">
        <script src="jquery-1.12.4.min.js"></script>
        <script type="text/javascript" src="layui/layui.js"></script>
        <script>
                //加载css
                var loadCssFile=[
                    "video_view.css",
                ];
                for(var i =0;i<loadCssFile.length;i++){
                    document.write("<link rel='stylesheet' type='text/css' href='"+loadCssFile[i]+"?random=" + Math.random() + "' />");
                }
                //加载js
                var loadJsFile=[
                    "vsplayer.js",
                    "video_view.js",
                ];
                for(var i =0;i<loadJsFile.length;i++){
                    document.write("<script type='text/javascript' src='"+ loadJsFile[i] + "?random=" + Math.random() + "'></s" + "cript>");
                }
        </script>
        <title>网页视频对接</title>
    </head>
    <body>
        <div class="video_main">
                <div class ="video_ctrl_area">
                <label class="layui-form-label info_status" id="show_player_info"></label>
                    <label class="layui-form-label info_status" id="show_status">状态</label>
                    <button class="layui-btn layui-btn-radius" id="start">
                        <i class="layui-icon"></i> 开始
                    </button>
                    <button class="layui-btn layui-btn-radius" id="stop">
                        <i class="layui-icon"></i> 停止
                    </button>
                    <button class="layui-btn layui-btn-radius" id="startListen">
                        <i class="layui-icon"></i> 启动监听
                    </button>
                    <button class="layui-btn layui-btn-radius" id="stopListen">
                        <i class="layui-icon"></i> 停止监听
                    </button>
                    <div class="right_ctrl_panel">
                        <div class="layui-btn-group">
                                <button class="layui-btn" id="split_1" value="1">1</button>
                                <button class="layui-btn" id="split_4" value="4">4</button>
                                <button class="layui-btn" id="split_6" value="6">6</button>
                                <button class="layui-btn" id="split_8" value="8">8</button>
                                <button class="layui-btn" id="split_9" value="9">9</button>
                         </div> 
                    </div>
                </div>
                <div class="video_player_area">
                </div>
        </div>
        <script>


            <?php
                $vehicleNo = $_GET["vehicleNo"];
                @$ini_array = parse_ini_file(__DIR__."/web_config.ini", true);
                if ($ini_array) {
                    //echo 'var cfgTitle = "'.mb_convert_encoding($ini_array["Web"]["Title"], "UTF-8", "GBK").'";'."\n";
                   // echo '<title>'.mb_convert_encoding($ini_array["Web"]["Title"], "UTF-8", "GBK").'</title>';
                    echo 'var IP = "'.$ini_array["Web"]["IP"].'";'."\n";
                    echo 'var Port = '.$ini_array["Web"]["Port"].';'."\n";
                    if (isset($ini_array["Web"]["UserName"])) {
                        echo 'var pwd = "'.$ini_array["Web"]["Pwd"].'";'."\n";
                        echo 'var UserName = "'.$ini_array["Web"]["UserName"].'";'."\n";
                    } else {
                        echo 'var UserName = null;'."\n";
                    }
                } else {
                    echo 'var IP = 127.0.0.1;'."\n";
                    echo 'var Port = 8080;'."\n";
                   // echo '<title>网页视频对接</title>';
                }
                
                echo 'var reqVehicleNo = "'.$vehicleNo.'";'."\n";
        
                
        ?>
         window.videoObj = new VideoView(9);
         window.videoObj.init(IP,Port,UserName,pwd,reqVehicleNo);

       //  connectNet();
        </script>
    </body>
</html>