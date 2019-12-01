(function () {
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "isShowDetail": true,
            "vehicleInfo": JSON.parse(decodeURI(utility.getQueryParams().vehicleInfo)),
            // "vehicleInfo": {
            //     "licenseNumber": ""
            // },
            "queryInfo": utility.getQueryParams(),
            "mIP": "220.231.225.7", // socket登录IP
            // "mIP": "120.79.197.241", // socket登录IP
            "mPort": 7668, // socket登录端口
            // "mUserName": "test1", // 登录用户名
            "mUserName": "mgkj", // 登录用户名
            "mPwd": "888888", // socket密码
            "msgInfo": "",
            "codeType": true,
            "netnSignal": "",
            "hd": [],
            "sd": [],
            "dragAndDrop": {
                "sourceEle": null,
                "targetEle": null,
                "sourceStyle": "",
                "targetStyle": ""
            },
            "backPlay": {
                "date": "",
                "beginTime": "",
                "endTIme": "",
                "Date": "",
                "BeginSecond": "",
                "EndSecond": "",
                "num": 0,
                "videoCount": 0,
                "channelTotal": 0,
                "channel": "",
                "channelInfo": {
                    "channel0": {
                        "channel": 0,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel1": {
                        "channel": 1,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel2": {
                        "channel": 2,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel3": {
                        "channel": 3,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel4": {
                        "channel": 4,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel5": {
                        "channel": 5,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel6": {
                        "channel": 6,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                    "channel7": {
                        "channel": 7,
                        "radioIndex": "",
                        "isChannel": false,
                        "list": []
                    },
                },
                "connectError": false,
                "tabs": "info"
            },
            "currentChannel": 0,
            "radioIndex": "",
            "front": null,
            "splitArea": [1, 4, 6, 8, 9], // 分屏类型
            "innerHeight": window.innerHeight,
            "videoWinSplit": {
                "count_1": [{
                    top: '0px',
                    left: '0px',
                    width: 'calc(100% - 4px)',
                    height: 'calc(100% - 4px)' //calc运算符一定要有空格，要不然解析不了
                }],
                "count_3": [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(70% - 4px)',
                        height: 'calc(100% - 4px)'
                    },
                    {
                        top: '0px',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '50%',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(50% - 4px)'
                    }
                ],
                "count_4": [{
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
                ],
                "count_5": [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(70% - 4px)',
                        height: 'calc(100% - 4px)'
                    },
                    {
                        top: '0px',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(25% - 4px)'
                    },
                    {
                        top: '25%',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(25% - 4px)'
                    },
                    {
                        top: '50%',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(25% - 4px)'
                    },
                    {
                        top: '75%',
                        left: '70%',
                        width: 'calc(30% - 4px)',
                        height: 'calc(25% - 4px)'
                    }
                ],
                "count_6": [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '0px',
                        left: '33.333%',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '0px',
                        left: '66.666%',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '50%',
                        left: '0px',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '50%',
                        left: '33.333%',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    },
                    {
                        top: '50%',
                        left: '66.666%',
                        width: 'calc(33.333% - 4px)',
                        height: 'calc(50% - 4px)'
                    }
                ],
                "count_7": [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(100% / 4 * 3 - 6px)',
                        height: 'calc(100% / 4 * 3 - 8px)'
                    }, //大屏
                    {
                        top: '0px',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 6px)'
                    }, //右上1
                    {
                        top: 'calc(100% / 4 * 1 - 2px)',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 6px)'
                    }, //右上2

                    {
                        top: 'calc(100% / 4 * 2 - 4px)',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 4px)'
                    }, //右上3
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: '0px',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //左下3
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: 'calc(100% / 4 * 1 - 0px)',
                        width: 'calc(100% / 4 * 1 - 6px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //右上4
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: 'calc(100% / 4 * 2 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //左下1

                ],
                "count_8": [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(100% / 4 * 3 - 6px)',
                        height: 'calc(100% / 4 * 3 - 8px)'
                    }, //大屏
                    {
                        top: '0px',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 6px)'
                    }, //右上1
                    {
                        top: 'calc(100% / 4 * 1 - 2px)',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 6px)'
                    }, //右上2

                    {
                        top: 'calc(100% / 4 * 2 - 4px)',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1 - 4px)'
                    }, //右上3
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: '0px',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //左下3
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: 'calc(100% / 4 * 1 - 0px)',
                        width: 'calc(100% / 4 * 1 - 6px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //右上4
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: 'calc(100% / 4 * 2 - 2px)',
                        width: 'calc(100% / 4 * 1 - 4px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //左下1
                    {
                        top: 'calc(100% / 4 * 3 - 4px)',
                        left: 'calc(100% / 4 * 3 - 2px)',
                        width: 'calc(100% / 4 * 1 - 2px)',
                        height: 'calc(100% / 4 * 1)'
                    }, //左下2

                ]
            },
            "videoInfo": [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            "vehicleList": [
                "22",
                "民航-B3521",
                "民航-B3605",
                "民航-B3045",
                "民航-B4321",
                "民航-B7494",
                "民航-B3090",
                "民航-B1787",
                "民航-B4081",
                "民航-B0277",
                "民航-B8596",
                "民航-B1786",
                "民航-B3132",
            ]
        },
        "methods": {
            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            "init": function (options) {
                var self = this;
                self.logout();

                if (!self.vehicleInfo.licenseNumber) {
                    self.backPlay.channelTotal = 0;
                    self.msgInfo = "请输入车牌号";
                    return;
                }
                setTimeout(function () {
                    self.connectNet();
                }, 1000);
            },
            "onTimeChange": function (value) {
                var self = this;
                self.timeLen = parseInt(value, 10);
            },
            "logout": function () {
                var self = this;
                // console.log(vsclientSession);
                if (typeof vsclientSession != "undefined") {
                    if (vsclientSession) {
                        vsclientSession.logout();
                        vsclientSession = null;
                        self.backPlay.channelTotal = 0;
                    }
                }
            },
            // 设置当前选中视频样式
            "setCurrentStyle": function (id) {
                var self = this;
                $("body").find(".videoItem").removeClass("active");
                $("body").find("#" + id).addClass("active");
            },

            // 获取回放视频
            "getReplayVedio": function () {
                var self = this;
                var nowTime = utility.getDateDetailInfo(new Date());
                var front = vsclientSession.findFrontByName(self.vehicleInfo.licenseNumber);
                var date = "";
                var beginTime = "";
                var endTIme = "";
                var starTime = "";
                var endTime = "";
                var msg = null;

                self.front = front;

                if (self.backPlay.Date.length == 0) {
                    date = nowTime.year + "-" + nowTime.month + "-" + nowTime.date;
                } else {
                    date = self.backPlay.Date;
                }
                if (self.backPlay.beginTime.length == 0) {
                    beginTime = "00:00:00";
                } else {
                    beginTime = self.backPlay.beginTime;
                }

                if (self.backPlay.endTIme.length == 0) {
                    endTIme = "23:59:59";
                } else {
                    endTIme = self.backPlay.endTIme;
                }
                starTime = date + " " + beginTime;
                endTime = date + " " + endTIme;
                msg = {
                    command: "query_record",
                    front: self.front.id,
                    channel: 254, //all channel
                    begin_time: parseInt(Date.parse(starTime.replace(/-/g, "/")) / 1000),
                    end_time: parseInt(Date.parse(endTime.replace(/-/g, "/")) / 1000),
                    sn: ++self.backPlay.num
                };
                self.msgInfo = "正在获取视频......";
                self.$Message.loading({
                    "content": "正在获取视频......",
                });
                // vsclientSession.connection.send(JSON.stringify(msg));
                vsclientSession.sendMsg(msg);
            },

            // 链接 socket 服务器
            "connectNet": function () {
                var self = this;
                if(self.vehicleInfo.licenseNumber.length == 0) {
                    return;
                }
                var callback = {
                    // 登录失败
                    onLoginFailed: function () {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "车辆 【" + self.vehicleInfo.licenseNumber + "】登录失败";
                        setTimeout(function () {
                            vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);
                        }, 3000);
                    },
                    //连接成功
                    onConnectSuccess: function () {

                    },
                    onVehicleInfo: function (vehicleInfo) {

                    },
                    // 登录成功
                    onlogin: function (info) {
                        var front = vsclientSession.findFrontByName(self.vehicleInfo.licenseNumber);
                        self.front = front;
                        self.$Message.destroy();
                        self.msgType = "success";
                        self.msgInfo = "车辆 【" + self.vehicleInfo.licenseNumber + "】登录成功";

                        if (front == null) {
                            self.msgType = "error";
                            self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】不存在";
                            self.isStop = true;
                            return;
                        }

                        console.log("登录");
                        self.backPlay.connectError = false;
                        self.getReplayVedio();
                    },
                    // 当车辆下线的时候
                    onOnOffline: function (front) {
                        if (front.name == self.vehicleInfo.licenseNumber) {
                            if (front.online == false) {
                                self.backPlay.tabs = "info";
                                self.backPlay.videoCount = 0;
                                self.backPlay.channelTotal = 0;
                                self.backPlay.channelInfo = {};
                                self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】已经下线";
                            } else {
                                self.backPlay.connectError = false;
                                self.getReplayVedio();
                            }
                        }
                    },
                    // 但 socket 服务链接断开
                    onServerConnectionLost: function () {
                        // self.$Message.destroy();
                        // self.msgType = "error";
                        // self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】连接失败";
                        // self.backPlay.connectError = true;
                    },
                    // 数据流状态
                    onStreamPlayStatus: function (status) {
                        console.log(status);
                    },
                    //历史回放的音频信息
                    onHistoryForListening: function (msg) {
                        //返回的音频流Id和所需要的通道号Chancel,不设置时默认为当前点击视频的通道号
                        var streamId = msg.streamID;
                        console.log("音频信息");
                        console.log(msg);
                        console.log("channel=" + self.currentChannel);
                        vsclientSession.startReplayAudio(streamId);
                    },
                    onGpsData: function (frontGpsData) { //车辆信息+GPS信
                        self.netnSignal = frontGpsData.gps.net_signal;
                        self.hd = frontGpsData.gps.storage.hd;
                        self.sd = frontGpsData.gps.storage.sd;
                    },
                    onReplayVideoList: function (listInfo) {
                        self.$Message.destroy();
                        self.backPlay.connectError = false;
                        if (!!listInfo) {
                            self.msgInfo = "";
                            self.backPlay.videoCount = 0;
                            self.backPlay.channelTotal = 0;
                            self.backPlay.channelInfo = {
                                "channel0": {
                                    "channel": 0,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel1": {
                                    "channel": 1,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel2": {
                                    "channel": 2,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel3": {
                                    "channel": 3,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel4": {
                                    "channel": 4,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel5": {
                                    "channel": 5,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel6": {
                                    "channel": 6,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel7": {
                                    "channel": 7,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                            };
                            for (var i = 0, len = listInfo.length; i < len; i++) {
                                if (listInfo[i]["channel"] >= 0) {
                                    if (listInfo[i]["data_type"] == 0) {
                                        self.backPlay.videoCount = self.backPlay.videoCount + 1;
                                        self.backPlay.channelInfo["channel" + (listInfo[i]["channel"])] = {
                                            "channel": listInfo[i]["channel"],
                                            "radioIndex": -1,
                                            "isChannel": self.backPlay.channelInfo["channel" + (listInfo[i]["channel"])].channel == listInfo[i]["channel"],
                                            "list": []
                                        };
                                    }
                                }
                            }

                            for (var key in self.backPlay.channelInfo) {
                                if (self.backPlay.channelInfo.hasOwnProperty(key)) {
                                    if (self.backPlay.channelInfo[key]["isChannel"]) {
                                        self.backPlay.channelTotal = self.backPlay.channelTotal + 1;
                                    }
                                    for (var c = 0, clen = listInfo.length; c < clen; c++) {
                                        if ((listInfo[c]["channel"] == self.backPlay.channelInfo[key]["channel"])) {
                                            if (listInfo[c]["data_type"] == 0) {
                                                self.backPlay.channelInfo[key]["list"].push({
                                                    channel: parseInt(listInfo[c]["channel"], 10),
                                                    date: (function () {
                                                        var time = utility.getDateDetailInfo(listInfo[c]["begin_time"] * 1000);
                                                        return time.year + "/" + time.month + "/" + time.date
                                                    }()),
                                                    beginTime: (function () {
                                                        var time = utility.getDateDetailInfo(listInfo[c]["begin_time"] * 1000);
                                                        return time.hour + ":" + time.min + ":" + time.second
                                                    }()),
                                                    endTime: (function () {
                                                        var time = utility.getDateDetailInfo(listInfo[c]["end_time"] * 1000);
                                                        return time.hour + ":" + time.min + ":" + time.second
                                                    }()),
                                                    weekDay: (function () {
                                                        var time = utility.getDateDetailInfo(listInfo[c]["end_time"] * 1000);
                                                        return time.weekDay
                                                    }()),
                                                    source: listInfo[c],
                                                });
                                            }
                                        }
                                    }
                                }
                            }

                            // console.log(JSON.stringify(self.backPlay.channelInfo));

                            setTimeout(function () {
                                self.backPlay.channel = "";
                                $("body").find("#channel0 .ivu-collapse-header").on("click", function () {
                                    console.log("");
                                });
                                $("body").find("#channel0 .ivu-collapse-header").trigger("click");
                            }, 500);

                            self.backPlay.tabs = "video";

                        } else {
                            self.msgType = "error";
                            self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】没有视频数据";
                            self.backPlay.tabs = "info";
                            self.backPlay.videoCount = 0;
                            self.backPlay.channelTotal = 0;
                            self.backPlay.channelInfo = {
                                "channel0": {
                                    "channel": 0,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel1": {
                                    "channel": 1,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel2": {
                                    "channel": 2,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel3": {
                                    "channel": 3,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel4": {
                                    "channel": 4,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel5": {
                                    "channel": 5,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel6": {
                                    "channel": 6,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                                "channel7": {
                                    "channel": 7,
                                    "radioIndex": "",
                                    "isChannel": false,
                                    "list": []
                                },
                            };
                        }

                    }
                };
                window.vsclientSession = new VSClientSession(callback);
                vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);

                self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】正在登录中......";
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "车辆【 " + self.vehicleInfo.licenseNumber + " 】正在登录中......",
                });
            },

            // 播放视频
            "playVideo": function (index, key, current) {
                var self = this;
                var video = $("#backVedio" + self.backPlay.channelInfo[key]["list"][index]["channel"]);
                $("body").find("#hidden" + current).val(index + "-" + key + "-" + current);

                self.currentChannel = self.backPlay.channelInfo[key]["list"][index]["channel"];
                vsclientSession.stopReplay(video[0]);
                vsclientSession.stopReAudio(self.currentChannel);
                setTimeout(function () {
                    self.backPlay.channelInfo[key]["radioIndex"] = index;
                    vsclientSession.startReplay(self.vehicleInfo.licenseNumber, current, video[0], self.backPlay.channelInfo[key]["list"][index]["source"]);
                }, 1000);
                self.getVideoFrame(index, key);
            },

            // reStart
            "reStart": function () {
                var self = this;
                // self.connectNet();
                vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);

                self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】正在登录中......";
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "车辆【 " + self.vehicleInfo.licenseNumber + " 】正在登录中......",
                });
            },

            // 返回
            "backPage": function () {
                var self = this;
                window.close();
            },
            "dateChange": function (value) {
                var self = this;
                self.backPlay.Date = value;
            },
            "beginTimeChange": function (value) {
                var self = this;
                var timeInfo = value.split(":");
                self.backPlay.beginTime = value;
                self.backPlay.BeginSecond = timeInfo[0] * 3600 + timeInfo[1] * 60 + timeInfo[2];
            },
            "endTimeChange": function (value) {
                var self = this;
                var timeInfo = value.split(":");
                self.backPlay.endTIme = value;
                self.backPlay.EndSecond = timeInfo[0] * 3600 + timeInfo[1] * 60 + timeInfo[2];
            },
            // 当拖拽结束
            "dragEnd": function (event) {
                var self = this;
                var srcElement = $(event.srcElement);

                self.dragAndDrop.sourceEle = srcElement;
                self.dragAndDrop.sourceStyle = srcElement.attr("style");

            },
            // 接收拖拽元素
            "drop": function (event) {
                var self = this;
                var srcElement = $(event.srcElement).parents(".videoItem");

                event.preventDefault();

                self.dragAndDrop.targetEle = srcElement;
                self.dragAndDrop.targetStyle = srcElement.attr("style");

                setTimeout(function () {
                    self.dragAndDrop.targetEle.attr("style", self.dragAndDrop.sourceStyle);
                    self.dragAndDrop.sourceEle.attr("style", self.dragAndDrop.targetStyle);
                }, 250);
            },
            // 设置全屏
            "setFullScream": function (id) {
                var el = $("body").find("#" + id)[0];
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                } else if (typeof window.ActiveXObject != "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            "dragOver": function (event) {
                var self = this;
                event.preventDefault();
            },
            "playSigleVideo": function (info) {
                var self = this;
                var playInfo = $("#" + info).val().split("-");
                var video = $("#backVedio" + playInfo[2]);
                vsclientSession.stopReplay(video[0]);
            },
            // getVideoFrame
            "getVideoFrame": function (videoId, key) {
                var self = this;
                var lastCurrTime = 0;
                var lastFrameCount = 0;
                var fps = 0;
                var index = self.backPlay.channelInfo[key]["list"][videoId]["channel"];
                setInterval(function () {
                    var currTime = $("#backVedio" + index)[0].currentTime;
                    if (typeof currTime == 'undefined') {
                        return;
                    }
                    var videoHeight = $("#backVedio" + index)[0].videoHeight;
                    var videoWidth = $("#backVedio" + index)[0].videoWidth;
                    var webkitDecodedFrameCount = $("#backVedio" + index)[0].webkitDecodedFrameCount;

                    if (currTime == 0) {
                        lastCurrTime = 0;
                        lastFrameCount = 0;
                    }
                    if (currTime != 0) {
                        fps = (webkitDecodedFrameCount - lastFrameCount) / (currTime - lastCurrTime);
                        lastCurrTime = currTime;
                        lastFrameCount = webkitDecodedFrameCount;
                    }

                    self.videoInfo[index] = {
                        videoWidth: videoWidth,
                        videoHeight: videoHeight,
                        fps: fps.toFixed(0)
                    };

                }, 1000);
            },
        },
        "mounted": function () {
            var self = this;

            self.$Message.config({
                "top": 3,
                "duration": 0,
                "closable": true
            });

            self.$Notice.config({
                "top": 3,
                "duration": 0,
                "closable": true
            });

            // "ip": "192.168.1.102",//"220.231.225.7",
            // "port": 8001, //7668,
            // "userName": "admin1", //"mgkj",
            // "pwd": "888888",
            // self.vehicleInfo.licenseNumber = self.vehicleList[0];
            self.init();

        }
    });

}())