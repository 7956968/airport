(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isAddTableLoading": true,
            "isShowModal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "isShowMember": false,
            "isShowGroupTypeList": false,
            "isPermissions": false,
            "isFunctionList": false,
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "groupTypeList": bizParam["groupType"],
            "index": 0,
            "pageInfo": {
                "id": "", // 查询关键字（角色名称）
                "groupName": "", // 查询关键字（用户名称）
                "companyId": "", // 公司ID
                "groupTypeId": 123, // 查询关键字（用户名称）
            },
            "page": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "selectItem": null,
            "itemInfo": {
                "id": "",
                "companyId": "",
                "groupName": "",
                "groupDesc": "",
                "isValid": 1,
                "groupTypeId": 123,
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
                    "title": { "CN": "所在公司", "EN": "Company Name", "TW": "所在公司" }[language["language"]],
                    "key": "companyName",
                    "width": 180
                },
                {
                    "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "groupName"
                },
                // {
                //     "title": { "CN": "分组类型", "EN": "Gruop Type", "TW": "分組類型" }[language["language"]],
                //     "key": "groupTypeName"
                // },
                {
                    "title": { "CN": "组描述", "EN": "Role Description", "TW": "組描述" }[language["language"]],
                    "key": "groupDesc"
                },
                {
                    "title": { "CN": "是否可用", "EN": "Availability", "TW": "是否可用" }[language["language"]],
                    "key": "isValid"
                },
                {
                    "title": { "CN": "创建时间", "EN": "Creation Time", "TW": "創建時間" }[language["language"]],
                    "key": "createTime"
                },
                {
                    "title": { "CN": "操作", "EN": "State", "TW": "操作" }[language["language"]],
                    "key": "state",
                    "width": 200,
                    "align": "center",
                    "render": function (h, params) {
                        return h('div', [
                            h('Button', {
                                "props": {
                                    "type": "primary",
                                    "size": "small"
                                },
                                "style": {
                                    "marginRight": "5px"
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.groupMemberItem = params.row;
                                        pageVue.groupMemberPageInfo.groupId = pageVue.groupList[params.index]["id"];
                                        pageVue.groupMemberPageInfo.companyId = pageVue.groupList[params.index]["companyId"];
                                        // pageVue.groupTypeId = pageVue.groupList[params.index]["groupTypeId"];
                                        pageVue.groupTypeId = 123;
                                        pageVue.itemInfo.id = pageVue.groupList[params.index]["id"];
                                        pageVue.isShowMember = true;
                                        pageVue.getGroupMemberList(true);
                                    }
                                }
                            }, { 'CN': '组成员', 'EN': 'Group Members', 'TW': '組成員' }[language["language"]]),
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
                                        pageVue.delItem();
                                    }
                                }
                            }, { "CN": "删除", "EN": "Delete", "TW": "刪除" }[language["language"]])
                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "groupList": [],
            "companyList": [],
            "groupMemberList": [],
            "groupMemberItem": {
                "id": "",
                "groupId": "",
                "objectId": "",
                "companyId": "",
                "objectName": "",
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "groupMemberPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "groupId": "", //组ID
                "companyId": "", //公司ID
                "objTypeId": "", //公司ID
            },
            "selectGroupMember": [],
            "groupMemberColumsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                // {
                //     "title": { "CN": "公司名称", "EN": "Company Name", "TW": "公司名稱" }[language["language"]],
                //     "key": "companyName"
                // },
                // {
                //     "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                //     "key": "groupName"
                // },
                {
                    "title": { "CN": "车牌号", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "objCode"
                },
                {
                    "title": { "CN": "类型", "EN": "Member Name", "TW": "成員名稱" }[language["language"]],
                    "key": "objTypeName"
                }
            ],
            "groupMemberDataList": [],

            "groupTypeId": 123,
            "groupTypePageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 10000,
            },
            "groupTypePageInfoModal": {
                "vehicleTypeId": "",
                "licenseNumber": "",
                "companyId": "", //公司ID
            },
            "groupTypeColumsList": [],
            "groupTypeDataList": [],
            "selectTypeMember": [],
            "selectMember": [],

            // 接口信息
            "groupTypeInterFace": {
                // 用户
                "121": {
                    "service": CONFIG.SERVICE.userService,
                    "action": CONFIG.ACTION.getUserList,
                    "columnsList": "userColumnsList",
                    "tableRowList": "userTableRowList",
                    "dataList": "userList",
                },
                // 防区
                "122": {
                    "service": CONFIG.SERVICE.areaService,
                    "action": CONFIG.ACTION.getSecureAreaList,
                    "columnsList": "areaColumnsList",
                    "tableRowList": "areaTableRowList",
                    "dataList": "areaList",
                },
                // 车辆
                "123": {
                    "service": CONFIG.SERVICE.vehicleService,
                    "action": CONFIG.ACTION.getVehicleList,
                    "columnsList": "vehicleColumnsList",
                    "tableRowList": "vehicleTableRowList",
                    "dataList": "vehicleList",
                },
                // 设备
                "124": {
                    "service": CONFIG.SERVICE.deviceService,
                    "action": CONFIG.ACTION.getDeviceList,
                    "columnsList": "deviceColumnsList",
                    "tableRowList": "deviceTableRowList",
                    "dataList": "deviceList",
                },
                // 摄像机
                "125": {
                    "service": CONFIG.SERVICE.deviceService,
                    "action": CONFIG.ACTION.getCameraList,
                    "columnsList": "cameraColumnsList",
                    "tableRowList": "cameraTableRowList",
                    "dataList": "deviceList",
                }
            },

            // 用户
            "sexTypeList": bizParam["sexType"],
            "userStatusTypeList": bizParam["userStatusType"],
            "userList": [],
            "userColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "用户姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
                    "key": "userName"
                },
                {
                    "title": { "CN": "性别", "EN": "Gender", "TW": "性別" }[language["language"]],
                    "key": "sex"
                },
                {
                    "title": { "CN": "手机号", "EN": "cellPhone No.", "TW": "手機號" }[language["language"]],
                    "key": "mobile"
                },
                {
                    "title": { "CN": "所属公司", "EN": "Company", "TW": "所屬公司" }[language["language"]],
                    "key": "company"
                },
                {
                    "title": { "CN": "员工工号", "EN": "Staff Number", "TW": "員工工號" }[language["language"]],
                    "key": "userSeq"
                }
            ],
            "userTableRowList": [],

            // 防区
            "areaList": [],
            "areaColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "areaName",
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "areaCode",
                },
                {
                    "title": { "CN": "状态", "EN": "Status", "TW": "狀態" }[language["language"]],
                    "key": "secureStatus",
                },
                {
                    "title": { "CN": "速度上限", "EN": "Speed Limit", "TW": "速度上限" }[language["language"]],
                    "key": "speedLimit",
                },
                {
                    "title": { "CN": "停留时长", "EN": "Length Of Stay", "TW": "停留時長" }[language["language"]],
                    "key": "staySecond",
                },
            ],
            "areaTableRowList": [],

            // 车辆
            "vehicleList": [],
            "vehicleColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "车牌号", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "licenseNumber"
                },
                {
                    "title": { "CN": "类型", "EN": "Type", "TW": "類型" }[language["language"]],
                    "key": "vehicleTypeName"
                },
                // {
                //     "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                //     "key": "vehicleCode"
                // },
                // {
                //     "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                //     "key": "vehicleStatus"
                // }
            ],
            "vehicleTableRowList": [],

            // 定位设备
            "deviceList": [],
            "deviceColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "运行状态", "EN": "Working Condition", "TW": "運行狀態" }[language["language"]],
                    "key": "deviceStatusName"
                },
                {
                    "title": { "CN": "供应商", "EN": "Supplier", "TW": "廠家名稱" }[language["language"]],
                    "key": "providerName"
                },
                {
                    "title": { "CN": "系统版本", "EN": "System Version", "TW": "系統版本" }[language["language"]],
                    "key": "versionName"
                },
                {
                    "title": { "CN": "系统版本号", "EN": "System Version No.", "TW": "系統版本號" }[language["language"]],
                    "key": "versionNum"
                },
            ],
            "deviceTableRowList": [],

            // 摄像头
            "cameraList": [],
            "cameraColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "cameraName"
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "cameraCode"
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "cameraDesc"
                },
            ],
            "cameraTableRowList": [],

            // 数据权限
            "permissionsItem": {
                "id": "",
                "groupId": "",
                "groupName": "",
                "companyId": "",
                "companyName": "",
                "resId": "",
                "resName": "",
                "resTypeId": "",
                "resTypeName": "",
                "createUserName": "",
                "modifyUserName": "", // 修改用户ID，修改时必传
            },
            "selectPermission": [],
            "permissionList": [],
            "permissionsPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "groupId": "",
                "companyId": "",
            },
            "permissionsColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "groupName"
                },
                {
                    "title": { "CN": "公司名", "EN": "Company Name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "业务对象", "EN": "Business Object", "TW": "業務對象" }[language["language"]],
                    "key": "resName"
                }
            ],
            "permissionsTableRowList": [],

            "functionsPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "functionList": [],
            "selectFunction": [],
            "permissionFunctionTypeLis": bizParam["permissionFunctionType"],
            "functionsColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                // {
                //     "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                //     "width": 60,
                //     "key": "id"
                // },
                {
                    "title": { "CN": "功能层级", "EN": "Functions Name", "TW": "功能層級" }[language["language"]],
                    "key": "functionLevel"
                },
                {
                    "title": { "CN": "功能类型", "EN": "Functions Type", "TW": "功能類型" }[language["language"]],
                    "key": "functionType"
                },
                {
                    "title": { "CN": "功能名称", "EN": "Functions Name", "TW": "功能名稱" }[language["language"]],
                    "key": "functionName"
                },
                {
                    "title": { "CN": "是否可用", "EN": "isValid", "TW": "是否可用" }[language["language"]],
                    "key": "isValid"
                }
            ],
            "functionsTableRowList": [],
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
                    "id": "",
                    "companyId": "",
                    "groupTypeId": 123,
                    "groupName": "",
                    "groupDesc": "",
                    "isValid": 1,
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.groupList[self.index];
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
            },
            // 删除
            "delItem": function () {
                var self = this;
                self.$Modal.confirm({
                    "title": "确定删除？",
                    "width": 200,
                    "onOk": function() {
                        self.itemInfo = self.groupList[self.index];
                        utility.showMessageTip(self, function () {
                            utility.interactWithServer({
                                url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.delGroup + "&ids=" + self.itemInfo.id + "&modifyUserId=" + userInfo["id"],
                                actionUrl: CONFIG.SERVICE.groupService,
                                beforeSendCallback: function () {
                                    self.isTableLoading = true;
                                },
                                completeCallback: function () {
                                    self.isTableLoading = false;
                                },
                                successCallback: function (data) {
                                    if (data.code == 200) {
                                        self.getGroupList(true);
                                    } else {
                                        self.$Message.error(data.message);
                                    }
                                }
                            });
                        });
                    }
                });
            },
            // 角色成员
            "selectMembers": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.isShowMember = true;
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

            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.saveGroup,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        "id": self.itemInfo.id,
                        "companyId": self.itemInfo.companyId,
                        "groupTypeId": self.itemInfo.groupTypeId,
                        "groupName": encodeURI(self.itemInfo.groupName),
                        "groupDesc": encodeURI(self.itemInfo.groupDesc),
                        "isValid": self.itemInfo.isValid,
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getGroupList(true);
                            self.isShowModal = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupList(true);
                }, 200);
            },
            // 格式化组数据
            "formatGroupData": function () {
                var self = this;

                for (var i = 0, len = self.groupList.length; i < len; i++) {
                    self.tableRowList.push({
                        "groupName": decodeURI(self.groupList[i]["groupName"]), //"组名称",
                        "companyName": decodeURI(self.groupList[i]["companyName"]), //"所在公司",
                        "groupTypeName": self.groupList[i]["groupTypeName"], //"分组类型",
                        "createTime": self.groupList[i]["createTime"], //"创建时间",
                        "groupDesc": decodeURI(self.groupList[i]["groupDesc"]), //"组描述",
                        "isValid": { "1": { 'CN': '可用', 'EN': 'Available', 'TW': '可用' }[self.language], "0": { 'CN': '不可用', 'EN': 'Unavailable', 'TW': '不可用' }[self.language] }[self.groupList[i]["isValid"] + ""], //"是否可用",
                    });
                }
            },
            // 获取组列表信息
            "getGroupList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.tableRowList = [];
                self.groupList = [];
                if (bool == true) {
                    self.page.pageNum = 0;
                    self.page.count = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "groupName": encodeURI(self.pageInfo.groupName), // 查询关键字（用户名称）
                        "companyId": self.pageInfo.companyId, // 公司ID
                    }, //self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.groupList = data.data;
                            self.page.count = data.count;

                            // 格式化表格数据
                            self.formatGroupData();
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
            // 格式化组成员
            "formatGroupMember": function () {
                var self = this;

                for (var i = 0, len = self.groupMemberList.length; i < len; i++) {
                    self.groupMemberDataList.push({
                        "id": decodeURI(self.groupMemberList[i]["id"]), //"组名称",
                        "groupName": decodeURI(self.groupMemberList[i]["groupTypeName"]), //"组名称",
                        "objectName": decodeURI(self.groupMemberList[i]["objectName"]), //"成员名称",
                        "objCode": decodeURI(self.groupMemberList[i]["objNumber"]), //"成员名称",
                        "objTypeName": decodeURI(self.groupMemberList[i]["objTypeName"]), //"成员名称",
                        "companyName": decodeURI(self.groupMemberList[i]["companyName"]), //"公司名称",
                    });
                }
            },
            // 获取组成员信息
            "getGroupMemberList": function (bool) {
                var self = this;
                self.groupMemberDataList = [];
                if (bool == true) {
                    self.groupMemberPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupMemberList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: self.groupMemberPageInfo,
                    beforeSendCallback: function () {
                        self.isAddTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isAddTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.groupMemberList = data.data;
                            self.groupMemberPageInfo.count = data.count;
                            self.formatGroupMember();
                        }
                    }
                });
            },
            // 删除组成员
            "deleteGroupMember": function () {
                var self = this;
                if (self.selectMember.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                self.isModalLoading = true;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.delGroupMember,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        objectIds: self.selectMember.join(","), // 成员id
                        modifyUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isAddTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isAddTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            if (data.code == 200) {
                                self.getGroupMemberList(true);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    }
                });
            },
            // 当选择的成员改变时
            "selectMemberChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectMember = ids;
            },
            // 页数改变时的回调
            "groupMemberPageSizeChange": function (value) {
                var self = this;
                self.groupMemberPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "groupMemberPageRowChange": function (value) {
                var self = this;
                self.groupMemberPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            // 页数改变时的回调
            "groupTypePageSizeChange": function (value) {
                var self = this;
                self.groupTypePageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.showGroupTypeList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "groupTypePageRowChange": function (value) {
                var self = this;
                self.groupTypePageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.showGroupTypeList(false);
                }, 200);
            },
            // 格式化组类型数据
            "formatGroupTypeData": function () {
                var self = this;
                var list = self[self.groupTypeInterFace[self.groupTypeId]["dataList"]];
                self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]] = list;
            },
            // 获取不同类型的列表数据
            "getGroupTypeDataList": function (bool,callback) {
                var self = this;
                self[self.groupTypeInterFace[self.groupTypeId]["dataList"]] = [];
                self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]] = [];
                
                if (bool == true) {
                    self.groupTypePageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + self.groupTypeInterFace[self.groupTypeId]["service"] + "?action=" + self.groupTypeInterFace[self.groupTypeId]["action"],
                    actionUrl: self.groupTypeInterFace[self.groupTypeId]["service"],
                    dataObj: {
                        companyId: self.groupMemberPageInfo.companyId,
                        pageNum: self.groupTypePageInfo.pageNum,
                        pageSize: self.groupTypePageInfo.pageSize,
                        vehicleTypeId: self.groupTypePageInfoModal.vehicleTypeId,
                        licenseNumber: encodeURI(self.groupTypePageInfoModal.licenseNumber),
                    },
                    beforeSendCallback: function () {
                        self.isAddTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isAddTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self[self.groupTypeInterFace[self.groupTypeId]["dataList"]] = data.data.reverse();
                            self.groupTypePageInfo.count = data.count;
                            self.formatGroupTypeData();
                            !!callback && callback();
                            self.groupTypeColumsList = self[self.groupTypeInterFace[self.groupTypeId]["columnsList"]];
                            self.groupTypeDataList = self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]];
                        }
                    }
                });
            },
            // 显示不同分组成员列表
            "showGroupTypeList": function (bool) {
                var self = this;
                self.getGroupTypeDataList(bool, function () {
                    // self.groupTypeColumsList = self[self.groupTypeInterFace[self.groupTypeId]["columnsList"]];
                    // self.groupTypeDataList = self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]];
                    if(self.groupTypeDataList.lengt==0) {
                        self.$Message.error("没有成员数组");
                        return;
                    }
                    self.isShowGroupTypeList = true;
                });
            },
            "selectTypeMemberChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectTypeMember = ids;
            },

            // 新增组成员
            "addGroupTypeMember": function () {
                var self = this;
                if (self.selectTypeMember.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.saveGroupMember,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        groupId: self.itemInfo.id,
                        objectIds: self.selectTypeMember.join(","), // 公司id
                        modifyUserId: userInfo["id"], // 修改用户的id
                        createUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isModalLoading = true;
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getGroupMemberList(true);
                            self.isShowGroupTypeList = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 获取用户组可访问的业务数据对象列表接口
            "getUserGroupDataResList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getUserGroupDataResList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: {
                        groupId: self.permissionsItem.id, // 公司id
                        modifyUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isAddTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isAddTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {

                        }
                    }
                });
            },

            // 当选择的行发生变化时 
            "selectPermissionChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectPermission = ids;
            },
            "permissionsPageSizeChange": function (value) {
                var self = this;
                self.permissionsPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getPermissionsDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "permissionsPageRowChange": function (value) {
                var self = this;
                self.permissionsPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getPermissionsDataList(false);
                }, 200);
            },
            // 格式化用户可访问用户列表
            "formatPermission": function () {
                var self = this;

                for (var i = 0, len = self.permissionList.length; i < len; i++) {
                    self.permissionsTableRowList.push({
                        "id": decodeURI(self.permissionList[i]["id"]), //"组名称",
                        "groupName": decodeURI(self.permissionList[i]["groupName"]), //"组名称",
                        "companyName": decodeURI(self.permissionList[i]["companyName"]), //"公司名",
                        "resName": decodeURI(self.permissionList[i]["resName"]), //"业务对象",
                    });
                }
            },
            // 获取角色可用功能列表数据接口
            "getPermissionsDataList": function (bool) {
                var self = this;
                self.permissionsTableRowList = [];
                if (bool == true) {
                    self.permissionsPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getUserGroupDataResList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.permissionsPageInfo,
                    beforeSendCallback: function () {
                        self.isAddTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isAddTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.permissionList = data.data;
                            self.permissionsPageInfo.count = data.count;

                            self.formatPermission();

                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 删除数据权限
            "deletePermissions": function () {
                var self = this;
                if (self.selectPermission.length == 0) {
                    self.$Message.error({
                        "content": { "CN": "请选择一条数据", "EN": "Please select a data", "TW": "請選擇一條數據" }[self.language],
                        "top": 200,
                        "duration": 3
                    });
                    return;
                }
                self.isModalLoading = true;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.delUserGroupDataResList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        resIds: self.selectPermission.join(","), // 成员id
                        modifyUserId: userInfo["id"], // 修改用户的id
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            if (data.code == 200) {
                                self.getPermissionsDataList(true);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    }
                });
            },
            // 提交功能信息到服務器
            "uploadPermissionsDataToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.saveUserGroupDataRes,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: {
                        "groupId": self.permissionsPageInfo.groupId, // 所属用户组 id
                        "resIds": self.selectFunction.join(","), // 功能id
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.isModalLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getPermissionsDataList(true);
                            self.isFunctionList = false;
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },

            // 显示功能层
            "showFunctionsLayer": function () {
                var self = this;
                self.isFunctionList = true;
                self.getFunctionsDataList(true);
            },
            // 当选择的行发生变化时 
            "selectFunctionsChange": function (selection) {
                var self = this;
                var ids = [];

                for (var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectFunction = ids;
            },
            
            // 格式化系统操作权限功能
            "formatFunctions": function () {
                var self = this;
                for (var i = 0, len = self.functionList.length; i < len; i++) {
                    self.functionsTableRowList.push({
                        "id": self.functionList[i]["id"], //"角色名称",
                        "functionLevel": self.functionList[i]["functionLevel"], //"权限所处层级",
                        "functionType": (function () {
                            var type = "";
                            for (var f = 0, flen = self.permissionFunctionTypeLis.length; f < flen; f++) {
                                if (self.permissionFunctionTypeLis[f]["type"] == self.functionList[f]["functionType"]) {
                                    type = self.permissionFunctionTypeLis[f]["name"];
                                    break;
                                }
                            }
                            return type;
                        }()), // self.permissionFunctionTypeLis[self.functionList[i]["functionType"]], //"功能类型",
                        "functionName": decodeURI(self.functionList[i]["functionName"]), //"功能名称",
                        "functionCode": decodeURI(self.functionList[i]["functionCode"]), //"功能权限项描述",
                        "isValid": { "1": { 'CN': '是', 'EN': 'Yes', 'TW': '是' }[self.language], "0": { 'CN': '否', 'EN': 'No', 'TW': '否' }[self.language] }[self.functionList[i]["isValid"] + ""], //"是否有效"
                    });
                }
            },
            // 获取系统操作权限功能项目列表接口
            "getFunctionsDataList": function (bool) {
                var self = this;
                self.functionsTableRowList = [];
                if (bool == true) {
                    self.functionsPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.permissionService + "?action=" + CONFIG.ACTION.getFunctionList,
                    actionUrl: CONFIG.SERVICE.permissionService,
                    dataObj: self.functionsPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.functionList = data.data;
                            self.functionsPageInfo.count = data.count;
                            self.formatFunctions();
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 页数改变时的回调
            "functionsPageSizeChange": function (value) {
                var self = this;
                self.functionsPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "functionsPageRowChange": function (value) {
                var self = this;
                console.log(value);
                self.functionsPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getFunctionsDataList(false);
                }, 200);
            },
        },
        "created": function () {
            var self = this;
            var timeOut = null;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getGroupList(true);
                self.getCompanyList();
            }, 500);

            self.$watch('pageInfo', function () {
                clearTimeout(timeOut);
                timeOut = setTimeout(function() {
                    self.getGroupList(true);
                }, 500);
            }, {
                deep: true
            });

            self.$watch('groupTypePageInfoModal', function () {
                clearTimeout(timeOut);
                timeOut = setTimeout(function() {
                    self.getGroupTypeDataList(true);
                }, 500);
            }, {
                deep: true
            });
            
        }
    });

}())
