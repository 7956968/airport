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
                    "title": { "CN": "编号", "EN": "Number", "TW": "編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "是否激活", "EN": "Is It Activated", "TW": "是否激活" }[language["language"]],
                    "key": "active"
                }
            ],
            "dataList": [
                {
                    "id": 1,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 2,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 3,
                    
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 4,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 5,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 6,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 7,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 8,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 9,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 10,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 11,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 12,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 13,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 14,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 15,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 16,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 17,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 18,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 19,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
                },
                {
                    "id": 20,
                    "number": "编号",
                    "name": "名称",
                    "active": "是否激活"
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
