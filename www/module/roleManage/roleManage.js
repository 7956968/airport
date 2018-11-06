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
            "isShowMember": false,
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
                    "title": { "CN": "角色编号", "EN": "Role Number", "TW": "角色編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "角色名称", "EN": "Role Name", "TW": "角色名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "角色名称", "EN": "Company Name", "TW": "角色名称" }[language["language"]],
                    "key": "company"
                },
                {
                    "title": { "CN": "创建时间", "EN": "Creation Time", "TW": "創建時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "公共", "EN": "Public", "TW": "公共" }[language["language"]],
                    "key": "public"
                },
                {
                    "title": { "CN": "有效", "EN": "Effective", "TW": "有效" }[language["language"]],
                    "key": "effective"
                }, {
                    "title": { "CN": "角色描述", "EN": "Role Description", "TW": "角色描述" }[language["language"]],
                    "key": "description"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 2,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 3,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 4,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 5,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 6,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 7,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 8,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 9,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 10,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 11,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 12,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 13,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 14,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 15,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 16,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 17,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 18,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 19,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
                {
                    "id": 20,
                    "number": "角色编号",
                    "name": "部门名称",
                    "company": "角色名称",
                    "time": "创建时间",
                    "public": "公共",
                    "effective": "有效",
                    "description": "角色描述"
                },
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
            }],
            "departmentList": [
                {
                    "title": "机场有限公司",
                    "expand": true,
                    "children": [
                        {
                            "title": "信息管理部",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名",
                                    "expand": true,
                                    "children": [
                                        {
                                            "title": "姓名"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "title": "部门名称",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名",
                                    "expand": true,
                                    "children": [
                                        {
                                            "title": "姓名"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "机场有限公司",
                    "expand": true,
                    "children": [
                        {
                            "title": "信息管理部",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        },
                        {
                            "title": "部门名称",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "机场有限公司",
                    "expand": true,
                    "children": [
                        {
                            "title": "信息管理部",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        },
                        {
                            "title": "部门名称",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "机场有限公司",
                    "expand": true,
                    "children": [
                        {
                            "title": "信息管理部",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        },
                        {
                            "title": "部门名称",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "机场有限公司",
                    "expand": true,
                    "children": [
                        {
                            "title": "信息管理部",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        },
                        {
                            "title": "部门名称",
                            "expand": true,
                            "children": [
                                {
                                    "title": "姓名"
                                }
                            ]
                        }
                    ]
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
            // 角色成员
            "selectMembers": function () {
                var self = this;
                utility.showMessageTip(self, function() {
                    self.isShowMember = true;
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
            },
            // 当节点树选择改变时
            "treeChangeAction": function (event) {
                var self = this;

                console.log(event);
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
