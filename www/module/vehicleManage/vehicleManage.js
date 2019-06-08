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
            "isDelete": false,
            "modalTitle": "",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "vehicleStatuList": bizParam["terminalStatus"], // 车辆运动状态
            "vehicleUseStatusList": bizParam["vehicleUseStatus"], // 车辆使用状态
            "deviceProviderIdList": bizParam["deviceProviderId"], // 定位设备供应商
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 车辆ID
                "companyId": "", // 所属公司ID
                "companyName": "", // 公司名称
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编号
                "useStatus": "", // 使用状态
                "remark": "", // 车辆备注
                "providerId": "", // 设备供应商ID
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleTypeId": "", // 车辆类型ID
                "vehicleBrandId": "", // 车辆品牌ID
                "deptId": "", // 部门ID
                "deptIds": [], // 部门ID
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
                "deptId": "", // 部门ID，可选
                "deptIds": [], // 部门ID，可选
                "bindDeviceFlag": "", // 是否绑定定位设备
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "licenseNumber": "", // 车牌号
                "vehicleStatus": "", // 车辆运行状态
                "useStatus": "-1", // 使用状态
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
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyId",
                    "fixed": "left",
                    "sortable": true,
                    "sortType": "asc",
                    "width": 150
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "deptId",
                    "sortable": true,
                    "sortType": "asc",
                    "width": 200
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName",
                    "width": 150
                },
                {
                    "title": { "CN": "车牌号", "EN": "Plate No.", "TW": "車牌號" }[language["language"]],
                    "key": "licenseNumber",
                    "width": 140
                },
                {
                    "title": { "CN": "运动状态", "EN": "Move State", "TW": "運動狀態" }[language["language"]],
                    "key": "vehicleStatus",
                    "width": 240,
                    "render": function (h, params) {
                        var liveButton = null;
                        var backButton = null;

                        if (pageVue.vehicleList[params.index]['licenseNumber'] && pageVue.vehicleList[params.index]['providerId'] < 100) {
                            if (pageVue.vehicleList[params.index]['vehicleStatus'] == 401 || pageVue.vehicleList[params.index]['vehicleStatus'] == 402) {
                                liveButton = h("Button", {
                                    "props": {
                                        "type": "primary",
                                        "size": "small",
                                    },
                                    "style": {
                                        "marginLeft": '5px'
                                    },
                                    "on": {
                                        "click": function () {
                                            pageVue.showLiveVideo(pageVue.vehicleList[params.index], 0)
                                        }
                                    }
                                }, "实时监控");

                                if(pageVue.vehicleList[params.index]["providerId"] == 2) {
                                    backButton = h("Button", {
                                        "props": {
                                            "type": "default",
                                            "size": "small",
                                            "disabled": true,
                                        },
                                        "class": "disabled",
                                        "style": {
                                            "marginLeft": '5px'
                                        },
                                    }, "视频回放");
                                } else {
                                    backButton = h("Button", {
                                        "props": {
                                            "size": "small",
                                        },
                                        "class": "backPlay",
                                        "style": {
                                            "marginLeft": '5px'
                                        },
                                        "on": {
                                            "click": function () {
                                                pageVue.showLiveVideo(pageVue.vehicleList[params.index], 1)
                                            }
                                        }
                                    }, "视频回放");
                                }
                            } else {
                                liveButton = h("Button", {
                                    "props": {
                                        "type": "default",
                                        "size": "small",
                                        "disabled": true,
                                    },
                                    "class": "disabled",
                                    "style": {
                                        "marginLeft": '5px'
                                    },
                                }, "实时监控");

                                backButton = h("Button", {
                                    "props": {
                                        "type": "default",
                                        "size": "small",
                                        "disabled": true,
                                    },
                                    "class": "disabled",
                                    "style": {
                                        "marginLeft": '5px'
                                    },
                                }, "视频回放");
                            }
                        }
                        return h("div", [
                            h("span", {
                                "props": {
                                    "type": "warning",
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                            }, params.row.vehicleStatus),
                            liveButton,
                            backButton
                        ]);
                    }
                },
                {
                    "title": { "CN": "使用状态", "EN": "User State", "TW": "使用狀態" }[language["language"]],
                    "width": 100,
                    "render": function (h, params) {
                        var text = "";
                        if (pageVue.vehicleList[params.index]['providerId'] >= 100) {
                            text = pageVue.vehicleList[params.index]['useStatusName'];
                        } else {
                            text = "----";
                        }

                        return h("div", [
                            h("span", {
                            }, text)
                        ]);
                    }
                },
                {
                    "title": { "CN": "车辆编码", "EN": "Vehicle Code", "TW": "車輛編碼" }[language["language"]],
                    "key": "vehicleCode",
                    "width": 150
                },
                {
                    "title": { "CN": "绑定终端", "EN": "Terminal", "TW": "綁定終端" }[language["language"]],
                    "key": "gpsDeviceId",
                    "width": 250
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleTypeId",
                    "width": 120
                },
                {
                    "title": { "CN": "车辆颜色", "EN": "Vehicle Color", "TW": "車輛顔色" }[language["language"]],
                    "key": "vehicleColorId",
                    "width": 120
                },
                {
                    "title": { "CN": "品牌", "EN": "Brand", "TW": "品牌" }[language["language"]],
                    "key": "vehicleBrandId",
                    "width": 120
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "fixed": "right",
                    "width": 150,
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
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
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.index = params.index;
                                        pageVue.selectItem = params.row;
                                        pageVue.itemInfo = pageVue.vehicleList[pageVue.index];
                                        pageVue.isDelete = true;
                                    }
                                }
                            }, { "CN": "删除", "EN": "Delete", "TW": "刪除" }[language["language"]]),
                        ]);
                    }
                }
            ],
            "dataList": [],
            "companyList": [],
            "departmentList": [],
            "terminalList": [],
            "isRecord": false,
            "recordIndex": 0,
            "recordPageInfo": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 0,
                "vehicleId": "",
            },
            "userRecordcolumns": [
                {
                    "title": { "CN": "运动状态", "EN": "Move State", "TW": "運動狀態" }[language["language"]],
                    "key": "vehicleStatusName",
                },
                {
                    "title": { "CN": "使用状态", "EN": "User State", "TW": "使用狀態" }[language["language"]],
                    "key": "lastUseStatusName"
                },
                {
                    "title": { "CN": "开始使用时间", "EN": "User State", "TW": "使用狀態" }[language["language"]],
                    "key": "lastCreateTime",
                    "width": 150
                },
                {
                    "title": { "CN": "结束使用时间", "EN": "User State", "TW": "使用狀態" }[language["language"]],
                    "key": "lastFinishTime",
                    "width": 150
                },
            ],
            "userRecordList": []
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
                    "useStatus": "", // 使用状态
                    "remark": "", // 车辆备注
                    "vehicleColorId": "", // 车辆颜色ID
                    "vehicleTypeId": "", // 车辆类型ID
                    "vehicleBrandId": "", // 车辆品牌ID
                    "deptIds": [], // 部门ID
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
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                    self.getDepartmentList("itemInfo");
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
                self.itemInfo = self.vehicleList[self.index];
                utility.showMessageTip(self, function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.delVehicle + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                        actionUrl: CONFIG.SERVICE.vehicleService,
                        beforeSendCallback: function () {
                            self.isModalLoading = true;
                        },
                        completeCallback: function () {
                            self.isModalLoading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.isDelete = false;
                                self.getVehicleList(false);
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
            "vehicleUseStatusChange": function (row, index) {
                var self = this;
                self.itemInfo = self.vehicleList[index];
                self.itemInfo.useStatus = self.dataList[index]["useStatus"];

                self.uploadDataToServer();
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
                        "deptId": !!self.itemInfo["deptIds"] ? self.itemInfo["deptIds"][self.itemInfo["deptIds"].length - 1] : self.itemInfo["deptId"], // 部门ID，可选
                        "vehicleName": encodeURI(self.itemInfo["vehicleName"]), // 车辆名称
                        "vehicleCode": encodeURI(self.itemInfo["vehicleCode"]), // 车辆编码
                        "licenseNumber": encodeURI(self.itemInfo["licenseNumber"]), // 车辆编码
                        "gpsDeviceId": self.itemInfo["gpsDeviceId"], // 
                        "useStatus": self.itemInfo["useStatus"], // 
                        "vehicleColorId": self.itemInfo["vehicleColorId"], // 
                        "vehicleTypeId": self.itemInfo["vehicleTypeId"], // 
                        "vehicleBrandId": self.itemInfo["vehicleBrandId"], // 
                        "providerId": self.itemInfo["providerId"], // // 设备供应商ID
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
                        "licenseNumber": decodeURI(self.vehicleList[i]["licenseNumber"]), // 车牌号
                        "gpsDeviceId": self.vehicleList[i]["gpsDeviceCode"], // 
                        "useStatus": self.vehicleList[i]["useStatusName"], // 
                        "vehicleColorId": (function () {
                            var label = "";
                            for (var c = 0, clen = self.vehicleColorList.length; c < clen; c++) {
                                if (self.vehicleList[i]["vehicleColorId"] == self.vehicleColorList[c]["type"]) {
                                    label = self.vehicleColorList[c]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleColorName"], // 
                        "vehicleTypeId": (function () {
                            var label = "";
                            for (var t = 0, tlen = self.vehicleTypeList.length; t < tlen; t++) {
                                if (self.vehicleList[i]["vehicleTypeId"] == self.vehicleTypeList[t]["type"]) {
                                    label = self.vehicleTypeList[t]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleTypeName"], // 
                        "vehicleBrandId": (function () {
                            var label = "";
                            for (var b = 0, blen = self.vehicleBrandList.length; b < blen; b++) {
                                if (self.vehicleList[i]["vehicleBrandId"] == self.vehicleBrandList[b]["type"]) {
                                    label = self.vehicleBrandList[b]["name"];
                                    break;
                                }
                            }
                            return label;
                        }()), // self.vehicleList[i]["vehicleBrandName"], // 
                        "vehicleStatus": self.vehicleList[i]["vehicleStatusName"],// 
                        "cellClassName": {
                            "vehicleStatus": "_" + self.vehicleList[i]["vehicleStatus"]
                        }
                    });
                }
            },
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
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
                        "vehicleTypeId": self.pageInfo.vehicleTypeId, // 
                        "vehicleStatus": self.pageInfo.vehicleStatus, // 
                        "useStatus": self.pageInfo.useStatus, // 
                        "bindDeviceFlag": self.pageInfo.bindDeviceFlag, // 是否绑定定位设备
                        "vehicleColorId": self.pageInfo.vehicleColorId, // 
                        "vehicleBrandId": self.pageInfo.vehicleBrandId, // 
                        "vehicleName": encodeURI(self.pageInfo.vehicleName), // 车辆名称
                        "vehicleCode": encodeURI(self.pageInfo.vehicleCode), // 车辆编码
                        "gpsDeviceId": encodeURI(self.pageInfo.gpsDeviceId), // 
                        "licenseNumber": encodeURI(self.pageInfo.licenseNumber), // 车牌号
                        "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length - 1] || 0, // 部门ID，可选
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.dataList = [];
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
            "getSuper": function (list, value, arr) {
                var self = this;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].value == value) {
                        arr.push(value);
                        if (list[i].paraDeptId == 0) {
                            return;
                        }
                        self.getSuper(self.departmentList, list[i].paraDeptId, arr);
                    } else {
                        self.getSuper(list[i]["children"], value, arr);
                    }
                }
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function (list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.departmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getDepartmentList": function (type) {
                var self = this;
                self.departmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0, // 公司ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var arr = [];
                            self[type]["deptIds"] = [];
                            self.formatSuperiorDeprt(data.data);

                            self.getSuper(self.departmentList, self[type]["deptId"], arr);

                            self[type]["deptIds"] = arr.reverse();
                        }
                    }
                });
            },
            // 显示视屏
            "showLiveVideo": function (vehicleInfo, isBackPlay) {
                var self = this;
                var url = "http://43.247.68.26:9090/airport/www/module/liveVideo/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                
                if(isBackPlay) {
                    url = "http://43.247.68.26:9090/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                }

                if (vehicleInfo.providerId == 2) {
                    if(isBackPlay) {
                        url = "http://43.247.68.26:9090/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                    } else {
                        url = "http://43.247.68.26:9090/airport/www/module/liveVideoTest1/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                    }
                }
                window.open(
                    url,
                    "liveVideo",
                    "toolbar=yes, location=0, directories=no, status=0, menubar=0, scrollbars=1, resizable=1, copyhistory=1, width=" + window.outerWidth + ", height=" + (window.outerHeight-50)
                );
            },
            // 页数改变时的回调
            "userStatuPageSizeChange": function (value) {
                var self = this;
                self.recordPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleUseRecordList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "userStatuPageRowChange": function (value) {
                var self = this;
                self.recordPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleUseRecordList(false);
                }, 200);
            },
            // 格式化使用记录
            "formatRecord": function (dataList) {
                var self = this;
                for (var i = 0, len = dataList.length; i < len; i++) {
                    self.userRecordList.push({
                        "lastCreateTime": dataList[i].lastCreateTime, // 
                        "lastFinishTime": dataList[i].lastFinishTime, // 
                        "vehicleStatusName": dataList[i].vehicleStatusName,
                        "lastUseStatusName": dataList[i].lastUseStatusName,
                        "cellClassName": {
                            "vehicleStatusName": "_" + dataList[i]["vehicleStatus"]
                        }
                    });
                }
            },
            // 获取车辆使用记录列表
            "getVehicleUseRecordList": function (bool) {
                var self = this;
                if (bool == true) {
                    self.recordPageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleUseRecordList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": self.recordPageInfo.pageNum,
                        "pageSize": self.recordPageInfo.pageSize,
                        "vehicleId": self.vehicleList[self.recordIndex].id,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.userRecordList = [];
                            self.recordPageInfo.count = data.count;
                            self.formatRecord(data.data);
                        }
                    }
                });
            },
            // 显示使用列表
            "showRecordList": function (index) {
                var self = this;
                self.isRecord = true;
                self.recordIndex = index;
                self.itemInfo = self.vehicleList[self.recordIndex];
                self.getVehicleUseRecordList(false);
            }
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

                setInterval(function () {
                    self.getVehicleList(false);
                }, 5000);
            }, 500);
        }
    });

}())
