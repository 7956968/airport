
const MAX_VIDEO_NUM = 10;
const VIDEO_BORDER_DEFAULT_COLOR = "rgb(255,125,0)";
const SPLIT_ARRAY_DEF=[1,4,6,8,9];
var videoWinSplitDef=[
    {
        count:1,
        param:[
            {
                top:'0px',
                left:'0px',
                width:'calc(100% - 4px)',
                height:'calc(100% - 4px)'//calc运算符一定要有空格，要不然解析不了
            }
        ]
    },//1分屏
    {
        count:4,
        param:[
            {
                top:'0px',
                left:'0px',
                width:'calc(50% - 4px)',
                height:'calc(50% - 4px)'
            },
            {
                top:'0px',
                left:'50%',
                width:'calc(50% - 4px)',
                height:'calc(50% - 4px)'
            },
            {
                top:'50%',
                left:'0px',
                width:'calc(50% - 4px)',
                height:'calc(50% - 4px)'
            },
            {
                top:'50%',
                left:'50%',
                width:'calc(50% - 4px)',
                height:'calc(50% - 4px)'
            }
        ]
    },//4分屏
    {
        count:6,
        param:[
            {
                top:'0px',
                left:'0px',
                width:'calc(100% / 3 * 2 - 6px)',
                height:'calc(100% / 3 * 2 - 8px)'
            },//大屏
            {
                top:'calc(100% / 3 * 2 - 4px)',
                left:'0px',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1)'
            },//左下1
            {
                top:'calc(100% / 3 * 2 - 4px)',
                left:'calc(100% / 3 * 1 - 0px)',
                width:'calc(100% / 3 * 1 - 6px)',
                height:'calc(100% / 3 * 1)'
            },//左下2
            {
                top:'calc(100% / 3 * 2 - 4px)',
                left:'calc(100% / 3 * 2 - 2px)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1)'
            },//左下3
            {
                top:'0px',
                left:'calc(100% / 3 * 2 - 2px)',
                width:'calc(100% / 3 * 1 - 2px)',
                height:'calc(100% / 3 * 1 - 8px)'
            },//右上1
            {
                top:'calc(100% / 3 * 1 - 4px)',
                left:'calc(100% / 3 * 2 - 2px)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 4px)'
            }//右上2
        ]
    },//6分屏
    {
        count:8,
        param:[
            {
                top:'0px',
                left:'0px',
                width:'calc(100% / 4 * 3 - 6px)',
                height:'calc(100% / 4 * 3 - 8px)'
            },//大屏
            {
                top:'calc(100% / 4 * 3 - 4px)',
                left:'0px',
                width:'calc(100% / 4 * 1 - 4px)',
                height:'calc(100% / 4 * 1)'
            },//左下1
            {
                top:'calc(100% / 4 * 3 - 4px)',
                left:'calc(100% / 4 * 1 - 0px)',
                width:'calc(100% / 4 * 1 - 6px)',
                height:'calc(100% / 4 * 1)'
            },//左下2
            {
                top:'calc(100% / 4 * 3 - 4px)',
                left:'calc(100% / 4 * 2 - 2px)',
                width:'calc(100% / 4 * 1 - 4px)',
                height:'calc(100% / 4 * 1)'
            },//左下3
            {
                top:'calc(100% / 4 * 3 - 4px)',
                left:'calc(100% / 4 * 3 - 2px)',
                width:'calc(100% / 4 * 1 - 2px)',
                height:'calc(100% / 4 * 1)'
            },//左下4
            {
                top:'0px',
                left:'calc(100% / 4 * 3 - 2px)',
                width:'calc(100% / 4 * 1 - 4px)',
                height:'calc(100% / 4 * 1 - 6px)'
            },//右上1
            {
                top:'calc(100% / 4 * 1 - 2px)',
                left:'calc(100% / 4 * 3 - 2px)',
                width:'calc(100% / 4 * 1 - 4px)',
                height:'calc(100% / 4 * 1 - 6px)'
            },//右上2
            {
                top:'calc(100% / 4 * 2 - 4px)',
                left:'calc(100% / 4 * 3 - 2px)',
                width:'calc(100% / 4 * 1 - 4px)',
                height:'calc(100% / 4 * 1 - 4px)'
            }//右上3
        ]
    },//8分屏
    {
        count:9,
        param:[
            {
                top:'0px',
                left:'0px',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 6px)'
            },//1,1
            {
                top:'0px',
                left:'calc(100% / 3 * 1)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 6px)'
            },//1,2
            {
                top:'0px',
                left:'calc(100% / 3 * 2)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 6px)'
            },//1,3
            {
                top:'calc(100% / 3 * 1 - 2px)',
                left:'0px',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 2px)'
            },//2,1
            {
                top:'calc(100% / 3 * 1 - 2px)',
                left:'calc(100% / 3 * 1)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 2px)'
            },//2,2
            {
                top:'calc(100% / 3 * 1 - 2px)',
                left:'calc(100% / 3 * 2)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 2px)'
            },//2,3
            {
                top:'calc(100% / 3 * 2)',
                left:'0px',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 4px)'
            },//3,1
            {
                top:'calc(100% / 3 * 2)',
                left:'calc(100% / 3 * 1)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 4px)'
            },//3,2
            {
                top:'calc(100% / 3 * 2)',
                left:'calc(100% / 3 * 2)',
                width:'calc(100% / 3 * 1 - 4px)',
                height:'calc(100% / 3 * 1 - 4px)'
            }//3,3
        ]        
    }//9分屏
];
var mIP = "";
var mPort = "";
var mUserName = "";
var mPwd = "";
var mVehicleNo = "";
var mVideoCount =0;

function VideoView(videoCount){

    mVideoCount = videoCount;
    console.log("mVideoCount"+mVideoCount);
}

VideoView.prototype.init = function(ip,port,username,pwd,vehicleNo){
    mIP = ip;
    mPort = port;
    mPwd = pwd;
    mUserName = username;
    mVehicleNo = vehicleNo;

    console.log("vehicleNo:"+vehicleNo);
    if(this.mVideoCount>MAX_VIDEO_NUM
        &&this.mVideoCount < 0){
        alert("视频窗口数量有误");
        return;
    }
    for(var idx =0;idx <mVideoCount;idx++){
        
        // var videoPlayer = $('<video id="video_player_win_' + idx + '" class ="video_player_bg">无视频</video>');
        
        // $(".video_player_area").append(videoPlayer);
        
        $("#video_player_win_"+idx).click(function(){
    
            $(".video_player_bg").css({"border-width":"2px","border-style":"soild","border-color":"rgb(212, 212, 212)"});
            $(this).css({"border-width":"2px","border-style":"soild","border-color":VIDEO_BORDER_DEFAULT_COLOR});
        });
        
    }
    // $(".video_player_bg").css({
    //     "border-width": "0ch",
    //     "border-style": "solid",
    //     "border-color": "rgb(255, 136, 0)",
    //     "background-color": "rgb(60,60,60)",
    //     "position": "absolute",
    //     "object-fit": "fill"
    // })
    for(var idx =0;idx<SPLIT_ARRAY_DEF.length;idx++){
        $("#split_"+SPLIT_ARRAY_DEF[idx]).click(function(){
          //  console.log("SPLIT_ARRAY_DEF[idx]"+this.value);
            window.videoObj.updateVideoWin(this.value);
        });
    }
    $('#start').click(function(){
        var front = vsclientSession.findFrontByName(mVehicleNo);
        if(front==null)
        {
            $("#show_status").text("不存在该车辆"+mVehicleNo);
            alert("不存在该车辆"+mVehicleNo); 
            return;
        }
        playVideo(front);
    });

    $("#stop").click(function(){
        for(var idx =0 ; idx < mVideoCount; idx++){
            vsclientSession.stopPlay($("#video_player_win_"+idx)[0]);
        }
        setButtunState("#start","enable");
        setButtunState("#stop","disabled");
        $("#show_status").text("视频全部关闭完成");
    });

    setButtunState("#start","disabled");
    setButtunState("#stop","disabled");
    this.updateVideoWin(4);
    connectNet();

}
//更新视频的窗口
VideoView.prototype.updateVideoWin = function(splitNum){
    var param =null;
    var spiltCn =0;
    for(var idx = 0; idx < videoWinSplitDef.length; idx++){
        if(videoWinSplitDef[idx].count==splitNum)
        {
            param = videoWinSplitDef[idx].param;
            spiltCn = splitNum;
            break;
        }
    }
    if(param ==null){
        alert("分屏数据定义有误");
        return;
    }
    for(var idx =0;idx < spiltCn; idx++){
        var curVideoWin = $('#video_player_win_'+idx);
        if(curVideoWin == null){
            alert("当前视频窗口定义不存在");
            return;
        }
        curVideoWin.css({"top":param[idx].top,"left":param[idx].left,"width":param[idx].width,"height":param[idx].height,"position":"absolute","display": "block"});
        
    }
    for(var idx =spiltCn;idx<MAX_VIDEO_NUM;idx++)
    {
        var curVideoWin = $('#video_player_win_'+idx);
        if(curVideoWin == null){
            alert("当前视频窗口定义不存在");
            return;
        }
        curVideoWin.css("display","none");
    }
    $("#video_player_win_0").css({"border-width":"2px","border-style":"soild","border-color":VIDEO_BORDER_DEFAULT_COLOR});
}

function setButtunState(id,status){
    if(status==="disabled") {
        $(id).addClass("layui-btn-disabled");
        $(id).attr("disabled",status);
    }
    else{
        $(id).removeClass("layui-btn-disabled");
        $(id).removeAttr("disabled");
    }
   
}

function getSplitNumFromChNum(chNum){
    if(chNum<4){
        return 1;
    }else if(chNum<5){
        return 4;
    }else if(chNum<7){
        return 6;
    }else if(chNum<9){
        return 8;
    }else{
        return 9;
    }
}

function playVideo(front){

    if(!front.online){
        $("#show_player_info").text("当前车牌号:["+mVehicleNo+"],车辆不在线");
        alert("查看车辆不在线");
        return;
    }
    var channelNum =  front.channel_num;
    var ret =false;
    var splitcn = getSplitNumFromChNum(channelNum);
    $("#show_player_info").text("当前车牌号:["+mVehicleNo+"],共["+channelNum+"]个通道");
    window.videoObj.updateVideoWin(splitcn);
    for(var idx =0;idx<channelNum;idx++)
    {
        ret = vsclientSession.startPlay(mVehicleNo, idx, $("#video_player_win_"+idx)[0]);
    }
    if(ret){
        setButtunState("#start","disabled");
        setButtunState("#stop","enable");
        $("#show_status").text("正在请求视频...");
    }else{
        $("#show_status").text("请求视频失败...");
    }
}
//websocket连接
function connectNet(){
    var callback = {
        onLoginFailed: function() {
            $("#show_status").text("登录失败");
            setTimeout(function() {
                vsclientSession.login(mUserName, mPwd, mIP, mPort);
            }, 5000);
    },
        onlogon: function() {
        $("#show_status").text("登录成功");
        var front = vsclientSession.findFrontByName(mVehicleNo);
        if(front==null)
        {
            $("#show_status").text("不存在该车辆"+mVehicleNo);
            alert("不存在该车辆"+mVehicleNo); 
            return;
        }
        setButtunState("#start","enable");

        
    },
        onServerConnectionLost: function() {
            $("#show_status").text("连接失败");
                for(var idx =0;idx< mVideoCount;idx++)
                {
                    vsclientSession.stopPlay($("#video_player_win_"+idx)[0]);
                }
                vsclientSession.login(mUserName, mPwd, mIP, mPort);
        },
        onStreamPlayStatus:function(status){
            switch(status)
            {
                case STREAM_PLAY_STATE_REQUESTTING:
                $("#show_status").text("正在请求视频...");
                break;
                case STREAM_PLAY_STATE_REQ_STREAM_SUCCESS:
                $("#show_status").text("请求完成,等待播放...");
                break;
                case STREAM_PLAY_STATE_PLAY_STRAM_SUCCESS:
                $("#show_status").text("视频播放成功");
                break;
                case STREAM_PLAY_STATE_PLAY_STRAM_FAILED:
                $("#show_status").text("视频播放失败");
                break;
                default:
                    alert("播放状态异常");
                break;

            }   
        },
        onGpsData:function(frontGpsData){//车辆信息+GPS信息
            console.log("frontGpsData:"+JSON.stringify(frontGpsData));
        }
    };
    window.vsclientSession = new VSClientSession(callback);
    vsclientSession.login(mUserName, mPwd, mIP, mPort);
    $("#show_status").text("登录中..."); 
}

