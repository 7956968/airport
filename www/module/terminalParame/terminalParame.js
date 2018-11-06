(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "itemInfo": null,
            "columnsList": [
                {
                    "type": "selection",
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
                },
                {
                    "title": { "CN": "系统反馈", "EN": "System Feedback", "TW": "系統反饋" }[language["language"]],
                    "key": "feedback"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 2,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 3,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 4,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 5,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 6,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 7,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 8,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 9,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 10,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 11,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 12,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 13,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 14,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 15,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 16,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 17,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 18,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 19,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 19,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
                },
                {
                    "id": 20,
                    "number": "终端状态",
                    "state": "状态",
                    "manufacturer": "厂家名称",
                    "state": "状态",
                    "cycle": "上报周期",
                    "version": "系统版本",
                    "feedback": "系统反馈"
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
            // 当选择的行发生变化时 
            "setCurrentRowData": function (event) {
                var self = this;

                console.log(event);

                if (!!event) {
                    self.itemInfo = event;
                }
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
