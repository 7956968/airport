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
                    "title": { "CN": "部门名称", "EN": "Department Name", "TW": "部門名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "部门编号", "EN": "Department Number", "TW": "部門編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "部门简称", "EN": "Department Abbreviation", "TW": "部門簡稱" }[language["language"]],
                    "key": "abbreviation",
                    "width": 120
                },
                {
                    "title": { "CN": "部门性质", "EN": "Department Nature", "TW": "部門性質" }[language["language"]],
                    "key": "nature"
                },
                {
                    "title": { "CN": "负责人", "EN": "Head", "TW": "負責人" }[language["language"]],
                    "key": "head"
                },
                {
                    "title": { "CN": "电话", "EN": "Telephone", "TW": "電話" }[language["language"]],
                    "key": "telephone"
                },{
                    "title": { "CN": "分机号", "EN": "Extension Number", "TW": "分機號" }[language["language"]],
                    "key": "extension"
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "remarks"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 2,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 3,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 4,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 5,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 6,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 7,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 8,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 9,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 10,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 11,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 12,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 13,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 14,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 15,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 16,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 17,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 18,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
                    "remarks": "备注"
                },
                {
                    "id": 20,
                    "name": "部门名称",
                    "number": "部门编号",
                    "abbreviation": "部门简称",
                    "nature": "部门性质",
                    "head": "负责人",
                    "telephone": "电话",
                    "extension": "分机号",
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
