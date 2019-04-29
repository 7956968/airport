(function () {
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "mIP": "", // socket登录IP
            "mPort": "", // socket登录端口
            "mUserName": "", // 登录用户名
            "mPwd": "", // socket密码
            "mVehicleNo": "", // 车牌号
            "mVideoCount": 9, // 分屏数
            "maxVideoNum": 10, // 最大视频数
            "isStop": true, // 是否开始了
            "offLine": false, // 是否开始了
            "isLogin": false, // 登录框
            "loginCodeUrl": "http://140.246.113.143:6680/code/verificationCode.do",
            "loginCode": "", // 验证码
            "loading": false,
            "uSession": "",
            "errorTip": "",
            "timeOfflineOut": null,
            "timeOffline": 5,
            "timeLen": 300,
            "timeSelect": "300",
            "timeLenOut": null,
            "netnSignal": "",
            "msgType": "primary",
            "msgInfo": "",
            "isFullScream": false,
            "channelIndex": 1,
            "fullScreamIndex": "",
            "defaultColor": "rgb(255,125,0)", // 当前激活视频样式
            "splitNum": 1,
            "connectTimeOut": null,
            "playerList": [],
            "mediaDataSourceList": [],
            "splitArea": [1, 4, 6, 8, 9], // 分屏类型
            "videoWinSplit": [
                {
                    count: 1,
                    param: [
                        {
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% - 4px)',
                            height: 'calc(100% - 4px)'//calc运算符一定要有空格，要不然解析不了
                        }
                    ]
                },//1分屏
                {
                    count: 4,
                    param: [
                        {
                            top: '0px',
                            left: '0px',
                            width: 'calc(50% - 4px)',
                            height: 'calc(50% - 4px)'
                        },
                        {
                            top: '0px',
                            left: '50%',
                            width: 'calc(50% - 4px)',
                            height: 'calc(50% - 4px)'
                        },
                        {
                            top: '50%',
                            left: '0px',
                            width: 'calc(50% - 4px)',
                            height: 'calc(50% - 4px)'
                        },
                        {
                            top: '50%',
                            left: '50%',
                            width: 'calc(50% - 4px)',
                            height: 'calc(50% - 4px)'
                        }
                    ]
                },//4分屏
                {
                    count: 6,
                    param: [
                        {
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 2 - 6px)',
                            height: 'calc(100% / 3 * 2 - 8px)'
                        },//大屏
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        },//左下1
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 1 - 0px)',
                            width: 'calc(100% / 3 * 1 - 6px)',
                            height: 'calc(100% / 3 * 1)'
                        },//左下2
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        },//左下3
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 2px)',
                            height: 'calc(100% / 3 * 1 - 8px)'
                        },//右上1
                        {
                            top: 'calc(100% / 3 * 1 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }//右上2
                    ]
                },//6分屏
                {
                    count: 8,
                    param: [
                        {
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 4 * 3 - 6px)',
                            height: 'calc(100% / 4 * 3 - 8px)'
                        },//大屏
                        {
                            top: 'calc(100% / 4 * 3 - 4px)',
                            left: '0px',
                            width: 'calc(100% / 4 * 1 - 4px)',
                            height: 'calc(100% / 4 * 1)'
                        },//左下1
                        {
                            top: 'calc(100% / 4 * 3 - 4px)',
                            left: 'calc(100% / 4 * 1 - 0px)',
                            width: 'calc(100% / 4 * 1 - 6px)',
                            height: 'calc(100% / 4 * 1)'
                        },//左下2
                        {
                            top: 'calc(100% / 4 * 3 - 4px)',
                            left: 'calc(100% / 4 * 2 - 2px)',
                            width: 'calc(100% / 4 * 1 - 4px)',
                            height: 'calc(100% / 4 * 1)'
                        },//左下3
                        {
                            top: 'calc(100% / 4 * 3 - 4px)',
                            left: 'calc(100% / 4 * 3 - 2px)',
                            width: 'calc(100% / 4 * 1 - 2px)',
                            height: 'calc(100% / 4 * 1)'
                        },//左下4
                        {
                            top: '0px',
                            left: 'calc(100% / 4 * 3 - 2px)',
                            width: 'calc(100% / 4 * 1 - 4px)',
                            height: 'calc(100% / 4 * 1 - 6px)'
                        },//右上1
                        {
                            top: 'calc(100% / 4 * 1 - 2px)',
                            left: 'calc(100% / 4 * 3 - 2px)',
                            width: 'calc(100% / 4 * 1 - 4px)',
                            height: 'calc(100% / 4 * 1 - 6px)'
                        },//右上2
                        {
                            top: 'calc(100% / 4 * 2 - 4px)',
                            left: 'calc(100% / 4 * 3 - 2px)',
                            width: 'calc(100% / 4 * 1 - 4px)',
                            height: 'calc(100% / 4 * 1 - 4px)'
                        }//右上3
                    ]
                },//8分屏
                {
                    count: 9,
                    param: [
                        {
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        },//1,1
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        },//1,2
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        },//1,3
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        },//2,1
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        },//2,2
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        },//2,3
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        },//3,1
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        },//3,2
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }//3,3
                    ]
                }//9分屏
            ]
        },
        "methods": {
            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            "init": function (options) {
                var self = this;

                self.mIP = options.ip;
                self.mPwd = options.pwd;
                self.mPort = options.port;
                self.mUserName = options.userName;
                self.mVehicleNo = options.vehicleNo;

                if (self.mVideoCount > self.maxVideoNum || self.mVideoCount < 0) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "视频窗口数量有误";
                    return;
                }

                self.updateVideoWin(4);

                self.loginGetVideo();
            },
            "changLoginCode": function() {
                var self = this;
                self.loginCodeUrl = "http://140.246.113.143:6680/code/verificationCode.do?t=" + Date.parse(new Date);
            },
            "loginGetVideo": function() {
                var self = this;
                // if($.trim(self.loginCode).length != 0) {
                    $.ajax({
                        url: "http://39.106.1.200:8080/turkeyApi/user/loginApi.do?userAccount=zyltest&password=000000&languages=cn",
                        beforeSend: function (data) {
                            self.loading = true;
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            self.loading = false;
                        },
                        success: function (data) {
                            if (data.result == 0) {
                                self.isLogin = false;
                                self.uSession = data.pojo.sessionId;
                                if(data.pojo.sessionId) {
                                    self.startVideo();
                                }
                            }
                            self.loading = false;
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(textStatus);
                        }
                    });
                // } else {
                //     self.errorTip = "请输入验证码";
                // }
            },
            "onTimeChange": function (value) {
                var self = this;
                self.timeLen = parseInt(value, 10);
            },
            // 设置当前选中视频样式
            "setCurrentStyle": function (id) {
                var self = this;
                $("body").find(".videoItem").removeClass("active");
                $("body").find("#" + id).addClass("active");
            },

            // 链接 socket 服务器
            "connectNet": function () {
                var self = this;
                for (var i = 0; i < self.splitNum; i++) {
                    self.playerList.push(null);
                    self.loadVideoSource({
                        type: 'flv',
                        url: "http://140.246.113.143:6604/RealplayFlv.do?DevIDNO=015831021100&Channel="+ i +"&StreamType=1&uSession="+ self.uSession
                    },i);
                }
                for (var a = 0; a < self.splitNum; a++) {
                    self.playerList[a].play();
                }
                self.isStop = false;
                self.timeLenOut = null;
                setTimeout(function() {
                    self.timeLenOut = setInterval(function() {
                        self.timeLen--;
                        self.$Message.destroy();
                        if(self.timeLen <= 0) {
                            self.stopVideo();
                        }
                    }, 1000);
                }, 5000);
            },

            // 重新分割窗口
            "updateVideoWin": function (splitNum) {
                var self = this;
                var param = null;

                for (var i = 0; i < self.videoWinSplit.length; i++) {
                    if (self.videoWinSplit[i].count == splitNum) {
                        param = self.videoWinSplit[i].param;
                        break;
                    }
                }

                if (param == null) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "分屏数据定义有误";
                    clearInterval(self.timeLenOut);
                    return;
                }

                $("body").find(".videoItem").css("display", "none");
                for (var idx = 0; idx < splitNum; idx++) {
                    var curVideoWin = $("body").find("#liveVideo" + idx);
                    if (curVideoWin == null) {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "当前视频窗口定义不存在";
                        clearInterval(self.timeLenOut);
                        return;
                    }
                    curVideoWin.css({ "top": param[idx].top, "left": param[idx].left, "width": param[idx].width, "height": param[idx].height, "display": "block" });
                }

                self.splitNum = splitNum;
                $("body").find("#liveVideo0").addClass("active");
            },

            // 获取视频资源
            "loadVideoSource": function (mediaDataSource, index) {
                var self = this;
                var element = $("body").find("#video" + index)[0];
                if (typeof self.playerList[index] !== "undefined") {
                    if (self.playerList[index] != null) {
                        self.playerList[index].unload();
                        self.playerList[index].detachMediaElement();
                        self.playerList[index].destroy();
                        self.playerList[index] = null;
                    }
                }
                self.playerList[index] = flvjs.createPlayer(mediaDataSource, {
                    enableWorker: false,
                    lazyLoadMaxDuration: 3 * 60, // 延迟负载最大持续时间180s
                    seekType: 'range',  //滑块控件range
                });
                self.playerList[index].attachMediaElement(element);
                self.playerList[index].load();
            },

            // 开始视频
            "startVideo": function () {
                var self = this;
                self.stopVideo(); // 先停止正在播放的视频
                self.connectNet(); // 重新连接
                self.$Message.destroy();
                self.msgType = "error";
                self.msgInfo = "";
            },

            // 停止视频
            "stopVideo": function () {
                var self = this;
                for (var i = 0; i < self.splitNum; i++) {
                    if(!!self.playerList[i]) {
                        self.playerList[i].pause();
                        self.playerList[i].unload();
                        self.playerList[i].detachMediaElement();
                        self.playerList[i].destroy();
                        self.playerList[i] = null;
                    }
                }
                self.isStop = true;
                self.$Message.destroy();
                self.msgType = "success";
                self.msgInfo = "视频已经全部关闭";
                clearInterval(self.timeLenOut);
                self.timeOffline = 5;
                if (self.timeLen <= 0) {
                    self.timeLen = parseInt(self.timeSelect);
                }
            },
            // 全屏
            "setFullScream": function (id) {
                var self = this;
                self.isFullScream = true;
                $("body").find("#" + id).parents(".videoWrap").addClass("fullScream");
                self.runPrefixMethod($("body").find("#" + id).parents(".videoWrap")[0], "RequestFullScreen")
            },
            // 关闭全屏
            "closeFullScream": function (id) {
                var self = this;
                self.isFullScream = false;
                $("body").find("#" + id).parents(".videoWrap").removeClass("fullScream");
                self.runPrefixMethod(document, "CancelFullScreen");
            },

            // 播放声音
            "playAudio": function (channel) {
                var self = this;

                // self.channelIndex = channel;
                // vsclientSession.stopListening();
                // vsclientSession.startListening(self.mVehicleNo, channel);
            },
            // 停止播放声音
            "stopAudio": function () {
                var self = this;
                // self.channelIndex = 0;
                // vsclientSession.stopListening();
            },
            // 
            "runPrefixMethod": function (element, method) {
                var usablePrefixMethod;
                ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                    if (usablePrefixMethod) return;
                    if (prefix === "") {
                        // 无前缀，方法首字母小写
                        method = method.slice(0, 1).toLowerCase() + method.slice(1);

                    }

                    var typePrefixMethod = typeof element[prefix + method];

                    if (typePrefixMethod + "" !== "undefined") {
                        if (typePrefixMethod === "function") {
                            usablePrefixMethod = element[prefix + method]();
                        } else {
                            usablePrefixMethod = element[prefix + method];
                        }
                    }
                });

                return usablePrefixMethod;
            },
        },
        "mounted": function () {
            var self = this;

            self.$Message.config({
                "top": 5,
                "duration": 0,
                "closable": true
            });

            self.$Notice.config({
                "top": 5,
                "duration": 0,
                "closable": true
            });

            // "ip": "192.168.1.102",//"220.231.225.7",
            // "port": 8001, //7668,
            // "userName": "admin1", //"mgkj",
            // "pwd": "888888",
            self.init({
                "port": 7668,
                "pwd": "888888",
                "userName": "mgkj",
                "ip": "220.231.225.7",
                "vehicleNo": decodeURI(utility.getQueryParams().vehicleNo),
            });
        }
    });

}())
