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
            "terminalStatusList": bizParam["terminalStatus"], // 车辆状态
            "deviceProviderList": bizParam["deviceProviderId"], // 车辆状态
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 车辆ID
                "companyId": "", // 所属公司ID
                "companyName": "", // 公司名称
                "providerId": "", // 供应商ID
                "deviceCode": "", // 定位终端设备编号
                "remark": "", // 车辆备注
                "dataPeriod": 30, // 数据上报周期(单位秒)
                "versionName": "", // 系统软件版本名
                "versionNum": "", // 系统软件版本号，如100
                "deviceStatus": "", // 定位设备运行状态
                "deptId": "", // 部门名称
                "deptName": "", // 部门名称
                "speed": "", // 当前速度（米/秒）
                "power": "", // 终端电量（百分比）
                "lastPosition": "", // 当前经纬度坐标
                "lastDataTime": "", // 数据最后上报时间
            },
            "pageInfo": {
                "count": 0,
                "id": "", // 车辆ID
                "companyId": "", // 所属公司ID，手动从公司列表选择
                "deptId": "", // 部门ID，可选
                "providerId": "", // 供应商ID
                "deviceStatus": "", // 定位设备运行状态
                "deviceCode": "", // 定位终端设备编号
                "dataPeriod": "", // 数据上报周期(单位秒)
                "versionName": "", // 系统软件版本名
                "versionNum": "", // 系统软件版本号，如100
                "bindFlag": 0, // 是否被绑定到车辆：
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
            },
            "page": {
                "pageNum": 1,
                "pageSize": 20,
            },
            "columnsList": [
                // {
                //     "type": "index",
                //     "width": 60,
                //     "align": "center"
                // },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyId",
                    "width": 200
                },
                {
                    "title": "绑定车辆",
                    "key": "vehicleName",
                    "width": 150
                },
                {
                    "title": { "CN": "运行状态", "EN": "Working Condition", "TW": "運行狀態" }[language["language"]],
                    "key": "deviceStatus"
                },
                {
                    "title": { "CN": "供应商", "EN": "Supplier", "TW": "廠家名稱" }[language["language"]],
                    "key": "providerId"
                },
                {
                    "title": { "CN": "终端编号", "EN": "No.", "TW": "終端編號" }[language["language"]],
                    "key": "deviceCode"
                },
                {
                    "title": { "CN": "上报周期", "EN": "Reporting Cycle", "TW": "上報周期" }[language["language"]],
                    "key": "dataPeriod"
                },
                {
                    "title": { "CN": "系统版本", "EN": "System Version", "TW": "系統版本" }[language["language"]],
                    "key": "versionName"
                },
                {
                    "title": { "CN": "系统版本号", "EN": "System Version No.", "TW": "系統版本號" }[language["language"]],
                    "key": "versionNum"
                },
                {
                    "title": { "CN": "当前速度", "EN": "Speed", "TW": "當前速度" }[language["language"]],
                    "key": "speed"
                },
                {
                    "title": { "CN": "电量", "EN": "Power", "TW": "電量" }[language["language"]],
                    "key": "power"
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
            "terminalList": [],
            "companyList": [],
            "departmentList": [],
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
                    "providerId": "", // 供应商ID
                    "deviceCode": "", // 定位终端设备编号
                    "remark": "", // 车辆备注
                    "dataPeriod": 30, // 数据上报周期(单位秒)
                    "versionName": "", // 系统软件版本名
                    "versionNum": "", // 系统软件版本号，如100
                    "deviceStatus": "", // 定位设备运行状态
                    "deptId": "", // 部门名称
                    "deptName": "", // 部门名称
                    "speed": "", // 当前速度（米/秒）
                    "power": "", // 终端电量（百分比）
                    "lastPosition": "", // 当前经纬度坐标
                    "lastDataTime": "", // 数据最后上报时间
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.terminalList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 修改
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.terminalList[self.index];
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
                        self.itemInfo = self.terminalList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.delDevice + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.deviceService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getTerminalList(false);
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
                    self.getTerminalList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getTerminalList(false);
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
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.saveDevice,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "id": self.itemInfo.id, // 车辆ID
                        "companyId": self.itemInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "providerId": self.itemInfo.providerId, // 供应商ID
                        "deviceCode": encodeURI(self.itemInfo.deviceCode), // 定位终端设备编号
                        "dataPeriod": self.itemInfo.dataPeriod || 30, // 数据上报周期(单位秒)
                        "versionName": encodeURI(self.itemInfo.versionName), // 系统软件版本名
                        "versionNum": self.itemInfo.versionNum, // 系统软件版本号，如100
                        "deviceStatus": self.itemInfo.deviceStatus, // 定位设备运行状态
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传  
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getTerminalList(false);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化车辆信息
            "formatTerminal": function () {
                var self = this;
                for (var i = 0, len = self.terminalList.length; i < len; i++) {
                    self.dataList.push({
                        "providerId": self.terminalList[i]["providerName"], // 供应商ID
                        "deviceCode": decodeURI(self.terminalList[i]["deviceCode"]), // 定位终端设备编号
                        "dataPeriod": self.terminalList[i]["dataPeriod"] || 30, // 数据上报周期(单位秒)
                        "versionName": decodeURI(self.terminalList[i]["versionName"]), // 系统软件版本名
                        "versionNum": self.terminalList[i]["versionNum"], // 系统软件版本号，如100
                        "deviceCode": decodeURI(self.terminalList[i]["deviceCode"]), // 终端编号
                        "vehicleName": decodeURI(self.terminalList[i]["vehicleName"]), // 终端编号
                        "speed": self.terminalList[i]["speed"], // 当前速度（米/秒）
                        "power": self.terminalList[i]["power"], //  终端电量（百分比）
                        "lastPosition": self.terminalList[i]["lastPosition"], // 当前经纬度坐标
                        "lastDataTime": self.terminalList[i]["lastDataTime"], // 数据最后上报时间
                        "companyId": self.terminalList[i]["companyName"], // 所属公司ID，手动从公司列表选择
                        "companyName": decodeURI(self.terminalList[i]["companyName"]), // 所属公司ID，手动从公司列表选择
                        "deviceStatus": decodeURI(self.terminalList[i]["deviceStatusName"]), //self.terminalList[i]["deviceStatus"], // 
                    });
                }
            },
            // 获取终端设备列表
            "getTerminalList": function (bool) {
                var self = this;
                self.dataList = [];
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.page.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.getDeviceList,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyId": self.pageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "deptId": self.pageInfo.deptId, // 部门ID，可选
                        "providerId": self.pageInfo.providerId, // 供应商ID
                        "deviceStatus": self.pageInfo.deviceStatus, // 定位设备运行状态
                        "deviceCode": encodeURI(self.pageInfo.deviceCode), // 定位终端设备编号
                        "dataPeriod": self.pageInfo.dataPeriod, // 数据上报周期(单位秒)
                        "versionName": encodeURI(self.pageInfo.versionName), // 系统软件版本名
                        "versionNum": encodeURI(self.pageInfo.versionNum), // 系统软件版本号，如100
                        "bindFlag": self.pageInfo.bindFlag, // 是否被绑定到车辆：
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.terminalList = data.data;
                            self.pageInfo.count = data.count;
                            self.formatTerminal();
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
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getTerminalList(true);
                self.getCompanyList();
                self.$watch('pageInfo', function () {
                    self.getTerminalList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
