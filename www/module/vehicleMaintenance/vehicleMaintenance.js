(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
            "isShowVehicleNumber": false,
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
                    "title": { "CN": "车辆编号", "EN": "Vehicle Number", "TW": "車輛编号" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "本次保养日期", "EN": "This Maintenance Date", "TW": "本次保養日期" }[language["language"]],
                    "key": "thisDate"
                },
                {
                    "title": { "CN": "保养项目", "EN": "Maintenance Projects", "TW": "保養項目" }[language["language"]],
                    "key": "project"
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "type"
                },
                {
                    "title": { "CN": "归属公司", "EN": "OwnerShip Company", "TW": "歸屬公司" }[language["language"]],
                    "key": "ownerCompnay"
                },
                {
                    "title": { "CN": "保养单位", "EN": "Maintenance Company", "TW": "保養單位" }[language["language"]],
                    "key": "maintCompnnay"
                },
                {
                    "title": { "CN": "当前里程数", "EN": "Current Mileage", "TW": "當前里程數" }[language["language"]],
                    "key": "currentMile"
                },
                {
                    "title": { "CN": "上次保养日期", "EN": "Last Maintenance Date", "TW": "上次保養日期" }[language["language"]],
                    "key": "lastDate"
                },
                {
                    "title": { "CN": "上次保养里程数", "EN": "Number Of Miles Last Maintained", "TW": "上次保養里程數" }[language["language"]],
                    "key": "lastMile"
                },
                {
                    "title": { "CN": "保养责任人", "EN": "Maintenance Responsible Person", "TW": "保養責任人" }[language["language"]],
                    "key": "person"
                },
                {
                    "title": { "CN": "下次保养里程数", "EN": "Number Of Miles Next Maintained", "TW": "下次保養里程數" }[language["language"]],
                    "key": "nextMile"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 2,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 3,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 4,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 5,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 6,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司"
                },
                {
                    "id": 7,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 8,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 9,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 10,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 11,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 12,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 13,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 14,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 15,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 16,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 17,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 18,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 19,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 19,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
                },
                {
                    "id": 20,
                    "number": "车辆编号",
                    "thisDate": "本次保养日期",
                    "project": "保养项目",
                    "thisDate": "本次保养日期",
                    "type": "车辆类型",
                    "ownerCompnay": "归属公司",
                    "maintCompnnay": "保养单位",
                    "currentMile": "当前里程数",
                    "lastDate":"上次保养日期",
                    "lastMile": "上次保养里程数",
                    "person": "保养责任人",
                    "nextMile": "下次保养里程数"
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
            "selectVehicleNumber": function() {
                var self = this;
                self.isShowVehicleNumber = true;
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
