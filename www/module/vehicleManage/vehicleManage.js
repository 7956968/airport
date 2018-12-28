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
            "isShowTerminal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "vehicleStatuList": bizParam["terminalStatus"], // 车辆状态
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 车辆ID
                "companyId": "", // 所属公司ID
                "companyName": "", // 公司名称
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编号
                "remark": "", // 车辆备注
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleTypeId": "", // 车辆类型ID
                "vehicleBrandId": "", // 车辆品牌ID
                "deptId": "", // 部门ID
                "deptName": "", // 部门名称
                "gpsDeviceId": "", // 定位终端ID
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleStatus": "", // 车辆运行状态ID：
            },
            "pageInfo": {
                "count": 0,
                "pageSize": 15,
                "pageNum": 0,
                "id": "", // 车辆ID
                "companyId": "", // 所属公司ID，手动从公司列表选择
                "deptId": "", // 部门ID，可选
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "gpsDeviceId": "", // 
                "vehicleColorId": "", // 
                "vehicleTypeId": "", // 
                "vehicleBrandId": "", // 
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
            },
            "vehicleList": [],
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyId"
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "deptId"
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "车辆编码", "EN": "Vehicle Name", "TW": "車輛編碼" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "vehicleStatus"
                },
                {
                    "title": { "CN": "终端设备", "EN": "Terminal", "TW": "終端設備" }[language["language"]],
                    "key": "gpsDeviceId"
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleTypeId"
                },
                {
                    "title": { "CN": "车辆颜色", "EN": "Vehicle Color", "TW": "車輛顔色" }[language["language"]],
                    "key": "vehicleColorId"
                },
                {
                    "title": { "CN": "品牌", "EN": "Brand", "TW": "品牌" }[language["language"]],
                    "key": "vehicleBrandId"
                }
            ],
            "dataList": [],
            "companyList": [],
            "departmentList": [],
            "terminalList": [],
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
                    "id": "", // 车辆ID
                    "companyId": "", // 所属公司ID
                    "companyName": "", // 公司名称
                    "vehicleName": "", // 车辆名称
                    "vehicleCode": "", // 车辆编号
                    "remark": "", // 车辆备注
                    "vehicleColorId": "", // 车辆颜色ID
                    "vehicleTypeId": "", // 车辆类型ID
                    "vehicleBrandId": "", // 车辆品牌ID
                    "deptId": "", // 部门ID
                    "deptName": "", // 部门名称
                    "gpsDeviceId": "", // 定位终端ID
                    "gpsDeviceCode": "", // 定位终端编号
                    "vehicleStatus": "", // 车辆运行状态ID：
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.vehicleList[self.index];
                    console.log(self.itemInfo);
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.itemInfo = self.vehicleList[self.index];
                // 先判断是否选择了一家公司
                utility.showMessageTip(self, function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.delVehicle + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                        actionUrl: CONFIG.SERVICE.vehicleService,
                        beforeSendCallback: function () {
                            self.isTableLoading = true;
                        },
                        completeCallback: function () {
                            self.isTableLoading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getVehicleList(true);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                });
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.pageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
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
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.saveVehicle,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "id": self.itemInfo["id"], // 车辆ID
                        "companyId": self.itemInfo["companyId"], // 所属公司ID，手动从公司列表选择
                        "deptId": self.itemInfo["deptName"], // 部门ID，可选
                        "vehicleName": encodeURI(self.itemInfo["vehicleName"]), // 车辆名称
                        "vehicleCode": encodeURI(self.itemInfo["vehicleCode"]), // 车辆编码
                        "gpsDeviceId": self.itemInfo["gpsDeviceId"], // 
                        "vehicleColorId": self.itemInfo["vehicleColorId"], // 
                        "vehicleTypeId": self.itemInfo["vehicleTypeId"], // 
                        "vehicleBrandId": self.itemInfo["vehicleBrandId"], // 
                        "remark": encodeURI(self.itemInfo["remark"]), // 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getVehicleList(true);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化车辆信息
            "formatVehicle": function () {
                var self = this;
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    self.dataList.push({
                        "companyId": self.vehicleList[i]["companyId"], // 所属公司ID，手动从公司列表选择
                        "deptId": self.vehicleList[i]["deptId"], // 部门ID，可选
                        "vehicleName": decodeURI(self.vehicleList[i]["vehicleName"]), // 车辆名称
                        "vehicleCode": decodeURI(self.vehicleList[i]["vehicleCode"]), // 车辆编码
                        "gpsDeviceId": (function () {
                            // var value = "";
                            // for(var d = 0, dlen = ) {

                            // }
                            return "";
                        }()), //self.vehicleList[i]["gpsDeviceId"], // 
                        "vehicleColorId": (function () {
                            var value = "";
                            for (var d = 0, dlen = self.vehicleColorList.length; d < dlen; d++) {
                                if (self.vehicleColorList[d]["type"] == self.vehicleList[i]["vehicleColorId"]) {
                                    value = self.vehicleColorList[d]["name"];
                                    break;
                                }
                            }
                            return value;
                        }()), //self.vehicleList[i]["vehicleColorId"], // 
                        "vehicleTypeId": (function () {
                            var value = "";
                            for (var d = 0, dlen = self.vehicleTypeList.length; d < dlen; d++) {
                                if (self.vehicleTypeList[d]["type"] == self.vehicleList[i]["vehicleTypeId"]) {
                                    value = self.vehicleTypeList[d]["name"];
                                    break;
                                }
                            }
                            return value;
                        }()), //self.vehicleList[i]["vehicleTypeId"], // 
                        "vehicleBrandId": (function () {
                            var value = "";
                            for (var d = 0, dlen = self.vehicleBrandList.length; d < dlen; d++) {
                                if (self.vehicleBrandList[d]["type"] == self.vehicleList[i]["vehicleBrandId"]) {
                                    value = self.vehicleBrandList[d]["name"];
                                    break;
                                }
                            }
                            return value;
                        }()), //self.vehicleList[i]["vehicleBrandId"], // 
                        "vehicleStatus": (function () {
                            var value = "";
                            for (var d = 0, dlen = self.vehicleStatuList.length; d < dlen; d++) {
                                if (self.vehicleStatuList[d]["type"] == self.vehicleList[i]["vehicleStatus"]) {
                                    value = self.vehicleStatuList[d]["name"];
                                    break;
                                }
                            }
                            return value;
                        }()), //self.vehicleList[i]["vehicleStatus"], // 
                    });
                }
            },
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.dataList = [];
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data;
                            self.pageInfo.count = data.count;
                            self.formatVehicle();
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
            // 获取终端设备列表
            "getTerminalList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.getDeviceList,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.terminalList = data.data;
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
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getVehicleList(true);
                self.getCompanyList();
                self.getTerminalList();
                self.getDepartmentList();
            }, 500);
        }
    });

}())
