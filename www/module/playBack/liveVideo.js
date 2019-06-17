(function () {
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "isShowDetail": true,
            "vehicleInfo": JSON.parse(decodeURI(utility.getQueryParams().vehicleInfo)),
            "queryInfo": utility.getQueryParams(),
            "mIP": "220.231.225.7", // socket登录IP
            "mPort": 7668, // socket登录端口
            "mUserName": "mgkj", // 登录用户名
            "mPwd": "888888", // socket密码
            "msgInfo": "",
            "codeType": true,
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
            "radioIndex": "",
            "front": null,
            "splitArea": [1, 4, 6, 8, 9], // 分屏类型
            "innerHeight": window.innerHeight,
            "videoWinSplit": {
                "count_1": [
                    {
                        top: '0px',
                        left: '0px',
                        width: 'calc(100% - 4px)',
                        height: 'calc(100% - 4px)'//calc运算符一定要有空格，要不然解析不了
                    }
                ],
                "count_3": [
                    {
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
                "count_4": [
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
                ],
                "count_8": [
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
            },
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
                self.connectNet();
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
                vsclientSession.connection.send(JSON.stringify(msg));
            },

            // 链接 socket 服务器
            "connectNet": function () {
                var self = this;
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
                    // 登录成功
                    onlogon: function (info) {
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
                    onOnOffline: function(front){
                        if(front.name == self.vehicleInfo.licenseNumber) {
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
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】连接失败";
                        self.backPlay.connectError = true;
                    },
                    // 数据流状态
                    onStreamPlayStatus: function (status) {
                        console.log(status);
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
                                    console.log("data_type="+listInfo[i]["data_type"]);
                                    if(listInfo[i]["data_type"]==0 || listInfo[i]["data_type"]==2) {
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
                                            if(listInfo[c]["data_type"] == 0 || listInfo[c]["data_type"] == 2) {
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
            "playVideo": function (index, key) {
                var self = this;
                $("#backVedio").attr("src", "");
                vsclientSession.stopReplay($("#backVedio" + self.backPlay.channelInfo[key]["list"][index]["channel"])[0]);
                self.backPlay.channelInfo[key]["radioIndex"] = index;
                console.log(self.backPlay.channelInfo[key]["radioIndex"]);
                if (self.backPlay.connectError == true) {
                    self.reStart();
                }
                console.log(self.backPlay.channelInfo[key]["list"][index]["source"]);
                setTimeout(function () {
                    vsclientSession.startReplay({
                        name: self.vehicleInfo.licenseNumber,
                        videoCtrl: $("#backVedio" + self.backPlay.channelInfo[key]["list"][index]["channel"])[0],
                        info: self.backPlay.channelInfo[key]["list"][index]["source"],
                        codeType: self.codeType
                    });
                }, 1000);
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
        },
        "mounted": function () {
            var self = this;

            // self.vehicleInfo = {
            //     "vehicleColorId": 331,
            //     "deptName": "浦东营运部特车运行中心",
            //     "gpsDeviceId": 30,
            //     "lastMaintainUserId": 0,
            //     "createUserId": 1,
            //     "lastMaintainDeptId": 0,
            //     "vehicleName": "浦东-行李传送车",
            //     "vehicleTypeId": 304,
            //     "lastMaintainMiles": 0,
            //     "useStatusName": "空闲中",
            //     "lastMaintainDeptName": "",
            //     "companyName": "上海浦东国际机场",
            //     "maintainRemark": "",
            //     "modifyUserId": 0,
            //     "createUserName": "管理员",
            //     "remark": "V",
            //     "vehicleStatusName": "静止",
            //     "delFlag": 0,
            //     "vehicleColorName": "白色",
            //     "otherStatusDesc": "",
            //     "speed": 0,
            //     "modifyUserName": "System",
            //     "modifyTime": "2019-06-04 16:46:33",
            //     "lastMaintainUserName": "",
            //     "providerId": 1,
            //     "currMaintainTime": "",
            //     "lastPosition": "{\"type\":\"Point\",\"coordinates\":[121.80599,31.156428]}",
            //     "vehicleBrandId": 323,
            //     "licenseNumber": "民航-B3045",
            //     "id": 34,
            //     "power": 0,
            //     "lastMaintainTime": "",
            //     "nextMaintainMiles": 0,
            //     "providerName": "民贵2",
            //     "vehicleTypeName": "行李传送车",
            //     "deptId": 14,
            //     "vehicleBrandName": "威海广泰",
            //     "vehicleCode": "民航-B3045",
            //     "lastGpsTime": "2019-06-04 16:46:33",
            //     "gpsDeviceCode": "00000000000000000023",
            //     "illegalNum": 0,
            //     "useStatus": 0,
            //     "currMiles": 59044.0583,
            //     "companyId": 11,
            //     "createTime": "2019-01-20 20:28:15",
            //     "lastPositionStr": "",
            //     "vehicleStatus": 401
            // };

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
