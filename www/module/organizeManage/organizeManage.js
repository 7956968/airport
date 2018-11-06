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
                    "title": { "CN": "公司名称", "EN": "Company name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "外文名称", "EN": "Foreign Name", "TW": "外文名稱" }[language["language"]],
                    "key": "foreign"
                },
                {
                    "title": { "CN": "中文名称", "EN": "Chinese Name", "TW": "中文名稱" }[language["language"]],
                    "key": "chinese"
                },
                {
                    "title": { "CN": "公司性质", "EN": "Company Nature", "TW": "公司性質" }[language["language"]],
                    "key": "nature"
                },
                {
                    "title": { "CN": "成立时间", "EN": "Founding Time", "TW": "成立時間" }[language["language"]],
                    "key": "founding"
                },
                {
                    "title": { "CN": "负责人", "EN": "Head", "TW": "負責人" }[language["language"]],
                    "key": "head"
                },
                {
                    "title": { "CN": "经营范围", "EN": "Management Scope", "TW": "經營範圍" }[language["language"]],
                    "key": "scope"
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "remarks"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 2,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 3,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 4,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 5,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 6,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 7,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 8,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 9,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 10,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 11,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 12,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 13,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 14,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 15,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 16,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 17,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 18,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
                    "remarks": "备注"
                },
                {
                    "id": 20,
                    "companyName": "公司名称",
                    "foreign": "外文名称",
                    "chinese": "中文名称",
                    "nature": "公司性质",
                    "founding": "成立时间",
                    "head": "负责人",
                    "scope": "经营范围",
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
