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
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "code"
                },
                {
                    "title": { "CN": "驾驶员姓名", "EN": "Driver's Name", "TW": "駕駛員姓名" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "性别", "EN": "Sex", "TW": "性別" }[language["language"]],
                    "key": "sex"
                },
                {
                    "title": { "CN": "身份证号", "EN": "ID Number", "TW": "身份證號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "出生年月", "EN": "Birthday", "TW": "出生年月" }[language["language"]],
                    "key": "birthday"
                },
                {
                    "title": { "CN": "单位电话", "EN": "Work Telephone", "TW": "單位電話" }[language["language"]],
                    "key": "telephone"
                },{
                    "title": { "CN": "所属单位", "EN": "Ownership Company", "TW": "所屬單位" }[language["language"]],
                    "key": "ownership"
                },{
                    "title": { "CN": "住址", "EN": "Address", "TW": "住址" }[language["language"]],
                    "key": "address"
                },{
                    "title": { "CN": "创建用户", "EN": "Creation User", "TW": "創建用戶" }[language["language"]],
                    "key": "user"
                },{
                    "title": { "CN": "创建日期", "EN": "Creation Time", "TW": "創建時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "remarks"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 2,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 3,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 4,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 5,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 6,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 7,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 8,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 9,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 10,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 11,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 12,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 13,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 14,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 15,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 16,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 17,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 18,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
                },
                {
                    "id": 20,
                    "code": "编码",
                    "name": "驾驶员姓名",
                    "sex": "性别",
                    "number": "身份证号",
                    "birthday": "出生年月",
                    "telephone": "单位电话",
                    "ownership": "所属单位",
                    "address":"住址",
                    "user":"创建用户",
                    "time":"创建日期",
                    "remarks": "备注"
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
