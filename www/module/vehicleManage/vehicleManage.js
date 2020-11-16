(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var userFuncList = utility.getLocalStorage("userFuncList")["menu_device"];
    var isViewVideo = (function () {
        var bool = false;
        for (var i = 0, len = userFuncList.length; i < len; i++) {
            if (userFuncList[i]["functionCode"] == "device_manage_view_video") {
                bool = true;
                break;
            }
        }
        return bool;
    }());
    var filterCompany = [];
    var filterDepart = [];
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
            "vehicleModalBrandList": [],
            "vehicleModalTypeList": [],
            // 车辆信息
            "vehicleInfo": {
                "list": [],
                "count": 0,
                "_401": 0,
                "_402": 0,
                "_406": 0
            },
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
                "vehicleModelId": "", // 车辆运行状态ID：
            },
            "pageInfo": {
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
            "page": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 1,
            },
            "vehicleList": [],
            "vehicleBrandTypeList": [],
            "columnsList": [{
                    "type": "index",
                    "width": 60,
                    "align": "center",
                    "title": "序号",
                    "fixed": "left",
                },
                {
                    "title": "公司",
                    "key": "companyId",
                    "fixed": "left",
                    "width": 200,
                    "filters": filterCompany,
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.companyId = value;
                        pageVue.getDepartmentList();
                    }
                },
                {
                    "title": "部门",
                    "key": "deptId",
                    "width": 180,
                    "fixed": "left",
                    "filters": filterDepart,
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.deptIds = value;
                    },
                },
                {
                    "title": "车辆名称",
                    "key": "vehicleName",
                    "width": 150
                },
                {
                    "title": "车牌号",
                    "key": "licenseNumber",
                    "width": 140
                },
                {
                    "title": "运动状态",
                    "key": "vehicleStatus",
                    "width": isViewVideo ? 240 : 120,
                    "filters": (function () {
                        var arr = [];
                        var terminalStatus = bizParam["terminalStatus"];

                        for (var i = 0, len = terminalStatus.length; i < len; i++) {
                            if (terminalStatus[i]["type"] == 401 || terminalStatus[i]["type"] == 402 || terminalStatus[i]["type"] == 403 || terminalStatus[i]["type"] == 406) {
                                arr.push({
                                    label: terminalStatus[i]["name"],
                                    value: terminalStatus[i]["type"]
                                });
                            }
                        }
                        return arr;
                    }()),
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.vehicleStatus = value;
                    },
                    "render": function (h, params) {
                        var liveButton = null;
                        var backButton = null;

                        if (isViewVideo) {
                            if (!!(pageVue.vehicleList[params.index] && pageVue.vehicleList[params.index]['licenseNumber']) && pageVue.vehicleList[params.index]['providerId'] < 100) {
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

                                    if (pageVue.vehicleList[params.index]["providerId"] == 2) {
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
                    "title": "上下线明细",
                    "width": 100,
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "default",
                                    "size": "small",
                                },
                                "style": {
                                    "marginLeft": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        console.log(params.row);
                                        pageVue.toOnlineDetail(params.row);
                                    }
                                }
                            }, "查看明细")
                        ]);
                    }
                },
                {
                    "title": "车辆编码",
                    "key": "vehicleCode",
                    "width": 150
                },
                {
                    "title": "绑定终端",
                    "key": "gpsDeviceId",
                    "width": 250
                },
                {
                    "title": "车辆类型",
                    "key": "vehicleTypeName",
                    "width": 120
                },
                {
                    "title": "品牌",
                    "key": "vehicleBrandName",
                    "width": 120
                },
                {
                    "title": "品牌型号",
                    "key": "vehicleModelName",
                    "width": 120
                },
                {
                    "title": "操作",
                    "key": "operation",
                    "fixed": "right",
                    "align": "center",
                    "width": 200,
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "icon": "md-pin",
                                    "type": "info", // md-pin
                                    "size": "small",
                                },
                                "style": {
                                    "marginRight": '5px'
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.toMapCoordinates(pageVue.vehicleList[params.index]);
                                    }
                                }
                            }, ""),
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
                            }, "详情"),
                            // h("Button", {
                            //     "props": {
                            //         "type": "info",
                            //         "size": "small",
                            //     },
                            //     "style": {
                            //         "marginRight": '5px'
                            //     },
                            //     "on": {
                            //         "click": function () {
                            //             pageVue.showRecordList(params.index);
                            //         }
                            //     }
                            // }, "使用记录"),
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
                            }, "编辑"),
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
                            }, "删除"),
                        ]);
                    }
                }
            ],
            "dataList": [],
            "companyList": [],
            "filterCompany": [],
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
            "userRecordcolumns": [{
                    "title": "运动状态",
                    "key": "vehicleStatusName",
                },
                // {
                //     "title": { "CN": "使用状态", "EN": "User State", "TW": "使用狀態" }[language["language"]],
                //     "key": "lastUseStatusName"
                // },
                {
                    "title": "开始使用时间",
                    "key": "lastCreateTime",
                    "width": 150
                },
                {
                    "title": "结束使用时间",
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
                // window.location.href = window.location.href.split("?")[0]+"?v="+Date.parse(new Date());
                window.location.href = window.location.href;
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
                    self.modalTitle = {
                        "CN": "修改",
                        "EN": "Edit",
                        "TW": "修改"
                    } [self.language];
                    self.getSysParaList("vehicleBrand");
                    self.getSysParaList("vehicleType");
                    self.getVehicleModelList();
                    self.getDepartmentTreeList("itemInfo");
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
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(true);
                }, 200);
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (item, index) {
                var self = this;
                self.index = index;
                self.selectItem = item;
            },
            "toOnlineDetail": function (onlineStatItemInfo) {
                var self = this;
                utility.setSessionStorage("onlineStatItemInfo", onlineStatItemInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_OnlineDetail").bind("click");
                    $(window.parent.document).find("#nav_OnlineDetail").trigger("click");
                }, 200);
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
                        "vehicleName": encodeURI($.trim(self.itemInfo["vehicleName"])), // 车辆名称
                        "vehicleCode": encodeURI($.trim(self.itemInfo["vehicleCode"])), // 车辆编码
                        "licenseNumber": encodeURI($.trim(self.itemInfo["licenseNumber"])), // 车辆编码
                        "gpsDeviceId": self.itemInfo["gpsDeviceId"], // 
                        "useStatus": self.itemInfo["useStatus"], // 
                        "vehicleColorId": self.itemInfo["vehicleColorId"], // 
                        "vehicleTypeId": self.itemInfo["vehicleTypeId"], // 
                        "vehicleBrandId": self.itemInfo["vehicleBrandId"], // 
                        "providerId": self.itemInfo["providerId"], // // 设备供应商ID
                        "remark": encodeURI($.trim(self.itemInfo["remark"])), // 
                        "vehicleModelId": encodeURI($.trim(self.itemInfo["vehicleModelId"])), // 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"] // 修改用户ID，修改时必传 
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
                var list = [];
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    list.push({
                        "companyId": self.vehicleList[i]["companyName"], // 所属公司ID，手动从公司列表选择
                        "deptId": self.vehicleList[i]["deptName"], // 部门ID，可选
                        "vehicleName": decodeURI(self.vehicleList[i]["vehicleName"]), // 车辆名称
                        "vehicleCode": decodeURI(self.vehicleList[i]["vehicleCode"]), // 车辆编码
                        "licenseNumber": decodeURI(self.vehicleList[i]["licenseNumber"] || ""), // 车牌号
                        "gpsDeviceId": self.vehicleList[i]["gpsDeviceCode"], // 
                        "useStatus": self.vehicleList[i]["useStatusName"], // 
                        "vehicleTypeName": self.vehicleList[i]["vehicleTypeName"], // 
                        "vehicleTypeId": self.vehicleList[i]["vehicleTypeId"], // 
                        "vehicleBrandId": self.vehicleList[i]["vehicleBrandId"], // self.vehicleList[i]["vehicleBrandId"], // 
                        "vehicleModelName": self.vehicleList[i]["vehicleModelName"], // self.vehicleList[i]["vehicleBrandName"], // 
                        "vehicleBrandName": self.vehicleList[i]["vehicleBrandName"], // self.vehicleList[i]["vehicleBrandName"], // 
                        "vehicleStatus": self.vehicleList[i]["vehicleStatusName"], // 
                        "cellClassName": {
                            "vehicleStatus": "_" + self.vehicleList[i]["vehicleStatus"]
                        }
                    });
                }
                self.dataList = list;
            },
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.page.pageNum = 1;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyId": self.pageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "vehicleTypeId": self.pageInfo.vehicleTypeId, // 
                        "vehicleStatus": self.pageInfo.vehicleStatus, // 
                        "useStatus": self.pageInfo.useStatus, // 
                        "bindDeviceFlag": self.pageInfo.bindDeviceFlag, // 是否绑定定位设备
                        "vehicleColorId": self.pageInfo.vehicleColorId, // 
                        "vehicleBrandId": self.pageInfo.vehicleBrandId, // 
                        "vehicleName": encodeURI($.trim(self.pageInfo.vehicleName)), // 车辆名称
                        "vehicleCode": encodeURI($.trim(self.pageInfo.vehicleCode)), // 车辆编码
                        "gpsDeviceId": encodeURI(self.pageInfo.gpsDeviceId), // 
                        "licenseNumber": encodeURI($.trim(self.pageInfo.licenseNumber)), // 车牌号
                        "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length - 1] || 0, // 部门ID，可选
                    },
                    beforeSendCallback: function () {
                        // self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data.sort(function (a, b) {
                                return a.vehicleStatus - b.vehicleStatus;
                            });

                            self.page.count = data.count;
                            self.formatVehicle();
                        }
                    }
                });
            },
            // 获取车辆信息
            "getAllVehicleList": function () {
                var self = this;

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        id: "",
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleInfo = {
                                "_401": 0,
                                "_402": 0,
                                "_406": 0,
                            };
                            self.vehicleInfo.count = data.count;
                            self.vehicleInfo.list = data.data;

                            for (var i = 0, len = self.vehicleInfo.list.length; i < len; i++) {
                                if(self.vehicleInfo.list[i]["vehicleStatus"] == 401 || self.vehicleInfo.list[i]["vehicleStatus"] == 402 || self.vehicleInfo.list[i]["vehicleStatus"] == 406) {
                                    self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] = self.vehicleInfo["_" + self.vehicleInfo.list[i]["vehicleStatus"]] + 1;
                                }
                            }
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
                            for (var i = 0, len = self.companyList.length; i < len; i++) {
                                filterCompany.push({
                                    label: self.companyList[i]["companyName"],
                                    value: self.companyList[i]["id"]
                                });
                            }
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
            // 获取部门树状信息
            "getDepartmentTreeList": function (type, bool) {
                var self = this;
                self.departmentList = [];

                if(type == "itemInfo" && !!bool) {
                    self.itemInfo.vehicleTypeId = "";
                    self.itemInfo.vehicleBrandId = "";
                    self.getSysParaList("vehicleBrand");
                    self.getSysParaList("vehicleType");
                }
                
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
            // 获取部门信息
            "getDepartmentList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        pageNum: 1,
                        pageSize: 10000,
                        companyId: self.pageInfo.companyId[0] || 0, // 公司ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                filterDepart.push({
                                    label: data.data[i]["deptName"],
                                    value: data.data[i]["id"],
                                });
                            }
                        }
                    }
                });
            },
            // 显示视屏
            "showLiveVideo": function (vehicleInfo, isBackPlay) {
                var self = this;
                var port = "8080";
                // var port = "9090";
                var baseUrl = "http://43.247.68.26:";
                var url = baseUrl + port + "/airport/www/module/liveVideo/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;

                if (isBackPlay) {
                    url = baseUrl + port + "/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                }

                // if (vehicleInfo.providerId == 2) {
                //     if (isBackPlay) {
                //         url = baseUrl + port + "/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                //     } else {
                //         url = baseUrl + port + "/airport/www/module/liveVideoTest1/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                //     }
                // }
                window.open(
                    url,
                    "liveVideo",
                    "toolbar=yes, location=0, directories=no, status=0, menubar=0, scrollbars=1, resizable=1, copyhistory=1, width=" + window.outerWidth + ", height=" + (window.outerHeight - 50)
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
            },
            "toMapCoordinates": function (vehicleInfo) {
                var self = this;
                utility.setSessionStorage("fromInfo",null);
                utility.setSessionStorage("vehicleInfoFrom", vehicleInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
                }, 200);
            },
            // 获取品牌型号
            "getVehicleModelList": function (bool) {
                var self = this;
                self.vehicleBrandTypeList = [];
                if(!!bool) {
                    self.itemInfo.vehicleModelId = "";
                }
                
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleModelService + "?action=" + CONFIG.ACTION.getVehicleModelList,
                    actionUrl: CONFIG.SERVICE.vehicleModelService,
                    dataObj: {
                        "pageNum": 0,
                        "pageSize": 1000000,
                        "companyId": self.itemInfo["companyId"], // 参数名称
                        "vehicleBrandId": (function() {
                            var id = "";
                            for(var i = 0, len = self.vehicleModalBrandList.length; i < len; i++) {
                                if(self.itemInfo.vehicleBrandId == self.vehicleModalBrandList[i]["type"]) {
                                    id = self.vehicleModalBrandList[i]["id"];
                                    break;
                                }
                            }
                            return id;
                        }()), // 参数名称
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleBrandTypeList = data.data;
                        }
                    }
                });
            },
            // 
            "getSysParaList": function (cateCode, bool) {
                var self = this;
                if(cateCode == "vehicleBrand") {
                    self.vehicleModalBrandList = [];
                } else if(cateCode == "vehicleType") {
                    self.vehicleModalTypeList = [];
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.sysParaService + "?action=" + CONFIG.ACTION.getSysParaList,
                    actionUrl: CONFIG.SERVICE.sysParaService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 1000,
                        "companyId": self.itemInfo.companyId, // 参数名称
                        "cateCode": cateCode,
                    },
                    beforeSendCallback: function () {
                        // self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            if(cateCode == "vehicleBrand") {
                                self.vehicleModalBrandList = data.data;
                            } else if(cateCode == "vehicleType") {
                                self.vehicleModalTypeList = data.data;
                            }
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
                self.getAllVehicleList();
                self.getCompanyList();
                self.getTerminalList();

                setInterval(function () {
                    self.getVehicleList(false);
                    self.getAllVehicleList();
                }, 3000);

                self.$watch('pageInfo', function () {
                    self.getVehicleList(true);
                }, {
                    deep: true
                });

                setInterval(function() {
                    bizParam = utility.getLocalStorage("bizParam")
                }, 10000);
                
            }, 500);
        }
    });

}())