(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowDetail": false,
            "isModalLoading": true,
            "modalTitle": "",
            "defensFunc": (function () {
                var func = JSON.stringify(userFuncList["menu_map"]);
                // 如果是管理防区
                if (func.indexOf("device_manage_secure_area") != -1) {
                    return true;
                } else {
                    return false;
                }
            }()),
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "secureAreaStatusList": bizParam["secureAreaStatus"],
            "secureAreaLimitTypeList": bizParam["secureAreaLimitType"], // 车辆品牌
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 防区ID 
                "companyId": "", // 所属公司ID
                "companyName": "", // 公司名称
                "areaName": "", // 防区名称
                "areaCode": "", // 防区编码
                "secureStatus": "", // 防区状态
                "areaRange": "", // 防区位置坐标
                "speedLimit": "", // 行驶速度限制上限（米/秒）
                "staySecond": "", // 最大允许停留时长(单位秒)
            },
            "pageInfo": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 0,
                "areaName": "", // 查询关键字（防区名称）
                "companyId": "", // 所属公司ID
                "secureStatus": "", // 防区状态
                "canEnter": "", // 是否允许车辆进入：720：不设限 721：禁止驶入 722：允许驶入
                "canExit": "", // 是否允许车辆驶出： 720：不设限 723：禁止驶出 724：允许驶出
                "canStay": "", //是否允许车辆停留： 720：不设限 725：禁止停留 726：允许停留
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传 
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "areaName"
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "areaCode"
                },
                {
                    "title": { "CN": "状态", "EN": "Status", "TW": "狀態" }[language["language"]],
                    "key": "secureStatus"
                },
                {
                    "title": { "CN": "速度上限", "EN": "Speed Limit", "TW": "速度上限" }[language["language"]],
                    "key": "speedLimit"
                },
                {
                    "title": { "CN": "停留时长", "EN": "Length Of Stay", "TW": "停留時長" }[language["language"]],
                    "key": "staySecond"
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        var deleteAction = null;
                        // 如果是管理防区
                        if (func.indexOf("device_manage_secure_area") != -1) {
                            label = { "CN": "编辑", "EN": "Edite", "TW": "編輯" }[language["language"]];
                            deleteAction = h("Button", {
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
                        } else {
                            label = { "CN": "查看", "EN": "View", "TW": "查看" }[language["language"]]
                        }
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
                            }, label),
                            deleteAction
                        ]);
                    }
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                }
            ],
            "defensList": [],
            "companyList": []
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
                    "id": "", // 防区ID 
                    "companyId": "", // 所属公司ID
                    "companyName": "", // 公司名称
                    "areaName": "", // 防区名称
                    "areaCode": "", // 防区编码
                    "secureStatus": "", // 防区状态
                    "areaRange": "", // 防区位置坐标
                    "speedLimit": "", // 行驶速度限制上限（米/秒）
                    "staySecond": "", // 最大允许停留时长(单位秒)
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.defensList[self.index]));
                    self.itemInfo.remark = decodeURI(self.defensList[self.index].remark);
                    self.itemInfo.canEnter = self.itemInfo["canEnter"] || 720,
                    self.itemInfo.canExit = self.itemInfo["canExit"] || 720,
                    self.itemInfo.canStay = self.itemInfo["canStay"] || 720,
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 修改
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.defensList[self.index];
                    self.itemInfo.remark = decodeURI(self.defensList[self.index].remark);
                    self.itemInfo.secureStatusName = (function () {
                        var status = "";
                        for (var d = 0, dlen = self.secureAreaStatusList.length; d < dlen; d++) {
                            if (self.secureAreaStatusList[d]["type"] == self.itemInfo.secureStatus) {
                                status = self.secureAreaStatusList[d]["name"];
                                break;
                            }
                        }
                        return status;
                    }()),
                        self.itemInfo.canEnterName = (function () {
                            var status = "";
                            for (var d = 0, dlen = self.secureAreaLimitTypeList.length; d < dlen; d++) {
                                if (self.secureAreaLimitTypeList[d]["type"] == self.itemInfo.canEnter || 720) {
                                    status = self.secureAreaLimitTypeList[d]["name"];
                                    break;
                                }
                            }
                            return status;
                        }()),
                        self.itemInfo.canStayName = (function () {
                            var status = "";
                            for (var d = 0, dlen = self.secureAreaLimitTypeList.length; d < dlen; d++) {
                                if (self.secureAreaLimitTypeList[d]["type"] == self.itemInfo.canStay || 720) {
                                    status = self.secureAreaLimitTypeList[d]["name"];
                                    break;
                                }
                            }
                            return status;
                        }()),
                        self.itemInfo.canExitName = (function () {
                            var status = "";
                            for (var d = 0, dlen = self.secureAreaLimitTypeList.length; d < dlen; d++) {
                                if (self.secureAreaLimitTypeList[d]["type"] == self.itemInfo.canExit || 720) {
                                    status = self.secureAreaLimitTypeList[d]["name"];
                                    break;
                                }
                            }
                            return status;
                        }()),
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
                        self.itemInfo = self.defensList[self.index];
                        // 先判断是否选择了一家公司
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.delSecureArea + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.areaService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getDefensAreaList(true);
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
                    self.getDefensAreaList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getDefensAreaList(false);
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
                    url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.saveSecureArea,
                    actionUrl: CONFIG.SERVICE.areaService,
                    dataObj: {
                        "id": self.itemInfo.id,
                        "opType": 2, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                        "companyId": self.itemInfo.companyId,
                        "deptId": self.itemInfo.deptId, // 部门ID，可选
                        "areaName": encodeURI(self.itemInfo.areaName), // 防区名称
                        "areaCode": encodeURI(self.itemInfo.areaCode), // 防区编码
                        "secureStatus": self.itemInfo.secureStatus, // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                        "areaRangeStr": self.itemInfo.areaRange, // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": self.itemInfo.speedLimit, // 行驶速度限制上限（米/秒）
                        "staySecond": self.itemInfo.staySecond, // 最大允许停留时长(单位秒)
                        "remark": encodeURI(self.itemInfo.remark), // 备注
                        "createUserId": self.itemInfo.createUserId, // 创建用户ID，新增时必传
                        "modifyUserId": self.itemInfo.modifyUserId, // 修改用户ID，修改时必传  
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getDefensAreaList(true);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化防区
            "formatDefensData": function () {
                var self = this;
                for (var i = 0, len = self.defensList.length; i < len; i++) {
                    self.dataList.push({
                        "companyName": decodeURI(self.defensList[i]["companyName"]),
                        "areaName": decodeURI(self.defensList[i]["areaName"]),
                        "areaCode": decodeURI(self.defensList[i]["areaCode"]),
                        "canEnter": self.defensList[i]["canEnter"] || 720,
                        "canExit": self.defensList[i]["canExit"] || 720,
                        "canStay": self.defensList[i]["canStay"] || 720,
                        "secureStatus": (function () {
                            var status = "";
                            for (var d = 0, dlen = self.secureAreaStatusList.length; d < dlen; d++) {
                                if (self.secureAreaStatusList[d]["type"] == self.defensList[i]["secureStatus"]) {
                                    status = self.secureAreaStatusList[d]["name"];
                                    break;
                                }
                            }
                            return status;
                        }()),
                        "speedLimit": self.defensList[i]["speedLimit"],
                        "staySecond": self.defensList[i]["staySecond"],
                    });
                }
            },
            // 获取防区列表
            "getDefensAreaList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.dataList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 0;
                }
                setTimeout(function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.getSecureAreaList,
                        actionUrl: CONFIG.SERVICE.areaService,
                        dataObj: self.pageInfo,
                        beforeSendCallback: function () {
                            self.isTableLoading = true;
                        },
                        completeCallback: function () {
                            self.isTableLoading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.defensList = data.data;
                                self.pageInfo.count = data.count;
                                self.formatDefensData();
                            }
                        }
                    });
                }, 500);
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
            // 跳转到地图页面
            "toMapPage": function () {
                var self = this;
                utility.setSessionStorage("fromInfo", {
                    type: "isDefense",
                    vehicleStatus: ""
                });
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
                }, 200);
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getDefensAreaList(true);
                self.getCompanyList();
            }, 500);
        }
    });

}())
