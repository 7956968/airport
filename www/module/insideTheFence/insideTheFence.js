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
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "防区名称", "EN": "Defense Area Name", "TW": "防區名稱" }[language["language"]],
                    "key": "area"
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleType"
                },
                {
                    "title": { "CN": "终端编号", "EN": "Terminal Number", "TW": "終端編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "归属公司", "EN": "Ownership Company", "TW": "歸屬公司" }[language["language"]],
                    "key": "ownership"
                },
                {
                    "title": { "CN": "车辆颜色", "EN": "Vehicle Color", "TW": "車輛顔色" }[language["language"]],
                    "key": "vehicleColor"
                },
                {
                    "title": { "CN": "品牌", "EN": "Brand", "TW": "品牌" }[language["language"]],
                    "key": "brand"
                },
                {
                    "title": { "CN": "时间", "EN": "Creation Time", "TW": "時間" }[language["language"]],
                    "key": "time"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    "number": "终端编号",
                    "vehicleType": "车辆类型",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "违规时间"
                },
                {
                    "id": 2,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 3,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 4,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 5,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 6,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 7,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 8,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 9,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 10,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 11,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 12,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 13,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 14,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 15,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 16,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 17,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 18,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "创建时间"
                },
                {
                    "id": 20,
                    "area": "防区名称",
                    
                    "vehicleName": "车辆名称",
                    
                    "number": "终端编号",
                    "vehicleType": "负责人",
                    "czzdbh": "czzdbh",
                    "electric": "电量",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
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
