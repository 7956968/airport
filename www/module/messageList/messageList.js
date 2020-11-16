(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
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
            "pageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "timeDefensTableList": [],
            "msgTableList": [],
            "msgColumList": [
                {
                    "type": "index",
                    "width": 60,
                    "title": "序号",
                    "align": "center"
                },
                {
                    "title": { "CN": "防区", "EN": "Defens", "TW": "防區" }[language["language"]],
                    "key": "areaName"
                },
                {
                    "title": { "CN": "防区编码", "EN": "Defens Code", "TW": "防區編碼" }[language["language"]],
                    "key": "areaCode"
                },
                {
                    "title": { "CN": "车辆", "EN": "Vehicle Name", "TW": "車輛" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "车辆编码", "EN": "Vehicle Code", "TW": "車輛編碼" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "crossTypeName"
                },
                {
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "crossTime",
                    "width": 150
                },
                {
                    "title": { "CN": "坐标位置", "EN": "Coordinate", "TW": "座標位置" }[language["language"]],
                    "key": "currPosition",
                    "width": 250,
                    "render": function (h, params) {
                        var coordinates = JSON.parse(pageVue.msgTableList[params.index]["currPosition"])["coordinates"].join(",");
                        return h("div", coordinates);
                    }
                }
            ]
        
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
                    self.getCrossAreaList(true);
                }, 200);
            },
            // 实时防区信息
            "getCrossAreaList": function (bool) {
                var self = this;
                self.msgTableList = [];
                if(bool == true) {
                    self.pageInfo.pageNum = 1;
                    self.pageInfo.count = 0;
                }
                // 如果是查询，则重新从第一页开始
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getCrossAreaList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": self.pageInfo.pageNum,
                        "pageSize": self.pageInfo.pageSize,
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.pageInfo.count = data.count;
                            self.msgTableList = data.data;
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
                // 实时防区信息
                self.getCrossAreaList();
            }, 500);
        }
    });

}())
