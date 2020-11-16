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
            "count": 0,
            "pageInfo": {
                "companyId": "", // 参数名称
                "name": "", // 参数名称
                "type": "", // 参数代码
                "cateCode": "vehicleType",
            },
            "page": {
                "count": 0,
                "pageSize": 20,
                "pageNum": 0,
            },
            "index": 0,
            "selectItem": "",
            "itemInfo": {
                "id": "", // ID 
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                "companyId": "", // 参数名称
                "name": "", // 参数名称
                "type": "", // 参数代码
                "cateCode": "vehicleType",
            },
            "columnsList": [{
                    "type": "index",
                    "width": 60,
                    "align": "center",
                    "title": "序号"
                },
                {
                    "title": {
                        "CN": "公司",
                        "EN": "Company name",
                        "TW": "公司名稱"
                    } [language["language"]],
                    "key": "companyName",
                    "width": 280
                },
                {
                    "title": "车辆类型编号",
                    "key": "type"
                },
                {
                    "title": "车辆类型名称",
                    "key": "name"
                },
                // {
                //     "title": "创建用户",
                //     "key": "createUserName"
                // },
                {
                    "title": "创建时间",
                    "key": "createTime"
                },
                {
                    "title": {
                        "CN": "操作",
                        "EN": "Operation",
                        "TW": "操作"
                    } [language["language"]],
                    "key": "operation",
                    "align": "center",
                    "width": 120,
                    "render": function (h, params) {
                        return h("div", [
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
            "companyList": [],
            "tableRowList": [],
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
                    "id": "", // ID 
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    "companyId": "", // 参数名称
                    "name": "", // 参数名称
                    "type": "", // 参数代码
                    "cateCode": "vehicleType", // 部门ID 
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.tableRowList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = {
                        "CN": "修改",
                        "EN": "Edit",
                        "TW": "修改"
                    } [self.language];
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = JSON.parse(JSON.stringify(self.tableRowList[self.index]));
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
                        self.itemInfo = self.tableRowList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.sysParaService + "?action=" + CONFIG.ACTION.delSysPara,
                                dataObj: {
                                    ids: self.itemInfo.id,
                                    modifyUserId: userInfo["id"], // 修改用户ID，修改时必传
                                },
                                actionUrl: CONFIG.SERVICE.sysParaService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getBizParam();
                                        self.getSysParaList(true);
                                    } else {
                                        self.$Message.error(data.message);
                                    }
                                }
                            });
                        });
                    }
                });
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
                if (utility.checkLen(self.itemInfo.companyId, 0)) {
                    self.$Message.error("请选择公司");
                    self.isModalLoading = false;
                    return;
                }
                if (utility.checkLen(self.itemInfo.type, 0)) {
                    self.$Message.error("请填写编码");
                    self.isModalLoading = false;
                    return;
                }
                if (utility.checkLen(self.itemInfo.name, 0)) {
                    self.$Message.error("请填写名称");
                    self.isModalLoading = false;
                    return;
                }
                if (!utility.checkIsNum(self.itemInfo.type)) {
                    self.$Message.error("编码只能是数字");
                    self.isModalLoading = false;
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.sysParaService + "?action=" + CONFIG.ACTION.saveSysPara,
                    actionUrl: CONFIG.SERVICE.sysParaService,
                    dataObj: {
                        "id": self.itemInfo.id, // ID 
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        "companyId": self.itemInfo.companyId, // 参数名称
                        "name": encodeURI(self.itemInfo.name), // 参数名称
                        "type": encodeURI(self.itemInfo.type), // 参数代码
                        "cateCode": "vehicleType", // 部门ID 
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getBizParam();
                            self.getSysParaList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                            // console.log(self.itemInfo.companyId + "-" + self.itemInfo.name + "-" + data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getSysParaList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getSysParaList(true);
                }, 200);
            },
            // 获取机构用户信息
            "getSysParaList": function (bool) {
                var self = this;
                self.tableRowList = [];
                self.tableRowList = [];
                if (bool == true) {
                    // 如果是查询，则重新从第一页开始
                    self.page.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.sysParaService + "?action=" + CONFIG.ACTION.getSysParaList,
                    actionUrl: CONFIG.SERVICE.sysParaService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyId": self.pageInfo.companyId, // 参数名称
                        "name": encodeURI(self.pageInfo.name), // 参数名称
                        "type": encodeURI(self.pageInfo.type), // 参数代码
                        "cateCode": "vehicleType",
                    },
                    beforeSendCallback: function () {
                        // self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.tableRowList = data.data;
                            self.page.count = data.count;
                        }
                    }
                });
            },
            "setAllInfo": function () {
                var self = this;
                // 测试环境
                // var vehicleTypeList = [
                //     {
                //         "type": 301,
                //         "name": "牵引车"
                //     },
                //     {
                //         "type": 304,
                //         "name": "行李传送车"
                //     },
                //     {
                //         "type": 305,
                //         "name": "摆渡车"
                //     },
                //     {
                //         "type": 306,
                //         "name": "升降平台车"
                //     },
                //     {
                //         "type": 307,
                //         "name": "客梯车"
                //     },
                //     {
                //         "type": 308,
                //         "name": "大型三面卡拖车"
                //     },
                //     {
                //         "type": 309,
                //         "name": "小型三面卡拖车"
                //     },
                //     {
                //         "type": 310,
                //         "name": "大型平板拖车"
                //     },
                //     {
                //         "type": 311,
                //         "name": "小型平板拖车"
                //     },
                //     {
                //         "type": 107,
                //         "name": "行李牵引车"
                //     },
                //     {
                //         "type": 108,
                //         "name": "飞机牵引车"
                //     }
                // ];
                // 正式环境
                var vehicleTypeList = [{
                        "type": 300,
                        "name": "冷藏车"
                    },
                    {
                        "type": 304,
                        "name": "行李传送车"
                    },
                    {
                        "type": 305,
                        "name": "摆渡车"
                    },
                    {
                        "type": 306,
                        "name": "升降平台车"
                    },
                    {
                        "type": 307,
                        "name": "客梯车"
                    },
                    {
                        "type": 107,
                        "name": "行李牵引车"
                    },
                    {
                        "type": 108,
                        "name": "飞机牵引车"
                    },
                    {
                        "type": 109,
                        "name": "残疾人登机车"
                    },
                    {
                        "type": 110,
                        "name": "冷藏车"
                    },
                    {
                        "type": 111,
                        "name": "垃圾车"
                    },
                    {
                        "type": 112,
                        "name": "除冰车"
                    }
                ];

                for (var i = 0, len = self.companyList.length; i < len; i++) {
                    (function (i) {
                        console.log(self.companyList[i].id + "_" + self.companyList[i]["companyName"]);
                        for (var j = 0, jlen = vehicleTypeList.length; j < jlen; j++) {
                            console.log(vehicleTypeList[j]["type"] + "-" + vehicleTypeList[j].name);
                            (function (j) {
                                self.itemInfo = {
                                    "id": "", // ID 
                                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                                    "companyId": self.companyList[i].id, // 参数名称
                                    "name": vehicleTypeList[j].name, // 参数名称
                                    "type": vehicleTypeList[j].type, // 参数代码
                                    "cateCode": "vehicleBrand", // 部门ID 
                                };
                                self.uploadDataToServer();
                            }(j));
                        }
                    }(i));
                }
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
                            // self.setAllInfo();
                        }
                    }
                });
            },

            // 获取枚举值保存在本地
            "getBizParam": function () {
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.commonService + "?action=" + CONFIG.ACTION.getBizParam,
                    actionUrl: CONFIG.SERVICE.commonService,
                    dataObj: {
                        companyId: userInfo["companyId"]
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            utility.setLocalStorage("bizParam", data.data);
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
                self.getCompanyList();
                self.getSysParaList(true);

                self.$watch('pageInfo', function () {
                    self.tableRowList = [];
                    self.getSysParaList(true);
                }, {
                    deep: true
                });
            }, 500);
        }
    });

}())