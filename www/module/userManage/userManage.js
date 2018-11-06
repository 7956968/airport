(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowReset": false,
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
                    "title": { "CN": "账号", "EN": "Account", "TW": "帳號" }[language["language"]],
                    "key": "account"
                },
                {
                    "title": { "CN": "姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "性别", "EN": "Gender", "TW": "性別" }[language["language"]],
                    "key": "gender"
                },
                {
                    "title": { "CN": "手机", "EN": "Telephone", "TW": "手機" }[language["language"]],
                    "key": "telephone"
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "company"
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "department"
                },
                {
                    "title": { "CN": "岗位", "EN": "Post", "TW": "崗位" }[language["language"]],
                    "key": "post"
                },
                {
                    "title": { "CN": "职位", "EN": "Position", "TW": "職位" }[language["language"]],
                    "key": "position"
                },
                {
                    "title": { "CN": "角色", "EN": "Role", "TW": "角色" }[language["language"]],
                    "key": "role"
                },
                {
                    "title": { "CN": "主管", "EN": "Supervisor", "TW": "主管" }[language["language"]],
                    "key": "supervisor"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "state",
                    "width": 70,
                    "align": "center",
                    "render": function(h, params) {
                        return h('div', [
                            h('Button', {
                                "props": {
                                    "type": 'primary',
                                    "size": 'small'
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function() {
                                        console.log(params.index);
                                    }
                                }
                            }, "禁用")
                        ]);
                    }
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "remarks"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 2,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 3,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 4,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 5,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 6,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 7,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 8,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 9,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 10,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 11,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 12,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 13,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 14,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 15,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 16,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 17,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 18,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 19,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
                    "remarks": "备注"
                },
                {
                    "id": 20,
                    "account": "账号",
                    "name": "姓名",
                    "gender": "性别",
                    "telephone": "手机",
                    "company": "公司",
                    "department": "部门",
                    "post": "岗位",
                    "position": "职位",
                    "role": "角色",
                    "supervisor": "主管",
                    "state": "状态",
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
            // 重置密码
            "resetPassword": function () {
                var self = this;
                utility.showMessageTip(self, function() {
                    self.isShowReset = true;  
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
