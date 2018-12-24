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
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "pageInfo": {
                "id": 0,
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "deptName": "", // 查询关键字（部门名称）
                "companyId": "", // 公司ID
                "paraDeptId": "", // 上级部门ID
            },

            "pageInfo": {
                "id": 0,
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "userCode": "", // 查询关键字（角色名称）
                "userName": "", // 查询关键字（用户名称）
                "companyId": "", // 公司ID
            },
            "index": 0,
            "selectItem": "",
            "itemInfo": {
                "deptId": "", // 部门ID 
                "userIds": [], // 用户ID，多个用户ID间以英文半角逗号分隔
                "posiType": "", // 员工在部门的职位类型： 921=普通员工 922=副负责人 923=正负责人
                "posiName": "", // 员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
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
                    "title": { "CN": "公司名称", "EN": "Company name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "部门名称", "EN": "Department Name", "TW": "部門名稱" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "userName"
                },
                {
                    "title": { "CN": "职位名称", "EN": "Job Title", "TW": "職位名稱" }[language["language"]],
                    "key": "posiName"
                },
                {
                    "title": { "CN": "职位类型", "EN": "Job Type", "TW": "職位類型" }[language["language"]],
                    "key": "posiType"
                }
            ],
            "tableRowList": [],
            "departUserList": [],
            "departmentList": [],
            "companyList": [],
            "userList": [],
            "deptUserPositionTypeList": bizParam["departmentPositionType"]
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
                    "deptId": "", // 部门ID 
                    "userIds": "", // 用户ID，多个用户ID间以英文半角逗号分隔
                    "posiType": "", // 员工在部门的职位类型： 921=普通员工 922=副负责人 923=正负责人
                    "posiName": "", // 员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.departUserList[self.index];
                    self.itemInfo.userIds = [self.itemInfo.userId];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.itemInfo = self.departUserList[self.index];
                // 先判断是否选择了一家公司
                utility.showMessageTip(self, function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.delDeptUser + "&ids=" + self.itemInfo.userId + "&modifyUserId=" + userInfo["id"],
                        actionUrl: CONFIG.SERVICE.deptUserService,
                        beforeSendCallback: function () {
                            self.isTableLoading = true;
                        },
                        completeCallback: function () {
                            self.isTableLoading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getDepartUserDataList(true);
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
            // 
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.saveDeptUser,
                    actionUrl: CONFIG.SERVICE.deptUserService,
                    dataObj: {
                        "id": self.itemInfo.id, // ID 
                        "deptId": self.itemInfo.deptId, // 部门ID 
                        "userIds": self.itemInfo.userIds.join(","), // 用户ID，多个用户ID间以英文半角逗号分隔
                        "posiType": self.itemInfo.posiType, // 员工在部门的职位类型： 921=普通员工 922=副负责人 923=正负责人
                        "posiName": encodeURI(self.itemInfo.posiName), // 员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getDepartUserDataList(true);
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
                self.pageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getDepartUserDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getDepartUserDataList(false);
                }, 200);
            },
            // 从获取回来的列表中，格式化出显示在表格上的内容
            "formatTableList": function () {
                var self = this;

                for (var i = 0, len = self.departUserList.length; i < len; i++) {
                    self.tableRowList.push({
                        "deptName": decodeURI(self.departUserList[i]["deptName"]), //"部门名称",
                        "companyName": decodeURI(self.departUserList[i]["companyName"]), //"姓名",
                        "userName": decodeURI(self.departUserList[i]["userName"]), //"职位名称",
                        "posiName": decodeURI(self.departUserList[i]["posiName"]), //"职位名称",
                        "posiType": (function() {
                            var name = "";
                            for(var p = 0, plen = self.deptUserPositionTypeList.length; p < plen; p++) {
                                if(self.deptUserPositionTypeList[p]["type"] == self.departUserList[i]["posiType"]) {
                                    name = self.deptUserPositionTypeList[p]["name"];
                                    break;
                                }
                            }
                            return name;
                        }()), //"职位名称",
                    });
                }
            },
            // 获取机构信息
            "getDepartUserDataList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.tableRowList = [];
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.getDeptUserList,
                    actionUrl: CONFIG.SERVICE.deptUserService,
                    dataObj: self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.departUserList = data.data;
                            self.pageInfo.count = data.count;

                            // 格式化表格数据
                            self.formatTableList();
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
            // 获取机构信息
            "getDepartmentList": function (bool) {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.departmentList = data.data;
                        }
                    }
                });
            },
            // 获取用户信息
            "getUserList": function (bool) {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
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
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getDepartUserDataList(true);
                self.getCompanyList();
                self.getDepartmentList();
                self.getUserList();
            }, 500);
        }
    });

}())
