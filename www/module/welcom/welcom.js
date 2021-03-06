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
            "copyRight": "???ICP???20021830??? Copyright ?? ?????????????????????????????????",
            // ????????????
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
                "vehicleStatus": "",
                "licenseNumber": ""
            },
            "isTableLoading": false,
            "showStatuDetail": false,
            "statuItemInfo": {},
            "statuColumns": [{
                    "title": "?????????",
                    "key": "licenseNumber"
                },
                {
                    "title": "????????????",
                    "key": "vehicleName",
                },
                {
                    "title": "????????????",
                    "key": "vehicleStatusName",
                    "align": "center",
                    "filters": (function(){
                        var statu = bizParam["terminalStatus"];
                        var arr = [];
                        for(var i = 0, len = statu.length; i < len; i++) {
                            if (statu[i]["type"] == 401 || statu[i]["type"] == 402 || statu[i]["type"] == 403 || statu[i]["type"] == 406) {
                                arr.push({
                                    label: statu[i]["name"],
                                    value: statu[i]["type"]
                                });
                            }
                        }
                        return arr;
                    }()),
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.statuPageInfo.vehicleStatus = value;
                        pageVue.getStatuVehicleList(true);
                    },
                },
                {
                    "title": "??????????????????",
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
                {
                    "title": "??????",
                    "key": "operation",
                    "align": "center",
                    "render": function (h, params) {
                        var type = "primary";
                        var txt = "??????";

                        if (params.row.alarmFlag == 1) {
                            type = "error";
                            txt = "??????";
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
                                        pageVue.statuItemInfo.lastPosition = pageVue.statuItemInfo.lastPosition!='null'?JSON.parse(pageVue.statuItemInfo.lastPosition)["coordinates"].join(","):null;

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
                "endTime": "",
                "licenseNumber": ""
            },
            "onlineStatColumns": [{
                    "title": "?????????",
                    "width": 100,
                    "key": "licenseNumber"
                },
                {
                    "title": "????????????",
                    "key": "statDay",
                    "sortable": true,
                    "sortType": "asc",
                },
                {
                    "title": "????????????",
                    "key": "onlineCount",
                    "sortable": true,
                    "align": "center",
                },
                {
                    "title": "????????????",
                    "key": "onlineDuration",
                    "sortable": true,
                    "align": "center",
                    "render": function (h, params) {
                        var text = (params.row.onlineDuration / 3600).toFixed(2) + "??????"
                        return h("div", [
                            h("span", {}, text)
                        ]);
                    }
                },
                {
                    "title": "??????",
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
                                "CN": "??????",
                                "EN": "Detail",
                                "TW": "??????"
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
                "companyId": "", // ??????ID
                "deptId": "", // ??????ID
                "dealFlag": 0,
                "vehicleName": "",
                "licenseNumber": "",
                "pageSize": 20,
                "pageNum": 1,
            },
            "alarmColumnsList": [
                {
                    "title": "????????????",
                    "key": "eventTypeDesc",
                    "width": 100,
                    "render": function (h, params) {
                        var alarmType = {
                            "_1": "??????",
                            "_2": "??????",
                            "_3": "?????????",
                            "_4": "????????????",
                            "_501": "????????????",
                            "_502": "????????????",
                            "_503": "???????????????",
                            "_504": "???????????????",
                            "_505": "???????????????"
                        };
                        return h("div", [
                            h("span", {}, params.row.eventTypeDesc || alarmType["_" + params.row.eventTypeId]),
                        ]);
                    }
                },
                {
                    "title": "????????????",
                    "key": "alarmTime",
                    "width": 140
                },
                {
                    "title": "????????????",
                    "key": "alarmInfo"
                },
                {
                    "title": "??????",
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
                            }, "??????"),
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
                            }, "????????????")
                        ]);
                    }
                }
            ],
            "alarmRowList": [],
            "isAlarmShowModal": false,
            "isAlarmModalLoading": true,
            "alarmItemInfo": {
                "id": "",
                "dealFlag": "", // ????????????????????????
                "remark": "", //?????????????????????????????????????????????url??????
                "createUserId": userInfo["id"], // ????????????ID??????????????????
                "modifyUserId": userInfo["id"], // ????????????ID??????????????????
            },
            "vehicleCateReport": []
        },
        "methods": {
            // ??????????????????????????????????????????????????????????????????????????????
            "isLogin": function () {
                var self = this;

                // ???????????????????????????
                if (!userInfo) {
                    alert("???????????????");
                    window.parent.window.location.href = "/airport/www/login.html";
                }
            },
            // ????????????
            "setTotalEchart": function () {
                var self = this;
                var myChart = echarts.init(document.getElementById('totalEchart'));
                var category = [];
                var seriesList = [];
                var legendLabel = [];
                var totalChartDataList = self.totalChartData.reverse();

                // console.log(self.vehicleTypeInfo);

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
                            if(!!self.vehicleTypeInfo["_" + totalChartDataList[i]["useStat"][s]["vehicleTypeId"]]) {
                                self.vehicleTypeInfo["_" + totalChartDataList[i]["useStat"][s]["vehicleTypeId"]]["list"][i] = (totalChartDataList[i]["useStat"][s]["totalVehicleNum"]);
                            }
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
                        left: 20,
                        right: 10,
                        top: 5,
                        padding: [5,2],
                        itemWidth: 15,
                        itemGap: 5,
                        data: legendLabel,
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    grid: {
                        left: 40,
                        top: 80,
                        right: 50,
                        bottom: 40
                    },
                    xAxis: {
                        name: "??????",
                        data: category,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis: {
                        name: "??????:???",
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

                // console.log(legendLabel);
                myChart.setOption(option);

            },
            // setVehicleEchart
            "setVehicleEchart": function() {
                var self = this;
                var colorList = [];
                var seriesList = [];
                var legendLabel = [];
                var myChart = echarts.init(document.getElementById('totalEchart'));

                for (var key in self.vehicleTypeInfo) {
                    legendLabel.push(self.vehicleTypeInfo[key]["name"]);
                    seriesList.push({
                        "value": 0,
                        "itemStyle": {
                            "color": self.vehicleTypeInfo[key]["color"]
                        },
                        "label": {
                            "normal": {
                                "show": true,
                                "position": 'top',
                                "fontSize": 14
                            }
                        },
                    });
                }

                for(var l = 0, llen = legendLabel.length; l < llen; l++) {
                    for(var i = 0, len = self.vehicleCateReport.length; i < len; i++) {
                        (function(l){
                            if (legendLabel[l] == self.vehicleCateReport[i]["vehicleTypeName"]) {
                                seriesList[l]["value"] = seriesList[l]["value"] + self.vehicleCateReport[i]["totalVehicleNum"];
                            }
                        })(l);
                    }
                }

                var option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // ??????????????????????????????????????????
                            type : 'shadow'        // ??????????????????????????????'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: 40,
                        top: 40,
                        right: 70,
                        bottom: 60
                    },
                    xAxis : {
                        name:'????????????',
                        type : 'category',
                        data : legendLabel,
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis : {
                        name: "??????:???",
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
                    series : [
                        {
                            name:'????????????',
                            type:'bar',
                            barWidth: '60%',
                            data: seriesList
                        }
                    ]
                };

                myChart.setOption(option);
            },
            // ??????
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
                    if (self.vehicleTypeList[i]["type"] != 302 && self.vehicleTypeList[i]["type"] != 303 && self.vehicleTypeList[i]["type"] != 109 && self.vehicleTypeList[i]["type"] != 111 && self.vehicleTypeList[i]["type"] != 112) {
                        
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
                self.getVehicleOnlineStat(false);
            },
            "endDateChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.endTime = value;
                self.getVehicleOnlineStat(false);
            },
            // ????????????????????????
            "onlineStatPageSizeChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineStat(false);
                }, 200);
            },
            // ??????????????????????????????
            "onlineStatPageRowChange": function (value) {
                var self = this;
                self.onlineStatPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineStat(false);
                }, 200);
            },
            // ??????????????????????????????
            "getVehicleOnlineStat": function (bool) {
                var self = this;
                if (bool == true) {
                    self.onlineStatPageInfo.pageNum = 1;
                }
                // ?????????????????????????????????????????????
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleOnlineStat,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": self.onlineStatPageInfo.pageNum,
                        "pageSize": self.onlineStatPageInfo.pageSize,
                        "beginTime": self.onlineStatPageInfo.beginTime,
                        "endTime": self.onlineStatPageInfo.endTime,
                        "licenseNumber": encodeURI($.trim(self.onlineStatPageInfo.licenseNumber))
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
            // ??????????????????
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

            // ????????????????????????
            "statuPageSizeChange": function (value) {
                var self = this;
                self.current = value;
                self.statuPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getStatuVehicleList(false);
                }, 200);
            },
            // ??????????????????????????????
            "statuPageRowChange": function (value) {
                var self = this;
                self.statuPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getStatuVehicleList(false);
                }, 200);
            },
            // ?????????????????????????????????????????????
            "getStatuVehicleList": function (bool) {
                var self = this;
                if (bool == true) {
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
                        vehicleStatus: self.statuPageInfo.vehicleStatus,
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
                            self.statuDataList = list;
                        }
                    }
                });
            },
            // ?????????????????????
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
            // ??????????????????????????????????????????????????????
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
            // ????????????????????????????????????????????????????????????
            "getVehicleRunReport": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleRunReport,
                    actionUrl: CONFIG.SERVICE.getVehicleRunReport,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.totalChartData = data.data;
                            self.setTotalEchart(); // ????????????
                        }
                    }
                });
            },
            // ????????????????????????????????????????????????????????????
            "getVehicleCateReport": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleCateReport,
                    actionUrl: CONFIG.SERVICE.getVehicleCateReport,
                    // dataObj: {
                    //     companyId: userInfo.companyId
                    // },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleCateReport = data.data;
                            self.setVehicleEchart();
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
            // ????????????????????????
            "alarmPageSizeChange": function (value) {
                var self = this;
                self.alarmPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getAlarmList(false);
                }, 200);
            },
            // ??????????????????????????????
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

            // ??????
            "editItem": function (index) {
                var self = this;
                self.isAlarmShowModal = true;
                self.alarmItemInfo = self.alarmRowList[index];
            },

            // ????????????????????????
            "uploadDataToServer": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.alarmService + "?action=" + CONFIG.ACTION.updateAlarmStatus,
                    actionUrl: CONFIG.SERVICE.alarmService,
                    dataObj: {
                        "id": self.alarmItemInfo.id, // ID 
                        "createUserId": userInfo["id"], // ????????????ID??????????????????
                        "modifyUserId": userInfo["id"], // ????????????ID??????????????????
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

            // ????????????????????????
            "getAlarmList": function (bool) {
                var self = this;
                // ?????????????????????????????????????????????
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
                        "companyId": self.alarmPageInfo.companyId, // ??????ID
                        "deptId": self.alarmPageInfo.deptId, // ??????ID
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
            // ?????????
            "init": function () {
                var self = this;

                // ??????????????????
                self.resetVehicleBizParamInfo();

                // ????????????????????????????????????????????????????????????
                // self.getVehicleRunReport(); //  // ????????????????????????????????????

                // ????????????
                self.getAllVehicleList();

                // ?????????????????????????????????????????????
                self.getStatuVehicleList();

                // ??????????????????????????????
                self.getVehicleOnlineStat(true);

                self.getVehicleCateReport(); // ????????????????????????????????????
            }
        },
        "created": function () {
            var self = this;

            // self.isBaiYun = (userInfo.userName.indexOf("??????")!=-1);

            // ??????????????????????????????????????????????????????????????????????????????
            utility.isLogin(false);

            // ???????????????
            self.init();

            setInterval(function () {
                self.init();
            }, 10000);

            // ???????????????????????????????????????
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
                // self.setVehicleEchart(); // ????????????
            }, 5000);
        }
    });

}())