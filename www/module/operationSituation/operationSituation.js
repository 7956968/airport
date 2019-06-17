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
                "pageNum": 0,
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
                    "title": { "CN": "里程数", "EN": "Mileage(km)", "TW": "里程數(公里)" }[language["language"]],
                    "key": "miles",
                    "sortable": true,
                    "render": function(h, params){
                        return h("div", [
                            h("span", {}, params.row.miles+"（公里）"),
                        ]);
                    }
                },
                {
                    "title": { "CN": "里程占比", "EN": "Mileage(percent)", "TW": "里程數占比" }[language["language"]],
                    "key": "mileRate",
                    "sortable": true
                },
            ],
            "departmentList": [],
            "vehicleList": [],
            "companyList": [],
            "userList": [],
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
                    self.getVehicleMileRateReport(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleMileRateReport(false);
                }, 200);
            },
            
            // 获取车辆信息
            "getVehicleMileRateReport": function (bool) {
                var self = this;
                self.vehicleList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleMileRateReport,
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
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getVehicleMileRateReport(true);
                self.getDepartmentList();
                self.getCompanyList();
            }, 500);
        }
    });

}())
