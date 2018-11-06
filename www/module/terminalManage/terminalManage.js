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
                    "title": { "CN": "终端状态", "EN": "Terminal Number", "TW": "終端編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "state"
                },
                {
                    "title": { "CN": "厂家名称", "EN": "Manufacturer Name", "TW": "廠家名稱" }[language["language"]],
                    "key": "manufacturer"
                },
                {
                    "title": { "CN": "上报周期", "EN": "Reporting Cycle", "TW": "上報周期" }[language["language"]],
                    "key": "cycle"
                },
                {
                    "title": { "CN": "系统版本", "EN": "System Version", "TW": "系統版本" }[language["language"]],
                    "key": "version"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "cycle": "上报周期",
                    "version": "系统版本"
                },
                {
                    "id": 2,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 3,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 4,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 5,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 6,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 7,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 8,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 9,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 10,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 11,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 12,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 13,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 14,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 15,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 16,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 17,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 18,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 19,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 19,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
                },
                {
                    "id": 20,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "负责人"
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
