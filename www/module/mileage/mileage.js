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
            "isModalLoading": true,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "pageInfo": {
                "id": "", // 指定的维护记录ID
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "deptId": "", // 部门ID
                "companyId": "", // 所属公司ID
                "vehicleCode": "",// 车辆编码
                "vehicleColorId": "",// 所属公司ID
                "vehicleTypeId": "",// 车辆颜色ID
                "vehicleBrandId": "",// 车辆类型ID
                "vehicleTypeId": "",// 车辆品牌ID
                "beginMiles": "",// 最大里程数
                "endMiles": "",// 最大里程数
                "beginTime": "", // 开始时间
                "endTime": "", // 结束时间
                "orderType": 1
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "车辆编码", "EN": "Vehicle Name", "TW": "車輛編碼" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "里程数(公里)", "EN": "Mileage(km)", "TW": "里程數(公里)" }[language["language"]],
                    "key": "miles",
                    "sortable": true
                },
            ],
            "departmentList": [],
            "vehicleList": [],
            "companyList": [],
            "userList": [],
            "vehicleInfo": {},
            "allVehicleList": [],
            "mileInfo": {
                "xAxisData": [],
                "seriesData": []
            },
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
            // 时间变化
            "beginRepairTime": function(value, item) {
                var self = this;
                self.pageInfo.beginTime = value;
            },
            "endRepairTime": function(value, item) {
                var self = this;
                self.pageInfo.endTime = value;
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.pageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleMilesReport(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleMilesReport(false);
                }, 200);
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
                        // self.errInfo.xAxisData.push(type);
                        self.mileInfo.xAxisData.push(type);

                        for(var t = 0, tlen = vehicleCodeInfo[type]["list"].length; t < tlen; t++) {
                            // errTime = errTime + vehicleCodeInfo[type]["list"][t]["illegalNum"];
                            mill = mill + vehicleCodeInfo[type]["list"][t]["miles"];
                        }
                        // self.errInfo.seriesData.push(errTime);
                        self.mileInfo.seriesData.push(mill);
                    }
                }
                self.vehicleInfo = vehicleCodeInfo;
            },
            // 获取所有车辆使用情况数据
            "getAllVehicleList": function () {
                var self = this;

                self.mileInfo.xAxisData = [];
                self.mileInfo.seriesData = [];
                
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleMilesReport,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": 1, //0,
                        "pageSize": 10000000, //20,
                        "deptId": self.pageInfo.deptId, // 部门ID
                        "companyId": self.pageInfo.companyId, // 所属公司ID
                        "vehicleCode": self.pageInfo.vehicleCode,// 车辆编码
                        "vehicleColorId": self.pageInfo.vehicleColorId,// 所属公司ID
                        "vehicleTypeId": self.pageInfo.vehicleTypeId,// 车辆颜色ID
                        "vehicleBrandId": self.pageInfo.vehicleBrandId,// 车辆类型ID
                        "vehicleTypeId": self.pageInfo.vehicleTypeId,// 车辆品牌ID
                        "beginMiles": self.pageInfo.beginMiles,// 最大里程数
                        "endMiles": self.pageInfo.endMiles,// 最大里程数
                        "beginTime": self.pageInfo.beginTime, // 开始时间
                        "endTime": self.pageInfo.endTime, // 结束时间
                        "orderType": 1, // 排列顺序
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.allVehicleList = data.data;
                            self.formatVehicle();
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
            // 获取车辆信息
            "getVehicleMilesReport": function (bool) {
                var self = this;
                self.vehicleList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleMilesReport,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data;
                            self.pageInfo.count = data.count;
                        }
                    }
                });
            },
            "changeToGetDetp": function() {
                var self = this;
                self.getDepartmentList();
            },
            // 获取部门信息
            "getDepartmentList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        companyId: self.pageInfo.companyId,
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.departmentList = data.data;
                        }
                    }
                });
            },
            // 获取公司列表
            "getCompanyList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.getCompanyList,
                    actionUrl: CONFIG.SERVICE.companyService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.companyList = data.data;
                        }
                    }
                });
            },
            // 点击查询按钮查询数据
            "getDataBySearch": function() {
                var self = this;
                self.getVehicleMilesReport(true);
                self.getAllVehicleList();
            },
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getVehicleMilesReport(true);
                self.getDepartmentList();
                self.getCompanyList();
                self.getAllVehicleList();
            }, 500);
        }
    });

}())
