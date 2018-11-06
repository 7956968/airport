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
                    "title": { "CN": "唯一ID", "EN": "Unique ID", "TW": "車輛名稱" }[language["language"]],
                    "key": "uniqueId"
                },
                {
                    "title": { "CN": "名字", "EN": "Name", "TW": "名字" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "歸屬公司" }[language["language"]],
                    "key": "state"
                },
                {
                    "title": { "CN": "速度", "EN": "Speed", "TW": "速度" }[language["language"]],
                    "key": "speed"
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleType"
                },
                {
                    "title": { "CN": "消息时间", "EN": "Message Time", "TW": "消息時間" }[language["language"]],
                    "key": "time"
                },
                {
                    "title": { "CN": "电量", "EN": "Electric Quantity", "TW": "電量" }[language["language"]],
                    "key": "electric"
                },
                {
                    "title": { "CN": "朝向", "EN": "Orientation", "TW": "朝向" }[language["language"]],
                    "key": "orientation"
                },
                {
                    "title": { "CN": "行驶长度", "EN": "Driving Length", "TW": "行駛長度" }[language["language"]],
                    "key": "lenght"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    "state": "状态",
                    "speed": "速度",
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 2,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 3,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 4,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 5,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 6,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 7,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 8,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 9,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 10,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 11,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 12,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 13,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 14,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 15,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 16,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 17,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 18,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 19,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 19,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
                },
                {
                    "id": 20,
                    "uniqueId": "唯一ID",
                    
                    "name": "名字",
                    
                    "state": "状态",
                    "speed": "速度",
                    
                    
                    "vehicleType": "车辆类型",
                    "time": "消息时间",
                    "electric": "电量",
                    "orientation": "朝向",
                    "lenght": "行驶长度"
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
