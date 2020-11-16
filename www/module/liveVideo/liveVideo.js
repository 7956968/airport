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
            // "mUserName": "test1", // 登录用户名
            // "mIP": "120.79.197.241", // socket登录IP
            "mVideoCount": 8, // 分屏数
            "maxVideoNum": 10, // 最大视频数
            "codeType": true, // true是网络码流 false是主码流
            "front": null,
            "cNet": "",
            "FPS": "",
            "pageCurrent": 1,
            "pageNum": 0,
            "frontChildren": [],
            "seleceChannel": [{
                value: '0-0'
            }, {
                value: '1-1'
            }, {
                value: '2-2'
            }, {
                value: '3-3'
            }, {
                value: '4-4'
            }, {
                value: '5-5'
            }, {
                value: '6-6'
            }, {
                value: '7-7'
            }],
            "flagChannel": [{
                value: '0-0'
            }, {
                value: '1-1'
            }, {
                value: '2-2'
            }, {
                value: '3-3'
            }, {
                value: '4-4'
            }, {
                value: '5-5'
            }, {
                value: '6-6'
            }, {
                value: '7-7'
            }],
            "videoInfo": [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            "isStop": false, // 是否开始了
            "offLine": false, // 是否开始了
            "timeOfflineOut": null,
            "timeOffline": 5,
            "timeLen": 120,
            "timeSelect": "120",
            "timeLenOut": null,
            "netnSignal": "",
            "hd": [],
            "sd": [],
            "storage_new": 0,
            "msgType": "primary",
            "msgInfo": "",
            "isFullScream": false,
            "channelIndex": "-",
            "fullScreamIndex": "",
            "defaultColor": "rgb(255,125,0)", // 当前激活视频样式
            "splitNum": 4,
            "connectTimeOut": null,
            "dragAndDrop": {
                "sourceEle": null,
                "targetEle": null,
                "sourceStyle": "",
                "targetStyle": ""
            },
            "splitArea": [1, 3, 4, 5, 6, 8, 9], // 分屏类型
            "videoWinSplit": {
                "_1": {
                    count: 1,
                    normal: [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(100% - 4px)',
                        height: 'calc(100% - 4px)' //calc运算符一定要有空格，要不然解析不了
                    }],
                    page: [{
                        top: '0px',
                        left: '0px',
                        width: 'calc(100% - 4px)',
                        height: 'calc(100% - 4px)' //calc运算符一定要有空格，要不然解析不了
                    }]
                },
                "_3": {
                    count: 3,
                    normal: [{
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
                    page: [{
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
                },
                "_4": {
                    count: 4,
                    normal: [{
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
                    page: [{
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
                },
                "_5": {
                    count: 5,
                    normal: [{
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
                    page: [{
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
                },
                "_6": {
                    count: 6,
                    normal: [{
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 2 - 6px)',
                            height: 'calc(100% / 3 * 2 - 8px)'
                        }, //大屏
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下1
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 1 - 0px)',
                            width: 'calc(100% / 3 * 1 - 6px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下2
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下3
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 2px)',
                            height: 'calc(100% / 3 * 1 - 8px)'
                        }, //右上1
                        {
                            top: 'calc(100% / 3 * 1 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        } //右上2
                    ],
                    page: [{
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 2 - 6px)',
                            height: 'calc(100% / 3 * 2 - 8px)'
                        }, //大屏
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下1
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 1 - 0px)',
                            width: 'calc(100% / 3 * 1 - 6px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下2
                        {
                            top: 'calc(100% / 3 * 2 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1)'
                        }, //左下3
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 2px)',
                            height: 'calc(100% / 3 * 1 - 8px)'
                        }, //右上1
                        {
                            top: 'calc(100% / 3 * 1 - 4px)',
                            left: 'calc(100% / 3 * 2 - 2px)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        } //右上2
                    ]
                },
                "_8": {
                    count: 8,
                    page: [{
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
                        },
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
                    normal: [{
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
                "_9": {
                    count: 9,
                    normal: [{
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,1
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,2
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,3
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,1
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,2
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,3
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }, //3,1
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }, //3,2
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        } //3,3
                    ],
                    page: [{
                            top: '0px',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,1
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,2
                        {
                            top: '0px',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 6px)'
                        }, //1,3
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,1
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,2
                        {
                            top: 'calc(100% / 3 * 1 - 2px)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 2px)'
                        }, //2,3
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: '0px',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }, //3,1
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 1)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        }, //3,2
                        {
                            top: 'calc(100% / 3 * 2)',
                            left: 'calc(100% / 3 * 2)',
                            width: 'calc(100% / 3 * 1 - 4px)',
                            height: 'calc(100% / 3 * 1 - 4px)'
                        } //3,3
                    ]
                }
            },
            "isNormal": false
        },
        "methods": {
            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            "init": function () {
                var self = this;

                if (self.mVideoCount > self.maxVideoNum || self.mVideoCount < 0) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "视频窗口数量有误";
                    return;
                }
                self.updateVideoWin(8);
                self.connectNet();
            },
            "onTimeChange": function (value) {
                var self = this;
                self.timeLen = parseInt(value, 10);
            },
            "onChannelChange": function (value) {
                var self = this;
                var info = value.split("-");
                var hiddenVideo = $(".hiddenVideo");
                var bool = true;
                var flagCha = $("body").find("#hidden" + info[1]);

                for (var i = 0, len = hiddenVideo.length; i < len; i++) {
                    // 如果当前是第二页
                    if (self.pageCurrent == 2) {
                        if (i > 3) {
                            if ($(hiddenVideo[i]).val() != flagCha.val()) {
                                if (info[0] == $(hiddenVideo[i]).val().split("-")[0]) {
                                    bool = false;
                                    self.seleceChannel[info[1]]['value'] = flagCha.val();
                                    alert("摄像机" + self.frontChildren[info[0]]["name"] + "正在其他通道播放，请选择其他摄像头");
                                    break;
                                }
                            }
                        }
                    } else {
                        if (i < 4) {
                            if ($(hiddenVideo[i]).val() != flagCha.val()) {
                                if (info[0] == $(hiddenVideo[i]).val().split("-")[0]) {
                                    bool = false;
                                    self.seleceChannel[info[1]]['value'] = flagCha.val();
                                    alert("摄像机" + self.frontChildren[info[0]]["name"] + "正在其他通道播放，请选择其他摄像头");
                                    break;
                                }
                            }
                        }
                    }
                }
                if (bool == true) {
                    flagCha.val(value);
                    vsclientSession.startPlay({
                        name: self.vehicleInfo.licenseNumber,
                        channel: info[0],
                        videoCtrl: $("#video" + info[1])[0],
                        codeType: self.codeType
                    });
                }
            },
            // 播放单个视频
            "playSigleVideo": function (channel, video) {
                var self = this;
                var info = video.split("-");
                if ($("body").find("#video" + info[1]).attr("src").indexOf("blob:http://") == -1) {
                    vsclientSession.startPlay({
                        name: self.vehicleInfo.licenseNumber,
                        channel: channel,
                        videoCtrl: $("#video" + info[1])[0],
                        codeType: self.codeType
                    });
                } else {
                    vsclientSession.stopPlay($("body").find("#video" + info[1])[0]);
                }
            },
            "playAllVedio": function () {
                var self = this;
                var left = $("body").find(".left");
                var right = $("body").find(".right");
                self.isNormal = !self.isNormal;

                setTimeout(function () {
                    self.updateVideoWin(8);
                    if (self.isNormal == true) {
                        left.css({
                            zIndex: 1000,
                            opacity: 1,
                        });
                        right.css({
                            zIndex: 1000,
                            opacity: 1,
                        });
                        left.each(function (item) {
                            var video = $(this).attr("data-id");
                            var index = $(this).attr("data-index");
                            if (!$("#" + video).attr("src") || $("#" + video).attr("src").length < 20) {
                                $("#" + video).attr("controls", true);
                                vsclientSession.startPlay({
                                    name: self.vehicleInfo.licenseNumber,
                                    channel: index,
                                    videoCtrl: $("#" + video)[0],
                                    codeType: self.codeType
                                });
                            }
                        });
                        right.each(function (item) {
                            var video = $(this).attr("data-id");
                            var index = $(this).attr("data-index");
                            if (!$("#" + video).attr("src") || $("#" + video).attr("src").length < 20) {
                                $("#" + video).attr("controls", true);
                                vsclientSession.startPlay({
                                    name: self.vehicleInfo.licenseNumber,
                                    channel: index,
                                    videoCtrl: $("#" + video)[0],
                                    codeType: self.codeType
                                });
                            }
                        });
                    } else {
                        left.css({
                            zIndex: 1000,
                            opacity: 1,
                        });
                        right.css({
                            zIndex: 10,
                            opacity: 0,
                        });
                        left.each(function (item) {
                            var video = $(this).attr("data-id");
                            var index = $(this).attr("data-index");
                            if ($("#" + video).attr("src").length < 20) {
                                $("#" + video).attr("controls", true);
                                vsclientSession.startPlay({
                                    name: self.vehicleInfo.licenseNumber,
                                    channel: index,
                                    videoCtrl: $("#" + video)[0],
                                    codeType: self.codeType
                                });
                            }
                        });
                        right.each(function (item) {
                            var video = $(this).attr("data-id");
                            var index = $(this).attr("data-index");
                            vsclientSession.stopPlay($("body").find("#" + video)[0]);
                        });
                    }
                    clearInterval(self.timeLenOut);
                    self.timeLenOut = null;
                    setTimeout(function () {
                        self.timeLenOut = setInterval(function () {
                            self.timeLen--;
                            self.$Message.destroy();
                            if (self.timeLen <= 0 || self.isStop == true) {
                                self.stopVideo("");
                                clearInterval(self.timeLenOut);
                            }
                        }, 1000);
                        self.stopAudio();
                        $("body").find("video").removeAttr("controls");;
                    }, 5000);
                }, 500);

            },
            "pageSizeChange": function (value) {
                var self = this;
                var left = $("body").find(".left");
                var right = $("body").find(".right");
                self.pageCurrent = value;
                if (value == 1) {
                    left.css({
                        zIndex: 1000,
                        opacity: 1,
                    });
                    right.css({
                        zIndex: 10,
                        opacity: 0,
                    });
                    left.each(function (item) {
                        var video = $(this).attr("data-id");
                        var index = $(this).attr("data-index");
                        vsclientSession.startPlay({
                            name: self.vehicleInfo.licenseNumber,
                            channel: index,
                            videoCtrl: $("#" + video)[0],
                            codeType: self.codeType
                        });
                    });
                    right.each(function (item) {
                        var video = $(this).attr("data-id");
                        var index = $(this).attr("data-index");
                        vsclientSession.stopPlay($("body").find("#" + video)[0]);
                    });
                    return;
                }
                if (value == 2) {
                    right.css({
                        zIndex: 1000,
                        opacity: 1,
                    });
                    left.css({
                        zIndex: 10,
                        opacity: 0,
                    });
                    right.each(function (item) {
                        var video = $(this).attr("data-id");
                        var index = $(this).attr("data-index");
                        vsclientSession.startPlay({
                            name: self.vehicleInfo.licenseNumber,
                            channel: index,
                            videoCtrl: $("#" + video)[0],
                            codeType: self.codeType
                        });
                    });
                    left.each(function (item) {
                        var video = $(this).attr("data-id");
                        var index = $(this).attr("data-index");
                        vsclientSession.stopPlay($("body").find("#" + video)[0]);
                    });
                    return;
                }
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
                    // 登录失败
                    onLoginFailed: function () {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "车辆 【" + self.vehicleInfo.licenseNumber + "】登录失败";
                        clearInterval(self.timeLenOut);
                        setTimeout(function () {
                            vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);
                        }, 3000);
                    },
                    // 登录成功
                    onlogon: function (info) {
                        var front = vsclientSession.findFrontByName(self.vehicleInfo.licenseNumber);

                        if (front == null) {
                            self.msgType = "error";
                            self.msgInfo = "没有找到车辆【 " + self.vehicleInfo.licenseNumber + " 】";
                            self.isStop = true;
                            clearInterval(self.timeLenOut);
                            return;
                        } else {
                            self.front = front;
                            self.frontChildren = self.front.children;
                            self.$Message.destroy();
                            self.msgType = "success";
                            self.msgInfo = "车辆 【" + self.vehicleInfo.licenseNumber + "】登录成功";
                            self.pageNum = self.frontChildren.length > 8 ? 8 : self.frontChildren.length;
                            // 登录成功后马上开始播放视频
                            self.startVideo();
                            // self.listenVideoFrame();
                        }
                        
                    },
                    // // 设备离线或上线
                    onOnOffline: function (front) {
                        if (front.name == self.vehicleInfo.licenseNumber) {
                            if (front.online == false) {
                                self.updateVehicleOnlineStatus();
                                self.$Message.destroy();
                                self.msgType = "error";
                                self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】已经下线";
                                self.isStop = true;
                                self.timeOfflineOut = null;
                                clearInterval(self.timeLenOut);
                                self.timeOfflineOut = setInterval(function () {
                                    self.timeOffline--;
                                    if (self.timeOffline <= 0) {
                                        self.stopVideo(self.msgInfo);
                                    }
                                }, 1000);
                            } else {
                                self.startVideo();
                            }
                        }
                    },
                    // 但 socket 服务链接断开
                    onServerConnectionLost: function () {
                        self.$Message.destroy();
                        self.msgType = "error";
                        self.msgInfo = "服务链接断开";
                        // self.stopVideo(self.msgInfo);
                    },
                    // 数据流状态
                    onStreamPlayStatus: function (status) {
                        switch (status) {
                            case STREAM_PLAY_STATE_REQUESTTING:
                                self.msgInfo = "";
                                self.$Message.destroy();
                                self.$Message.loading({
                                    "content": "正在请求视频......"
                                });
                                clearInterval(self.timeLenOut);
                                break;
                            case STREAM_PLAY_STATE_REQ_STREAM_SUCCESS:
                                self.msgInfo = "";
                                self.$Message.destroy();
                                // self.$Message.loading({
                                //     "content": "请求完成,等待播放......"
                                // });
                                break;
                            case STREAM_PLAY_STATE_PLAY_STRAM_SUCCESS:
                                self.$Message.destroy();
                                self.msgType = "success";
                                self.msgInfo = "";
                                self.isStop = false;
                                break;
                            case STREAM_PLAY_STATE_PLAY_STRAM_FAILED:
                                self.$Message.destroy();
                                self.msgType = "error";
                                self.msgInfo = "视频播放失败";
                                clearInterval(self.timeLenOut);
                                break;
                            default:
                                self.$Message.destroy();
                                self.msgType = "error";
                                self.msgInfo = "播放状态异常";
                                clearInterval(self.timeLenOut);
                                break;
                        }
                    },
                    onGpsData: function (frontGpsData) { //车辆信息+GPS信
                        var storage = frontGpsData.gps.storage.storage_new;
                        self.netnSignal = frontGpsData.gps.net_signal;
                        self.hd = frontGpsData.gps.storage.hd;
                        self.sd = frontGpsData.gps.storage.sd;

                        if(!!storage) {
                            for (var i= 0, len = storage.length; i < len; i++) {
                                if(storage[i] == 1) {
                                    self.storage_new = 1;
                                    break;
                                }
                            }
                        }
                        console.log("storage_new:"+frontGpsData.gps.storage_new);
                    }
                };
                window.vsclientSession = new VSClientSession(callback);
                self.stopVideo();
                vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);

                self.msgInfo = "";
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "车辆【 " + self.vehicleInfo.licenseNumber + " 】登录中......",
                });
                clearInterval(self.timeLenOut);
            },
            // getVideoFrame
            "getVideoFrame": function (videoId) {
                var self = this;
                var lastCurrTime = 0;
                var lastFrameCount = 0;
                var fps = 0;
                setInterval(function () {
                    var currTime = $("#video" + videoId)[0].currentTime;
                    var videoHeight = $("#video" + videoId)[0].videoHeight;
                    var videoWidth = $("#video" + videoId)[0].videoWidth;
                    var webkitDecodedFrameCount = $("#video" + videoId)[0].webkitDecodedFrameCount;

                    if (currTime == 0) {
                        lastCurrTime = 0;
                        lastFrameCount = 0;
                    }
                    if (currTime != 0) {
                        fps = (webkitDecodedFrameCount - lastFrameCount) / (currTime - lastCurrTime);
                        lastCurrTime = currTime;
                        lastFrameCount = webkitDecodedFrameCount;
                    }
                    self.videoInfo[videoId] = {
                        videoWidth: videoWidth,
                        videoHeight: videoHeight,
                        fps: fps.toFixed(0)
                    };
                }, 1000);
            },
            // listenVideoFrame
            "listenVideoFrame": function () {
                var self = this;
                var rAF = function () {
                    return (
                        window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        }
                    );
                }();

                var frame = 0;
                var allFrameCount = 0;
                var lastTime = Date.now();
                var lastFameTime = Date.now();

                var loop = function () {
                    var now = Date.now();
                    var fs = (now - lastFameTime);
                    var fps = Math.round(1000 / fs);

                    lastFameTime = now;
                    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
                    allFrameCount++;
                    frame++;

                    if (now > 1000 + lastTime) {
                        var fps = Math.round((frame * 1000) / (now - lastTime));
                        // console.log(`${new Date()} 1S内 FPS：`, fps);
                        frame = 0;
                        lastTime = now;
                        self.FPS = fps;
                    };

                    rAF(loop);
                }
                loop();
            },
            // 重新分割窗口
            "updateVideoWin": function (splitNum) {
                var self = this;
                var param = null;

                if (self.isNormal == true) {
                    param = self.videoWinSplit["_" + splitNum]["normal"];
                } else {
                    param = self.videoWinSplit["_" + splitNum]["page"];
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
                    curVideoWin.attr("data-style", "top: " + param[idx].top + "; left:" + param[idx].left + ";width: " + param[idx].width + ";height:" + param[idx].height + ";display:block;");
                    curVideoWin.css({
                        "top": param[idx].top,
                        "left": param[idx].left,
                        "width": param[idx].width,
                        "height": param[idx].height,
                        "display": "block"
                    });
                    self.getVideoFrame(idx);
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
                    self.updateVehicleOnlineStatus();
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.isStop = true;
                    self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】已经下线";
                    clearInterval(self.timeLenOut);
                    return;
                }
                var channelNum = 4;
                var ret = false;

                if (self.isNormal == true) {
                    channelNum = 8;
                }

                self.$Message.destroy();
                self.msgType = "blue";

                for (var idx = 0; idx < channelNum; idx++) {
                    $("#video" + idx).attr("controls", true);
                    ret = vsclientSession.startPlay({
                        name: self.vehicleInfo.licenseNumber,
                        channel: idx,
                        videoCtrl: $("#video" + idx)[0],
                        codeType: self.codeType
                    });
                }

                setTimeout(function () {
                    for (var i = 0; i < channelNum; i++) {
                        $("#video" + i).removeAttr("controls");
                    }
                }, 4000);

                if (ret) {
                    self.isStop = false;
                    self.msgInfo = "";
                    self.$Message.destroy();
                    self.$Message.loading({
                        "content": "正在请求视频......"
                    });

                    clearInterval(self.timeLenOut);
                    self.timeLenOut = null;
                    setTimeout(function () {
                        self.timeLenOut = setInterval(function () {
                            self.timeLen--;
                            self.$Message.destroy();
                            if (self.timeLen <= 0 || self.isStop == true) {
                                self.stopVideo("");
                                clearInterval(self.timeLenOut);
                            }
                        }, 1000);
                        self.stopAudio();
                        setTimeout(function () {
                            $("body").find("#playAudio_0").on("click");
                            $("body").find("#playAudio_0").trigger("click");
                        }, 3000);
                    }, 10000);
                } else {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "请求视频失败";
                    clearInterval(self.timeLenOut);
                }
            },

            // reStart
            "reStart": function () {
                var self = this;
                // window.location.href = window.location.href;
                vsclientSession.login(self.mUserName, self.mPwd, self.mIP, self.mPort);
                self.msgInfo = "";
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "车辆【 " + self.vehicleInfo.licenseNumber + " 】登录中......",
                });
                clearInterval(self.timeLenOut);
            },

            // 开始视频
            "startVideo": function () {
                var self = this;
                var front = vsclientSession.findFrontByName(self.vehicleInfo.licenseNumber);

                if (front == null) {
                    self.$Message.destroy();
                    self.msgType = "error";
                    self.msgInfo = "车辆【 " + self.vehicleInfo.licenseNumber + " 】不存在";
                    self.isStop = true;
                    clearInterval(self.timeLenOut);
                    return;
                }
                self.timeLen = 120;
                self.timeSelect = "120";
                self.stopAudio();
                self.playVideo(front);
            },

            // 停止视频
            "stopVideo": function (msgInfo) {
                var self = this;
                for (var idx = 0; idx < self.mVideoCount; idx++) {
                    vsclientSession.stopPlay($("body").find("#video" + idx)[0]);
                }
                self.isStop = true;
                self.$Message.destroy();
                self.msgType = "error";
                self.msgInfo = typeof msgInfo == "string" ? msgInfo : "";
                clearInterval(self.timeLenOut);
                clearInterval(self.timeOfflineOut);
                self.timeOffline = 5;
                if (self.timeLen <= 0) {
                    self.timeLen = parseInt(self.timeSelect);
                }
                self.stopAudio();
            },

            // 进入全屏/或取消全屏
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

            // 播放声音
            "playAudio": function (channel) {
                var self = this;

                self.channelIndex = channel;
                vsclientSession.stopListening();

                setTimeout(function () {
                    vsclientSession.startListening(self.vehicleInfo.licenseNumber, self.channelIndex);
                }, 1000);
            },
            // 停止播放声音
            "stopAudio": function () {
                var self = this;
                self.channelIndex = "-";
                vsclientSession.stopListening();
            },
            "dragEnd": function (event) {
                var self = this;
                var srcElement = $(event.srcElement);

                self.dragAndDrop.sourceEle = srcElement;
                self.dragAndDrop.sourceStyle = srcElement.attr("style");

            },
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
            "dragOver": function (event) {
                var self = this;
                event.preventDefault();
            },
            // 返回
            "backPage": function () {
                var self = this;
                window.close();
            },
            // 修改车辆状态
            "updateVehicleOnlineStatus": function() {
                var self = this;
                utility.interactWithServer({
					url: "http://" + window.location.host + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.updateVehicleOnlineStatus+"&vehicleId="+ self.vehicleInfo.id +"&status=406",
					actionUrl: CONFIG.SERVICE.vehicleService,
					successCallback: function (data) {}
				});
            }
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

            console.log(window.location.host);

            utility.setLocalStorage("userInfo", {
                "id": self.queryInfo.id,
                "userToken": self.queryInfo.userToken
            });

            console.log(self.vehicleInfo);
            self.init();

        }
    });

}())