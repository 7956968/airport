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
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "vehicleType"
                },
                {
                    "title": { "CN": "终端编号", "EN": "Number", "TW": "終端編號" }[language["language"]],
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
                    "title": { "CN": "违规总次数", "EN": "Total Number Of Violations", "TW": "違規總次數" }[language["language"]],
                    "key": "totalNumber"
                },
                {
                    "title": { "CN": "行驶总里程", "EN": "Total Mileage", "TW": "行駛總里程" }[language["language"]],
                    "key": "totalMileage"
                },
                {
                    "title": { "CN": "时间", "EN": "Creation Time", "TW": "時間" }[language["language"]],
                    "key": "time"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    "totalMileage": "行驶总里程",
                    "vehicleType": "车辆类型",
                    "ownership": "归属公司",
                    "vehicleColor": "车辆颜色",
                    "brand": "品牌",
                    "time": "时间"
                },
                {
                    "id": 2,
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
                    "totalNumber": "违规总次数",
                    "number": "终端编号",
                    "vehicleName": "车辆名称",
                    
                    "totalMileage": "行驶总里程",
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
