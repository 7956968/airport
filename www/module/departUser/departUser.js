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
            "isShowDetail": false,
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
                "pageSize": 20,
                "userCode": "", // 查询关键字（用户账户名）
                "userName": "", // 查询关键字（用户姓名）
                "posiName": "", // 查询关键字（职位名称）
                "companyId": "", // 公司ID
                "deptIds": [], // 部门ID
            },
            "index": 0,
            "selectItem": "",
            "itemInfo": {
                "deptId": "",
                "deptIds": [], // 部门ID 
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
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 180,
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "primary",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.index = params.index;
                                        pageVue.selectItem = params.row;
                                        pageVue.showDetail();
                                    }
                                }
                            }, { "CN": "详情", "EN": "Detail", "TW": "詳情" }[language["language"]]),
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
                            }, { "CN": "删除", "EN": "Delete", "TW": "刪除" }[language["language"]])
                        ]);
                    }
                }
            ],
            "userList": [],
            "companyList": [],
            "tableRowList": [],
            "departUserList": [],
            "superiorDepartmentList": [],
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
                    "deptIds": [], // 部门ID 
                    "userIds": [], // 用户ID，多个用户ID间以英文半角逗号分隔
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
                    self.getUserList(function() {
                        self.itemInfo.userIds = [self.itemInfo.userId];
                    });
                    self.getSuperiorDeprtList("itemInfo");
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.departUserList[self.index]));
                    self.itemInfo.posiTypeName = (function() {
                        var name = "";
                        for(var i = 0, len = self.deptUserPositionTypeList.length; i < len; i++) {
                            if(self.itemInfo.posiType == self.deptUserPositionTypeList[i]["type"]) {
                                name = self.deptUserPositionTypeList[i]["name"];
                                break;
                            }
                        }
                        return name;
                    }());
                    self.isShowDetail = true;
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.$Modal.confirm({
                    "title": "确定删除？",
                    "width": 200,
                    "onOk": function() {
                        self.itemInfo = self.departUserList[self.index];
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
            // 
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.saveDeptUser,
                    actionUrl: CONFIG.SERVICE.deptUserService,
                    dataObj: {
                        "id": self.itemInfo.id, // ID 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        "posiType": self.itemInfo.posiType, // 员工在部门的职位类型： 921=普通员工 922=副负责人 923=正负责人
                        "userIds": self.itemInfo.userIds.join(","), // 用户ID，多个用户ID间以英文半角逗号分隔
                        "posiName": encodeURI(self.itemInfo.posiName), // 员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                        "deptId": self.itemInfo.deptIds[self.itemInfo.deptIds.length-1], // 部门ID 
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
                self.pageInfo.pageNum = parseInt(value, 10);
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
            // 获取机构用户信息
            "getDepartUserDataList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptUserService + "?action=" + CONFIG.ACTION.getDeptUserList,
                    actionUrl: CONFIG.SERVICE.deptUserService,
                    dataObj: {
                        "pageNum": self.pageInfo.pageNum,
                        "pageSize": self.pageInfo.pageSize,
                        "userCode": self.pageInfo.userCode, // 查询关键字（用户账户名）
                        "userName": self.pageInfo.userName, // 查询关键字（用户姓名）
                        "posiName": self.pageInfo.posiName, // 查询关键字（职位名称）
                        "companyId": self.pageInfo.companyId, // 公司ID
                        "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length-1] || 0, // 部门ID
                    },
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
            "getSuper": function(list, value, arr){
                var self = this;
                for(var i = 0, len = list.length; i < len; i++) {
                    if(list[i].value == value) {
                        arr.push(value);
                        if(list[i].paraDeptId == 0) {
                            return;
                        }
                        self.getSuper(self.superiorDepartmentList, list[i].paraDeptId, arr);
                    } else {
                        self.getSuper(list[i]["children"], value, arr);
                    }
                }
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function(list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.superiorDepartmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getSuperiorDeprtList": function (type) {
                var self = this;
                self.superiorDepartmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0,
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var arr = [];
                            self[type]["deptIds"] = [];
                            self.formatSuperiorDeprt(data.data); // 格式化机构部门数据
                            self.getSuper(self.superiorDepartmentList, self[type]["deptId"], arr);
                            self[type]["deptIds"] = arr.reverse();
                        }
                    }
                });
            },
            // 获取用户信息
            "getUserList": function (callback) {
                var self = this;
                self.userList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self.itemInfo.companyId,
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
                            !!callback && callback();
                        }
                    }
                });
            },
            // 当选择公司时，动态选择部门用户
            "getDepartAndUser": function() {
                var self = this;
                self.itemInfo.userIds = [];
                self.getUserList();
                self.getSuperiorDeprtList("itemInfo");
            },
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getDepartUserDataList(true);
                self.getCompanyList();
                self.getSuperiorDeprtList("pageInfo");
            }, 500);
        }
    });

}())
