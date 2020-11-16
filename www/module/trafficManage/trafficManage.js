(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var fromMap = utility.getSessionStorage("fromMap");
    var filterCompany = [];
    var filterDepart = [];
    // 1：拆卸
    // 2：超速
    // 3：电量低
    // 501：进入防区
    // 502：离开防区
    // 503：防区内停留
    // 504：防区内行驶
    // 505：防区内超速 
    var eventList = [{
            label: "拆卸",
            value: 1
        },
        {
            label: "超速",
            value: 2
        },
        {
            label: "电量低",
            value: 3
        },
        {
            label: "进入防区",
            value: 501
        },
        {
            label: "离开防区",
            value: 502
        },
        {
            label: "防区内停留",
            value: 503
        },
        {
            label: "防区内行驶",
            value: 504
        },
        {
            label: "防区内超速",
            value: 505
        },
    ];
    var dealFlagList = [
        {
            label: "未处理",
            value: 0,
        },
        {
            label: "处理中",
            value: 1,
        },
        {
            label: "已处理",
            value: 2,
        }
    ];
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "filterDepart": [],
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowDetail": false,
            "isModalLoading": true,
            "modalTitle": "",
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "pageInfo": {
                "id": 0,
                "count": 0,
                "companyId": "", // 公司ID
                "deptIds": [], // 部门ID
                "vehicleTypeId": "",
                "vehicleName": "",
                "licenseNumber": "",
                "beginTime": "",
                "endTime": ""
            },
            "page": {
                "pageSize": 20,
                "pageNum": 1,
                "count": 0
            },
            "index": 0,
            "selectItem": "",
            "itemInfo": {
                "id": "",
                "dealFlag": "", // 报警信息处理状态
                "remark": "", //报警信息处理描述，需对中文进行url编码
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "columnsList": [{
                    "type": "index",
                    "align": "center",
                    "title": "序号",
                    "width": 60,
                },
                {
                    "title": "公司名称",
                    "key": "companyName",
                    // "filters": filterCompany,
                    // "filterMultiple": false,
                    // "filterRemote"(value, row) {
                    //     pageVue.pageInfo.companyId = value;
                    //     pageVue.getDepartmentList();
                    // }
                },
                {
                    "title": "部门名称",
                    "key": "deptName",
                    // "filters": filterDepart,
                    // "filterMultiple": false,
                    // "filterRemote"(value, row) {
                    //     pageVue.pageInfo.deptIds = value;
                    // },
                },
                {
                    "title": "车辆名称",
                    "key": "vehicleName"
                },
                {
                    "title": "车牌号",
                    "key": "licenseNumber"
                },
                {
                    "title": "车辆类型",
                    "key": "vehicleTypeName"
                },
                {
                    "title": "总使用流量",
                    "key": "dayCardFlow",
                    "render": function (h, params) {
                        return h("div", params.row.dayCardFlow+'M');
                    }
                },
                // {
                //     "title": "统计日期",
                //     "key": "statDay"
                // },
                {
                    "title": "开始统计时间",
                    "key": "beginTime"
                },
                {
                    "title": "结束统计时间",
                    "key": "endTime"
                },
                {
                    "title": "操作",
                    "key": "operation",
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
                            }, "详情")
                        ]);
                    }
                }
            ],
            "tableRowList": [],
            "userList": [],
            "companyList": [],
            "alarmList": [],
            "superiorDepartmentList": [],
            "deptUserPositionTypeList": bizParam["departmentPositionType"],
            "sumNumber": 0,
            "totalNumber": 0,
            "countCar": 0,
            "currentMonth": "",
            "monthDays": 0,
            "dateInfo": {},
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
                    "remark": "",
                    "dealFlag": "",
                    "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                    "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                };
            },
            // 修改
            "editItem": function () {
                var self = this;
                utility.showMessageTip(self, function () {
                    self.itemInfo = self.alarmList[self.index];
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
                    self.itemInfo = JSON.parse(JSON.stringify(self.alarmList[self.index]));
                    self.isShowDetail = true;
                });
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
                    self.getAlarmList(false);
                }, 200);
            },
            // 切换每页条数时的回调
            "pageRowChange": function (value) {
                var self = this;
                self.page.pageSize = parseInt(value, 10);
                setTimeout(function () {
                    self.getAlarmList(true);
                }, 200);
            },

            // 获取机构用户信息
            "getAlarmList": function (bool, options) {
                var self = this;
                var dataObj = {
                    "pageNum": self.page.pageNum,
                    "pageSize": self.page.pageSize,
                    "licenseNumber": encodeURI(self.pageInfo.licenseNumber),
                    "vehicleTypeId": self.pageInfo.vehicleTypeId,
                    "beginTime": self.pageInfo.beginTime,
                    "endTime": self.pageInfo.endTime,
                    "companyId": self.pageInfo.companyId, // 公司ID
                    "deptId": self.pageInfo.deptIds[self.pageInfo.deptIds.length - 1] || 0, // 部门ID
                };
                
                if(!options) {
                    // 如果是查询，则重新从第一页开始
                    self.tableRowList = [];
                    self.alarmList = [];
                    self.isTableLoading = true;
                }
                if (bool == true) {
                    self.page.pageNum = 1;
                    self.page.count = 0;
                }

                if(!!options && options.isChart == true) {
                    dataObj = {
                        "pageNum": 1,
                        "pageSize": 1,
                        "beginTime": options.beginTime + " 00:00:00",
                        "endTime": options.endTime + " 23:59:59",
                    };
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleCardFlowStat,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: dataObj,
                    async: !!options,
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            if(!options) {
                                self.page.count = data.count;
                                self.sumNumber = data.sum;
                                self.alarmList = data.data;
                            }
                        }

                        if(!!options && options.isChart==true) {
                            !!options.callback && options.callback(data.sum||0);
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
            "getSuper": function (list, value, arr) {
                var self = this;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].value == value) {
                        arr.push(value);
                        if (list[i].paraDeptId == 0) {
                            return;
                        }
                        self.getSuper(self.superiorDepartmentList, list[i].paraDeptId, arr);
                    } else {
                        self.getSuper(list[i]["children"], value, arr);
                    }
                }
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function (list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.superiorDepartmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getSuperiorDeprtList": function (type) {
                var self = this;
                self.superiorDepartmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var arr = [];
                            self[type]["deptIds"] = [];
                            self.formatSuperiorDeprt(data.data); // 格式化机构部门数据
                            self.getSuper(self.superiorDepartmentList, self[type]["deptId"], arr);
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
                            var arr = [];
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
            // 当选择公司时，动态选择部门用户
            "getDepartAndUser": function () {
                var self = this;
                self.itemInfo.userIds = [];
                self.getSuperiorDeprtList("itemInfo");
            },
            // 
            "toMapTrack": function(vehicleInfo) {
                var self = this;
                var self = this;
                utility.setSessionStorage("fromInfo",null);
                utility.setSessionStorage("vehicleTrackFrom", vehicleInfo);
                setTimeout(function () {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
                }, 200);
            },
            // 获取所有车辆使用情况数据
            "getAllVehicleList": function (callback) {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getAllVehiclePositonList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": 1, //0,
                        "pageSize": 1000000000, //20,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            !!callback && callback(data.count * 12 * 1024, data.count);
                        }
                    }
                });
            },

            // 画饼图
            "drawPie": function(time, userData, totalNumber) {
                var self = this;
                var myChart = echarts.init(document.getElementById("illegaInfo"));
                option = {
                    color: ['#d14a61', '#2d8cf0'],
                    title: {
                        text: time +'月份流量使用情况',
                        top: 10,
                        left: 'center'
                    },
                    center: "30%",
                    tooltip: {
                        trigger: 'item',
                        formatter: '{c}G({d}%)'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '60%',
                            center: [150, 155],
                            top: 40,
                            label: {
                                formatter: '{b}{c}G\n{d}%',
                            },
                            data: [
                                {value: Math.round(userData/1024), name: '使用'},
                                {value: Math.round((totalNumber-userData)/1024), name: '剩下'},
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
            },

            // 画曲线图
            "drawLine": function(time, monthDays, data) {
                var self = this;
                var myChart = echarts.init(document.getElementById("milleInfo"));
                option = {
                    color: ['#d14a61', '#2d8cf0'],
                    title: {
                        text: time +'月份每天流量使用情况',
                        top: 10,
                        left: 'center'
                    },
                    grid: {
                        left: 80,
                        top: 60,
                        right: 20,
                        bottom: 40
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}号：{c}M'
                    },
                    legend: {
                        data: ['流量'],
                        left: 10
                    },
                    xAxis: {
                        type: 'category',
                        data: (function(){
                            var arr = [];
                            for(var i = 0; i < monthDays; i++) {
                                arr.push(i+1);
                            }
                            return arr;
                        }())
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data,
                        type: 'line',
                        symbolSize: 8,
                    }]
                };
                myChart.setOption(option);
            },
            "changeMonth": function(value) {
                var self = this;
                self.currentMonth = parseInt(value || self.dateInfo.month, 10);
                self.monthDays = new Date(self.dateInfo.year,self.currentMonth,0).getDate();
                self.drawGraph();
            },
            "drawGraph": function() {
                var self = this;
                var lineData = {};
                var flg = [];
                var userDataList = [];
                self.getAlarmList(false, {
                    isChart: true,
                    beginTime: self.dateInfo.year+"-"+self.currentMonth+"-01",
                    endTime: self.dateInfo.year+"-"+self.currentMonth+"-"+ self.monthDays,
                    callback: function(userData){
                        self.drawPie(self.currentMonth, userData, self.totalNumber);
                    }
                });

                for(var i = 0; i < self.monthDays; i++) {
                    (function(i){
                        self.getAlarmList(false, {
                            isChart: true,
                            beginTime: self.dateInfo.year+"-"+self.currentMonth+"-"+ (i+1),
                            endTime: self.dateInfo.year+"-"+self.currentMonth+"-"+ (i+1),
                            callback: function(userData){
                                lineData["_"+i] = userData;
                                flg.push(userData);

                                if(flg.length == self.monthDays) {
                                    for(var j = 0; j < self.monthDays; j++) {
                                        userDataList.push(lineData["_" + j])
                                    }
                
                                    self.drawLine(self.currentMonth, self.monthDays, userDataList);
                                }
                            }
                        });
                    })(i)
                }
            }
        },
        "created": function () {
            var self = this;
            self.dateInfo = utility.getDateDetailInfo();
            self.currentMonth = parseInt(self.dateInfo.month);
            self.monthDays = new Date(self.dateInfo.year,self.currentMonth,0).getDate();

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            self.getAllVehicleList(function(totalNumber, countCar){
                self.totalNumber = totalNumber;
                self.countCar = countCar
                self.getAlarmList(true);
                self.getCompanyList();

                self.drawGraph();
            });

            self.$watch('pageInfo', function () {
                self.getAlarmList(true);
            }, {
                deep: true
            });
        }
    });

}())