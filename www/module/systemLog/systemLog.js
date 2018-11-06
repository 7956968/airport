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
            "itemInfo": null,
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "操作时间", "EN": "Message Time", "TW": "操作時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "操作用户", "EN": "Operating User", "TW": "操作用戶" }[language["language"]],
                    "key": "user"
                },
                {
                    "title": { "CN": "IP地址", "EN": "IP Address", "TW": "車輛名稱" }[language["language"]],
                    "key": "ipAddress"
                },
                {
                    "title": { "CN": "系统功能", "EN": "System Function", "TW": "系統功能" }[language["language"]],
                    "key": "function"
                },
                {
                    "title": { "CN": "操作类型", "EN": "Operation Type", "TW": "操作類型" }[language["language"]],
                    "key": "type"
                },
                {
                    "title": { "CN": "执行结果", "EN": "Execution Result", "TW": "執行結果" }[language["language"]],
                    "key": "result"
                },
                {
                    "title": { "CN": "执行结果描述", "EN": "Execution Result Description", "TW": "執行結果描述" }[language["language"]],
                    "key": "description"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    "function": "系统功能",
                    "type": "操作类型",
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 2,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 3,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 4,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 5,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 6,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 7,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 8,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 9,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 10,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 11,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 12,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 13,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 14,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 15,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 16,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 17,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 18,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 19,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 19,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
                },
                {
                    "id": 20,
                    "user": "操作用户",
                    
                    "ipAddress": "IP地址",
                    
                    "function": "系统功能",
                    "type": "操作类型",
                    
                    
                    "result": "执行结果",
                    "time": "操作时间",
                    "description": "执行结果描述",
                    
                    
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
            //新增
            "add": function () {
                var self = this;
                self.isShowModal = true;
                self.isModalLoading = true;
                self.modalTitle = { "CN": "新增", "EN": "Add", "TW": "新增" }[self.language];
            },
            //编辑
            "edit": function () {
                var self = this;
                utility.showMessageTip(self, function() {
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language]; 
                });
            },
            // 选择终端
            "selectTerminal": function() {
                var self = this;
                self.isShowTerminal = true;
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (event) {
                var self = this;

                console.log(event);

                if (!!event) {
                    self.itemInfo = event;
                }
            },
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                setTimeout(function () {
                    self.isModalLoading = false;
                }, 2000);
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.isTableLoading = false;
            }, 2000);
        }
    });

}())
