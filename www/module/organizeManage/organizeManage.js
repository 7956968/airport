(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var provinceList = utility.getLocalStorage("provinceList");
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
            "pageInfo": {
                "id": 0,
                "count": 0,
                "companyName": "", // 查询关键字（公司名称）
                "paraCompanyId": "", // 上级公司ID
            },
            "page": {
                "pageSize": 20,
                "pageNum": 1,
            },
            "index": 0,
            "selectItem": null,
            "itemInfo": {
                "id": "", // 公司ID，修改公司信息时必传
                "companyName": "", // 公司名称
                "companyTypeId": "", // 公司性质
                "companyEnName": "", // 公司英文名称
                "companyShortName": "", // 公司简称
                "paraCompanyId": "", // 上级公司ID
                "openTime": "", // 成立时间
                "chargeManId": "", // 负责人用户iD
                "chargeManName": "", // 负责人用户姓名
                "contactPhone": "", // 公司联系电话
                "contactEmail": "", // 公司联系邮箱
                "contactFax": "", // 公司传真
                "countryId": 0, // 公司所在国家，默认为0
                "provinceId": "", // 公司所在省份
                "cityId": "", // 公司所在城市
                "districtId": "", // 公司所在城市区县
                "address": "", // 公司详细地址
                "postCode": "", // 公司邮编
                "website": "", // 公司官网
                "business": "", // 公司经营范围
                "remark": "", // 备注
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center",
                    "title": "序号"
                },
                {
                    "title": { "CN": "公司名称", "EN": "Company name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName",
                    "width": 240
                },
                // {
                //     "title": { "CN": "外文名称", "EN": "companyEnName Name", "TW": "外文名稱" }[language["language"]],
                //     "key": "companyEnName"
                // },
                {
                    "title": { "CN": "公司性质", "EN": "Company Nature", "TW": "公司性質" }[language["language"]],
                    "key": "companyTypeId",
                    "align": "center",
                },
                {
                    "title": { "CN": "成立时间", "EN": "Founding Time", "TW": "成立時間" }[language["language"]],
                    "key": "openTime",
                    "align": "center",
                },
                {
                    "title": { "CN": "负责人", "EN": "Head", "TW": "負責人" }[language["language"]],
                    "key": "chargeManName",
                    "align": "center"
                },
                // {
                //     "title": { "CN": "经营范围", "EN": "Management Scope", "TW": "經營範圍" }[language["language"]],
                //     "key": "business"
                // },
                // {
                //     "title": { "CN": "备注", "EN": "Remarks", "TW": "備註" }[language["language"]],
                //     "key": "remark"
                // },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 180,
                    "align": "center",
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
            "tableRowList": [],
            "companyList": [],
            "companyTypeList": bizParam["companyType"],
            "provinceList": provinceList,
            "cityList": [],
            "districtList": [],
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
                    "id": "", // 公司ID，修改公司信息时必传
                    "companyName": "", // 公司名称
                    "companyTypeId": "", // 公司性质
                    "companyEnName": "", // 公司英文名称
                    "companyShortName": "", // 公司简称
                    "paraCompanyId": "", // 上级公司ID
                    "openTime": "", // 成立时间
                    "chargeManId": "", // 负责人用户iD
                    "chargeManName": "", // 负责人用户姓名
                    "contactPhone": "", // 公司联系电话
                    "contactEmail": "", // 公司联系邮箱
                    "contactFax": "", // 公司传真
                    "countryId": 0, // 公司所在国家，默认为0
                    "provinceId": "", // 公司所在省份
                    "cityId": "", // 公司所在城市
                    "districtId": "", // 公司所在城市区县
                    "address": "", // 公司详细地址
                    "postCode": "", // 公司邮编
                    "website": "", // 公司官网
                    "business": "", // 公司经营范围
                    "remark": "", // 备注
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.companyList[self.index];
                    self.itemInfo.companyName = decodeURI(self.itemInfo.companyName);
                    self.itemInfo.companyShortName = decodeURI(self.itemInfo.companyShortName);
                    self.itemInfo.chargeManName = decodeURI(self.itemInfo.chargeManName);
                    self.itemInfo.address = decodeURI(self.itemInfo.address);
                    self.itemInfo.business = decodeURI(self.itemInfo.business);
                    self.itemInfo.remark = decodeURI(self.itemInfo.remark);
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                    delete self.itemInfo.createTime;
                    delete self.itemInfo.modifyTime;
                    delete self.itemInfo.createUserName;
                    self.getCityList(); // 重新获取市数据
                    self.getDistrictList(); // 重新获取区数据
                });
            },
            // 查看详情
            "showDetail": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.companyList[self.index];
                    self.itemInfo.companyName = decodeURI(self.itemInfo.companyName);
                    self.itemInfo.companyShortName = decodeURI(self.itemInfo.companyShortName);
                    self.itemInfo.chargeManName = decodeURI(self.itemInfo.chargeManName);
                    self.itemInfo.address = decodeURI(self.itemInfo.address);
                    self.itemInfo.business = decodeURI(self.itemInfo.business);
                    self.itemInfo.remark = decodeURI(self.itemInfo.remark);
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
                        self.itemInfo = self.companyList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.delCompany + "&id=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.companyService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getCompanyList(true);
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
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getCompanyList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getCompanyList(false);
                }, 200);
            },
            // 验证所有输入
            "validateInput": function () {
                var self = this;

                // 先判断公司名称
            },
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                var dateInfo = utility.getDateDetailInfo(self.itemInfo.openTime);
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.saveCompany,
                    actionUrl: CONFIG.SERVICE.companyService,
                    dataObj: {
                        "id": self.itemInfo.id || 0, // 公司ID，修改公司信息时必传
                        "companyName": encodeURI(self.itemInfo.companyName), // 公司名称
                        "companyTypeId": self.itemInfo.companyTypeId, // 公司性质
                        "companyEnName": self.itemInfo.companyEnName, // 公司英文名称
                        "companyShortName": encodeURI(self.itemInfo.companyShortName), // 公司简称
                        "paraCompanyId": self.itemInfo.paraCompanyId, // 上级公司ID
                        "openTime": dateInfo.year + '-' + dateInfo.month + "-" + dateInfo.date, // 成立时间
                        "chargeManName": encodeURI(self.itemInfo.chargeManName), // 负责人用户姓名
                        "contactPhone": self.itemInfo.contactPhone, // 公司联系电话
                        "contactEmail": self.itemInfo.contactEmail, // 公司联系邮箱
                        "contactFax": self.itemInfo.contactFax, // 公司传真
                        "countryId": 0, // 公司所在国家，默认为0
                        "provinceId": self.itemInfo.provinceId, // 公司所在省份
                        "cityId": self.itemInfo.cityId, // 公司所在城市
                        "districtId": self.itemInfo.districtId, // 公司所在城市区县
                        "address": encodeURI(self.itemInfo.address), // 公司详细地址
                        "postCode": self.itemInfo.postCode, // 公司邮编
                        "website": self.itemInfo.website, // 公司官网
                        "business": encodeURI(self.itemInfo.business), // 公司经营范围
                        "remark": encodeURI(self.itemInfo.remark), // 备注
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getCompanyList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 从获取回来的列表中，格式化出显示在表格上的内容
            "formatTableList": function () {
                var self = this;

                for (var i = 0, len = self.companyList.length; i < len; i++) {
                    self.tableRowList.push({
                        "companyName": decodeURI(self.companyList[i]["companyName"]), //"公司名称",
                        "companyEnName": self.companyList[i]["companyEnName"], //"外文名称",
                        "openTime": self.companyList[i]["openTime"], //"成立时间",
                        "chargeManName": decodeURI(self.companyList[i]["chargeManName"]), //"负责人",
                        "business": decodeURI(self.companyList[i]["business"]), //"经营范围",
                        "remark": decodeURI(self.companyList[i]["remark"]), //"备注"
                        "companyTypeId": (function () {
                            var nature = "";
                            for (var c = 0, clen = self.companyTypeList.length; c < clen; c++) {
                                if (self.companyTypeList[c]["type"] == self.companyList[i]["companyTypeId"]) {
                                    nature = self.companyTypeList[c]["name"];
                                    break;
                                }
                            }
                            return nature;
                        }()), //"公司性质",
                    });
                }
            },
            // 获取机构信息
            "getCompanyList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                if (bool == true) {
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.getCompanyList,
                    actionUrl: CONFIG.SERVICE.companyService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "companyName": encodeURI(self.pageInfo.companyName), // 查询关键字（公司名称）
                        "paraCompanyId": self.pageInfo.paraCompanyId, // 上级公司ID
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.companyList = data.data;
                            self.pageInfo.count = data.count;

                            // 格式化表格数据
                            self.formatTableList();
                        }
                    }
                });
            },
            // 获取城市数据
            "getCityList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.commonService + "?action=" + CONFIG.ACTION.getCityList + "&provinceId=" + self.itemInfo.provinceId,
                    actionUrl: CONFIG.SERVICE.commonService,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.cityList = data.data;
                            self.districtList = [];
                        }
                    }
                });
            },
            // 获取城市数据
            "getDistrictList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.commonService + "?action=" + CONFIG.ACTION.getDistrictList + "&cityId=" + self.itemInfo.cityId,
                    actionUrl: CONFIG.SERVICE.commonService,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.districtList = data.data;
                        }
                    }
                });
            },
        },
        "created": function () {
            var self = this;
            var time = null;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getCompanyList(true);

                self.$watch('pageInfo', function () {
                    self.getCompanyList(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
