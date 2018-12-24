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
            "isModalLoading": true,
            "modalTitle": "",
            "isShowMember": false,
            "isShowGroupTypeList": false,
            "isPermissions": false,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "groupTypeList": bizParam["groupType"],
            "index": 0,
            "pageInfo": {
                "id": 0,
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "id": "", // 查询关键字（角色名称）
                "groupTypeId": "", // 查询关键字（用户名称）
                "groupName": "", // 查询关键字（用户名称）
                "companyId": "", // 公司ID
            },
            "selectItem": null,
            "itemInfo": {
                "id": "",
                "companyId": "",
                "groupTypeId": "",
                "groupName": "",
                "groupDesc": "",
                "isValid": "1",
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
                    "key": "companyName"
                },
                {
                    "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "groupName"
                },
                {
                    "title": { "CN": "分组类型", "EN": "Gruop Type", "TW": "分組類型" }[language["language"]],
                    "key": "groupTypeName"
                },
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
                                        pageVue.groupMemberPageInfo.groupId = pageVue.groupList[params.index]["id"];
                                        pageVue.groupMemberPageInfo.companyId = pageVue.groupList[params.index]["companyId"];
                                        pageVue.groupTypeId = pageVue.groupList[params.index]["groupTypeId"];
                                        pageVue.itemInfo.id = pageVue.groupList[params.index]["id"];
                                        pageVue.isShowMember = true;
                                        pageVue.getGroupMemberList(true);
                                    }
                                }
                            }, { 'CN': '组成员', 'EN': 'Group Members', 'TW': '組成員' }[language["language"]]),
                            h('Button', {
                                "props": {
                                    "type": "info",
                                    "size": "small"
                                },
                                "style": {
                                    "marginRight": "5px"
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.isPermissions = true;
                                    }
                                }
                            }, { "CN": "数据权限", "EN": "Data Permissions", "TW": "數據權限" }[language["language"]]),

                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "groupList": [],
            "companyList": [],
            "memberIndex": 0,
            "groupMemberList": [],
            "groupMemberItem": {
                "id": "",
                "groupId": "",
                "objectId": "",
                "companyId": "",
                "objectName": "",
                "createUserName": "",
                "modifyUserName": "",
            },
            "groupMemberPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
                "groupId": "", //组ID
                "companyId": "", //公司ID
            },
            "selectGroupMember": [],
            "groupMemberColumsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
                {
                    "title": { "CN": "公司名称", "EN": "Company Name", "TW": "公司名稱" }[language["language"]],
                    "key": "companyName"
                },
                {
                    "title": { "CN": "组名称", "EN": "Group Name", "TW": "組名稱" }[language["language"]],
                    "key": "groupName"
                },
                {
                    "title": { "CN": "成员名称", "EN": "Member Name", "TW": "成員名稱" }[language["language"]],
                    "key": "objectName"
                }
            ],
            "groupMemberDataList": [],

            "groupTypeId": "121",
            "groupTypePageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "groupTypeColumsList": [],
            "groupTypeDataList": [],
            "selectTypeMember": [],

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
                    "service": CONFIG.SERVICE.vehicleService,
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
                {
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "width": 60,
                    "key": "id"
                },
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
                    "title": { "CN": "防区姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
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
            "areaTableRowList": [
                {
                    "userCode": "账号",
                    "userName": "员工姓名",
                    "userSeq": "员工工号",
                    "sex": "性别",
                    "mobile": "固话",
                    "telephone": "手机号",
                    "company": "所属公司",
                    "remark": "备注",
                }
            ],

            // 车辆
            "vehicleList": [],
            "vehicleColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "车辆姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
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
            "vehicleTableRowList": [
                {
                    "userCode": "账号",
                    "userName": "员工姓名",
                    "userSeq": "员工工号",
                    "sex": "性别",
                    "mobile": "固话",
                    "telephone": "手机号",
                    "company": "所属公司",
                    "remark": "备注",
                }
            ],

            // 定位设备
            "deviceList": [],
            "deviceColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "定位设备姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
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
            "deviceTableRowList": [
                {
                    "userCode": "账号",
                    "userName": "员工姓名",
                    "userSeq": "员工工号",
                    "sex": "性别",
                    "mobile": "固话",
                    "telephone": "手机号",
                    "company": "所属公司",
                    "remark": "备注",
                },
            ],

            // 摄像头
            "cameraList": [],
            "cameraColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "摄像头姓名", "EN": "Name", "TW": "姓名" }[language["language"]],
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
            "cameraTableRowList": [
                {
                    "userCode": "账号",
                    "userName": "员工姓名",
                    "userSeq": "员工工号",
                    "sex": "性别",
                    "mobile": "固话",
                    "telephone": "手机号",
                    "company": "所属公司",
                    "remark": "备注",
                },
            ],

            // 数据权限
            "permissionsId": "931",
            "permissionsIndex": 0,
            "permissionsItem": null,
            "permissionInterface": {
                // 防区
                "931": {
                    "service": CONFIG.SERVICE.areaService,
                    "action": CONFIG.ACTION.getSecureAreaList,
                    "columnsList": "areaColumnsList",
                    "tableRowList": "areaTableRowList"
                },
                // 车辆
                "932": {
                    "service": CONFIG.SERVICE.vehicleService,
                    "action": CONFIG.ACTION.getVehicleList,
                    "columnsList": "vehicleColumnsList",
                    "tableRowList": "vehicleTableRowList"
                },
                // 摄像机
                "933": {
                    "service": CONFIG.SERVICE.deviceService,
                    "action": CONFIG.ACTION.getCameraList,
                    "columnsList": "cameraColumnsList",
                    "tableRowList": "cameraTableRowList"
                },
                // 单个防区
                "934": {
                    "service": CONFIG.SERVICE.areaService,
                    "action": CONFIG.ACTION.getSecureAreaList,
                    "columnsList": "areaColumnsList",
                    "tableRowList": "areaTableRowList"
                },
                // 单个车辆
                "935": {
                    "service": CONFIG.SERVICE.vehicleService,
                    "action": CONFIG.ACTION.getVehicleList,
                    "columnsList": "vehicleColumnsList",
                    "tableRowList": "vehicleTableRowList"
                },
                // 单个摄像机
                "936": {
                    "service": CONFIG.SERVICE.deviceService,
                    "action": CONFIG.ACTION.getCameraList,
                    "columnsList": "cameraColumnsList",
                    "tableRowList": "cameraTableRowList"
                }
            },
            "permissionsPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 20,
            },
            "permissionsColumnsList": [
                {
                    "type": "selection",
                    "width": 60,
                    "align": "center"
                },
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
            "permissionsTableRowList": [
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                },
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                },
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                },
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                },
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                },
                {
                    "groupName": "组名称",
                    "companyName": "公司名",
                    "resName": "业务对象"
                }
            ]

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
                    "groupTypeId": "",
                    "groupName": "",
                    "groupDesc": "",
                    "isValid": "",
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
                self.itemInfo = self.groupList[self.index];
                // 先判断是否选择了一家公司
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
                self.pageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getDataList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.pageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getDataList(false);
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
                if (bool == true) {
                    self.tableRowList = [];
                    self.pageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: self.pageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.groupList = data.data;
                            self.pageInfo.count = data.count;

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
                        "companyName": decodeURI(self.groupMemberList[i]["companyName"]), //"公司名称",
                    });
                }
            },
            // 获取组成员信息
            "getGroupMemberList": function (bool) {
                var self = this;
                if (bool == true) {
                    self.groupMemberDataList = [];
                    self.groupMemberPageInfo.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.groupService + "?action=" + CONFIG.ACTION.getGroupMemberList,
                    actionUrl: CONFIG.SERVICE.groupService,
                    dataObj: self.groupMemberPageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
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
            // 当选择的行发生变化时 
            "setGroupMembeItem": function (item, index) {
                var self = this;
                if (!!item) {
                    self.memberIndex = index;
                    self.groupMemberItem = item;
                }
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
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
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
            "selectMemberChange": function(selection) {
                var self = this;
                var ids = [];

                for(var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectMember = ids;
            },
            // 页数改变时的回调
            "groupMemberPageSizeChange": function (value) {
                var self = this;
                self.groupMemberPageInfo.pageNum = parseInt(value, 10) - 1;
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
                self.groupTypePageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "groupTypePageRowChange": function (value) {
                var self = this;
                self.groupTypePageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            
            // 显示不同分组成员列表
            "showPermissionsList": function () {
                var self = this;
                self.groupTypeColumsList = self[self.permissionInterface[self.permissionsId]["columnsList"]];
                self.groupTypeDataList = self[self.permissionInterface[self.permissionsId]["tableRowList"]];
                self.isShowGroupTypeList = true;
            },

            // 当分组类型改变时
            "groupTypeChange": function (value) {
                var self = this;
                self.groupTypeId = value;

                setTimeout(function() {
                    self.showGroupTypeList(false);
                }, 500);
            },

            // 格式化组类型数据
            "formatGroupTypeData": function () {
                var self = this;
                var list = self[self.groupTypeInterFace[self.groupTypeId]["dataList"]];
                if (self.groupTypeId == "121") {
                    for (var i = 0, len = list.length; i < len; i++) {
                        self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]].push({
                            "id": list[i]["id"], //"id",
                            "userCode": list[i]["userCode"], //"账号",
                            "userName": decodeURI(list[i]["userName"]), //"员工姓名",
                            "userSeq": list[i]["userSeq"], //"员工工号",
                            "mobile": list[i]["mobile"], //"固话",
                            "telephone": list[i]["telephone"], //"手机号",
                            "company": decodeURI(list[i]["companyName"]), //"所属公司",
                            "remark": decodeURI(list[i]["remark"]), //"备注",
                            "sex": (function () {
                                var sex = "";
                                for (var s = 0, slen = self.sexTypeList.length; s < slen; s++) {
                                    if (self.sexTypeList[s]["type"] == list[i]["sex"]) {
                                        sex = self.sexTypeList[s]["name"];
                                        break;
                                    }
                                }
                                return sex
                            }()), //"性别",
                            "state": (function () {
                                var statu = "";
                                for (var s = 0, slen = self.userStatusTypeList.length; s < slen; s++) {
                                    if (self.userStatusTypeList[s]["type"] == list[i]["status"]) {
                                        statu = self.userStatusTypeList[s]["name"];
                                        break;
                                    }
                                }
                                return statu
                            }()),
                        });
                    }
                }
            },
            // 获取不同类型的列表数据
            "getGroupTypeDataList": function (callback) {
                var self = this;
                self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]] = [];
                self.groupTypePageInfo.pageNum = 0;
                utility.interactWithServer({
                    url: CONFIG.HOST + self.groupTypeInterFace[self.groupTypeId]["service"] + "?action=" + self.groupTypeInterFace[self.groupTypeId]["action"],
                    actionUrl: self.groupTypeInterFace[self.groupTypeId]["service"],
                    dataObj: self.groupTypePageInfo,
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self[self.groupTypeInterFace[self.groupTypeId]["dataList"]] = data.data;
                            self.groupTypePageInfo.count = data.count;
                            self.formatGroupTypeData();

                            !!callback && callback();
                        }
                    }
                });
            },
            // 显示不同分组成员列表
            "showGroupTypeList": function (bool) {
                var self = this;
                self.getGroupTypeDataList(function () {
                    self.groupTypeColumsList = self[self.groupTypeInterFace[self.groupTypeId]["columnsList"]];
                    self.groupTypeDataList = self[self.groupTypeInterFace[self.groupTypeId]["tableRowList"]];
                    self.isShowGroupTypeList = bool;
                });
            },
            "selectTypeMemberChange": function(selection) {
                var self = this;
                var ids = [];

                for(var i = 0, len = selection.length; i < len; i++) {
                    ids.push(selection[i]["id"]);
                }

                self.selectTypeMember = ids;
            },
            
            // 新增组成员
            "addGroupTypeMember": function() {
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
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {

                        }
                    }
                });
            },
            // 当选择的行发生变化时 
            "setPermissionsItem": function (item, index) {
                var self = this;
                if (!!item) {
                    self.permissionsIndex = index;
                    self.permissionsItem = item;
                }
            },
            // 删除数据权限
            "deletePermissions": function () {
                var self = this;
            },
            "permissionsPageSizeChange": function (value) {
                var self = this;
                self.permissionsPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "permissionsPageRowChange": function (value) {
                var self = this;
                console.log(value);
                self.permissionsPageInfo.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getGroupMemberList(false);
                }, 200);
            },
            // 当分组类型改变时
            "permissionsChange": function (value) {
                var self = this;
                self.permissionsId = value;
            },
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.getGroupList(true);
                self.getCompanyList();
            }, 500);
        }
    });

}())
