
/***************************************************
 ********封装websocket连接
****************************************************/

const CLIENT_VER_V1 = 1
const CLIENT_VER_V2 = 2
const CLIENT_VER_CUR = CLIENT_VER_V2
//初始化构造
function VSClientSession(callback) {
    this.connection = null; // WebSocket
    this.hasLogon = false;
    this.context = {};
    this.callback = callback;
    this.videos = [];
    this.isListening = false;
    this.audioElement=null;
    this.HistoryAudioElement=null;
    this.listenParam={};
    this.audioPlayer=null;
    this.HistoryAudioPlayer=null;
    this.falidStatus = null; //1 为登录成功前，2 为登录成功后 3 为登出
    this.historyInfo = null;
}
//拼接websocket连接协议
VSClientSession.prototype.webSocketHost = function() {
    return 'ws://' + this.serverIP + ':' + this.serverPort;
}
//获取websocket连接url
VSClientSession.prototype.getWSURL = function() {
    var clientGuid = localStorage.getItem("clientGuid");
    if(clientGuid ==null||clientGuid==""){
        clientGuid = createRandomId();
        localStorage.setItem("clientGuid",clientGuid);
    }
    return this.webSocketHost() + "/session?user=" + this.username + "&password=" + this.password+"&clientGuid="+clientGuid+"&uploadFlag=7";
}
//连接服务器
VSClientSession.prototype.connectToServer = function() {
    console.log("url:"+this.wsURL);
    this.falidStatus = 1;
    this.connection = new WebSocket(this.wsURL);
    //注册事件回调
    this.connection.binaryType = "arraybuffer";
    this.connection.onopen = this.onConnectedToServer.bind(this);
    this.connection.onerror = this.onFailedToConnectToServer.bind(this);
    this.connection.onclose = this.onServerConnectionLost.bind(this);
    this.connection.onmessage = this.onRecvServerMessage.bind(this);
}
//连接登录服务器
VSClientSession.prototype.login = function(username, password, serverIP, serverPort) {
    this.username = username;
    this.password = password;
    this.serverIP = serverIP;
    this.serverPort = serverPort;
    this.context = {};
    this.hasLogon = false;
    this.wsURL = this.getWSURL();
   
    this.connectToServer();
}
//断开服务器连接
VSClientSession.prototype.logout = function(){
    if(this.connection){
        this.falidStatus = 3;
        this.connection.close();
    }
}
//连接成功事件
VSClientSession.prototype.onConnectedToServer = function () {
    //发送登录版本
    this.sendLoginInfo();
    this.callback.onConnectSuccess();

    
}
//连接错误事件
VSClientSession.prototype.onFailedToConnectToServer = function () {
    this.hasLogon = false;
    this.onLoginFailed();
}
//连接关闭事件
VSClientSession.prototype.onServerConnectionLost = function () {
    this.hasLogon = false;
    this.callback.onServerConnectionLost(this.falidStatus);
    
    this.falidStatus = 1;
}
function ab2str(u,f) {
       var b = new Blob([u]);
       var r = new FileReader();
        r.readAsText(b, 'utf-8');
        r.onload = function (){if(f)f.call(null,r.result)}
}
function createRandomId() {
     return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
}
//接收消息
VSClientSession.prototype.onRecvServerMessage = function (msg) {
    if (event.data instanceof ArrayBuffer) {
        self = this
        ab2str(event.data,function(str){
            var msg = JSON.parse(str);
            self.handleMessage(msg);
        });
    } else if (typeof event.data == 'string') {
        var msg = JSON.parse(event.data);
       
        this.handleMessage(msg);
    }
}
//登录成功
VSClientSession.prototype.onlogin = function(info) {
    this.falidStatus = 2;
    this.context = $.extend(this.context, info);
    this.token = this.context.token;
    if (!this.username) {
        this.username = info.username;
    }
    this.hasLogon = true;
    this.callback.onlogin();
    this.callback.onVehicleInfo(info.front);
}

//发送登录信息，目前只有版本号，连接成功后发送
VSClientSession.prototype.sendLoginInfo = function() {
    var loginInfoObj={};
    loginInfoObj.command = "login_info";
    loginInfoObj.client_version = CLIENT_VER_CUR;
    this.sendMsg(loginInfoObj);
}

//发送消息到服务器
VSClientSession.prototype.sendMsg = function(msg){
    this.connection.send(JSON.stringify(msg))
}
//登录失败
VSClientSession.prototype.onLoginFailed = function(reason) {
    this.callback.onLoginFailed(reason);
}
//处理消息 回调数据
VSClientSession.prototype.handleMessage = function(msg) {
    const msgType = msg.msg_type;
   
    if (msgType === "client_events") {
        var self = this;
        msg.events.forEach(function(event) {
            self.handleMessage(event);
        });
        return;
    }
    //包括未登录前的一些消息回应
    // else if(msgType ==="server_resp"){
    //     if(msg.resp_type==="error"){
    //         this.logout();
    //         console.log("info"+msg.info);
    //     }

    // }
   
    if (this.hasLogon) {
        if (msgType === "client_event") {
            switch (msg.info.type) {
            case 1://关闭连接
                this.hasLogon = false;
                this.callback.onClientServerConnLost();
                break;
            case 3://设备上下线事件
                this.onFrontOnOfflineEvent(msg.info.data);
                break;
            case 4: //接收到gps数据
           
                this.onFrontGPSEvent(msg.info.data);
            break;
            case 105://透传消息
                this.callback.onFrontTransMsgEvent(msg.info.data);
            break;
            default:
                //console.log('unknown client event ' + msg.info.type + "\n" + event.data);
                break;
            }
        }else if (msgType === "resp") {
            if(msg.resp === "query_record"){
                var list = msg.record_entries
                this.callback.onReplayVideoList(list)//视频回放
            }
            else if (msg.resp === "send_trans_msg") {
                this.callback.onTransResult(msg.success)//下发透传信息
            }else if(msg.resp === "start_hls_stream"){// hls 视频
              
                OnStartHLSStreamReply(msg);
            }
            else if (msg.resp === "playback_audio_resp") {
                this.callback.onHistoryForListening(msg)//历史回放的音频信息
            }
        } else if (msgType === "stream_close_notify") {
            
            OnHLSStreamClosed(msg);
        }
    }else {
        if (msgType === "login_result") {
           
                if (msg.result != 'success') {
                   
                    this.callback.onLoginFailed();//登录失败，可能是用户密码不对
                    return;
                }
                if(msg.info===undefined)
                {
                    return;
                }
                this.onlogin(msg.info);
        }
        
    }
}
//设备上下线消息
VSClientSession.prototype.onFrontOnOfflineEvent = function(event) {
    console.log("front" + event.front + " " + (event.online ? "online" : "offline"));

    var frontId = event.front;
    var front = this.findFrontByID(frontId);
    if (!front) {
        return;
    }

    front.online = event.online;
    //  this.callback.onFrontStatus(front);
}
//接收到GPS数据事件
VSClientSession.prototype.onFrontGPSEvent = function(event) {
   
    if (!this.hasLogon) {
        return;
    }
    
    var front = this.findFrontByID(event.front);
    if (!front) {
        return;
    }

    front.gps = jQuery.extend({}, event);

    if (!front.online) {
        return;
    }
    //回调gps数据
    this.callback.onGpsData(front);
}
//通过车辆GUID找到车辆信息
VSClientSession.prototype.findFrontByID = function(frontID) {
    var front = jQuery.grep(this.context.front, function (element) {
        return element.id == frontID;
    });
    if (!front || front.length == 0) {
        return null;
    }

    return front[0];
}
//通过车辆名称找到车辆信息
VSClientSession.prototype.findFrontByName = function(frontName) {
    var front = jQuery.grep(this.context.front, function (element) {
        return element.name == frontName;
    });
    if (!front || front.length == 0) {
        return null;
    }

    return front[0];
}
//实时视频播放
VSClientSession.prototype.startPlay = function(name, channel, videoCtrl) {
   
    var front = jQuery.grep(this.context.front, function (element) {
        return element.name == name;
    });
    if (!front || front.length == 0) {
        return false;
    }

    front = front[0];
    if (!front.online) {
        return false;
    }

    var videoCtx = {
        videoCtrl: videoCtrl.video,
        player: new Player(videoCtrl, front.id, channel, true, false)
       
    };

    this.videos.push(videoCtx);
    videoCtx.player.start();
    videoCtx.player.setStreamPlayStatus(this.callback.onStreamPlayStatus);
    return true;
}

//停止播放实时视频
VSClientSession.prototype.stopPlay = function(videoCtrl) {
    var videoCnt = this.videos.length;
    for (var i = 0; i < videoCnt; ++i) {
        if (this.videos[i].videoCtrl === videoCtrl) {
            this.videos[i].player.stop();
            this.videos.splice(i,1);
            return;
        }
    }
}
//开始监听
VSClientSession.prototype.startListening = function(name,channel) {
    if (this.isListening) {
        return;
    }
    var front = jQuery.grep(this.context.front, function (element) {
        return element.name == name;
    });
    if (!front || front.length == 0) {
        return false;
    }

    front = front[0];
    if (!front.online) {
        return false;
    }

    this.audioElement = document.createElement("audio");
    this.audioElement.controls = false;
    document.body.appendChild(this.audioElement);
    $(this.audioElement).css({width:0, height:0});
    var videoctrl={};
    videoctrl.video = this.audioElement;
    videoctrl.text = null;

    this.audioPlayer =  new Player(videoctrl, front.id,channel,  false, true);
    this.audioPlayer.start();

    this.isListening = true;
}
//停止监听
VSClientSession.prototype.stopListening = function () {
    if (!this.isListening) {
        return;
    }

    this.audioPlayer.stop();
    this.audioPlayer = null;
    document.body.removeChild(this.audioElement);
    this.audioElement = null;
    this.isListening = false;
}
//开始回放
VSClientSession.prototype.startReplay = function(name, channel,videoctrl,info) {
    var channel = info.channel;
    var frontId = info.front;
    this.historyInfo = info
    var front = jQuery.grep(this.context.front, function (element) {
        return element.name == name;
    });
    if (!front || front.length == 0) {
        return false;
    }

    front = front[0];
    if (!front.online) {
        return false;
    }
     //历史视频
    var makeVideoCtrl ={};
    makeVideoCtrl.video =   videoctrl;
    makeVideoCtrl.text = null;
    var videoCtx = {
        videoCtrl: videoctrl,
        player: new Player(makeVideoCtrl, frontId, channel, true,false)
    }; 
    this.videos.push(videoCtx);
    videoCtx.player.start(info);
    videoCtx.player.setStreamPlayStatus(this.callback.onStreamPlayStatus);
    
    return true;
}
//开始回放声音
VSClientSession.prototype.startReplayAudio = function(audioId,aisle){
    
    var info = this.historyInfo
    var channel = aisle || info.channel;
    var frontId = info.front;
    //历史声音
    this.HistoryAudioElement = document.createElement("audio");
    this.HistoryAudioElement.controls = true;
    document.body.appendChild(this.HistoryAudioElement);
    $(this.HistoryAudioElement).css({width:0, height:0});
    $(this.HistoryAudioElement).addClass("isAudioElement");
    $(this.HistoryAudioElement).attr("controls", true);
    var makeAudioCtrl={};
    makeAudioCtrl.video = this.HistoryAudioElement;
    makeAudioCtrl.text = null;
    this.HistoryAudioPlayer =  new Player(makeAudioCtrl,frontId,channel,true, false);
    this.HistoryAudioPlayer.start(info,true,audioId);
    this.HistoryAudioPlayer.setStreamPlayStatus(this.callback.onStreamPlayStatus);
}
//停止回放视频
VSClientSession.prototype.stopReplay = function(videoCtrl) {
    var videoCnt = this.videos.length;
    for (var i = 0; i < videoCnt; ++i) {
        if (this.videos[i].videoCtrl === videoCtrl) {
            this.videos[i].player.stop();
            this.videos.splice(i,1);
            return;
        }
    }
}
//停止回放音频
VSClientSession.prototype.stopReAudio = function() {
        //音频
        if(this.HistoryAudioPlayer){
            this.HistoryAudioPlayer.stop();
            this.HistoryAudioPlayer = null;
            document.body.removeChild(this.HistoryAudioElement);
            this.HistoryAudioElement = null;
        }
}
//value:跳转到某个时间
VSClientSession.prototype.ctrlReplayJumpTo = function(value,frontGuid,channel) {
    var msg={
        command: "query_record",
    };
    var msg = {
        command: "ctrl_history_stream",
        ctrl_type: 5,
        ctrl_value: Number(value),
        ctrl_frontid: frontGuid,
        ctrl_channel: Number(channel)                
    };
    this.connection.send(JSON.stringify(msg));
}
