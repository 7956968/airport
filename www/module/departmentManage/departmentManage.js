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
                "deptName": "", // 查询关键字（部门名称）
                "companyId": "", // 公司ID
                "paraDeptId": "", // 上级部门ID
                "paraDeptIds": [], // 上级部门ID
            },
            "page": {
                "pageSize": 20,
                "pageNum": 0,
            },
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 部门ID，修改部门信息时必传 
                "deptName": "", // 部门名称
                "companyId": "", // 所属公司ID，手动从公司列表选择
                "paraDeptId": "", // 上级部门ID
                "paraDeptIds": [], // 上级部门ID
                "paraDeptName": "", // 上级部门名称
                "deptLevel": "", // 部门层级，从小到大
                "orderNum": "", // 部门排序号
                "leaderUserId": "", // 部门负责人用户id
                "leaderUserName": "", // 部门负责人用户姓名
                "deptShortName": "", // 部门简称
                "deptTypeId": "", // 部门性质类型id
                "deptTypeName": "", // 部门性质名称
                "deptTel": "", // 部门电话
                "deptEmail": "", // 部门邮箱
                "deptFax": "", // 部门传真
                "deptRemark": "", // 部门备注
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                // "deptCode": "", // 部门编码，不需传入，系统自动生成
            },
            "columnsList": [
                {
                    "title": { "CN": "公司名称", "EN": "Company name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName",
                    "width": 180
                },
                {
                    "title": { "CN": "部门名称", "EN": "Department Name", "TW": "部門名稱" }[language["language"]],
                    "key": "deptName",
                    "width": 180
                },
                {
                    "title": "上级部门",
                    "key": "paraDeptName"
                },
                // {
                //     "title": { "CN": "部门简称", "EN": "Department Abbreviation", "TW": "部門簡稱" }[language["language"]],
                //     "key": "deptShortName",
                //     "width": 120
                // },
                // {
                //     "title": { "CN": "部门性质", "EN": "Department Nature", "TW": "部門性質" }[language["language"]],
                //     "key": "deptTypeName"
                // },
                {
                    "title": { "CN": "负责人", "EN": "Head", "TW": "負責人" }[language["language"]],
                    "key": "leaderUserName"
                },
                {
                    "title": { "CN": "电话", "EN": "Telephone", "TW": "電話" }[language["language"]],
                    "key": "deptTel"
                },
                {
                    "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                    "key": "deptRemark"
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "align": "center",
                    "width": 160,
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
            "departmentTypeList": bizParam["departmentType"],
            "departmentList": [],
            "superiorDepartmentList": [],
            "userList": [],
            "companyList": [],
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
            "addItem": function () {
                var self = this;
                self.isShowModal = true;
                self.isModalLoading = true;
                self.modalTitle = { "CN": "新增", "EN": "Add", "TW": "新增" }[self.language];
                self.itemInfo = {
                    "id": "", // 部门ID，修改部门信息时必传 
                    "deptName": "", // 部门名称
                    "companyId": "", // 所属公司ID，手动从公司列表选择
                    "paraDeptId": "", // 上级部门ID
                    "paraDeptIds": [], // 上级部门ID
                    "paraDeptName": "", // 上级部门名称
                    "deptLevel": "", // 部门层级，从小到大
                    "orderNum": "", // 部门排序号
                    "leaderUserId": "", // 部门负责人用户id
                    "leaderUserName": "", // 部门负责人用户姓名
                    "deptShortName": "", // 部门简称
                    "deptTypeId": "", // 部门性质类型id
                    "deptTypeName": "", // 部门性质名称
                    "deptTel": "", // 部门电话
                    "deptEmail": "", // 部门邮箱
                    "deptFax": "", // 部门传真
                    "deptRemark": "", // 部门备注
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    // "deptCode": "", // 部门编码，不需传入，系统自动生成
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.departmentList[self.index];
                    self.itemInfo.paraDeptIds = [];
                    self.itemInfo.deptName = decodeURI(self.itemInfo.deptName);
                    self.itemInfo.deptShortName = decodeURI(self.itemInfo.deptShortName);
                    self.itemInfo.leaderUserName = decodeURI(self.itemInfo.leaderUserName);
                    self.itemInfo.paraDeptName = decodeURI(self.itemInfo.paraDeptName);
                    self.itemInfo.deptShortName = decodeURI(self.itemInfo.deptShortName);
                    self.itemInfo.deptRemark = decodeURI(self.itemInfo.deptRemark);
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];

                    self.getSuperiorDepartmentList();
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.departmentList[self.index];
                    self.itemInfo.deptName = decodeURI(self.itemInfo.deptName);
                    self.itemInfo.deptShortName = decodeURI(self.itemInfo.deptShortName);
                    self.itemInfo.leaderUserName = decodeURI(self.itemInfo.leaderUserName);
                    self.itemInfo.paraDeptName = decodeURI(self.itemInfo.paraDeptName);
                    self.itemInfo.deptShortName = decodeURI(self.itemInfo.deptShortName);
                    self.itemInfo.deptRemark = decodeURI(self.itemInfo.deptRemark);
                    self.itemInfo.deptTypeName = (function () {
                        var deptTypeName = "";
                        for (var s = 0, slen = self.departmentTypeList.length; s < slen; s++) {
                            if (self.departmentTypeList[s]["type"] == self.itemInfo["deptTypeId"]) {
                                deptTypeName = self.departmentTypeList[s]["name"];
                                break;
                            }
                        }
                        return deptTypeName
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
                        self.itemInfo = self.departmentList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.delDept + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.deptService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getDepartmentDataList(true);
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
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.saveDept,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        "id": self.itemInfo.id, // 部门ID，修改部门信息时必传 
                        "deptName": encodeURI(self.itemInfo.deptName), // 部门名称
                        "companyId": self.itemInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "paraDeptId": self.itemInfo.paraDeptIds[self.itemInfo.paraDeptIds.length-1], // 上级部门ID
                        "paraDeptName": encodeURI(self.itemInfo.paraDeptName), // 上级部门名称
                        "deptLevel": self.itemInfo.deptLevel, // 部门层级，从小到大
                        "deptCode": self.itemInfo.deptCode, // 部门排序号
                        "leaderUserId": self.itemInfo.leaderUserId, // 部门负责人用户id
                        "leaderUserName": encodeURI(self.itemInfo.leaderUserName), // 部门负责人用户姓名
                        "deptShortName": encodeURI(self.itemInfo.deptShortName), // 部门简称
                        "deptTypeId": self.itemInfo.deptTypeId, // 部门性质类型id
                        "deptTypeName": encodeURI(self.itemInfo.deptTypeName), // 部门性质名称
                        "deptTel": self.itemInfo.deptTel, // 部门电话
                        "deptEmail": self.itemInfo.deptEmail, // 部门邮箱
                        "deptFax": self.itemInfo.deptFax, // 部门传真
                        "deptRemark": encodeURI(self.itemInfo.deptRemark), // 部门备注
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getDepartmentDataList(true);
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
                    self.getDepartmentDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getDepartmentDataList(false);
                }, 200);
            },
            // 当选择的负责人改变时
            "userChange": function () {
                var self = this;
                for (var i = 0, len = self.userList.length; i < len; i++) {
                    if (self.userList[i]["id"] == self.itemInfo.leaderUserId) {
                        self.itemInfo.leaderUserName = self.userList[i]["modifyUserName"];
                        break;
                    }
                }
            },
            // 从获取回来的列表中，格式化出显示在表格上的内容
            "formatTableList": function () {
                var self = this;

                for (var i = 0, len = self.departmentList.length; i < len; i++) {
                    self.tableRowList.push({
                        "companyName": decodeURI(self.departmentList[i]["companyName"]), //"部门名称",
                        "deptName": decodeURI(self.departmentList[i]["deptName"]), //"部门名称",
                        "deptCode": self.departmentList[i]["deptCode"], //"部门编号",
                        "deptShortName": decodeURI(self.departmentList[i]["deptShortName"]), //"部门简称",
                        "paraDeptName": decodeURI(self.departmentList[i]["paraDeptName"]), //"部门简称",
                        "deptTypeName": decodeURI(self.departmentList[i]["deptTypeName"]), //"部门性质",
                        "leaderUserName": decodeURI(self.departmentList[i]["leaderUserName"]), //"负责人",
                        "deptTel": self.departmentList[i]["deptTel"], //"电话",
                        "extension": self.departmentList[i]["extension"], //"分机号",
                        "deptRemark": decodeURI(self.departmentList[i]["deptRemark"]), //"备注",
                    });
                }
            },
            // 获取机构信息
            "getDepartmentDataList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.tableRowList = [];
                    self.page.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "deptName": encodeURI(self.pageInfo.deptName), // 查询关键字（部门名称）
                        "companyId": self.pageInfo.companyId, // 公司ID
                        "paraDeptId": self.pageInfo.paraDeptId, // 上级部门ID
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
                            self.pageInfo.count = data.count;

                            // 格式化表格数据
                            self.formatTableList();
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
            // 获取机构信息
            "getSuperiorDepartmentList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 10000,
                        "companyId": self.itemInfo.companyId, // 公司ID
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        var arr = [];
                        if (data.code == 200) {
                            self.superiorDepartmentList = [];
                            self.itemInfo.paraDeptIds = [];
                            self.formatSuperiorDeprt(data.data);
                            self.getSuper(self.superiorDepartmentList, self.itemInfo.paraDeptId, arr);
                            self.itemInfo.paraDeptIds = arr.reverse();
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
            // 获取用户信息
            "getUserDataList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.getUserList,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        companyId: self.itemInfo.paraCompanyId,
                        pageNum: 1,
                        pageSize: 1000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.userList = data.data;
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
                self.getDepartmentDataList(true); // 获取部门列表
                self.getCompanyList();
                self.$watch('pageInfo', function () {
                    self.getDepartmentDataList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
