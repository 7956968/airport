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
                    "title": { "CN": "设备编号", "EN": "Device Number", "TW": "設備編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "设备类别", "EN": "Device Category", "TW": "設備類別" }[language["language"]],
                    "key": "categoryId"
                },
                {
                    "title": { "CN": "设备类别", "EN": "Device Category", "TW": "設備類別" }[language["language"]],
                    "key": "categoryName"
                },
                {
                    "title": { "CN": "分组名称", "EN": "Group Name", "TW": "分組名稱" }[language["language"]],
                    "key": "groupName"
                },
                {
                    "title": { "CN": "设备名称", "EN": "Device Name", "TW": "設備名稱" }[language["language"]],
                    "key": "deviceName"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 2,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 3,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 4,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 5,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 6,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"

                },
                {
                    "id": 7,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 8,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 9,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 10,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 11,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 12,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 13,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 14,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 15,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 16,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 17,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 18,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 19,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 19,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
                },
                {
                    "id": 20,
                    "number": "设备编号",
                    "categoryId": "设备类别",
                    "categoryName": "设备类别",
                    "groupName": "分组名称",
                    "deviceName": "设备名称"
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
