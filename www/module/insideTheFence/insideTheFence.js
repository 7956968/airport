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
            "vehiclePassType": bizParam["vehiclePassType"],// 穿越类型
            "pageInfo": {
                "count": 0,
                "pageNum": 1,
                "areaId": "",
                "pageSize": 20,
                "areaName": "",
                "areaCode": "",
                "vehicleId": "",
                "companyId": "",
                "vehicleName": "",
                "vehicleCode": "",
                "crossTypeId": "",
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "防区名称", "EN": "Defense Name", "TW": "防區名稱" }[language["language"]],
                    "key": "areaName"
                },
                {
                    "title": { "CN": "防区编码", "EN": "Defense Code", "TW": "防區編碼" }[language["language"]],
                    "key": "areaCode"
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "车辆编码", "EN": "Vehicle Type", "TW": "車輛編碼" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "防区类型", "EN": "Defense Type", "TW": "防區類型" }[language["language"]],
                    "key": "crossTypeName"
                },
                {
                    "title": { "CN": "行驶速度", "EN": "Speed", "TW": "行駛速度" }[language["language"]],
                    "key": "speed",
                    "sortable": true,
                    "render": function(h, params){
                        return h("div", [
                            h("span", {}, params.row.speed+"（公里/小时）"),
                        ]);
                    }
                },
                {
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "crossTime",
                    "width": 160,
                },
                {
                    "title": { "CN": "坐标位置", "EN": "Coordinate", "TW": "座標位置" }[language["language"]],
                    "key": "currPosition",
                    "width": 250,
                    "render": function (h, params) {
                        var coordinates = JSON.parse(pageVue.dataList[params.index]["currPosition"])["coordinates"].join(",");
                        return h("div", coordinates);
                    }
                }
            ],
            "dataList": [],
            "companyList": []
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
                self.pageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getCrossAreaList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getCrossAreaList(false);
                }, 200);
            },
            // 获取车辆信息
            "getCrossAreaList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.dataList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getCrossAreaList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "areaId": self.pageInfo.areaId,
                        "pageNum": self.pageInfo.pageNum,
                        "areaCode": self.pageInfo.areaCode,
                        "pageSize": self.pageInfo.pageSize,
                        "vehicleId": self.pageInfo.vehicleId,
                        "companyId": self.pageInfo.companyId,
                        "vehicleCode": self.pageInfo.vehicleCode,
                        "crossTypeId": self.pageInfo.crossTypeId,
                        "areaName": encodeURI(self.pageInfo.areaName),
                        "vehicleName": encodeURI(self.pageInfo.vehicleName),
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
                            self.pageInfo.count = data.count;
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
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getCompanyList();
                self.getCrossAreaList(true);
            }, 500);
        }
    });

}())
