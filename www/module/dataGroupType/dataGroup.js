(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isAddTableLoading": true,
            "isShowModal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "isShowMember": false,
            "isShowGroupTypeList": false,
            "isPermissions": false,
            "isFunctionList": false,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "groupTypeList": bizParam["groupType"],
            "index": 0,
            "count": 0,
            "pageInfo": {
                "groupName": "", // 查询关键字（用户名称）
                "userName": "", // 查询关键字（用户名称）
                "userCode": "", // 查询关键字（用户名称）
                "companyId": "", // 公司ID
            },
            "page": {
                "pageNum": 1,
                "pageSize": 20,
            },
            "selectUser": [],
            "selectGroup": [],
            "selectItem": {
                "companyId": "",
                "groupIds": [],
                "userIds": [],
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [{
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": {
                        "CN": "所在公司",
                        "EN": "Company Name",
                        "TW": "所在公司"
                    } [language["language"]],
                    "key": "companyName"
                },
                {
                    "title": {
                        "CN": "组名称",
                        "EN": "Group Name",
                        "TW": "組名稱"
                    } [language["language"]],
                    "key": "groupName"
                },
                {
                    "title": {
                        "CN": "用户名",
                        "EN": "Gruop Type",
                        "TW": "分組類型"
                    } [language["language"]],
                    "key": "userName"
                },
                // {
                //     "title": {
                //         "CN": "用户代码",
                //         "EN": "Gruop Type",
                //         "TW": "分組類型"
                //     } [language["language"]],
                //     "key": "userCode"
                // },
                {
                    "title": {
                        "CN": "操作",
                        "EN": "State",
                        "TW": "操作"
                    } [language["language"]],
                    "key": "state",
                    "width": 200,
                    "align": "center",
                    "render": function (h, params) {
                        return h('div', [
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
                            }, {
                                "CN": "编辑",
                                "EN": "Edite",
                                "TW": "編輯"
                            } [language["language"]]),
                            h("Button", {
                                "props": {
                                    "type": "error",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.index = params.index;
                                        pageVue.selectItem = params.row;
                                        pageVue.delItem();
                                    }
                                }
                            }, {
                                "CN": "删除",
                                "EN": "Delete",
                                "TW": "刪除"
                            } [language["language"]])
                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "companyList": [],
            "userList": [],
            "groupList": []
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
                self.modalTitle = {
                    "CN": "新增",
                    "EN": "Add",
                    "TW": "新增"
                } [self.language];
                self.selectUser = [];
                self.selectGroup = [];
                self.selectItem = {
                    "id": "",
                    "companyId": "",
                    "groupIds": "",
                    "userIds": "",
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.selectItem = self.tableRowList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = {
                        "CN": "修改",
                        "EN": "Edit",
                        "TW": "修改"
                    } [self.language];
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.$Modal.confirm({
                    "title": "确定删除？",
                    "width": 200,
                    "onOk": function () {
                        self.selectItem = self.tableRowList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delUserGroups + "&ids=" + self.selectItem.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.permissionService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getUserGroupList(true);
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
                    self.selectItem.userIds = item.userId;
                    self.selectItem.groupIds = item.resId;
                    self.selectUser = [item.userId];
                    self.selectGroup = [item.resId];
                    self.getUserList();
                    self.getGroupList();
                }
            },

            "companyChange": function (value) {
                var self = this;
                self.selectItem.companyId = value;
                self.selectUser = [];
                self.selectGroup = [];
                self.getUserList();
                self.getGroupList();
            },

            "userListChange": function (value) {
                var self = this;
                self.selectItem.userIds = value.join(",");
            },

            "groupListChange": function (value) {
                var self = this;
                self.selectItem.groupIds = value.join(",");
            },

            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                if (self.selectItem.companyId == "") {
                    self.$Message.error("请选择公司");
                    return;
                }
                if (self.selectItem.userIds == "") {
                    self.$Message.error("请选择用户");
                    return;
                }
                if (self.selectItem.groupIds == "") {
                    self.$Message.error("请选择资源组");
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveUserGroups,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "id": self.selectItem.id,
                        "groupIds": self.selectItem.groupIds,
                        "userIds": self.selectItem.userIds,
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getUserGroupList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserGroupList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserGroupList(true);
                }, 200);
            },

            // 重新格式化数据
            "forMatUserGroupList": function (dataList) {
                var self = this;
                var userList = {};
                for (var i = 0, len = dataList.length; i < len; i++) {
                    userList[dataList[i]["userId"]] = {
                        "companyName": "",
                        "companyId": "",
                        "userName": "",
                        "resIds": "",
                        "userIds": "",
                        "groupNames": "",
                        "createTime": "2019-12-29 15:44:49",
                        "id": "",
                    };
                }

                for (var key in userList) {
                    for (var s = 0, slen = dataList.length; s < len; s++) {
                        if (dataList[s]["userId"] == key) {
                            userList[key]["companyName"] = dataList[s]["companyName"];
                            userList[key]["companyId"] = dataList[s]["companyId"];
                            userList[key]["userName"] = dataList[s]["userName"];
                            userList[key]["resIds"] = !!userList[key]["resIds"] ? userList[key]["resIds"] + "," + dataList[s]["resId"] : dataList[s]["resId"];
                            userList[key]["userIds"] = !!userList[key]["userIds"]? userList[key]["userIds"] + "," + dataList[s]["userId"] : dataList[s]["userId"];
                            userList[key]["groupNames"] = !!userList[key]["groupNames"]? userList[key]["groupNames"] + "," + dataList[s]["groupName"] : dataList[s]["groupName"];
                        }
                    }
                }
                // for (var keyTable in userList) {
                //     self.tableRowList.push(userList[keyTable]);
                // }
            },
            // 获取组列表信息
            "getUserGroupList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                if (bool == true) {
                    self.page.pageNum = 0;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getUserGroupList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "groupName": encodeURI(self.pageInfo.groupName), // 查询关键字（用户名称）
                        "userName": encodeURI(self.pageInfo.userName), // 查询关键字（用户名称）
                        "userCode": encodeURI(self.pageInfo.userCode), // 查询关键字（用户名称）
                        "companyId": self.pageInfo.companyId, // 公司ID
                    }, // self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.count = data.count;

                            self.forMatUserGroupList(data.data);

                            // 格式化表格数据
                            self.tableRowList = data.data;
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
            "getUserList": function () {
                var self = this;
                if(self.selectItem.companyId==undefined) {
                    self.userList = [];
                    self.selectUser = [];
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 100000,
                        "companyId": self.selectItem.companyId, // 公司ID
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
                        }
                    }
                });
            },
            // 获取组列表信息
            "getGroupList": function (bool) {
                var self = this;
                if(self.selectItem.companyId==undefined) {
                    self.groupList = [];
                    self.selectGroup = [];
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 100000,
                        "companyId": self.selectItem.companyId, // 公司ID
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.groupList = data.data;
                        }
                    }
                });
            },
        },
        "created": function () {
            var self = this;
            var timeOut = null;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getUserGroupList(true);
                self.getCompanyList();
            }, 500);

            self.$watch('pageInfo', function () {
                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    self.getUserGroupList(true);
                }, 200);
            }, {
                deep: true
            });
        }
    });

}())