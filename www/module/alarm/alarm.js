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
                "companyId": "", // 公司ID
                "deptIds": [], // 部门ID
                "eventTypeId": "",
                "dealFlag": "",
                "vehicleName": "",
                "beginTime": "",
                "endTime": ""
            },
            "page": {
                "pageSize": 20,
                "pageNum": 1,
            },
            "index": 0,
            "selectItem": "",
            "itemInfo": {
                "id": "",
                "dealFlag": "", // 报警信息处理状态
                "remark": "", //报警信息处理描述，需对中文进行url编码
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [
                {
                    "title": { "CN": "公司名称", "EN": "Company name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName",
                    "width": 200
                },
                {
                    "title": { "CN": "部门名称", "EN": "Department Name", "TW": "部門名稱" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "报警类型", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "alarmTypeDesc"
                },
                {
                    "title": { "CN": "处理状态", "EN": "Job Title", "TW": "職位名稱" }[language["language"]],
                    "key": "dealDesc"
                },
                {
                    "title": { "CN": "警报事件", "EN": "Job Title", "TW": "職位名稱" }[language["language"]],
                    "key": "eventTypeDesc"
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Job Type", "TW": "職位類型" }[language["language"]],
                    "key": "vehicleName",
                    "width": 150
                },
                {
                    "title": { "CN": "报警时间", "EN": "Job Type", "TW": "職位類型" }[language["language"]],
                    "key": "alarmTime",
                    "width": 130
                },
                {
                    "title": { "CN": "报警内容", "EN": "Job Type", "TW": "職位類型" }[language["language"]],
                    "key": "alarmInfo",
                    "width": 180
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
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
                        ]);
                    }
                }
            ],
            "userList": [],
            "companyList": [],
            "tableRowList": [],
            "alarmList": [],
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
                    "remark": "",
                    "dealFlag": "",
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.alarmList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.alarmList[self.index]));
                    self.isShowDetail = true;
                });
            },
           
            // 时间变化
            "beginRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.beginTime = value;
            },
            "endRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.endTime = value;
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
                    url: CONFIG.HOST + CONFIG.SERVICE.alarmService + "?action=" + CONFIG.ACTION.updateAlarmStatus,
                    actionUrl: CONFIG.SERVICE.alarmService,
                    dataObj: {
                        "id": self.itemInfo.id, // ID 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        "dealFlag": self.itemInfo.dealFlag,
                        "remark": encodeURI(self.itemInfo.remark),
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getAlarmList(true);
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
                    self.getAlarmList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getAlarmList(false);
                }, 200);
            },

            // 获取机构用户信息
            "getAlarmList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                if (bool == true) {
                    self.page.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.alarmService + "?action=" + CONFIG.ACTION.getAlarmList,
                    actionUrl: CONFIG.SERVICE.alarmService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "alarmTypeId": self.pageInfo.alarmTypeId,
                        "eventTypeId": self.pageInfo.eventTypeId,
                        "dealFlag": self.pageInfo.dealFlag,
                        "vehicleName": encodeURI(self.pageInfo.vehicleName),
                        "beginTime": self.pageInfo.beginTime,
                        "endTime": self.pageInfo.endTime,
                        "companyId": self.pageInfo.companyId, // 公司ID
                        "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length - 1] || 0, // 部门ID
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.alarmList = data.data;
                            self.pageInfo.count = data.count;

                            // 格式化表格数据
                            // self.formatTableList();

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
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.userList = data.data;
                            !!callback && callback();
                        }
                    }
                });
            },
            // 当选择公司时，动态选择部门用户
            "getDepartAndUser": function () {
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
                self.getAlarmList(true);
                self.getCompanyList();
                // self.getSuperiorDeprtList("pageInfo");

                self.$watch('pageInfo', function () {
                    self.getAlarmList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
