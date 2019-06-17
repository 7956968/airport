(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowTerminal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "terminalStatusList": bizParam["terminalStatus"], // 车辆状态
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "vehiclePositonPageInfo": {
                "span": "", // 距离查询中间点的距离（密），不指定则默认为100米。 // 通过centerPosition+ span两个参数可以联合查询距离中心点多少米内的车辆最近位置
                "count": 0,
                "pageNum": 1,
                "deptId": "", // 部门ID
                "pageSize": 20,
                "companyId": "", // 所属公司ID
                "vihecleId": "", // 车辆ID
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleTypeId": "", // 车辆类型ID
                "vehicleStatus": "", // 车辆运行状态
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleBrandId": "", // 车辆品牌ID
                "centerPosition": "", // 查询中心点坐标，格式为：经度,纬度
            },
            "columnsList": [
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "车辆", "EN": "Name", "TW": "車輛" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "类型", "EN": "Type", "TW": "類型" }[language["language"]],
                    "key": "vehicleTypeName"
                },
                {
                    "title": { "CN": "颜色", "EN": "Color", "TW": "顔色" }[language["language"]],
                    "key": "vehicleColorName"
                },
                {
                    "title": { "CN": "品牌", "EN": "Brand", "TW": "品牌" }[language["language"]],
                    "key": "vehicleBrandName"
                },
                {
                    "title": { "CN": "终端", "EN": "Terminal", "TW": "終端" }[language["language"]],
                    "key": "gpsDeviceCode"
                },
                {
                    "title": { "CN": "违规", "EN": "Violation", "TW": "違規" }[language["language"]],
                    "key": "illegalNum"
                },
                {
                    "title": { "CN": "里程", "EN": "Mileage(km)", "TW": "里程(km)" }[language["language"]],
                    "key": "currMiles",
                    "sortable": true,
                    "width": 110,
                    "render": function(h, params){
                        return h("div", [
                            h("span", {}, params.row.currMiles+"（公里）"),
                        ]);
                    }
                },
                {
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "modifyTime",
                    "width": 150,
                },
                {
                    "title": { "CN": "坐标", "EN": "Coordinate", "TW": "座標" }[language["language"]],
                    "key": "currPosition",
                    "width": 250,
                    "render": function (h, params) {
                        var coordinates = JSON.parse(pageVue.dataList[params.index]["lastPosition"])["coordinates"].join(",");
                        return h("div", coordinates);
                    }
                }
            ],
            "dataList": [],
            "allVehicleList": [],
            "vehicleInfo": [],
            "errInfo": {
                "xAxisData": [],
                "seriesData": []
            },
            "mileInfo": {
                "xAxisData": [],
                "seriesData": []
            },
        },
        "watch": {

        },
        "methods": {
            // 刷新
            "refresh": function () {
                var self = this;
                window.location.href = window.location.href;
                if (self.isTableLoading == false) {
                    self.isTableLoading = true;
                    setTimeout(function () {
                        self.isTableLoading = false;
                    }, 3000);
                }
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.vehiclePositonPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.vehiclePositonPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },
            // 获取车辆使用情况
            "getVehicleList": function (bool) {
                var self = this;
                self.vehiclePositionList = [];
                 if (bool == true) {
                     self.vehiclePositonPageInfo.pageNum = 1;
                 }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getAllVehiclePositonList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "span": self.vehiclePositonPageInfo.span, //"", // 距离查询中间点的距离（密），不指定则默认为100米。 // 通过centerPosition+ span两个参数可以联合查询距离中心点多少米内的车辆最近位置
                        "deptId": self.vehiclePositonPageInfo.deptId, //"", // 部门ID
                        "pageNum": self.vehiclePositonPageInfo.pageNum, //0,
                        "pageSize": self.vehiclePositonPageInfo.pageSize, //20,
                        "vihecleId": self.vehiclePositonPageInfo.vihecleId, //"", // 车辆ID
                        "companyId": self.vehiclePositonPageInfo.companyId, //"", // 所属公司ID
                        "gpsDeviceCode": self.vehiclePositonPageInfo.gpsDeviceCode, //"", // 定位终端编号
                        "vehicleTypeId": self.vehiclePositonPageInfo.vehicleTypeId, //"", // 车辆类型ID
                        "vehicleStatus": self.vehiclePositonPageInfo.vehicleStatus, //"", // 车辆运行状态
                        "vehicleColorId": self.vehiclePositonPageInfo.vehicleColorId, //"", // 车辆颜色ID
                        "vehicleBrandId": self.vehiclePositonPageInfo.vehicleBrandId, //"", // 车辆品牌ID
                        "centerPosition": self.vehiclePositonPageInfo.centerPosition, //"", // 查询中心点坐标，格式为：经度,纬度
                        "vehicleName": encodeURI(self.vehiclePositonPageInfo.vehicleName), //"", // 车辆名称
                        "vehicleCode": encodeURI(self.vehiclePositonPageInfo.vehicleCode), //"", // 车辆编码
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.dataList = data.data;
                            self.vehiclePositonPageInfo.count = data.count;
                        }
                    }
                });
            },
            // 画违章图表
            "drawVehicle": function(options) {
                var self = this;
                var myChart = echarts.init(document.getElementById(options.id));

                option = {
                    title: {
                        text: options.title,
                        top: 10,
                        textStyle: {
                            fontSize: 13,
                            align: "center"
                        }
                    },
                    color: [options.color],
                    tooltip : {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 13
                        },
                        formatter: function(params) {
                            var key = params[0]["axisValue"];
                            var info = self.vehicleInfo[key]["info"];
                            var strArr = [];
                            strArr.push("结果：" + params[0]["value"] + "<br/>");
                            strArr.push("公司：" + info.companyName + "<br/>");
                            strArr.push("部门：" + info.deptName + "<br/>");
                            strArr.push("车辆：" + info.vehicleName + "<br/>");
                            strArr.push("类型：" + info.vehicleTypeName + "<br/>");
                            strArr.push("品牌：" + info.vehicleBrandName + "<br/>");
                            strArr.push("颜色：" + info.vehicleColorName + "<br/>");
                            strArr.push("终端：" + info.gpsDeviceCode);
                            return strArr.join(" ");
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : options.data.xAxisData,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'',
                            type:'bar',
                            barWidth: '60%',
                            data: options.data.seriesData,
                        }
                    ]
                };
                myChart.setOption(option);
            },
            // 格式化车辆信息
            "formatVehicle": function() {
                var self = this;
                var vehicleCodeInfo = {};
                for(var i = 0, len = self.allVehicleList.length; i < len; i++) {
                    vehicleCodeInfo[self.allVehicleList[i]["vehicleCode"]] = {
                        info: self.allVehicleList[i],
                        list: []
                    };
                }

                for(var key in vehicleCodeInfo) {
                    if(vehicleCodeInfo.hasOwnProperty(key)) {
                        for(var s = 0, slen = self.allVehicleList.length; s < slen; s++) {
                            if(self.allVehicleList[s]["vehicleCode"] == key) {
                                vehicleCodeInfo[key]["list"].push(self.allVehicleList[s]);
                            }
                        }
                    }
                }

                for(var type in vehicleCodeInfo) {
                    if(vehicleCodeInfo.hasOwnProperty(type)) {
                        var errTime = 0;
                        var mill = 0;
                        self.errInfo.xAxisData.push(type);
                        self.mileInfo.xAxisData.push(type);

                        for(var t = 0, tlen = vehicleCodeInfo[type]["list"].length; t < tlen; t++) {
                            errTime = errTime + vehicleCodeInfo[type]["list"][t]["illegalNum"];
                            mill = mill + vehicleCodeInfo[type]["list"][t]["currMiles"];
                        }
                        self.errInfo.seriesData.push(errTime);
                        self.mileInfo.seriesData.push(mill);
                    }
                }
                self.vehicleInfo = vehicleCodeInfo;
            },
            // 获取所有车辆使用情况数据
            "getAllVehicleList": function () {
                var self = this;
                self.errInfo.xAxisData = [];
                self.errInfo.seriesData = [];
                self.mileInfo.xAxisData = [];
                self.mileInfo.seriesData = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getAllVehiclePositonList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": 1, //0,
                        "pageSize": 10000000, //20,
                        "span": self.vehiclePositonPageInfo.span, //"", // 距离查询中间点的距离（密），不指定则默认为100米。 // 通过centerPosition+ span两个参数可以联合查询距离中心点多少米内的车辆最近位置
                        "deptId": self.vehiclePositonPageInfo.deptId, //"", // 部门ID
                        "vihecleId": self.vehiclePositonPageInfo.vihecleId, //"", // 车辆ID
                        "companyId": self.vehiclePositonPageInfo.companyId, //"", // 所属公司ID
                        "gpsDeviceCode": self.vehiclePositonPageInfo.gpsDeviceCode, //"", // 定位终端编号
                        "vehicleTypeId": self.vehiclePositonPageInfo.vehicleTypeId, //"", // 车辆类型ID
                        "vehicleStatus": self.vehiclePositonPageInfo.vehicleStatus, //"", // 车辆运行状态
                        "vehicleColorId": self.vehiclePositonPageInfo.vehicleColorId, //"", // 车辆颜色ID
                        "vehicleBrandId": self.vehiclePositonPageInfo.vehicleBrandId, //"", // 车辆品牌ID
                        "centerPosition": self.vehiclePositonPageInfo.centerPosition, //"", // 查询中心点坐标，格式为：经度,纬度
                        "vehicleName": encodeURI(self.vehiclePositonPageInfo.vehicleName), //"", // 车辆名称
                        "vehicleCode": encodeURI(self.vehiclePositonPageInfo.vehicleCode), //"", // 车辆编码
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.allVehicleList = data.data;
                            self.formatVehicle();
                            self.drawVehicle({
                                "id": "illegaInfo",
                                "color": "#C23531",
                                "data": self.errInfo,
                                "title": "车辆违章情况统计(单位/次)",
                            });
                            self.drawVehicle({
                                "id": "milleInfo",
                                "color": "#2d8cf0",
                                "data": self.mileInfo,
                                "title": "车辆行驶里程统计(单位/公里)",
                            });
                        }
                    }
                });
            },
            // 通过查询获取数据
            "getDataBySearch": function() {
                var self = this;
                self.getVehicleList(true);
                self.getAllVehicleList();
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getVehicleList(true);
                self.getAllVehicleList();
            }, 500);
        }
    });

}())
