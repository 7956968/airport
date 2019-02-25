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
                "deptId": [], // 部门ID
                "deptName": "", // 部门名称
                "gpsDeviceId": "", // 定位终端ID
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleStatus": "", // 车辆运行状态ID：
            },
            "pageInfo": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 0,
                "companyId": "", // 所属公司ID，手动从公司列表选择
                "deptId": [], // 部门ID，可选
                "bindDeviceFlag": "", // 是否绑定定位设备
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
                    "title": { "CN": "绑定终端", "EN": "Terminal", "TW": "綁定終端" }[language["language"]],
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
            "dataList": [],
            "companyList": [],
            "departmentList": [],
            "terminalList": [],
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
                    "deptId": [], // 部门ID
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
                    self.itemInfo.deptId = [self.vehicleList[self.index]["deptId"]];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
             // 查看详情
             "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.vehicleList[self.index];
                    self.itemInfo.deptId = [self.vehicleList[self.index]["deptId"]];
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
                        self.itemInfo = self.vehicleList[self.index];
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
                                        self.getVehicleList(false);
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
                self.pageInfo.pageNum = parseInt(value, 10);
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
                        "deptId": self.itemInfo["deptId"][self.itemInfo["deptId"].length-1], // 部门ID，可选
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
                            self.getVehicleList(false);
                            self.isShowModal = false;
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
                        "companyId": self.vehicleList[i]["companyName"], // 所属公司ID，手动从公司列表选择
                        "deptId": self.vehicleList[i]["deptName"], // 部门ID，可选
                        "vehicleName": decodeURI(self.vehicleList[i]["vehicleName"]), // 车辆名称
                        "vehicleCode": decodeURI(self.vehicleList[i]["vehicleCode"]), // 车辆编码
                        "gpsDeviceId": self.vehicleList[i]["gpsDeviceCode"], // 
                        "vehicleColorId": (function(){
                            var label = "";
                            for(var c = 0, clen = self.vehicleColorList.length; c < clen; c++) {
                                if(self.vehicleList[i]["vehicleColorId"] == self.vehicleColorList[c]["type"]) {
                                    label = self.vehicleColorList[c]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleColorName"], // 
                        "vehicleTypeId": (function(){
                            var label = "";
                            for(var t = 0, tlen = self.vehicleTypeList.length; t < tlen; t++) {
                                if(self.vehicleList[i]["vehicleTypeId"] == self.vehicleTypeList[t]["type"]) {
                                    label = self.vehicleTypeList[t]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleTypeName"], // 
                        "vehicleBrandId": (function(){
                            var label = "";
                            for(var b = 0, blen = self.vehicleBrandList.length; b < blen; b++) {
                                if(self.vehicleList[i]["vehicleBrandId"] == self.vehicleBrandList[b]["type"]) {
                                    label = self.vehicleBrandList[b]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleBrandName"], // 
                        "vehicleStatus": (function(){
                            var label = "";
                            for(var s = 0, slen = self.vehicleStatuList.length; s < slen; s++) {
                                if(self.vehicleList[i]["vehicleStatus"] == self.vehicleStatuList[s]["type"]) {
                                    label = self.vehicleStatuList[s]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleStatusName"], // 
                    });
                }
            },
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.dataList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
                        "pageNum": self.pageInfo.pageNum,
                        "pageSize": self.pageInfo.pageSize,
                        "companyId": self.pageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "vehicleName":self.pageInfo.vehicleName, // 车辆名称
                        "vehicleCode": self.pageInfo.vehicleCode, // 车辆编码
                        "gpsDeviceId": self.pageInfo.gpsDeviceId, // 
                        "vehicleTypeId": self.pageInfo.vehicleTypeId, // 
                        "bindDeviceFlag": self.pageInfo.bindDeviceFlag, // 是否绑定定位设备
                        "vehicleColorId": self.pageInfo.vehicleColorId, // 
                        "vehicleBrandId": self.pageInfo.vehicleBrandId, // 
                        "deptId": self.pageInfo.deptId[self.pageInfo.deptId.length-1], // 部门ID，可选
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
            // 格式化上级部门
            "formatSuperiorDeprt": function(list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.departmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getDepartmentList": function (type) {
                var self = this;
                self.departmentList = [];
                self[type]["deptId"] = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"]||0, // 公司ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.formatSuperiorDeprt(data.data);
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
                self.getDepartmentList("pageInfo");
            }, 500);
        }
    });

}())
