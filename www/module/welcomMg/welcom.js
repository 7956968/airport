(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var functionInfo = (function () {
        var info = {
            isViewVideo: false,
            isSearch: false,
            isTrack: false,
            isOnlineDetail: false,
        };
        for (var key in userFuncList) {
            if (userFuncList.hasOwnProperty(key)) {
                for (var i = 0, len = userFuncList[key].length; i < len; i++) {
                    if (userFuncList[key][i]["functionCode"] == "device_manage_view_video") {
                        info.isViewVideo = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "map_query_live_vehicle") {
                        info.isSearch = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "map_view_track") {
                        info.isTrack = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "device_manage_secure_area") {
                        info.isDefense = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "device_manage_camera") {
                        info.isCamera = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "device_manage_view_online") {
                        info.isOnlineDetail = true;
                    }
                }
            }
        }
        return info;
    }());
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "isBaiYun": true,
            "functionInfo": functionInfo,
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": false,
            "isLoading": true,
            "innerHeight": window.innerHeight / 2,
            "resizeTime": null,
            "copyRight": { "CN": "@copyRight 深圳市民贵科技有限公司", 'EN': "@copyRight Mingui Non-Powered Euipment Management System", 'TW': "@copyRight 民貴無動力管理系統" }[language["language"]],
            // 车辆信息
            "vehicleInfo": {
                "list": [],
                "count": 0
            },
            "terminalStatusList": bizParam["terminalStatus"],
            "vehicleTypeList": bizParam["vehicleType"],
            "vehicleInfoStr": "",
            "vehicleTypeInfo": {},
            "vehiclePassType": {},

            "isloadDefen": false,
            "totalChartData": null,
            "colorList": ["#66CCCC", "#CCFF66", "#FF99CC", "#A0522D", "#FFFF00", "#336699", "#CC9933", "#339999"],
            "statuPageInfo": {
                "online": 2,
                "daySpan": 0,
                "pageNum": 1,
                "pageSize": 10,
                "count": 0,
                "licenseNumber": ""
            },
            "isTableLoading": false,
            "showStatuDetail": false,
            "statuItemInfo": {},
            "statuColumns": [
                {
                    "title": "车辆名称",
                    "key": "vehicleName"
                },
                {
                    "title": "车牌号",
                    "key": "licenseNumber"
                },
                {
                    "title": "车辆编号",
                    "key": "vehicleCode"
                },
                {
                    "title": "最后上线时间",
                    "render": function (h, params) {
                        var classType = "normalDay";
                        var now = Date.parse(new Date());
                        var lastTime = Date.parse(params.row.lastGpsTime.replace("-", "/"));
                        var day = Math.floor((now - lastTime) / (24 * 3600 * 1000));
                        if (day >= 1) {
                            classType = "overDay";
                        }
                        return h("div", [
                            h("span", {
                                "class": classType,
                            }, params.row.lastGpsTime),
                        ]);
                    }
                },
                {
                    "title": "操作",
                    "key": "operation",
                    "align": "center",
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "primary",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.showStatuDetail = true;
                                        pageVue.statuItemInfo = pageVue.statuDataList[params.index];
                                        pageVue.statuItemInfo.lastPosition = JSON.parse(pageVue.statuItemInfo.lastPosition)["coordinates"].join(",")
                                        var now = Date.parse(new Date());
                                        var lastTime = Date.parse(params.row.lastGpsTime.replace("-", "/"));
                                        var day = Math.floor((now - lastTime) / (24 * 3600 * 1000));
                                        if (day > 3) {
                                            pageVue.statuItemInfo.overDay = true;
                                        }
                                    }
                                }
                            }, { "CN": "详情", "EN": "Detail", "TW": "詳情" }[language["language"]])
                        ]);
                    }
                }
            ],
            "statuDataList": [],
            "isloadStae": false,
            "onlineStatPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 10,
                "beginTime": "",
                "endTime": ""
            },
            "onlineStatColumns": [
                {
                    "title": "车牌号",
                    "width": 100,
                    "key": "licenseNumber"
                },
                {
                    "title": "统计日期",
                    "key": "statDay",
                    "sortable": true,
                    "sortType": "asc",
                },
                {
                    "title": "在线次数",
                    "key": "onlineCount",
                    "sortable": true,
                    "align": "center",
                },
                {
                    "title": "离线次数",
                    "key": "offlineCount",
                    "sortable": true,
                    "align": "center",
                },
                {
                    "title": "在线时长",
                    "key": "onlineDuration",
                    "sortable": true,
                    "align": "center",
                    "render": function(h, params){
                        var text = (params.row.onlineDuration/3600).toFixed(2) + "小时"
                        return h("div", [
                            h("span", {
                            }, text)
                        ]);
                    }
                },
                {
                    "title": "操作",
                    "key": "operation",
                    "align": "center",
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "primary",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.showOnlineDetail = true;
                                        pageVue.onlineStatItemInfo = pageVue.onlineStatList[params.index];
                                    }
                                }
                            }, { "CN": "详情", "EN": "Detail", "TW": "詳情" }[language["language"]])
                        ]);
                    }
                }
            ],
            "onlineStatList": [],
            "onlineStatItemInfo": {},
            "showOnlineDetail": false,
            "current": 1
        },
        "methods": {
            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            "isLogin": function () {
                var self = this;

                // 判断是否有用户信息
                if (!userInfo) {
                    alert("请先登录！");
                    window.parent.window.location.href = "/airport/www/login.html";
                }
            },
            // 数据汇总
            "setTotalEchart": function () {
                var self = this;
                var myChart = echarts.init(document.getElementById('totalEchart'));
                var category = [];
                var seriesList = [];
                var legendLabel = [];
                var totalChartDataList = self.totalChartData.reverse();

                for (var key in self.vehicleTypeInfo) {
                    self.vehicleTypeInfo[key]['list'] = new Array(self.totalChartData.length);
                    for(var v = 0, vlen = self.totalChartData.length; v < vlen; v++) {
                        self.vehicleTypeInfo[key]['list'][v] = 0;
                    }
                }

                for (var i = 0, len = totalChartDataList.length; i < len; i++) {
                    category.push(totalChartDataList[i]["day"]);
                    for (var s = 0, slen = totalChartDataList[i]["useStat"].length; s < slen; s++) {
                        if(totalChartDataList[i]["useStat"][s]["vehicleTypeId"]) {
                            self.vehicleTypeInfo["_" + totalChartDataList[i]["useStat"][s]["vehicleTypeId"]]["list"][i] = (totalChartDataList[i]["useStat"][s]["totalVehicleNum"]);
                        }
                    }
                }

                for (var key in self.vehicleTypeInfo) {
                    legendLabel.push(self.vehicleTypeInfo[key]["name"]);
                    if (self.vehicleTypeInfo.hasOwnProperty(key)) {
                        seriesList.push({
                            name: self.vehicleTypeInfo[key]["name"],
                            type: 'bar',
                            barWidth: 4,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 2,
                                    color: self.vehicleTypeInfo[key]["color"]
                                }
                            },
                            data: self.vehicleTypeInfo[key]["list"]
                        });
                    }
                }

                // option
                option = {
                    backgroundColor: '#0f375f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        top: 20,
                        data: legendLabel,
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    xAxis: {
                        data: category,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: { show: false },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    series: seriesList.reverse()
                };
                myChart.setOption(option);

            },
            // 重置
            "resetVehicleBizParamInfo": function () {
                var self = this;
                var vList = [];
                self.vehicleTypeInfo = {};
                self.vehiclePassType = {};
                self.vehicleInfo = {
                    "list": [],
                    "count": 0
                };
                for (var i = 0, len = self.vehicleTypeList.length; i < len; i++) {
                    if (self.vehicleTypeList[i]["type"] != 302 && self.vehicleTypeList[i]["type"] != 303) {
                        self.vehicleTypeInfo["_" + self.vehicleTypeList[i]["type"]] = {
                            "value": 0,
                            "name": self.vehicleTypeList[i]["name"],
                            "list": [],
                            "color": self.colorList[i]
                        }
                    }
                    vList.push(self.vehicleTypeList[i]['type']);
                    
                }
                self.vehicleInfoStr = vList.join();

                for (var j = 0, jlen = self.terminalStatusList.length; j < jlen; j++) {
                    self.vehicleInfo["_" + self.terminalStatusList[j]["type"]] = 0
                }

            },
            "startDateChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.beginTime = value;
                self.getVehicleOnlineStat();
            },
            "endDateChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.endTime = value;
                self.getVehicleOnlineStat();
            },
            // 页数改变时的回调
            "onlineStatPageSizeChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineStat();
                }, 200);
            },
            // 切换每页条数时的回调
            "onlineStatPageRowChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineStat();
                }, 200);
            },
            // 获取车辆在线统计情况
            "getVehicleOnlineStat": function () {
                var self = this;
                // 如果是查询，则重新从第一页开始
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleOnlineStat,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": self.onlineStatPageInfo.pageNum,
                        "pageSize": self.onlineStatPageInfo.pageSize,
                        "beginTime": self.onlineStatPageInfo.beginTime,
                        "endTime": self.onlineStatPageInfo.endTime,
                    },
                    beforeSendCallback: function () {
                        self.isloadStae = true;
                    },
                    completeCallback: function () {
                        self.isloadStae = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.onlineStatPageInfo.count = data.count;
                            self.onlineStatList = data.data;
                        }
                    }
                });
            },
            // 获取车辆信息
            "getAllVehicleList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        id: "",
                        pageSize: 10000,
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleInfo.count = data.count;
                            self.vehicleInfo.list = data.data;
                            for (var i = 0, len = self.vehicleInfo.list.length; i < len; i++) {
                                self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] = self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] + 1;
                                if(!!self.vehicleTypeInfo["_" + self.vehicleInfo.list[i]["vehicleTypeId"]]) {
                                    self.vehicleTypeInfo["_" + self.vehicleInfo.list[i]["vehicleTypeId"]]["value"] = self.vehicleTypeInfo["_" + self.vehicleInfo.list[i]["vehicleTypeId"]]["value"] + 1;
                                }
                            }
                        }
                    }
                });
            },

            // 页数改变时的回调
            "statuPageSizeChange": function (value) {
                var self = this;
                self.current = value;
                self.statuPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getStatuVehicleList();
                }, 200);
            },
            // 切换每页条数时的回调
            "statuPageRowChange": function (value) {
                var self = this;
                self.statuPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getStatuVehicleList();
                }, 200);
            },
            // 获取车辆不同天数的状态信息信息
            "getStatuVehicleList": function (bool) {
                var self = this;
                if(bool == true) {
                    self.current = 1;
                    self.statuPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        id: "",
                        online: parseInt(self.statuPageInfo.online),
                        daySpan: parseInt(self.statuPageInfo.daySpan),
                        pageSize: self.statuPageInfo.pageSize,
                        pageNum: self.statuPageInfo.pageNum,
                        licenseNumber:  encodeURI($.trim(self.statuPageInfo.licenseNumber)),
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.statuPageInfo.count = data.count;
                            self.statuDataList = data.data;
                        }
                    }
                });
            },
            // 跳转到地图页面
            "toMapPage": function (vehicleStatus) {
                var self = this;
                utility.setSessionStorage("fromInfo", {
                    type: "isSearch",
                    vehicleStatus: vehicleStatus
                });
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
                }, 200);
            },
            // 获取按运行状态的车辆分类占比统计数据
            "getVehicleStatusReport": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleStatusReport,
                    actionUrl: CONFIG.SERVICE.getVehicleStatusReport,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            console.log(data);
                        }
                    }
                });
            },
            // 获取按车辆类型的车辆使用情况统计数据接口
            "getVehicleRunReport": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleRunReport,
                    actionUrl: CONFIG.SERVICE.getVehicleRunReport,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.totalChartData = data.data;
                            self.setTotalEchart(); // 数据汇总
                        }
                    }
                });
            },
            // 获取按车辆类型的车辆分类占比统计数据接口
            "getVehicleCateReport": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleCateReport,
                    actionUrl: CONFIG.SERVICE.getVehicleCateReport,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            console.log(data);
                        }
                    }
                });
            },
            "toOnlineDetail": function(onlineStatItemInfo) {
                var self = this;
                utility.setSessionStorage("onlineStatItemInfo", onlineStatItemInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_OnlineDetail").bind("click");
                    $(window.parent.document).find("#nav_OnlineDetail").trigger("click");
                }, 200);
            },
            // 初始化
            "init": function () {
                var self = this;

                // 重置常量数据
                self.resetVehicleBizParamInfo();

                // 获取按车辆类型的车辆使用情况统计数据接口
                self.getVehicleRunReport();

                // 车辆数据
                self.getAllVehicleList();

                // 获取车辆不同天数的状态信息信息
                self.getStatuVehicleList();

                // 获取车辆在线统计情况
                self.getVehicleOnlineStat();
            }
        },
        "created": function () {
            var self = this;

            // self.isBaiYun = (userInfo.userName.indexOf("白云")!=-1);

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            // 初始化数据
            self.init();

            setInterval(function () {
                self.init();
            }, 10000);

            // 当窗口变化时，重新调整高度
            $(window).resize(function () {
                clearTimeout(self.resizeTime);
                self.resizeTime = setTimeout(function () {
                    window.location.href = window.location.href;
                }, 500);
            });
        },
        "mounted": function () {
            var self = this;
            setTimeout(function () {
                self.isLoading = false;
                // self.setVehicleEchart(); // 车辆统计
            }, 5000);
        }
    });

}())
