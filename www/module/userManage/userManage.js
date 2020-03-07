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
            "isShowReset": false,
            "isShowDetail": false,
            "isModalLoading": false,
            "modalTitle": "",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 员工ID，修改员工信息时必传
                "userCode": "", // 用户帐号名
                "userPwd": "", // 用户密码. 说明： 1、	创建时不设置则默认为123456; 2、修改用户时不设置则不修改原有密码
                "companyId": "", //所属公司ID，手动从公司列表选择
                "userSeq": "", // 员工工号
                "userName": "", // 员工姓名
                "sex": "", // 员工性别
                "birthday": "", // 员工生日
                "mobile": "", // 员工手机号
                "telephone": "", // 员工办公电话号
                "email": "", // 员工邮箱
                "remark": "", // 员工备注
                "status": "", // 员工帐号状态，默认值911表示正常： 911：正常 912：冻结 913：作废                
                "idNo": "", // 身份证号
                "address": "", // 员工家庭住址
                "deptIds": [],
                "isCompanyAdmin": "", // 是否公司管理员
                "roleIds": "", // 角色id，可多选，多个间以英文半角分割
                "roleIdList": [],
                "deptId": "", // 部门id，单选
                "posiType": "", // 当deptId不为空时，必填。 员工在部门的职位类型： 141 =正负责人 142=副负责人 143=员工
                "posiName": "", // 当deptId不为空时，必填。员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "pageInfo": {
                "id": 0,
                "userCode": "", // 查询关键字（角色名称）
                "userName": "", // 查询关键字（用户名称）
                "companyId": "", // 公司ID
                "deptId": "",
                "deptIds": [],
            },
            "page": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center",
                    "title": "序号",
                    "fixed": "left"
                },
                {
                    "title": "公司",
                    "key": "companyName",
                    "fixed": "left",
                    "width": 180
                },
                {
                    "title": "部门",
                    "key": "deptName",
                    "fixed": "left",
                    "width": 180
                },
                {
                    "title": { "CN": "姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "userName",
                    "width": 120,
                },
                {
                    "title": { "CN": "账号", "EN": "Account", "TW": "帳號" }[language["language"]],
                    "key": "userCode",
                    "width": 120,
                },
                {
                    "title": "角色",
                    "key": "roleNames",
                    "width": 150,
                },
                {
                    "title": "是否公司管理员",
                    "key": "isCompanyAdmin",
                    "width": 120,
                    "align": "center"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "state",
                    "width": 120,
                    "align": "center"
                },
                {
                    "title": "职位类型",
                    "key": "posiType",
                    "width": 120,
                },
                {
                    "title": "职位名称	",
                    "key": "posiName",
                    "width": 120,
                },
                {
                    "title": { "CN": "手机号", "EN": "cellPhone No.", "TW": "手機號" }[language["language"]],
                    "key": "mobile",
                    "width": 120,
                },
                {
                    "title": { "CN": "员工工号", "EN": "Staff Number", "TW": "員工工號" }[language["language"]],
                    "key": "userSeq",
                    "width": 120,
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "remark",
                    "width": 180,
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 150,
                    "fixed": "right",
                    "align": "center",
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
            "tableRowList": [],
            "superiorCompanyList": [],
            "userList": [],
            "companyList": [],
            "sexTypeList": bizParam["sexType"],
            "userStatusTypeList": bizParam["userStatusType"],
            "roleList": [],
            "superiorDepartmentList": [],
            "posiTypeInfo": {
                "_141": "正负责人",
                "_142": "副负责人",
                "_143": "员工",
            }
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
                self.isModalLoading = false;
                self.modalTitle = { "CN": "新增", "EN": "Add", "TW": "新增" }[self.language];
                self.itemInfo = {
                    "id": "", // 员工ID，修改员工信息时必传
                    "userCode": "", // 用户帐号名
                    "userPwd": "", // 用户密码. 说明： 1、	创建时不设置则默认为123456; 2、修改用户时不设置则不修改原有密码
                    "companyId": "", //所属公司ID，手动从公司列表选择
                    "userSeq": "", // 员工工号
                    "userName": "", // 员工姓名
                    "sex": "", // 员工性别
                    "birthday": "", // 员工生日
                    "mobile": "", // 员工手机号
                    "telephone": "", // 员工办公电话号
                    "email": "", // 员工邮箱
                    "remark": "", // 员工备注
                    "status": "", // 员工帐号状态，默认值911表示正常： 911：正常 912：冻结 913：作废                
                    "idNo": "", // 身份证号
                    "address": "", // 员工家庭住址
                    "deptIds": [],
                    "isCompanyAdmin": "", // 员工家庭住址
                    "roleIds": "", // 角色id，可多选，多个间以英文半角分割
                    "roleIdList": [],
                    "deptId": "", // 部门id，单选
                    "posiType": "", // 当deptId不为空时，必填。 员工在部门的职位类型： 141 =正负责人 142=副负责人 143=员工
                    "posiName": "", // 当deptId不为空时，必填。员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.userList[self.index];
                    self.itemInfo.roleIdList = (function () {
                        var list = [];
                        var role = self.itemInfo.roleIds.split(",");
                        for (var i = 0, len = role.length; i < len; i++) {
                            list.push(parseInt(role[i], 10));
                        }
                        return list;
                    }());
                    self.itemInfo.userName = decodeURI(self.itemInfo.userName);
                    self.itemInfo.remark = decodeURI(self.itemInfo.remark);
                    self.itemInfo.address = decodeURI(self.itemInfo.address);
                    self.itemInfo.posiName = decodeURI(self.itemInfo.posiName);
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                    self.getSuperiorDeprtList("itemInfo");
                    self.getRoleDataList();
                    self.isModalLoading = false;
                });
            },
            // 修改
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.userList[self.index];
                    self.itemInfo.userName = decodeURI(self.itemInfo.userName);
                    self.itemInfo.remark = decodeURI(self.itemInfo.remark);
                    self.itemInfo.address = decodeURI(self.itemInfo.address);
                    self.itemInfo.posiName = decodeURI(self.itemInfo.posiName);
                    self.itemInfo.sexName = (function () {
                        var sex = "";
                        for (var s = 0, slen = self.sexTypeList.length; s < slen; s++) {
                            if (self.sexTypeList[s]["type"] == self.itemInfo["sex"]) {
                                sex = self.sexTypeList[s]["name"];
                                break;
                            }
                        }
                        return sex
                    }());
                    self.itemInfo.statusName = (function () {
                        var statu = "";
                        for (var s = 0, slen = self.userStatusTypeList.length; s < slen; s++) {
                            if (self.userStatusTypeList[s]["type"] == self.itemInfo["status"]) {
                                statu = self.userStatusTypeList[s]["name"];
                                break;
                            }
                        }
                        return statu
                    }());
                    self.isShowDetail = true;
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.$Modal.confirm({
                    "title": "确定删除？",
                    "content": "<p>账号：" + self.userList[self.index]["userCode"] + "</p><p>用户：" + self.userList[self.index]["userName"] + "</p>",
                    "width": 300,
                    "onOk": function () {
                        self.itemInfo = self.userList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.delUser + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.userService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getUserList(true);
                                    } else {
                                        self.$Message.error(data.message);
                                    }
                                }
                            });
                        });
                    }
                });
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getUserList(true);
                }, 200);
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (item, index) {
                var self = this;
                if (!!item) {
                    self.index = index;
                    self.selectItem = item;
                }
            },
            // 提交信息到服務器
            "uploadDataToServer": function (event) {
                var self = this;
                var dateInfo = utility.getDateDetailInfo(self.itemInfo.birthday);
                self.$Message.config({
                    top: 150,
                    duration: 3
                });
                self.isModalLoading = true;
                if (self.itemInfo.deptIds.length != 0) {
                    if (!!!self.itemInfo.posiType) {
                        self.$Message.error("请选择职位类型");
                        self.isModalLoading = false;
                        return false;
                    }

                    if (utility.checkLen(self.itemInfo.posiName, 0)) {
                        self.$Message.error("请填写职位名称");
                        self.isModalLoading = false;
                        return false;
                    }
                }

                if($.trim(self.itemInfo.userPwd).length > 0 && $.trim(self.itemInfo.userPwd).length<=5) {
                    self.$Message.error("密码长度为6为以上字符");
                    self.isModalLoading = false;
                    return false;
                }
                if(!utility.checkPass($.trim(self.itemInfo.userPwd))) {
                    self.$Message.error("密码格式不正确");
                    self.isModalLoading = false;
                    return false;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.saveUser,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "id": self.itemInfo.id, // 员工ID，修改员工信息时必传
                        "userCode": self.itemInfo.userCode, // 用户帐号名
                        "userPwd": self.itemInfo.userPwd, // 用户密码. 说明： 1、	创建时不设置则默认为123456; 2、修改用户时不设置则不修改原有密码
                        "companyId": self.itemInfo.companyId, //所属公司ID，手动从公司列表选择
                        "userSeq": self.itemInfo.userSeq, // 员工工号
                        "userName": encodeURI(self.itemInfo.userName), // 员工姓名
                        "sex": self.itemInfo.sex, // 员工性别
                        "birthday": dateInfo.year + '-' + dateInfo.month + "-" + dateInfo.date, // 员工生日
                        "mobile": self.itemInfo.mobile, // 员工手机号
                        "telephone": self.itemInfo.telephone, // 员工办公电话号
                        "email": self.itemInfo.email, // 员工邮箱
                        "remark": encodeURI(self.itemInfo.remark), // 员工备注
                        "status": self.itemInfo.status, // 员工帐号状态，默认值911表示正常： 911：正常 912：冻结 913：作废                
                        "idNo": self.itemInfo.idNo, // 身份证号
                        "address": encodeURI(self.itemInfo.address), // 员工家庭住址
                        "isCompanyAdmin": self.itemInfo.isCompanyAdmin || 0, // 是否公司管理员
                        "roleIds": self.itemInfo.roleIdList.join(","), // 角色id，可多选，多个间以英文半角分割
                        "deptId": self.itemInfo.deptIds[self.itemInfo.deptIds.length - 1], // 部门id，单选
                        "posiType": self.itemInfo.posiType, // 当deptId不为空时，必填。 员工在部门的职位类型： 141 =正负责人 142=副负责人 143=员工
                        "posiName": encodeURI(self.itemInfo.posiName), // 当deptId不为空时，必填。员工职位名称，默认为员工，可根据岗位设置设定员工的职位名称
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getUserList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 从获取回来的列表中，格式化出显示在表格上的内容
            "formatTableList": function () {
                var self = this;

                for (var i = 0, len = self.userList.length; i < len; i++) {
                    self.tableRowList.push({
                        "userCode": self.userList[i]["userCode"], //"账号",
                        "userName": decodeURI(self.userList[i]["userName"]), //"员工姓名",
                        "userSeq": self.userList[i]["userSeq"], //"员工工号",
                        "mobile": self.userList[i]["mobile"], //"固话",
                        "telephone": self.userList[i]["telephone"], //"手机号",
                        "companyName": decodeURI(self.userList[i]["companyName"]), //"所属公司",
                        "posiName": decodeURI(self.userList[i]["posiName"]), //"所属公司",
                        "roleNames": decodeURI(self.userList[i]["roleNames"]), //"所属公司",
                        "deptName": decodeURI(self.userList[i]["deptName"]), //"所属公司",
                        "posiType": self.posiTypeInfo["_" + self.userList[i]["posiType"]], //"所属公司",
                        "isCompanyAdmin": !!self.userList[i]["isCompanyAdmin"] ? "是" : "否", // 是否公司管理员,
                        "remark": decodeURI(self.userList[i]["remark"]), //"备注",
                        "sex": (function () {
                            var sex = "";
                            for (var s = 0, slen = self.sexTypeList.length; s < slen; s++) {
                                if (self.sexTypeList[s]["type"] == self.userList[i]["sex"]) {
                                    sex = self.sexTypeList[s]["name"];
                                    break;
                                }
                            }
                            return sex
                        }()), //"性别",
                        "state": (function () {
                            var statu = "";
                            for (var s = 0, slen = self.userStatusTypeList.length; s < slen; s++) {
                                if (self.userStatusTypeList[s]["type"] == self.userList[i]["status"]) {
                                    statu = self.userStatusTypeList[s]["name"];
                                    break;
                                }
                            }
                            return statu
                        }()),
                    });
                }
            },
            // 获取用户信息
            "getUserList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                if (bool == true) {
                    self.page.pageNum = 0;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "userCode": encodeURI(self.pageInfo.userCode), // 查询关键字（角色名称）
                        "userName": encodeURI(self.pageInfo.userName), // 查询关键字（用户名称）
                        "companyId": self.pageInfo.companyId, // 公司ID
                        "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length-1],
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
                            self.page.count = data.count;

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
            // 获取角色信息
            "getRoleDataList": function () {
                var self = this;
                // 如果是查询，则重新从第一页开始
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getRoleList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "companyId": self.itemInfo.companyId,
                        "pageNum": 1,
                        "pageSize": 100000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.roleList = data.data;
                            if(self.roleList.length == 0) {
                                for(var i = 0, len = self.companyList.length; i < len; i++) {
                                    if(self.itemInfo.companyId == self.companyList[i]["id"]) {
                                        self.$Message.error(self.companyList[i]["companyName"]+"没有可用角色");
                                        return;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            "getSuper": function (list, value, arr) {
                var self = this;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].value == value) {
                        arr.push(value);
                        if (list[i].paraDeptId == 0) {
                            return;
                        }
                        self.getSuper(self.superiorDepartmentList, list[i].paraDeptId, arr);
                    } else {
                        self.getSuper(list[i]["children"], value, arr);
                    }
                }
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function (list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.superiorDepartmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getSuperiorDeprtList": function (type) {
                var self = this;
                self.superiorDepartmentList = [];
                self.getRoleDataList();
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0,
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
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getUserList(true);
                self.getCompanyList();
                // self.getSuperiorDeprtList("pageInfo");

                self.$watch('pageInfo', function () {
                    self.getUserList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
