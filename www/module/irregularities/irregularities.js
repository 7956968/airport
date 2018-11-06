(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
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
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "防区名称", "EN": "Defense Area Name", "TW": "防區名稱" }[language["language"]],
                    "key": "defense"
                },
                {
                    "title": { "CN": "告警时间", "EN": "Alarm Time", "TW": "告警時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "告警级别", "EN": "Alarm Level", "TW": "告警級別" }[language["language"]],
                    "key": "level"
                },
                {
                    "title": { "CN": "告警类别", "EN": "Alarm Type", "TW": "告警類別" }[language["language"]],
                    "key": "type"
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "describe"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 2,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 3,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 4,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 5,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 6,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"

                },
                {
                    "id": 7,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 8,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 9,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 10,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 11,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 12,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 13,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 14,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 15,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 16,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 17,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 18,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 19,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 19,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
                },
                {
                    "id": 20,
                    "name": "名称",
                    "defense": "防区名称",
                    "time": "告警时间",
                    "level": "告警级别",
                    "type": "告警类别",
                    "describe": "描述"
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
                utility.showMessageTip(self, function () {
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
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
