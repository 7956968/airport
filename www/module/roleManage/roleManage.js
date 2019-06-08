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
            "isUserListTree": false,
            "isFunctionList": false,
            "isShowDataGroup": false,
            "isDataGroupList": false,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "groupTypeList": bizParam["groupType"],
            "pageInfo": {
                "id": 0,
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
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
                    "width": 350,
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
                            // h('Button', {
                            //     "props": {
                            //         "type": 'primary',
                            //         "size": 'small'
                            //     },
                            //     "style": {
                            //         "marginRight": '5px'
                            //     },
                            //     "on": {
                            //         "click": function () {
                            //             pageVue.isShowDataGroup = true;
                            //             pageVue.roleDataGroupPageInfo.roleId = pageVue.roleList[params.index]["id"];
                            //             pageVue.roleDataGroupPageInfo.companyId = pageVue.roleList[params.index]["companyId"];
                            //             pageVue.getRoleDataGroupList(true);
                            //         }
                            //     }
                            // }, { 'CN': '数据权限', 'EN': 'DataGroup', 'TW': '數據權限' }[language["language"]]),
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
                                        pageVue.getSuperiorDepartmentList();
                                        pageVue.getRoleMemberList(true);
                                    }
                                }
                            }, { 'CN': '角色成员', 'EN': 'Role Members', 'TW': '角色成員' }[language["language"]]),
                            h("Button", {
                                "props": {
                                    "type": "warning",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.index = params.index;
                                        pageVue.selectItem = params.row;
                                        pageVue.editItem();
                                    }
                                }
                            }, { "CN": "编辑", "EN": "Edite", "TW": "編輯" }[language["language"]]),
                            h("Button", {
                                "props": {
                                    "type": "error",
                                    "size": "small",
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.index = params.index;
                                        pageVue.selectItem = params.row;
                                        pageVue.delItem();
                                    }
                                }
                            }, { "CN": "删除", "EN": "Delete", "TW": "刪除" }[language["language"]]),
                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "companyList": [],
            "roleList": [],
            "departList": [],
            "roleMemberIndex": 0,
            "userType": 1,
            "roleMemberPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
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
                "deptId": [], // 部门ID
                "pageSize": 20,
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
                    "key": "userId"
                },
                {
                    "title": { "CN": "姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "userName"
                },
                {
                    "title": { "CN": "所属公司", "EN": "Company", "TW": "所屬公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "所属部门", "EN": "Department", "TW": "所屬部門" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "员工职位", "EN": "Position", "TW": "員工職位" }[language["language"]],
                    "key": "posiName"
                }
            ],
            "userTableRowList": [],
            "userList": [],
            "selectUser": [],

            "roleFunctionPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "roleId": "", // 角色ID
                "companyId": "", // 公司ID
            },
            "roleFunctionIndex": 0,
            "roleFunctionItem": {},
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
                    "width": 100,
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
                    "title": { "CN": "功能名称", "EN": "Functions Name", "TW": "功能名稱" }[language["language"]],
                    "key": "functionName"
                }
            ],
            "roleFunctionTableRowList": [],

            "functionsPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 1000,
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
                    "width": 100,
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
            "superiorDepartmentList": [],
            "superiorDepartmentTree": [],

            "roleDataGroupPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "roleId": "", // 角色ID
                "companyId": "", // 公司ID
                "resName": ""
            },
            "roleDataGroupItem": {
                "id": "",
                "roleId": "",
                "roleName": "",
                "companyId": "",
                "userId": "",
                "userName": "",
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "roleDataGroupColumsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 100,
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
                    "title": { "CN": "数据组类型", "EN": "DataGroup Type", "TW": "數據組類型" }[language["language"]],
                    "key": "resTypeName"
                },
                {
                    "title": { "CN": "数据组名称", "EN": "DataGroup Name", "TW": "數據組名稱" }[language["language"]],
                    "key": "resName"
                }
            ],
            "roleDataGroupTableRowList": [],
            "selectRoleDataGroup": [],
            "roleDataGroupList": [],
            "dataGroupPageInfo": {
                "count": 0,
                "pageNum": 1,
                "deptId": [], // 部门ID
                "pageSize": 20,
                "companyId": "", // 公司ID
            },
            "dataGroupColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "所在公司", "EN": "Company Name", "TW": "所在公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "groupName"
                },
                {
                    "title": { "CN": "分组类型", "EN": "Gruop Type", "TW": "分組類型" }[language["language"]],
                    "key": "groupTypeName"
                },
                {
                    "title": { "CN": "组描述", "EN": "Role Description", "TW": "組描述" }[language["language"]],
                    "key": "groupDesc"
                },
                {
                    "title": { "CN": "是否可用", "EN": "Availability", "TW": "是否可用" }[language["language"]],
                    "key": "isValid"
                },
            ],
            "dataGroupTableRowList": [],
            "dataGroupList": [],
            "selectDataGroup": [],

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
                self.$Modal.confirm({
                    "title": "确定删除？",
                    "width": 200,
                    "onOk": function() {
                        self.itemInfo = self.roleList[self.index];
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
                    }
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
                self.pageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleDataList(false);
                }, 200);
            },
            // 显示用户层
            "showUserLayer": function (type) {
                var self = this;
                self[type] = true;
                if(type == 'isUserList') {
                    self.getUserList(true);
                    self.userType = 1;
                } else if(type == "isUserListTree") {
                    self.userType = 2;
                }
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
                self.roleMemberTableRowList = [];
                if (bool == true) {
                    self.roleMemberPageInfo.pageNum = 1;
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
                self.roleMemberPageInfo.pageNum = parseInt(value, 10);
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
                self.userPageInfo.pageNum = parseInt(value, 10);
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
                        "userType": self.userType, // 用户类型
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
                            self.isUserListTree = false;
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
                self.tableRowList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 1;
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
                    ids.push(selection[i]["userId"]);
                }

                self.selectUser = ids;
            },
            // 当选择的行发生变化时 
            "selectDepartmentTreeChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectUser = ids;
            },
            // 通过部门选择员工
            "getUserListByDept": function(value, selectedData) {
                var self = this;
                self.userPageInfo.deptId = value;
                self.getUserList(true);
            },
            // 格式化用户列表
            "formatUserData": function () {
                var self = this;
                for (var i = 0, len = self.userList.length; i < len; i++) {
                    self.userTableRowList.push({
                        "userId": self.userList[i]["userId"],
                        "userName": decodeURI(self.userList[i]["userName"]),
                        "deptName": decodeURI(self.userList[i]["deptName"]),
                        "posiName": decodeURI(self.userList[i]["posiName"]),
                        "companyName": decodeURI(self.userList[i]["companyName"]),
                    });
                }
            },
            // 获取用户信息
            "getUserList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.userTableRowList = [];
                if (bool == true) {
                    self.userPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.getDeptUserList,
                    actionUrl: CONFIG.SERVICE.deptUserService,
                    dataObj: {
                        pageSize: 20,
                        pageNum: self.userPageInfo.pageNum,
                        deptId: self.userPageInfo.deptId[self.userPageInfo.deptId.length-1],
                    },
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
                self.roleFunctionPageInfo.pageNum = parseInt(value, 10);
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
                            self.isFunctionList = false;
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
                        "functionName": decodeURI(self.roleFunctionList[i]["functionName"]), //"功能名称",
                    });
                }
            },
            // 获取角色可用功能列表数据接口
            "getRoleFunctionsDataList": function (bool) {
                var self = this;
                self.roleFunctionList = [];
                self.roleFunctionTableRowList = [];
                if (bool == true) {
                    self.roleFunctionPageInfo.pageNum = 1;
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
                var fun = JSON.stringify(self.functionList).replace(/(subFunctionList)/g,'children').replace(/(functionName)/g, 'title').replace(/isValid/g, 'expand');
                self.functionsTableRowList = JSON.parse(fun);
            },
            // 获取系统操作权限功能项目列表接口
            "getFunctionsDataList": function (bool) {
                var self = this;
                self.functionList = [];
                self.functionsTableRowList = [];
                if (bool == true) {
                    self.functionsPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getFunctionTreeList,
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
                self.functionsPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "functionsPageRowChange": function (value) {
                var self = this;
                self.functionsPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function(list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                var listTree = JSON.stringify(list).replace(/deptName/g, 'title').replace(/subDeptList/g, 'children');
                self.superiorDepartmentList = JSON.parse(listInfo);
                self.superiorDepartmentTree = JSON.parse(listTree);
            },
            // 获取机构信息
            "getSuperiorDepartmentList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 10000,
                        "companyId": self.userPageInfo.companyId, // 公司ID
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.superiorDepartmentList = [];
                            self.formatSuperiorDeprt(data.data);
                        }
                    }
                });
            },
            // 获取数据权限组列表数据
            "getRoleDataGroupList": function(bool) {
                var self = this;
                self.roleDataGroupList = [];
                if (bool == true) {
                    self.roleDataGroupPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getUserGroupDataResList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.roleDataGroupPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.roleDataGroupPageInfo.count = data.count;
                            self.roleDataGroupTableRowList = data.data;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "roleDataGroupPageSizeChange": function (value) {
                var self = this;
                self.roleDataGroupPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleDataGroupList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "roleDataGroupPageRowChange": function (value) {
                var self = this;
                self.roleDataGroupPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getRoleDataGroupList(false);
                }, 200);
            },
            // 当选择的行发生变化时 
            "selectRoleDataGroupChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectRoleDataGroup = ids;
            },
            // 删除角色数据组
            "deleteRoleDataGroup": function() {
                var self = this;
                if (self.selectRoleDataGroup.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                self.isModalLoading = true;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delUserGroupDataResList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        ids: self.selectRoleDataGroup.join(","), // 公司id
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
                            self.getRoleDataGroupList(true);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 显示数据组权限列表
            "showDataGroupLayer": function() {
                var self = this;
                self.isDataGroupList = true;
                self.getDataGroupList(true);
            },

            // 获取数据权限组列表数据
            "getDataGroupList": function(bool) {
                var self = this;
                self.roleDataGroupList = [];
                if (bool == true) {
                    self.dataGroupPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        pageNum: self.dataGroupPageInfo.pageNum,
                        pageSize: self.dataGroupPageInfo.pageSize,
                        companyId: self.roleDataGroupPageInfo.companyId
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.dataGroupPageInfo.count = data.count;
                            self.dataGroupTableRowList = data.data;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "dataGroupPageSizeChange": function (value) {
                var self = this;
                self.dataGroupPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getDataGroupList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "dataGroupPageRowChange": function (value) {
                var self = this;
                self.dataGroupPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getDataGroupList(false);
                }, 200);
            },
            // 当选择的行发生变化时 
            "selectDataGroupChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectDataGroup = ids;
            },
            // 添加角色数据组
            "addRoleDataGroup": function(){
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveUserGroupDataRes,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "roleId": self.roleDataGroupPageInfo.roleId, // 系统角色ID，修改时必传
                        "companyId": self.roleDataGroupPageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "resIds": self.selectDataGroup.join(","), // 角色名称
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getRoleDataGroupList(true);
                            self.isDataGroupList = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
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
