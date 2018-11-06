(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": true,
            "isShowModal": false,
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
                    "title": { "CN": "ID", "EN": "ID", "TW": "ID" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "describe"
                },
                {
                    "title": { "CN": "trsp地址", "EN": "rtsp Address", "TW": "rtsp地址" }[language["language"]],
                    "key": "trsp"
                },
                {
                    "title": { "CN": "方向", "EN": "Direction", "TW": "方向" }[language["language"]],
                    "key": "direction"
                },
                {
                    "title": { "CN": "半径", "EN": "Radius", "TW": "半徑" }[language["language"]],
                    "key": "radius"
                },
                {
                    "title": { "CN": "视野角度", "EN": "Angle Of View", "TW": "視野角度" }[language["language"]],
                    "key": "view"
                },
                {
                    "title": { "CN": "创建用户", "EN": "Founder", "TW": "創建用戶etyn" }[language["language"]],
                    "key": "founder"
                },
                {
                    "title": { "CN": "创建时间", "EN": "Creation Time", "TW": "創建時間" }[language["language"]],
                    "key": "time"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 2,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 3,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 4,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 5,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 6,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"

                },
                {
                    "id": 7,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 8,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 9,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 10,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 11,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 12,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 13,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 14,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 15,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 16,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 17,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 18,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 19,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
                    "time": "创建时间"
                },
                {
                    "id": 20,
                    "number": "ID",
                    "name": "名称",
                    "describe": "描述",
                    "trsp": "trsp地址",
                    "direction": "方向",
                    "radius": "半径",
                    "view": "视野角度",
                    "founder": "创建用户",
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
                utility.showMessageTip(self, function () {
                    self.isShowModal = true;
                    self.modalTitle = { "CN": "修改", "EN": "Edit", "TW": "修改" }[self.language];
                });
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
