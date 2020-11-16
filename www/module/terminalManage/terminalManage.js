(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var airPort = utility.getLocalStorage("airPort");

    var filterCompany = [];
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "isBeijing": airPort.airPort == "116.5924,40.0791",
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
                "deviceStatus": 406, // 定位设备运行状态
                "deptId": "", // 部门名称
                "deptName": "", // 部门名称
                "speed": "", // 当前速度（米/秒）
                "power": "", // 终端电量（百分比）
                "lastPosition": "", // 当前经纬度坐标
                "lastDataTime": "", // 数据最后上报时间
            },
            "pageInfo": {
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
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "columnsList": [{
                    "type": "index",
                    "align": "center",
                    "title": "序号",
                    "width": 60,
                    // "fixed": "left"
                }, {
                    "title": "公司",
                    "key": "companyId",
                    "width": 200,
                    // "fixed": "left",
                    "filters": filterCompany,
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.companyId = value;
                    }
                },
                {
                    "title": "绑定车辆",
                    "key": "vehicleCode",
                    // "width": 150,
                },
                {
                    "title": "运行状态",
                    "key": "deviceStatus",
                    // "width": 150,
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
                        pageVue.pageInfo.deviceStatus = value;
                    }
                },
                {
                    "title": "供应商",
                    "key": "providerId",
                    // "width": 120,
                    "filters": (function () {
                        var arr = [];
                        var terminalStatus = bizParam["deviceProviderId"];

                        for (var i = 0, len = terminalStatus.length; i < len; i++) {
                            arr.push({
                                label: terminalStatus[i]["name"],
                                value: terminalStatus[i]["type"]
                            });
                        }
                        return arr;
                    }()),
                    "filterMultiple": false,
                    "filterRemote"(value, row) {
                        pageVue.pageInfo.providerId = value;
                    }
                },
                {
                    "title": "终端编号",
                    "key": "deviceCode",
                    "width": 150,
                },
                {
                    "title": "上报周期",
                    "key": "dataPeriod",
                    "align": "center",
                    // "width": 120,
                    "sortable": true,
                    "sortType": "des",
                    "render": function (h, params) {
                        return h("div", [
                            h("span", {}, params.row.dataPeriod + " 秒")
                        ]);
                    }
                },
                {
                    "title": "操作",
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
                            }, {
                                "CN": "详情",
                                "EN": "Detail",
                                "TW": "詳情"
                            } [language["language"]]),
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
                            }, {
                                "CN": "编辑",
                                "EN": "Edite",
                                "TW": "編輯"
                            } [language["language"]]),
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
                            }, {
                                "CN": "删除",
                                "EN": "Delete",
                                "TW": "刪除"
                            } [language["language"]])
                        ]);
                    }
                }
            ],
            "columnsList1": [{
                "type": "index",
                "align": "center",
                "title": "序号",
                "width": 60,
                // "fixed": "left"
            }, {
                "title": "公司",
                "key": "companyId",
                "width": 200,
                // "fixed": "left",
                "filters": filterCompany,
                "filterMultiple": false,
                "filterRemote"(value, row) {
                    pageVue.pageInfo.companyId = value;
                }
            },
            {
                "title": "绑定车辆",
                "key": "vehicleCode",
                // "width": 150,
            },
            {
                "title": "运行状态",
                "key": "deviceStatus",
                // "width": 150,
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
                    pageVue.pageInfo.deviceStatus = value;
                }
            },
            {
                "title": "供应商",
                "key": "providerId",
                // "width": 120,
                "filters": (function () {
                    var arr = [];
                    var terminalStatus = bizParam["deviceProviderId"];

                    for (var i = 0, len = terminalStatus.length; i < len; i++) {
                        arr.push({
                            label: terminalStatus[i]["name"],
                            value: terminalStatus[i]["type"]
                        });
                    }
                    return arr;
                }()),
                "filterMultiple": false,
                "filterRemote"(value, row) {
                    pageVue.pageInfo.providerId = value;
                }
            },
            {
                "title": "终端编号",
                "key": "deviceCode",
                "width": 150,
            },
            {
                "title": "上报周期",
                "key": "dataPeriod",
                "align": "center",
                // "width": 120,
                "sortable": true,
                "sortType": "des",
                "render": function (h, params) {
                    return h("div", [
                        h("span", {}, params.row.dataPeriod + " 秒")
                    ]);
                }
            },
            {
                "title": "电量",
                "key": "power",
                "align": "center",
                "sortable": true,
                "sortType": "des",
                "render": function (h, params) {
                    var nom = {
                        "_18600000026": "93",
                        "_18600000016": "98",
                        "_18600000019": "98",
                        "_18600000021": "98",
                        "_18600000027": "94",
                        "_18600000031": "95",
                        "_18600000014": "97",
                        "_18600000032": "94",
                        "_18600000010": "98",
                        "_18600000008": "99",
                        "_18600000001": "84",
                        "_18600000017": "100",
                        "_18600000030": "100",
                        "_18600000007": "100",
                        "_18600000033": "100",
                    };

                    // console.log(params.row.deviceCode);
                    return h("div", [
                        h("span", {}, params.row.power + "%")
                    ]);
                }
            },
            {
                "title": "操作",
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
                        }, {
                            "CN": "详情",
                            "EN": "Detail",
                            "TW": "詳情"
                        } [language["language"]]),
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
                        }, {
                            "CN": "编辑",
                            "EN": "Edite",
                            "TW": "編輯"
                        } [language["language"]]),
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
                        }, {
                            "CN": "删除",
                            "EN": "Delete",
                            "TW": "刪除"
                        } [language["language"]])
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
                self.modalTitle = {
                    "CN": "新增",
                    "EN": "Add",
                    "TW": "新增"
                } [self.language];
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
                    "deviceStatus": 406, // 定位设备运行状态
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
                    self.modalTitle = {
                        "CN": "修改",
                        "EN": "Edit",
                        "TW": "修改"
                    } [self.language];
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
                    self.getTerminalList(true);
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
                var arr = [];
                for (var i = 0, len = self.terminalList.length; i < len; i++) {
                    arr.push({
                        "providerId": self.terminalList[i]["providerName"], // 供应商ID
                        "deviceCode": decodeURI(self.terminalList[i]["deviceCode"]), // 定位终端设备编号
                        "dataPeriod": self.terminalList[i]["dataPeriod"] || 30, // 数据上报周期(单位秒)
                        "versionName": decodeURI(self.terminalList[i]["versionName"]), // 系统软件版本名
                        "versionNum": self.terminalList[i]["versionNum"], // 系统软件版本号，如100
                        "deviceCode": decodeURI(self.terminalList[i]["deviceCode"]), // 终端编号
                        "vehicleName": decodeURI(self.terminalList[i]["vehicleName"]), // 终端编号
                        "vehicleCode": self.terminalList[i]["vehicleCode"], // 当前速度（米/秒）
                        "speed": self.terminalList[i]["speed"], // 当前速度（米/秒）
                        "power": self.terminalList[i]["power"], //  终端电量（百分比）
                        "lastPosition": self.terminalList[i]["lastPosition"], // 当前经纬度坐标
                        "lastDataTime": self.terminalList[i]["lastDataTime"], // 数据最后上报时间
                        "companyId": self.terminalList[i]["companyName"], // 所属公司ID，手动从公司列表选择
                        "companyName": decodeURI(self.terminalList[i]["companyName"]), // 所属公司ID，手动从公司列表选择
                        "deviceStatus": decodeURI(self.terminalList[i]["deviceStatusName"]), //self.terminalList[i]["deviceStatus"], // 
                    });
                }
                self.dataList = arr;
            },
            // 获取终端设备列表
            "getTerminalList": function (bool) {
                var self = this;
                self.dataList = [];
                self.terminalList = [];
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.page.pageNum = 1;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.getDeviceList,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyId": self.pageInfo.companyId, // 所属公司ID，手动从公司列表选择
                        "deptId": self.pageInfo.deptId, // 所属公司ID，手动从公司列表选择
                        "providerId": self.pageInfo.providerId, // 供应商ID
                        "deviceStatus": self.pageInfo.deviceStatus, // 定位设备运行状态
                        "deviceCode": encodeURI(self.pageInfo.deviceCode), // 定位终端设备编号
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
                            self.dataList = [];
                            self.terminalList = [];
                            self.terminalList = data.data;
                            self.page.count = data.count;
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
            // 下载Excel
            "downLoadExcel": function () {
                var self = this;
                var timestamp = Date.parse(new Date());

                var info = {
                    "companyId": self.pageInfo.companyId, // 所属公司ID，手动从公司列表选择
                    "providerId": self.pageInfo.providerId, // 供应商ID
                    "deviceStatus": self.pageInfo.deviceStatus, // 定位设备运行状态
                    "deviceCode": encodeURI(self.pageInfo.deviceCode), // 定位终端设备编号
                    "bindFlag": self.pageInfo.bindFlag, // 是否被绑定到车辆：
                    "version": 100, // 默认100
                    "timestamp": timestamp,
                    "languageVer": 'cn', // cn：中文简体 en：英语 hk：中文繁体
                    "appType": 2, // 请求来源类型：1:H5 2:WWW 3:android app 4: ios app
                    "actionUrl": CONFIG.SERVICE.deviceService, // 使用接口URL(注意：不包含http://ip:port的服务器域名/IP+端口这部分)
                    "userId": !!userInfo ? userInfo["id"] : "",
                    "userToken": !!userInfo ? userInfo["userToken"] : "", // 登陆后会有，如无则为空字符串
                    "signStr": md5((!!userInfo ? userInfo["userToken"] : "") + (!!userInfo ? userInfo["id"] : "") + timestamp + "100").toUpperCase() // 算法：MD5(userToken + userid+ timestamp+languageVer +version)，安全Key由系统设定
                };
                var params = "";
                var url = CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.downloadDeviceList;

                for (var key in info) {
                    if (info.hasOwnProperty(key)) {
                        params = params + ("&" + key + "=" + info[key]);
                    }
                }
                window.open(url + params);
            },
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
                }, {
                    deep: true
                });
            }, 500);
        }
    });

}())