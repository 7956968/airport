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
            "cameraFunc": (function(){
                var func = JSON.stringify(userFuncList["menu_map"]);
                // 如果是管理防区
                if(func.indexOf("device_manage_camera")!=-1) {
                    return true;
                } else {
                    return false;
                }
            }()),
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "monitorStatusList": bizParam["monitorStatusId"], // 监控状态
            "index": 0,
            "selectItem": null,
            "pageInfo": {
                "companyId": "",
                "cameraName": "",
                "cameraCode": "",
                "monitorStatus": ""
            },
            "page": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 1,
            },
            "itemInfo": {
                "id": "", // 摄像机ID
                "companyId": "", // 所属公司ID 
                "companyName": "", // 公司名称
                "deptId": "", // 部门ID，可选
                "deptName": "", // 部门名称
                "cameraName": "", // 摄像机名称
                "cameraCode": "", // 摄像机编码
                "cameraDesc": "", // 摄像机描述
                "cameraPositionStr": "", // 位置坐标
                "radius": "", // 摄像头监控半径（单位米）
                "angle": "", // 视野角度
                "monitorStatus": "", // 摄像头监控状态：
                "remark": "", // 备注
                "rtspLiveUrl": "", // Rtsp直播地址
                "rtspHisUrl": "", // Rtsp录播地址
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [
                {
                    "type": "index",
                    "align": "center",
                    "title": "序号",
                    "width": 60,
                    "fixed": "left",
                }, 
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName",
                    "width": 180,
                    "fixed": "left",
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "cameraName",
                    "width": 140,
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "cameraCode",
                    "width": 140,
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "cameraDesc",
                    "width": 140,
                },
                {
                    "title": { "CN": "Rtsp直播地址", "EN": "Live URL", "TW": "Rtsp直播地址" }[language["language"]],
                    "key": "rtspLiveUrl",
                    "width": 140,
                },
                {
                    "title": { "CN": "Rtsp录播地址", "EN": "Delayed URL", "TW": "Rtsp錄播地址" }[language["language"]],
                    "key": "rtspHisUrl",
                    "width": 140,
                },
                {
                    "title": { "CN": "半径", "EN": "Radius", "TW": "半徑" }[language["language"]],
                    "key": "radius",
                    "width": 140,
                },
                {
                    "title": { "CN": "视野角度", "EN": "Angle Of View", "TW": "視野角度" }[language["language"]],
                    "key": "angle",
                    "width": 140,
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "monitorStatus",
                    "width": 140,
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 180,
                    "align": "center",
                    "fixed": "right",
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        var deleteAction = null;
                        // 如果是管理防区
                        if(func.indexOf("device_manage_camera")!=-1) {
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
            "dataList": [],
            "cameraList": [],
            "companyList": []
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
                    "dataPeriod": "", // 数据上报周期(单位秒)
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
                    self.itemInfo = JSON.parse(JSON.stringify(self.cameraList[self.index]));
                    self.itemInfo.remark = decodeURI(self.cameraList[self.index]["remark"]);
                    self.itemInfo.cameraName = decodeURI(self.cameraList[self.index]["cameraName"]);
                    self.itemInfo.cameraCode = decodeURI(self.cameraList[self.index]["cameraCode"]);
                    self.itemInfo.cameraDesc = decodeURI(self.cameraList[self.index]["cameraDesc"]);
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.cameraList[self.index]));
                    self.itemInfo.remark = decodeURI(self.cameraList[self.index]["remark"]);
                    self.itemInfo.cameraName = decodeURI(self.cameraList[self.index]["cameraName"]);
                    self.itemInfo.cameraCode = decodeURI(self.cameraList[self.index]["cameraCode"]);
                    self.itemInfo.cameraDesc = decodeURI(self.cameraList[self.index]["cameraDesc"]);
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
                        self.itemInfo = self.cameraList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.delCamera + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.deviceService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getCameraList(true);
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
                    self.getCameraList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getCameraList(true);
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
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.saveCamera,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "id": self.itemInfo["id"], // 摄像机ID
                        "companyId": self.itemInfo["companyId"], // 所属公司ID 
                        "companyName": encodeURI(self.itemInfo["companyName"]), // 公司名称
                        "deptId": self.itemInfo["deptId"], // 部门ID，可选
                        "deptName": encodeURI(self.itemInfo["deptName"]), // 部门名称
                        "cameraName": encodeURI(self.itemInfo["cameraName"]), // 摄像机名称
                        "cameraCode": encodeURI(self.itemInfo["cameraCode"]), // 摄像机编码
                        "cameraDesc": encodeURI(self.itemInfo["cameraDesc"]), // 摄像机描述
                        "radius": self.itemInfo["radius"], // 摄像头监控半径（单位米）
                        "angle": self.itemInfo["angle"], // 视野角度
                        "monitorStatus": self.itemInfo["monitorStatus"], // 摄像头监控状态：
                        "remark": encodeURI(self.itemInfo["remark"]), // 备注
                        "rtspLiveUrl": self.itemInfo["rtspLiveUrl"], // Rtsp直播地址
                        "rtspHisUrl": self.itemInfo["rtspHisUrl"], // Rtsp录播地址
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传  
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getCameraList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 格式化摄像机列表数据
            "formatCameraData": function () {
                var self = this;
                for (var i = 0, len = self.cameraList.length; i < len; i++) {
                    self.dataList.push({
                        "id": self.cameraList[i]["id"], // 摄像机ID
                        "companyId": self.cameraList[i]["companyId"], // 所属公司ID 
                        "companyName": decodeURI(self.cameraList[i]["companyName"]), // 公司名称
                        "deptId": self.cameraList[i]["deptId"], // 部门ID，可选
                        "deptName": decodeURI(self.cameraList[i]["deptName"]), // 部门名称
                        "cameraName": decodeURI(self.cameraList[i]["cameraName"]), // 摄像机名称
                        "cameraCode": decodeURI(self.cameraList[i]["cameraCode"]), // 摄像机编码
                        "cameraDesc": decodeURI(self.cameraList[i]["cameraDesc"]), // 摄像机描述
                        "radius": self.cameraList[i]["radius"], // 摄像头监控半径（单位米）
                        "angle": self.cameraList[i]["angle"], // 视野角度
                        "monitorStatus": self.cameraList[i]["monitorStatusName"], // 摄像头监控状态：
                        "remark": decodeURI(self.cameraList[i]["remark"]), // 备注
                        "rtspLiveUrl": self.cameraList[i]["rtspLiveUrl"], // Rtsp直播地址
                        "rtspHisUrl": self.cameraList[i]["rtspHisUrl"], // Rtsp录播地址
                    });
                }
            },
            // 获取摄像机列表数据
            "getCameraList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.dataList = [];
                self.cameraList = [];
                if (bool == true) {
                    self.page.pageNum = 0;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.getCameraList,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyId": self.pageInfo.companyId,
                        "cameraName": self.pageInfo.cameraName,
                        "cameraCode": self.pageInfo.cameraCode,
                        "monitorStatus": self.pageInfo.monitorStatus
                    }, //self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.cameraList = data.data;
                            self.page.count = data.count;
                            self.formatCameraData();
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
            // 跳转到地图页面
            "toMapPage": function() {
                var self = this;
                utility.setSessionStorage("fromInfo", {
                    type: "isCamera",
                    vehicleStatus: ""
                });
                setTimeout(function() {
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
                self.getCameraList(true);
                self.getCompanyList();

                self.$watch('pageInfo', function () {
                    self.getCameraList(true);
                }, {
                    deep: true
                });
            }, 500);
        }
    });

}())
