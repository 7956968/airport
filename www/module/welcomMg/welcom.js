(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var airPort = utility.getLocalStorage("airPort");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var licenseNumberList = [];
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
            "isLoading": true,
            "innerHeight": window.innerHeight / 2,
            "resizeTime": null,
            "copyRight": {
                "CN": "@copyRight 深圳市民贵科技有限公司",
                'EN': "@copyRight Mingui Non-Powered Euipment Management System",
                'TW': "@copyRight 民貴無動力管理系統"
            } [language["language"]],
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
            "statuColumns": [{
                    "title": "车牌号",
                    "key": "licenseNumber",
                    // "filters": licenseNumberList,
                    // "filterMultiple": false,
                    // "filterRemote"(value, row) {
                    //     pageVue.statuPageInfo.licenseNumber = value;
                    //     pageVue.getStatuVehicleList(true, false);
                    // }
                },
                {
                    "title": "车辆名称",
                    "key": "vehicleName",
                    // "width": 140
                },
                {
                    "title": "车辆状态",
                    "key": "vehicleStatusName",
                    "align": "center",
                    // "width": 120
                },
                {
                    "title": "最后上线时间",
                    // "width": 180,
                    "render": function (h, params) {
                        var classType = "normalDay";
                        var now = Date.parse(new Date());
                        if (!!params.row.lastGpsTime) {
                            var lastTime = Date.parse(params.row.lastOnlineTime.replace(/\-/g, "/"));
                            var day = Math.floor((now - lastTime) / (24 * 3600 * 1000));
                            if (day >= 7) {
                                classType = "overDay";
                            }
                        }
                        return h("div", [
                            h("span", {
                                "class": classType,
                            }, params.row.lastOnlineTime),
                        ]);
                    }
                },
                // {
                //     "title": "最后上线地点",
                //     "key": "lastAddress",
                //     "width": 300,
                //     "render": function (h, params) {

                //         return h("div", [
                //             h("span", {}, params.row.lastAddress),
                //         ]);
                //     }
                // },

                {
                    "title": "操作",
                    "key": "operation",
                    "align": "center",
                    // "fixed": "right",
                    // "width": 140,
                    "render": function (h, params) {
                        var type = "primary";
                        var txt = "详情";

                        if (params.row.alarmFlag == 1) {
                            type = "error";
                            txt = "异常";
                        }
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": type,
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
                                        var lastTime = Date.parse(params.row.lastGpsTime.replace(/\-/g, "/"));
                                        var day = Math.floor((now - lastTime) / (24 * 3600 * 1000));
                                        if (day >= 1) {
                                            pageVue.statuItemInfo.overDay = true;
                                        }
                                        if (params.row.alarmFlag == 1) {
                                            pageVue.alarmPageInfo.companyId = pageVue.statuItemInfo.companyId;
                                            pageVue.alarmPageInfo.deptId = pageVue.statuItemInfo.deptId;
                                            pageVue.alarmPageInfo.vehicleName = pageVue.statuItemInfo.vehicleName;
                                            pageVue.alarmPageInfo.licenseNumber = pageVue.statuItemInfo.licenseNumber;
                                            pageVue.getAlarmList(true);
                                        }
                                    }
                                }
                            }, txt),
                            // warning
                            h("Button", {
                                "props": {
                                    "icon": "md-pin",
                                    "type": "warning", // md-pin
                                    "size": "small",
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.toMapCoordinates(pageVue.statuDataList[params.index]);
                                    }
                                }
                            }, "")
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
            "onlineStatColumns": [{
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
                    "title": "在线时长",
                    "key": "onlineDuration",
                    "sortable": true,
                    "align": "center",
                    "render": function (h, params) {
                        var text = (params.row.onlineDuration / 3600).toFixed(2) + "小时"
                        return h("div", [
                            h("span", {}, text)
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
                                "on": {
                                    "click": function () {
                                        pageVue.showOnlineDetail = true;
                                        pageVue.onlineStatItemInfo = pageVue.onlineStatList[params.index];
                                    }
                                }
                            }, {
                                "CN": "详情",
                                "EN": "Detail",
                                "TW": "詳情"
                            } [language["language"]])
                        ]);
                    }
                }
            ],
            "onlineStatList": [],
            "onlineStatItemInfo": {},
            "showOnlineDetail": false,
            "current": 1,
            "alarmPageInfo": {
                "count": 0,
                "companyId": "", // 公司ID
                "deptId": "", // 部门ID
                "dealFlag": 0,
                "vehicleName": "",
                "licenseNumber": "",
                "pageSize": 20,
                "pageNum": 1,
            },
            "alarmColumnsList": [
                {
                    "title": "警报事件",
                    "key": "eventTypeDesc",
                    "width": 100,
                    "render": function (h, params) {
                        var alarmType = {
                            "_1": "拆卸",
                            "_2": "超速",
                            "_3": "电量低",
                            "_501": "进入防区",
                            "_502": "离开防区",
                            "_503": "防区内停留",
                            "_504": "防区内行驶",
                            "_505": "防区内超速"
                        };
                        return h("div", [
                            h("span", {}, params.row.eventTypeDesc || alarmType["_" + params.row.eventTypeId]),
                        ]);
                    }
                },
                {
                    "title": "报警时间",
                    "key": "alarmTime",
                    "width": 140
                },
                {
                    "title": "报警内容",
                    "key": "alarmInfo"
                },
                {
                    "title": "操作",
                    "key": "operation",
                    "align": "center",
                    "width": 140,
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
                                        pageVue.toAlarmPage(pageVue.statuItemInfo);
                                    }
                                }
                            }, "详情"),
                            h("Button", {
                                "props": {
                                    "type": "warning",
                                    "size": "small",
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.editItem(params.index);
                                    }
                                }
                            }, "处理异常")
                        ]);
                    }
                }
            ],
            "alarmRowList": [],
            "isAlarmShowModal": false,
            "isAlarmModalLoading": true,
            "alarmItemInfo": {
                "id": "",
                "dealFlag": "", // 报警信息处理状态
                "remark": "", //报警信息处理描述，需对中文进行url编码
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
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
                    for (var v = 0, vlen = self.totalChartData.length; v < vlen; v++) {
                        self.vehicleTypeInfo[key]['list'][v] = 0;
                    }
                }

                for (var i = 0, len = totalChartDataList.length; i < len; i++) {
                    category.push(totalChartDataList[i]["day"]);
                    for (var s = 0, slen = totalChartDataList[i]["useStat"].length; s < slen; s++) {
                        if (totalChartDataList[i]["useStat"][s]["vehicleTypeId"]) {
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
                        name: "日期",
                        data: category,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis: {
                        name: "单位:辆",
                        minInterval: 1,
                        splitLine: {
                            show: false
                        },
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
                    self.vehicleInfo["_" + self.terminalStatusList[j]["type"]] = 0;
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
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleInfo.count = data.count;
                            self.vehicleInfo.list = data.data;

                            for (var i = 0, len = self.vehicleInfo.list.length; i < len; i++) {
                                self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] = self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] + 1;
                                if (!!self.vehicleTypeInfo["_" + self.vehicleInfo.list[i]["vehicleTypeId"]]) {
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
                    self.getStatuVehicleList(false, false);
                }, 200);
            },
            // 切换每页条数时的回调
            "statuPageRowChange": function (value) {
                var self = this;
                self.statuPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getStatuVehicleList(false, false);
                }, 200);
            },
            // 获取车辆不同天数的状态信息信息
            "getStatuVehicleList": function (bool, isAll) {
                var self = this;
                if (bool == true) {
                    self.current = 1;
                    self.statuPageInfo.pageNum = 1;
                }
                if(isAll==true) {
                    self.statuPageInfo.pageSize = 10000;
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
                        licenseNumber: encodeURI($.trim(self.statuPageInfo.licenseNumber)),
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var addressList = [];
                            var list = [];
                            self.statuPageInfo.count = data.count;

                            for (var i = 0, len = data.data.length; i < len; i++) {
                                // vehicleName licenseNumber vehicleCode lastGpsTime vehicleStatusName vehicleStatus
                                if(isAll == true) {
                                    licenseNumberList.push({
                                        label: data.data[i]["licenseNumber"],
                                        value: data.data[i]["licenseNumber"]
                                    });
                                } else {
                                    list.push({
                                        "alarmFlag": decodeURI(data.data[i]["alarmFlag"]),
                                        "companyName": decodeURI(data.data[i]["companyName"]),
                                        "deptName": decodeURI(data.data[i]["deptName"]),
                                        "vehicleName": decodeURI(data.data[i]["vehicleName"]),
                                        "licenseNumber": decodeURI(data.data[i]["licenseNumber"]),
                                        "vehicleCode": decodeURI(data.data[i]["vehicleCode"]),
                                        "lastGpsTime": decodeURI(data.data[i]["lastGpsTime"]),
                                        "lastOnlineTime": decodeURI(data.data[i]["lastOnlineTime"]),
                                        "lastPosition": decodeURI(data.data[i]["lastPosition"]),
                                        "useStatusName": decodeURI(data.data[i]["useStatusName"]),
                                        "providerName": decodeURI(data.data[i]["providerName"]),
                                        "gpsDeviceCode": decodeURI(data.data[i]["gpsDeviceCode"]),
                                        "lastAddress": "",
                                        "vehicleStatusName": decodeURI(data.data[i]["vehicleStatusName"]),
                                        "cellClassName": {
                                            "vehicleStatusName": "_" + data.data[i]["vehicleStatus"]
                                        }
                                    });
                                }
                            }
                            self.statuDataList = list;
                        }
                    }
                });
            },
            // 跳转到地图页面
            "toMapPage": function (vehicleStatus) {
                var self = this;
                utility.setSessionStorage("vehicleInfoFrom", null);
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
                            // console.log(data);
                        }
                    }
                });
            },
            "toOnlineDetail": function (onlineStatItemInfo) {
                var self = this;
                utility.setSessionStorage("onlineStatItemInfo", onlineStatItemInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_OnlineDetail").bind("click");
                    $(window.parent.document).find("#nav_OnlineDetail").trigger("click");
                }, 200);
            },
            // 页数改变时的回调
            "alarmPageSizeChange": function (value) {
                var self = this;
                self.alarmPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getAlarmList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "alarmPageRowChange": function (value) {
                var self = this;
                self.alarmPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getAlarmList(false);
                }, 200);
            },

            "toAlarmPage": function (alarmItemInfo) {
                var self = this;
                utility.setSessionStorage("fromMap", alarmItemInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Alarm").bind("click");
                    $(window.parent.document).find("#nav_Alarm").trigger("click");
                }, 200);
            },

            // 修改
            "editItem": function (index) {
                var self = this;
                self.isAlarmShowModal = true;
                self.alarmItemInfo = self.alarmRowList[index];
            },

            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.alarmService + "?action=" + CONFIG.ACTION.updateAlarmStatus,
                    actionUrl: CONFIG.SERVICE.alarmService,
                    dataObj: {
                        "id": self.alarmItemInfo.id, // ID 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        "dealFlag": self.alarmItemInfo.dealFlag,
                        "remark": encodeURI(self.alarmItemInfo.remark),
                    },
                    completeCallback: function () {
                        self.isAlarmModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getAlarmList(true);
                            self.isAlarmShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 获取机构用户信息
            "getAlarmList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.alarmRowList = [];
                if (bool == true) {
                    self.alarmPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.alarmService + "?action=" + CONFIG.ACTION.getAlarmList,
                    actionUrl: CONFIG.SERVICE.alarmService,
                    dataObj: {
                        "pageNum": self.alarmPageInfo.pageNum,
                        "pageSize": self.alarmPageInfo.pageSize,
                        "dealFlag": self.alarmPageInfo.dealFlag,
                        "vehicleName": encodeURI(self.alarmPageInfo.vehicleName),
                        "companyId": self.alarmPageInfo.companyId, // 公司ID
                        "deptId": self.alarmPageInfo.deptId, // 部门ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var list = [];

                            self.alarmPageInfo.count = data.count;

                            for (var i = 0, len = data.data.length; i < len; i++) {
                                list.push(data.data[i]);
                                list[i]["alarmAddress"] = "";
                            }
                            self.alarmRowList = list;

                            for (var a = 0; a < data.data.length; a++) {
                                (function (a) {
                                    if (!!data.data[a].lastPosition) {
                                        var position = JSON.parse(data.data[a].lastPosition)["coordinates"];
                                        if (position[0] != 0 && position[1] != 0) {
                                            utility.convertorByBaidu(position, gcoord, BMap, function (point, lng, lat) {
                                                utility.getAdressDetail([lng, lat], BMap, function (address) {
                                                    self.alarmRowList[a]["alarmAddress"] = address;
                                                });
                                            });
                                        } else {
                                            self.alarmRowList[a]["alarmAddress"] = "--";
                                        }
                                    } else {
                                        self.alarmRowList[a]["alarmAddress"] = "--";
                                    }
                                }(a));
                            }
                        }
                    }
                });
            },
            "toMapCoordinates": function (vehicleInfo) {
                var self = this;
                utility.setSessionStorage("fromInfo",null);
                utility.setSessionStorage("vehicleInfoFrom", vehicleInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
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
                self.getStatuVehicleList(true, false);

                // 获取车辆在线统计情况
                self.getVehicleOnlineStat();
            }
        },
        "created": function () {
            var self = this;

            // self.isBaiYun = (userInfo.userName.indexOf("白云")!=-1);

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            // self.resetVehicleBizParamInfo();
            self.getStatuVehicleList(false, true);

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