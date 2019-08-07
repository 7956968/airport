(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var onlineStatItemInfo = utility.getSessionStorage("onlineStatItemInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isModalLoading": true,
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "pageInfo": {
                "id": "", // 指定的维护记录ID
                "count": 0,
                "deptId": "", // 部门ID
                "deptIds": "", // 部门ID
                "companyId": "", // 所属公司ID
                "statusType": -1,  //上下线类型： -1：全部 0：下线 1：上线
                "vehicleName": "",// 车辆名称
                "licenseNumber": "",// 车牌号
                "beginTime": "", // 开始时间
                "endTime": "", // 结束时间
            },
            "page": {
                "pageSize": 20,
                "pageNum": 1,
            },
            "columnsList": [
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName",
                    "width": 200
                },
                {
                    "title": { "CN": "部门", "EN": "Department", "TW": "部門" }[language["language"]],
                    "key": "deptName"
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": "车牌号",
                    "key": "licenseNumber"
                },
                {
                    "title": "统计日期",
                    "key": "statDay",
                },
                {
                    "title": "上下线时间",
                    "key": "changeTime"
                },
                {
                    "title": "上下线类型",
                    "key": "statusType",
                    "render": function (h, params) {
                        var type = {
                            '_-1': '',
                            '_0': '下线',
                            '_1': '上线'
                        };
                        return h("div", [
                            h("span", {}, type['_' + params.row.statusType]),
                        ]);
                    }
                },

            ],
            "departmentList": [],
            "vehicleList": [],
            "companyList": [],
            "userList": [],
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
            // 时间变化
            "beginRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.beginTime = value;
            },
            "endRepairTime": function (value, item) {
                var self = this;
                self.pageInfo.endTime = value;
            },
            // 页数改变时的回调
            "pageSizeChange": function (value) {
                var self = this;
                self.page.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineDetail(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleOnlineDetail(false);
                }, 200);
            },
            // 下载Excel
            "downLoadExcel": function () {
                var self = this;
                var timestamp = Date.parse(new Date());

                var info = {
                    "deptId": self.pageInfo.deptId, // 部门ID
                    "companyId": self.pageInfo.companyId, // 所属公司ID
                    "statusType": self.pageInfo.statusType,  //上下线类型： -1：全部 0：下线 1：上线
                    "vehicleName": encodeURI(self.pageInfo.vehicleName),// 车辆名称
                    "licenseNumber": encodeURI(self.pageInfo.licenseNumber),// 车牌号
                    "beginTime": self.pageInfo.beginTime, // 开始时间
                    "endTime": self.pageInfo.endTime, // 结束时间
                    "version": 100, // 默认100
                    "timestamp": timestamp,
                    "languageVer": 'cn', // cn：中文简体 en：英语 hk：中文繁体
                    "appType": 2, // 请求来源类型：1:H5 2:WWW 3:android app 4: ios app
                    "actionUrl": CONFIG.SERVICE.vehicleService, // 使用接口URL(注意：不包含http://ip:port的服务器域名/IP+端口这部分)
                    "userId": !!userInfo ? userInfo["id"] : "",
                    "userToken": !!userInfo ? userInfo["userToken"] : "", // 登陆后会有，如无则为空字符串
                    "signStr": md5((!!userInfo ? userInfo["userToken"] : "") + (!!userInfo ? userInfo["id"] : "") + timestamp + "100").toUpperCase() // 算法：MD5(userToken + userid+ timestamp+languageVer +version)，安全Key由系统设定
                };
                var params = "";
                var url = CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.downVehicleOnlineDetail;

                for (var key in info) {
                    if (info.hasOwnProperty(key)) {
                        params = params + ("&" + key + "=" + info[key]);
                    }
                }
                window.open(url + params);
            },
            // 获取车辆信息
            "getVehicleOnlineDetail": function (bool) {
                var self = this;
                self.vehicleList = [];
                if (bool == true) {
                    self.page.pageNum = 0;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleOnlineDetail,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": self.page.pageNum,
                        "pageSize": self.page.pageSize,
                        "deptId": self.pageInfo.deptId, // 部门ID
                        "companyId": self.pageInfo.companyId, // 所属公司ID
                        "statusType": self.pageInfo.statusType,  //上下线类型： -1：全部 0：下线 1：上线
                        "vehicleName": encodeURI(self.pageInfo.vehicleName),// 车辆名称
                        "licenseNumber": encodeURI(self.pageInfo.licenseNumber),// 车牌号
                        "beginTime": self.pageInfo.beginTime, // 开始时间
                        "endTime": self.pageInfo.endTime, // 结束时间
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data;
                            self.pageInfo.count = data.count;
                            // utility.setSessionStorage("onlineStatItemInfo", null);
                        }
                    }
                });
            },
            "changeToGetDetp": function () {
                var self = this;
                self.getDepartmentList();
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
            "getDepartmentList": function () {
                var self = this;
                self.departmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self["pageInfo"]["companyId"] || 0, // 公司ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var arr = [];
                            self["pageInfo"]["deptIds"] = [];
                            self.formatSuperiorDeprt(data.data);

                            self.getSuper(self.departmentList, self["pageInfo"]["deptId"], arr);

                            self["pageInfo"]["deptIds"] = arr.reverse();
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
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            if(!!onlineStatItemInfo) {
                self.pageInfo.licenseNumber = onlineStatItemInfo.licenseNumber;
            }

            setTimeout(function () {
                self.getVehicleOnlineDetail(true);
                self.getCompanyList();
                self.getDepartmentList();
                self.$watch('pageInfo', function () {
                    self.getVehicleOnlineDetail(true);
                }, { deep: true });
            }, 500);
        }
    });

}())
