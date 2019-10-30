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
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "vehicleRepairTypeList": bizParam["vehicleRepairType"], // 保养项目
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 车辆保养信息ID
                "vehicleId": "",// 车辆ID
                "companyId": "",// 所属公司ID
                "companyName": "",// 公司名称
                "vehicleName": "",// 车辆名称
                "vehicleCode": "", // 车辆编号
                "remark": "", // 车辆备注
                "vehicleColorId": "",// 车辆颜色ID
                "vehicleTypeId": "",// 车辆类型ID
                "vehicleBrandId": "",// 车辆品牌ID
                "deptId": "",// 部门ID
                "deptName": "",// 部门名称
                "lastMaintainUserId": "",// 本次保养责任人用户id
                "lastMaintainUserName": "",// 本次保养责任人姓名
                "lastMaintainDeptId": "",// 本次保养责任单位ID
                "lastMaintainDeptName": "",// 本次保养责任单位id
                "currMaintainTime": "",// 本次保养时间（列表显示可命名为：上次保养时间）
                "currMiles": "",// 当前里程数，单位公里（列表显示可命名为：上次保养里程数）
                "nextMaintainMiles": "",// 下次计划保养里程数，单位公里
                "maintainRemark": "", // 本次保养项目
                "repairItemIds": []
            },
            "pageInfo": {
                "id": "", // 指定的维护记录ID
                "count": 0,
                "deptId": "", // 部门ID
                "vehicleId": "", // 车辆ID
                "vehicleName": "",// 车辆名称
                "vehicleCode": "",// 车辆编码
                "vehicleColorId": "",// 所属公司ID
                "vehicleTypeId": "",// 车辆颜色ID
                "vehicleBrandId": "",// 车辆类型ID
                "vehicleTypeId": "",// 车辆品牌ID
                "beginRepairTime": "",// 查询开始时间，yyyy-MM-dd
                "endRepairTime": "",// 查询结束时间，yyyy-MM-dd
                "beginMiles": "",// 最小里程数
                "endMiles": "",// 最大里程数
            },
            "page": {
                "pageNum": 1,
                "pageSize": 20,
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center",
                    "title": "序号",
                    // "fixed": "left",
                },
                {
                    "title": { "CN": "车辆编号", "EN": "Vehicle Number", "TW": "車輛编号" }[language["language"]],
                    "key": "vehicleCode",
                    // "width": 160,
                    // "fixed": "left",
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleTypeName",
                    // "width": 160,
                },
                // {
                //     "title": { "CN": "车辆颜色", "EN": "Vehicle Color", "TW": "車輛颜色" }[language["language"]],
                //     "key": "vehicleColorName"
                // },
                // {
                //     "title": { "CN": "车辆品牌", "EN": "Vehicle Brand", "TW": "車輛品牌" }[language["language"]],
                //     "key": "vehicleBrandName"
                // },
                {
                    "title": { "CN": "本次保养日期", "EN": "This Maintenance Date", "TW": "本次保養日期" }[language["language"]],
                    "key": "currMaintainTime",
                    "align": "center",
                    // "width": 160,
                },
                {
                    "title": { "CN": "保养项目", "EN": "Maintenance Projects", "TW": "保養項目" }[language["language"]],
                    "key": "maintainRemark",
                    // "width": 160,
                },
                {
                    "title": { "CN": "保养单位", "EN": "Maintenance Company", "TW": "保養單位" }[language["language"]],
                    "key": "lastMaintainDeptName",
                    // "width": 200,
                },
                // {
                //     "title": { "CN": "保养责任人", "EN": "Maintenance Responsible Person", "TW": "保養責任人" }[language["language"]],
                //     "key": "lastMaintainUserName",
                //     "width": 200,
                // },
                {
                    "title": { "CN": "当前里程数(公里)", "EN": "Current Mileage", "TW": "當前里程數" }[language["language"]],
                    "key": "currMiles",
                    "align": "center",
                    // "width": 160,
                },
                {
                    "title": { "CN": "下次保养里程(公里)", "EN": "Number Of Miles Next Maintained", "TW": "下次保養里程" }[language["language"]],
                    "key": "nextMaintainMiles",
                    "align": "center",
                    // "width": 160,
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 180,
                    "align": "center",
                    // "fixed": "right",
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
            "dataList": [],
            "maintenanceList": [],
            "vehicleList": [],
            "departmentList": [],
            "userList": []
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
                    "id": "", // 车辆保养信息ID
                    "vehicleId": "",// 车辆ID
                    "companyId": "",// 所属公司ID
                    "companyName": "",// 公司名称
                    "vehicleName": "",// 车辆名称
                    "vehicleCode": "", // 车辆编号
                    "remark": "", // 车辆备注
                    "vehicleColorId": "",// 车辆颜色ID
                    "vehicleTypeId": "",// 车辆类型ID
                    "vehicleBrandId": "",// 车辆品牌ID
                    "deptId": "",// 部门ID
                    "deptName": "",// 部门名称
                    "lastMaintainUserId": "",// 本次保养责任人用户id
                    "lastMaintainUserName": "",// 本次保养责任人姓名
                    "lastMaintainDeptId": "",// 本次保养责任单位ID
                    "lastMaintainDeptName": "",// 本次保养责任单位id
                    "currMaintainTime": "",// 本次保养时间（列表显示可命名为：上次保养时间）
                    "currMiles": "",// 当前里程数，单位公里（列表显示可命名为：上次保养里程数）
                    "nextMaintainMiles": "",// 下次计划保养里程数，单位公里
                    "maintainRemark": "", // 本次保养项目
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.maintenanceList[self.index]));
                    self.itemInfo.repairItemIds = (function () {
                        var arr = [];
                        var ids = self.itemInfo.repairItemIds.split(",");
                        for (var i = 0, len = ids.length; i < len; i++) {
                            arr.push(parseInt(ids[i]));
                        }
                        return arr;
                    }());
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.maintenanceList[self.index]));
                    self.itemInfo.currMaintainTimeName = self.itemInfo.currMaintainTime.split("T")[0];
                    self.itemInfo.repairItemIdName = (function () {
                        var arr = [];
                        var ids = self.maintenanceList[self.index].repairItemIds.split(",");
                        for (var e = 0, elen = ids.length; e < elen; e++) {
                            for (var r = 0, rlen = self.vehicleRepairTypeList.length; r < rlen; r++) {
                                if (parseInt(ids[e]) == self.vehicleRepairTypeList[r]["type"]) {
                                    arr.push(self.vehicleRepairTypeList[r]["name"]);
                                }
                            }
                        }
                        return arr.join(",");
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
                    "onOk": function () {
                        self.itemInfo = self.maintenanceList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.vehicleRepairService + "?action=" + CONFIG.ACTION.delVehicleRepairInfo + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.vehicleRepairService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getmaintenanceList(true);
                                    } else {
                                        self.$Message.error(data.message);
                                    }
                                }
                            });
                        });
                    }
                });

            },
            // 时间变化
            "beginRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.beginRepairTime = value;
            },
            "endRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.endRepairTime = value;
            },
            "currMaintainTime": function (value, item) {
                var self = this;
                self.itemInfo.currMaintainTime = value;
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getmaintenanceList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getmaintenanceList(false);
                }, 200);
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (item, index) {
                var self = this;
                self.index = index;
                self.selectItem = item;
            },
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleRepairService + "?action=" + CONFIG.ACTION.saveVehicleRepairInfo,
                    actionUrl: CONFIG.SERVICE.vehicleRepairService,
                    dataObj: {
                        "id": self.itemInfo.id, // 车辆保养信息ID
                        "vehicleId": self.itemInfo.vehicleId,// 车辆ID
                        "lastMaintainUserId": self.itemInfo.lastMaintainUserId,// 本次保养责任人用户id
                        "lastMaintainUserName": (function () {
                            var name = encodeURI(self.itemInfo.lastMaintainUserName);
                            if (self.itemInfo.lastMaintainUserId != "") {
                                for (var i = 0, len = self.userList.length; i < len; i++) {
                                    if (self.itemInfo.lastMaintainUserId == self.userList[i]["id"]) {
                                        name = encodeURI(self.userList[i]["userName"]);
                                    }
                                }
                            }
                            return name;
                        }()),// 本次保养责任人姓名
                        "lastMaintainDeptId": self.itemInfo.lastMaintainDeptId,// 本次保养责任单位ID
                        "lastMaintainDeptName": (function () {
                            var name = encodeURI(self.itemInfo.lastMaintainDeptName);
                            if (self.itemInfo.lastMaintainDeptId != "") {
                                for (var i = 0, len = self.departmentList.length; i < len; i++) {
                                    if (self.itemInfo.lastMaintainDeptId == self.departmentList[i]["id"]) {
                                        name = encodeURI(self.departmentList[i]["deptName"]);
                                    }
                                }
                            }
                            return name;
                        }()),// 本次保养责任单位名称
                        "currMaintainTime": self.itemInfo.currMaintainTime,// 本次保养时间（列表显示可命名为：上次保养时间）
                        "currMiles": self.itemInfo.currMiles,// 当前里程数，单位公里（列表显示可命名为：上次保养里程数）
                        "nextMaintainMiles": self.itemInfo.nextMaintainMiles,// 下次计划保养里程数，单位公里
                        "maintainRemark": encodeURI(self.itemInfo.maintainRemark), // 本次保养项目
                        "repairItemIds": self.itemInfo.repairItemIds.join(","), // 本次保养项目
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传  
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getmaintenanceList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化保养信息
            "formatMaintenanceData": function () {
                var self = this;
                for (var i = 0, len = self.maintenanceList.length; i < len; i++) {
                    self.dataList.push({
                        "id": self.maintenanceList[i]["id"], // 车辆保养信息ID
                        "vehicleId": self.maintenanceList[i]["vehicleId"],// 车辆ID
                        "companyId": self.maintenanceList[i]["companyId"],// 所属公司ID
                        "companyName": decodeURI(self.maintenanceList[i]["companyName"]),// 公司名称
                        "vehicleName": decodeURI(self.maintenanceList[i]["vehicleName"]),// 车辆名称
                        "vehicleCode": decodeURI(self.maintenanceList[i]["vehicleCode"]), // 车辆编号
                        "maintainRemark": (function () {
                            var arr = [];
                            var ids = self.maintenanceList[i].repairItemIds.split(",");

                            for (var e = 0, elen = ids.length; e < elen; e++) {
                                for (var r = 0, rlen = self.vehicleRepairTypeList.length; r < rlen; r++) {
                                    if (parseInt(ids[e]) == self.vehicleRepairTypeList[r]["type"]) {
                                        arr.push(self.vehicleRepairTypeList[r]["name"]);
                                    }
                                }
                            }
                            return arr.join(",");
                        }()), // 车辆备注
                        "vehicleColorId": self.maintenanceList[i]["vehicleColorId"],// 车辆颜色ID
                        "vehicleColorName": self.maintenanceList[i]["vehicleColorName"],// 车辆颜色ID
                        "vehicleTypeId": self.maintenanceList[i]["vehicleTypeId"],// 车辆类型ID
                        "vehicleTypeName": self.maintenanceList[i]["vehicleTypeName"],// 车辆类型ID
                        "vehicleBrandId": self.maintenanceList[i]["vehicleBrandId"],// 车辆品牌ID
                        "vehicleBrandName": self.maintenanceList[i]["vehicleBrandName"],// 车辆品牌ID
                        "deptId": self.maintenanceList[i]["deptId"],// 部门ID
                        "deptName": decodeURI(self.maintenanceList[i]["deptName"]),// 部门名称
                        "lastMaintainUserId": self.maintenanceList[i]["lastMaintainUserId"],// 本次保养责任人用户id
                        "lastMaintainUserName": decodeURI(self.maintenanceList[i]["lastMaintainUserName"]),// 本次保养责任人姓名
                        "lastMaintainDeptId": self.maintenanceList[i]["lastMaintainDeptId"],// 本次保养责任单位ID
                        "lastMaintainDeptName": decodeURI(self.maintenanceList[i]["lastMaintainDeptName"]),// 本次保养责任单位id
                        "currMaintainTime": self.maintenanceList[i]["currMaintainTime"],// 本次保养时间（列表显示可命名为：上次保养时间）
                        "currMiles": self.maintenanceList[i]["currMiles"],// 当前里程数，单位公里（列表显示可命名为：上次保养里程数）
                        "nextMaintainMiles": self.maintenanceList[i]["nextMaintainMiles"],// 下次计划保养里程数，单位公里
                        // "maintainRemark": decodeURI(self.maintenanceList[i]["maintainRemark"]), // 本次保养项目
                    });
                }
            },
            // 获取保养信息
            "getmaintenanceList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.dataList = [];
                if (bool == true) {
                    self.page.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleRepairService + "?action=" + CONFIG.ACTION.getVehicleRepairList,
                    actionUrl: CONFIG.SERVICE.vehicleRepairService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "vehicleId": self.pageInfo.vehicleId, // 车辆ID
                        "vehicleName": self.pageInfo.vehicleName,// 车辆名称
                        "vehicleCode": self.pageInfo.vehicleCode,// 车辆编码
                        "vehicleColorId": self.pageInfo.vehicleColorId,// 所属公司ID
                        "vehicleTypeId": self.pageInfo.vehicleTypeId,// 车辆颜色ID
                        "vehicleBrandId": self.pageInfo.vehicleBrandId,// 车辆类型ID
                        "vehicleTypeId": self.pageInfo.vehicleTypeId,// 车辆品牌ID
                        "beginRepairTime": self.pageInfo.beginRepairTime,// 查询开始时间，yyyy-MM-dd
                        "endRepairTime": self.pageInfo.endRepairTime,// 查询结束时间，yyyy-MM-dd
                        "beginMiles": self.pageInfo.beginMiles,// 最小里程数
                        "endMiles": self.pageInfo.endMiles,// 最大里程数
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.maintenanceList = data.data;
                            self.pageInfo.count = data.count;
                            self.formatMaintenanceData();
                        }
                    }
                });
            },
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "id": 0,
                        "pageSize": 10000,
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data;
                        }
                    }
                });
            },
            // 获取部门信息
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
            },

        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getmaintenanceList(true);
                self.getVehicleList();
                self.getDepartmentList();
                self.getUserList();

                self.$watch('pageInfo', function () {
                    self.getmaintenanceList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
