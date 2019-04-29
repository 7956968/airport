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
            "netnSignal": "",
            "msgType": "primary",
            "msgInfo": "",
            "isFullScream": false,
            "channelIndex": 1,
            "fullScreamIndex": "",
            "defaultColor": "rgb(255,125,0)", // 当前激活视频样式
            "splitNum": 1,
            "time": 15,
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
                self.connectNet();

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
                var callback = {
                    onLoginFailed: function () {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "车辆 【" + self.mVehicleNo + "】登录失败";
                        setTimeout(function () {
                            vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);
                        }, 5000);
                    },
                    onlogon: function (info) {
                        var front = vsclientSession.findFrontByName(self.mVehicleNo);
                        self.$Message.destroy();
                        self.msgType = "success";
                        self.msgInfo = "车辆 【" + self.mVehicleNo + "】登录成功";
                        
                        if (front == null) {
                            self.msgType = "error";
                            self.msgInfo = "车辆【 " + self.mVehicleNo + " 】不存在";
                            return;
                        }
                        self.isStop = true;

                        // 登录成功后马上开始播放视频
                        self.startVideo();
                    },
                    onOnOffline: function(info) {
                        console.log(info.online);
                        if(info.online == false) {
                            self.$Message.destroy();
                            self.msgType = "error";
                            self.msgInfo = "车辆暂无视频数据，画面即将关闭";
                            setTimeout(function(){
                                self.stopVideo();
                            }, 5000);
                        }  else {
                            self.startVideo();
                        }
                    },
                    onServerConnectionLost: function () {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "车辆【 " + self.mVehicleNo + " 】连接失败";
                        for (var idx = 0; idx < self.mVideoCount; idx++) {
                            vsclientSession.stopPlay($("#video" + idx)[0]);
                        }
                        vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);
                    },
                    onStreamPlayStatus: function (status) {
                        switch (status) {
                            case STREAM_PLAY_STATE_REQUESTTING:
                                self.msgInfo = "";
                                self.$Message.destroy();
                                self.$Message.loading({
                                    "content": "正在请求视频......"
                                });
                                break;
                            case STREAM_PLAY_STATE_REQ_STREAM_SUCCESS:
                                self.msgInfo = "";
                                self.$Message.destroy();
                                self.$Message.loading({
                                    "content": "请求完成,等待播放......"
                                });
                                break;
                            case STREAM_PLAY_STATE_PLAY_STRAM_SUCCESS:
                                self.$Message.destroy();
                                self.msgType = "success";
                                self.msgInfo = "视频播放成功";
                                self.isStop = false;
                                break;
                            case STREAM_PLAY_STATE_PLAY_STRAM_FAILED:
                                self.$Message.destroy();
                                self.msgType = "error";
                                self.msgInfo = "视频播放失败";
                                break;
                            default:
                                self.$Message.destroy();
                                self.msgType = "error";
                                self.msgInfo = "播放状态异常";
                                break;

                        }
                    },
                    onGpsData: function (frontGpsData) {//车辆信息+GPS信
                        self.netnSignal = frontGpsData.gps.net_signal;
                    }
                };
                window.vsclientSession = new VSClientSession(callback);
                vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);

                self.msgInfo = "";
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "车辆【 " + self.mVehicleNo + " 】登录中......",
                });
            },

            // 重新分割窗口
            "updateVideoWin": function (splitNum) {
                var self = this;
                var param = null;

                for (var idx = 0; idx < self.videoWinSplit.length; idx++) {
                    if (self.videoWinSplit[idx].count == splitNum) {
                        param = self.videoWinSplit[idx].param;
                        break;
                    }
                }

                if (param == null) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "分屏数据定义有误";
                    return;
                }

                $("body").find(".videoItem").css("display", "none");
                for (var idx = 0; idx < splitNum; idx++) {
                    var curVideoWin = $("body").find("#liveVideo" + idx);
                    if (curVideoWin == null) {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "当前视频窗口定义不存在";
                        return;
                    }
                    curVideoWin.css({ "top": param[idx].top, "left": param[idx].left, "width": param[idx].width, "height": param[idx].height, "display": "block" });
                }

                self.splitNum = splitNum;
                $("body").find("#liveVideo0").addClass("active");
            },

            // 获取通道值
            "getSplitNumFromChNum": function (chNum) {
                if (chNum < 4) {
                    return 1;
                } else if (chNum < 5) {
                    return 4;
                } else if (chNum < 7) {
                    return 6;
                } else if (chNum < 9) {
                    return 8;
                } else {
                    return 9;
                }
            },

            // 播放视频
            "playVideo": function (front) {
                var self = this;
                if (!front.online) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "车辆 【 " + self.mVehicleNo + " 】不在线";
                    return;
                }
                var channelNum = front.channel_num;
                var ret = false;
                var splitcn = self.getSplitNumFromChNum(channelNum);

                self.$Message.destroy();
                self.msgType = "blue";
                self.msgInfo = "车辆【" + self.mVehicleNo + "】，共【 " + channelNum + " 】个通道";
                self.updateVideoWin(splitcn);
                for (var idx = 0; idx < channelNum; idx++) {
                    ret = vsclientSession.startPlay(self.mVehicleNo, idx, $("#video" + idx)[0]);
                    if (idx == 0) {
                        self.playAudio(idx + 1);
                    }
                }
                if (ret) {
                    self.isStop = true;
                    self.msgInfo = "";
                    self.$Message.destroy()
                    self.$Message.loading({
                        "content": "正在请求视频......"
                    });
                } else {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "请求视频失败";
                }
            },

            // 开始视频
            "startVideo": function () {
                var self = this;
                var front = vsclientSession.findFrontByName(self.mVehicleNo);
                if (front == null) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "车辆【 " + self.mVehicleNo + " 】不存在";
                    return;
                }
                self.playVideo(front);
            },

            // 停止视频
            "stopVideo": function () {
                var self = this;
                for (var idx = 0; idx < self.mVideoCount; idx++) {
                    vsclientSession.stopPlay($("body").find("#video" + idx)[0]);
                }
                self.isStop = true;
                self.$Message.destroy();
                self.msgType = "success";
                self.msgInfo = "视频已经全部关闭";
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

                self.channelIndex = channel;
                vsclientSession.stopListening();
                setTimeout(function(){
                    vsclientSession.startListening(self.mVehicleNo, channel);
                }, 500);
            },
            // 停止播放声音
            "stopAudio": function () {
                var self = this;
                self.channelIndex = 0;
                vsclientSession.stopListening();
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
            var queryInfo = utility.getQueryParams();

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
                "vehicleNo": decodeURI(queryInfo.vehicleNo),
            });
        }
    });

}())
