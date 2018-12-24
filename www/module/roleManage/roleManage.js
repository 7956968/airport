(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "isShowMember": false,
            "isShowFunctions": false,
            "isUserList": false,
            "isFunctionList": false,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "groupTypeList": bizParam["groupType"],
            "pageInfo": {
                "id": 0,
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "roleName": "", // 查询关键字（角色名称）
                "companyId": "", // 公司ID
            },
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 系统角色ID，修改时必传
                "companyId": "", // 所属公司ID，手动从公司列表选择
                "roleName": "", // 角色名称
                "roleCode": "", // 角色编码
                "roleDesc": "", // 角色描述
                "isValid": "", // 分组是否可用，默认=1 0=否 1=是
                "isPublic": "", // 是否公共角色 0=否 1=是
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "公司名称", "EN": "Company Name", "TW": "公司名称" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "角色编号", "EN": "Role Number", "TW": "角色編號" }[language["language"]],
                    "key": "roleCode"
                },
                {
                    "title": { "CN": "角色名称", "EN": "Role Name", "TW": "角色名稱" }[language["language"]],
                    "key": "roleName"
                },
                {
                    "title": { "CN": "公共", "EN": "Public", "TW": "公共" }[language["language"]],
                    "key": "isPublic"
                },
                {
                    "title": { "CN": "有效", "EN": "Effective", "TW": "有效" }[language["language"]],
                    "key": "isValid"
                }, {
                    "title": { "CN": "角色描述", "EN": "Role Description", "TW": "角色描述" }[language["language"]],
                    "key": "roleDesc"
                },
                {
                    "title": { "CN": "操作", "EN": "State", "TW": "操作" }[language["language"]],
                    "key": "state",
                    "width": 200,
                    "align": "center",
                    "render": function (h, params) {
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
                                    "click": function () {
                                        pageVue.isShowFunctions = true;
                                        pageVue.roleFunctionPageInfo.roleId = pageVue.roleList[params.index]["id"];
                                        pageVue.roleFunctionPageInfo.companyId = pageVue.roleList[params.index]["companyId"];

                                        pageVue.getRoleFunctionsDataList(true);
                                    }
                                }
                            }, { "CN": "可用功能", "EN": "Role Functions", "TW": "可用功能" }[language["language"]]),
                            h('Button', {
                                "props": {
                                    "type": 'info',
                                    "size": 'small'
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.isShowMember = true;
                                        pageVue.roleMemberPageInfo.roleId = pageVue.roleList[params.index]["id"];
                                        pageVue.roleMemberPageInfo.companyId = pageVue.roleList[params.index]["companyId"];
                                        pageVue.userPageInfo.companyId = pageVue.roleList[params.index]["companyId"];
                                        pageVue.getRoleMemberList(true);
                                    }
                                }
                            }, { 'CN': '角色成员', 'EN': 'Role Members', 'TW': '角色成員' }[language["language"]])
                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "companyList": [],
            "roleList": [],
            "departList": [],
            "roleMemberIndex": 0,
            "roleMemberPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "roleId": "", // 角色ID
                "companyId": "", // 公司ID
            },
            "roleMemberItem": {
                "id": "",
                "roleId": "",
                "roleName": "",
                "companyId": "",
                "userId": "",
                "userName": "",
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "roleMemberColumsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
                {
                    "title": { "CN": "公司名称", "EN": "Company Name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "角色名称", "EN": "Role", "TW": "角色名稱" }[language["language"]],
                    "key": "roleName"
                },
                {
                    "title": { "CN": "下属姓名", "EN": "Subordinate Name", "TW": "下屬姓名" }[language["language"]],
                    "key": "userName"
                }
            ],
            "roleMemberTableRowList": [],
            "selectRoleMember": [],
            "roleMemberList": [],

            "userPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "companyId": "", // 公司ID
            },
            "userColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
                {
                    "title": { "CN": "姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "userName"
                },
                {
                    "title": { "CN": "性别", "EN": "Gender", "TW": "性別" }[language["language"]],
                    "key": "sex"
                },
                {
                    "title": { "CN": "手机号", "EN": "cellPhone No.", "TW": "手機號" }[language["language"]],
                    "key": "mobile"
                },
                {
                    "title": { "CN": "所属公司", "EN": "Company", "TW": "所屬公司" }[language["language"]],
                    "key": "company"
                },
                {
                    "title": { "CN": "员工工号", "EN": "Staff Number", "TW": "員工工號" }[language["language"]],
                    "key": "userSeq"
                }
            ],
            "userTableRowList": [],
            "userList": [],
            "selectUser": [],

            "roleFunctionPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "roleId": "", // 角色ID
                "companyId": "", // 公司ID
            },
            "roleFunctionIndex": 0,
            "roleFunctionItem": {

            },
            "roleFunctionList": [],
            "selectRoleFunction": [],
            "roleFunctionColumsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
                {
                    "title": { "CN": "公司名称", "EN": "Company Name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "角色名称", "EN": "Role", "TW": "角色名稱" }[language["language"]],
                    "key": "roleName"
                },
                // {
                //     "title": { "CN": "功能类型", "EN": "Functions Type", "TW": "功能類型" }[language["language"]],
                //     "key": "functionType"
                // },
                {
                    "title": { "CN": "功能名称", "EN": "Functions Name", "TW": "功能名稱" }[language["language"]],
                    "key": "functionName"
                }
            ],
            "roleFunctionTableRowList": [],

            "functionsPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "functionList": [],
            "selectFunction": [],
            "permissionFunctionTypeLis": bizParam["permissionFunctionType"],
            "functionsColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
                {
                    "title": { "CN": "功能层级", "EN": "Functions Name", "TW": "功能層級" }[language["language"]],
                    "key": "functionLevel"
                },
                {
                    "title": { "CN": "功能类型", "EN": "Functions Type", "TW": "功能類型" }[language["language"]],
                    "key": "functionType"
                },
                {
                    "title": { "CN": "功能名称", "EN": "Functions Name", "TW": "功能名稱" }[language["language"]],
                    "key": "functionName"
                },
                {
                    "title": { "CN": "是否可用", "EN": "isValid", "TW": "是否可用" }[language["language"]],
                    "key": "isValid"
                }
            ],
            "functionsTableRowList": [],

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
            "addItem": function () {
                var self = this;
                self.isShowModal = true;
                self.isModalLoading = true;
                self.modalTitle = { "CN": "新增", "EN": "Add", "TW": "新增" }[self.language];
                self.itemInfo = {
                    "id": "", // 系统角色ID，修改时必传
                    "companyId": "", // 所属公司ID，手动从公司列表选择
                    "roleName": "", // 角色名称
                    "roleCode": "", // 角色编码
                    "roleDesc": "", // 角色描述
                    "isValid": "", // 分组是否可用，默认=1 0=否 1=是
                    "isPublic": "", // 是否公共角色 0=否 1=是
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.roleList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.itemInfo = self.roleList[self.index];
                // 先判断是否选择了一家公司
                utility.showMessageTip(self, function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delRole,
                        actionUrl: CONFIG.SERVICE.permissionService,
                        dataObj: {
                            ids: self.itemInfo.id, // 角色id
                            modifyUserId: userInfo["id"], // 修改用户的id
                        },
                        beforeSendCallback: function () {
                            self.isTableLoading = true;
                        },
                        completeCallback: function () {
                            self.isTableLoading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getRoleDataList(true);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                });
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (item, index) {
                var self = this;
                if (!!item) {
                    self.index = index;
                    self.selectItem = item;
                }
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.pageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getRoleDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                console.log(value);
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleDataList(false);
                }, 200);
            },
            // 显示用户层
            "showUserLayer": function () {
                var self = this;
                self.isUserList = true;
                self.getUserList(true);
            },
            // 格式化角色成员列表
            "formatRoleMember": function () {
                var self = this;
                for (var i = 0, len = self.roleMemberList.length; i < len; i++) {
                    self.roleMemberTableRowList.push({
                        "id": decodeURI(self.roleMemberList[i]["id"]), //"角色名称",
                        "roleName": decodeURI(self.roleMemberList[i]["roleName"]), //"角色名称",
                        "companyName": decodeURI(self.roleMemberList[i]["companyName"]), //"公司名称",
                        "userName": decodeURI(self.roleMemberList[i]["userName"]), //"下属姓名",
                    });
                }
            },
            // 获取角色下属用户列表数据接口
            "getRoleMemberList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.roleMemberTableRowList = [];
                    self.roleMemberPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getRoleUserList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.roleMemberPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.roleMemberList = data.data;
                            self.roleMemberPageInfo.count = data.count;
                            self.formatRoleMember();
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 删除角色成员
            "deleteRoleMember": function () {
                var self = this;
                if (self.selectRoleMember.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                self.isModalLoading = true;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delRoleUser,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        ids: self.selectRoleMember.join(","), // 公司id
                        modifyUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleMemberList(true);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 页数改变时的回调
            "roleMemberPageSizeChange": function (value) {
                var self = this;
                self.roleMemberPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getRoleMemberList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "roleMemberPageRowChange": function (value) {
                var self = this;
                self.roleMemberPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleMemberList(false);
                }, 200);
            },
            // 页数改变时的回调
            "userPageSizeChange": function (value) {
                var self = this;
                self.userPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getUserList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "userPageRowChange": function (value) {
                var self = this;
                self.userPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserList(false);
                }, 200);
            },
            // 角色成员
            "selectMembers": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.isShowMember = true;
                });
            },
            // 当公司变化时
            "companyChange": function () {
                var self = this;
            },
            // 当选择的行发生变化时 
            "selectMemberChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectRoleMember = ids;
            },

            // 提交角色成员信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveRole,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "id": self.itemInfo.id, // 系统角色ID，修改时必传
                        "companyId": self.itemInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "roleName": encodeURI(self.itemInfo.roleName), // 角色名称
                        "roleCode": encodeURI(self.itemInfo.roleCode), // 角色编码
                        "roleDesc": encodeURI(self.itemInfo.roleDesc), // 角色描述
                        "isValid": self.itemInfo.isValid, // 分组是否可用，默认=1 0=否 1=是
                        "isPublic": self.itemInfo.isPublic, // 是否公共角色 0=否 1=是
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleDataList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 从获取回来的列表中，格式化出显示在表格上的内容
            "formatRoleTableList": function () {
                var self = this;

                for (var i = 0, len = self.roleList.length; i < len; i++) {
                    self.tableRowList.push({
                        "roleName": decodeURI(self.roleList[i]["roleName"]),
                        "companyName": decodeURI(self.roleList[i]["companyName"]),
                        "roleCode": self.roleList[i]["roleCode"],
                        "roleDesc": decodeURI(self.roleList[i]["roleDesc"]),
                        "isValid": { "1": { 'CN': '是', 'EN': 'Yes', 'TW': '是' }[self.language], "0": { 'CN': '否', 'EN': 'No', 'TW': '否' }[self.language] }[self.roleList[i]["isValid"] + ""],
                        "isPublic": { "1": { 'CN': '是', 'EN': 'Yes', 'TW': '是' }[self.language], "0": { 'CN': '否', 'EN': 'No', 'TW': '否' }[self.language] }[self.roleList[i]["isPublic"] + ""],
                    });
                }
            },
            // 添加角色成员
            "addRoleMember": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveRoleUser,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "roleId": self.roleMemberPageInfo.roleId, // 系统角色ID，修改时必传
                        "companyId": self.roleMemberPageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "userIds": self.selectUser.join(","), // 角色名称
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleMemberList(true);
                            self.isUserList = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 获取角色信息
            "getRoleDataList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.tableRowList = [];
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getRoleList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.roleList = data.data;

                            self.pageInfo.count = data.count;

                            // 格式化表格数据
                            self.formatRoleTableList();
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 获取公司列表
            "getCompanyList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.getCompanyList,
                    actionUrl: CONFIG.SERVICE.companyService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.companyList = data.data;
                        }
                    }
                });
            },
            // 当选择用户改变时
            "selectUserChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectUser = ids;
            },
            // 格式化用户列表
            "formatUserData": function () {
                var self = this;
                for (var i = 0, len = self.userList.length; i < len; i++) {
                    self.userTableRowList.push({
                        "id": decodeURI(self.userList[i]["id"]), //"员工姓名",
                        "userName": decodeURI(self.userList[i]["userName"]), //"员工姓名",
                        "sex": self.userList[i]["sex"], //"性别",
                        "mobile": self.userList[i]["mobile"], //"手机号",
                        "userSeq": decodeURI(self.userList[i]["userSeq"]), //"员工工号",
                        "company": decodeURI(self.userList[i]["companyName"]), //"所属公司",
                    });
                }
            },
            // 获取用户信息
            "getUserList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.userTableRowList = [];
                    self.userPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: self.userPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.userList = data.data;
                            self.userPageInfo.count = data.count;
                            self.formatUserData();
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 页数改变时的回调
            "roleFunctionsPageSizeChange": function (value) {
                var self = this;
                self.roleFunctionPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getRoleFunctionsDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "roleFunctionsPageRowChange": function (value) {
                var self = this;
                self.roleFunctionPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleFunctionsDataList(false);
                }, 200);
            },

            // 删除角色可用功能
            "deleteRoleFunctions": function () {
                var self = this;
                if (self.selectRoleFunction.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                self.isModalLoading = true;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delRoleFunction,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        ids: self.selectRoleFunction.join(","), // 公司id
                        modifyUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleFunctionsDataList(true);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 当选择的行发生变化时 
            "selectRoleFunctionsChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectRoleFunction = ids;
            },
            // 提交功能信息到服務器
            "uploadFunctionDataToServer": function () {
                var self = this;
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveRoleFunction,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "roleId": self.roleFunctionPageInfo.roleId, // 系统角色ID，修改时必传
                        "companyId": self.roleFunctionPageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "functionIds": self.selectFunction.join(","), // 角色名称
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleFunctionsDataList(true);
                            self.isUserList = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化角色可用功能列表
            "formatRoleFunction": function () {
                var self = this;
                for (var i = 0, len = self.roleFunctionList.length; i < len; i++) {
                    self.roleFunctionTableRowList.push({
                        "id": self.roleFunctionList[i]["id"], //"角色名称",
                        "roleName": decodeURI(self.roleFunctionList[i]["roleName"]), //"角色名称",
                        "companyName": decodeURI(self.roleFunctionList[i]["companyName"]), //"公司名称",
                        // "functionType": (function() {
                        //     var type = "";
                        //     for(var f = 0, flen = self.permissionFunctionTypeLis.length; f < flen; f++) {
                        //         if(self.permissionFunctionTypeLis[f]["type"] == self.roleFunctionList[f]["functionType"]) {
                        //             type = self.permissionFunctionTypeLis[f]["name"];
                        //             break;
                        //         }
                        //     }
                        //     return type;
                        // }()), // self.permissionFunctionTypeLis[self.roleFunctionList[i]["functionType"]], //"功能类型",
                        "functionName": decodeURI(self.roleFunctionList[i]["functionName"]), //"功能名称",
                    });
                }
            },
            // 获取角色可用功能列表数据接口
            "getRoleFunctionsDataList": function (bool) {
                var self = this;
                if (bool == true) {
                    self.roleFunctionTableRowList = [];
                    self.roleFunctionPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getRoleFunctionList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.roleFunctionPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.roleFunctionList = data.data;
                            self.roleFunctionPageInfo.count = data.count;

                            self.formatRoleFunction();

                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 显示功能层
            "showFunctionsLayer": function () {
                var self = this;
                self.isFunctionList = true;
                self.getFunctionsDataList(true);
            },
            // 当选择的行发生变化时 
            "selectFunctionsChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectFunction = ids;
            },
            // 格式化系统操作权限功能
            "formatFunctions": function () {
                var self = this;
                for (var i = 0, len = self.functionList.length; i < len; i++) {
                    self.functionsTableRowList.push({
                        "id": self.functionList[i]["id"], //"角色名称",
                        "functionLevel": self.functionList[i]["functionLevel"], //"权限所处层级",
                        "functionType": (function() {
                            var type = "";
                            for(var f = 0, flen = self.permissionFunctionTypeLis.length; f < flen; f++) {
                                if(self.permissionFunctionTypeLis[f]["type"] == self.functionList[f]["functionType"]) {
                                    type = self.permissionFunctionTypeLis[f]["name"];
                                    break;
                                }
                            }
                            return type;
                        }()), // self.permissionFunctionTypeLis[self.functionList[i]["functionType"]], //"功能类型",
                        "functionName": decodeURI(self.functionList[i]["functionName"]), //"功能名称",
                        "functionCode": decodeURI(self.functionList[i]["functionCode"]), //"功能权限项描述",
                        "isValid": { "1": { 'CN': '是', 'EN': 'Yes', 'TW': '是' }[self.language], "0": { 'CN': '否', 'EN': 'No', 'TW': '否' }[self.language] }[self.functionList[i]["isValid"] + ""], //"是否有效"
                    });
                }
            },
            // 获取系统操作权限功能项目列表接口
            "getFunctionsDataList": function (bool) {
                var self = this;
                if (bool == true) {
                    self.functionsTableRowList = [];
                    self.functionsPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getFunctionList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.functionsPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.functionList = data.data;
                            self.functionsPageInfo.count = data.count;
                            self.formatFunctions();
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "functionsPageSizeChange": function (value) {
                var self = this;
                self.functionsPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "functionsPageRowChange": function (value) {
                var self = this;
                console.log(value);
                self.functionsPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getRoleDataList(true);
                self.getCompanyList();
            }, 500);
        }
    });

}())
