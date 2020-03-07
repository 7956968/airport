(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var filterUserList = [];
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowTerminal": false,
            "isModalLoading": true,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "pageInfo": {
                "userCode": "",
                "beginTime": "",
                "endTime": "",
                "opTypeCode": "1",
                "opFunctionCode": "",
                "opFunctionDesc": "",
            },
            "page": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "title": "序号",
                    "align": "center"
                },
                {
                    "title": { "CN": "操作时间", "EN": "Message Time", "TW": "操作時間" }[language["language"]],
                    "key": "createTime",
                    "align": "center",
                    "sortable": true,
                    "sortType": "des"
                },
                {
                    "title": { "CN": "操作用户", "EN": "Operating User", "TW": "操作用戶" }[language["language"]],
                    "key": "userCode",
                    "align": "center",
                    "filters": filterUserList,
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.userCode = value;
                    },
                },
                {
                    "title": { "CN": "IP地址", "EN": "IP Address", "TW": "車輛名稱" }[language["language"]],
                    "key": "fromIp",
                    "align": "center"
                },
                {
                    "title": { "CN": "系统功能", "EN": "System Function", "TW": "系統功能" }[language["language"]],
                    "key": "opTypeDesc",
                    "align": "center"
                },
                {
                    "title": { "CN": "操作类型", "EN": "Operation Type", "TW": "操作類型" }[language["language"]],
                    "key": "opFunctionDesc",
                    "align": "center"
                },
                {
                    "title": { "CN": "执行结果", "EN": "Execution Result", "TW": "執行結果" }[language["language"]],
                    "key": "opResult",
                    "align": "center"
                }
            ],
            "dataList": [],
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
            // 时间变化
            "beginTimeChange": function(value, item) {
                var self = this;
                self.pageInfo.beginTime = value;
            },
            "endTimeChange": function(value, item) {
                var self = this;
                self.pageInfo.endTime = value;
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserLogList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserLogList(true);
                }, 200);
            },
            "getLogByCode": function(code) {
                var self = this;
                self.page.pageNum = 0;
                self.pageInfo.opTypeCode = code;
            },
            // 获取车辆信息
            "getUserLogList": function (bool) {
                var self = this;
                self.logList = [];
                self.dataList = [];
                if (bool == true) {
                    self.page.pageNum = 1;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserLogList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "userCode": encodeURI(self.pageInfo.userCode),
                        "beginTime": self.pageInfo.beginTime,
                        "endTime": self.pageInfo.endTime,
                        "opTypeCode": self.pageInfo.opTypeCode,
                        "opFunctionCode": encodeURI(self.pageInfo.opFunctionCode),
                        "opFunctionDesc": encodeURI(self.pageInfo.opFunctionDesc),
                    }, //self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.dataList = data.data;
                            self.page.count = data.count;
                        }
                    }
                });
            },
            "getUserList": function (bool) {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 10000,
                        "companyId": 0, // 公司ID
                        "deptId": 0,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            for(var i = 0, len = data.data.length; i < len; i++) {
                                filterUserList.push({
                                    label: data.data[i]["userCode"],
                                    value: data.data[i]["userCode"],
                                });
                            }
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
                self.isTableLoading = false;
                self.getUserList();
                self.getUserLogList(true);
            }, 500);

            self.$watch('pageInfo', function () {
                self.getUserLogList(true);
            }, {
                deep: true
            });
        }
    });

}())
