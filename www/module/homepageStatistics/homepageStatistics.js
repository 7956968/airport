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
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "统计值", "EN": "Statistical Value", "TW": "統計值" }[language["language"]],
                    "key": "value"
                },
                {
                    "title": { "CN": "类型", "EN": "Type", "TW": "類型" }[language["language"]],
                    "key": "type"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 2,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 3,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 4,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 5,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 6,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 7,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 8,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 9,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 10,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 11,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 12,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 13,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 14,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 15,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 16,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 17,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 18,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 19,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                },
                {
                    "id": 20,
                    "time": "时间",
                    "value": "统计值",
                    "type": "类型"
                }
            ],
            "superiorCompanyList": [{
                "value": 'beijing',
                "label": '北京',
                "children": [
                    {
                        "value": 'gugong',
                        "label": '故宫'
                    },
                    {
                        "value": 'tiantan',
                        "label": '天坛'
                    },
                    {
                        "value": 'wangfujing',
                        "label": '王府井'
                    }
                ]
            }, {
                "value": 'jiangsu',
                "label": '江苏',
                "children": [
                    {
                        "value": 'nanjing',
                        "label": '南京',
                        "children": [
                            {
                                "value": 'fuzimiao',
                                "label": '夫子庙',
                            }
                        ]
                    },
                    {
                        "value": 'suzhou',
                        "label": '苏州',
                        "children": [
                            {
                                "value": 'zhuozhengyuan',
                                "label": '拙政园',
                            },
                            {
                                "value": 'shizilin',
                                "label": '狮子林',
                            }
                        ]
                    }
                ],
            }]
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
