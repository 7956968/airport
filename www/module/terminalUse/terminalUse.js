(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowTerminal": false,
            "isModalLoading": true,
            "modalTitle": "",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "itemInfo": null,
            "columnsList": [
                {
                    "type": "index",
                    "width": 60,
                    "align": "center"
                },
                {
                    "title": { "CN": "终端编号", "EN": "Terminal Number", "TW": "終端編號" }[language["language"]],
                    "key": "terminalNum"
                },
                {
                    "title": { "CN": "车辆编号", "EN": "Vehicle Number", "TW": "車輛編號" }[language["language"]],
                    "key": "vehicleNum"
                },
                {
                    "title": { "CN": "归属公司", "EN": "Ownership Company", "TW": "歸屬公司" }[language["language"]],
                    "key": "ownership"
                },
                {
                    "title": { "CN": "创建时间", "EN": "Creation Time", "TW": "創建時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "上报周期", "EN": "Reporting Cycle", "TW": "上報週期" }[language["language"]],
                    "key": "cycle"
                },
                {
                    "title": { "CN": "工作状态", "EN": "Working Condition", "TW": "工作狀態" }[language["language"]],
                    "key": "workingCondition"
                },
                {
                    "title": { "CN": "正常工作时长", "EN": "Normal Working Hours", "TW": "正常工作時長" }[language["language"]],
                    "key": "workingHours"
                },
                {
                    "title": { "CN": "电量", "EN": "Electric Quantity", "TW": "電量" }[language["language"]],
                    "key": "electric"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    "cycle": "上报周期",
                    "vehicleType": "车辆类型",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间",
                    "electric": "电量"
                },
                {
                    "id": 2,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 3,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 4,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 5,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 6,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 7,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 8,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 9,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 10,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 11,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 12,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 13,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 14,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 15,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 16,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 17,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 18,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                },
                {
                    "id": 20,
                    
                    "terminalNum": "终端编号",
                    "vehicleNum": "车辆编号",
                    
                    "cycle": "上报周期",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "workingCondition": "工作状态",
                    "workingHours": "正常工作时长",
                    "time": "创建时间"
                }
            ]
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
            "add": function () {
                var self = this;
                self.isShowModal = true;
                self.isModalLoading = true;
                self.modalTitle = { "CN": "新增", "EN": "Add", "TW": "新增" }[self.language];
            },
            //编辑
            "edit": function () {
                var self = this;
                utility.showMessageTip(self, function() {
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language]; 
                });
            },
            // 选择终端
            "selectTerminal": function() {
                var self = this;
                self.isShowTerminal = true;
            },
            // 当选择的行发生变化时 
            "setCurrentRowData": function (event) {
                var self = this;

                console.log(event);

                if (!!event) {
                    self.itemInfo = event;
                }
            },
            // 提交信息到服務器
            "uploadDataToServer": function () {
                var self = this;
                setTimeout(function () {
                    self.isModalLoading = false;
                }, 2000);
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            setTimeout(function () {
                self.isTableLoading = false;
            }, 2000);
        }
    });

}())
