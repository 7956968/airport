(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "loading": false,
            "isShowTips": false,
            "message": "",
            "loginInfo": {
                "userCode": !!userInfo && !!userInfo["userCode"] ? userInfo["userCode"] : "",
                "userPwd": !!userInfo && !!userInfo["userPwd"] ? userInfo["userPwd"] : "",
                "remember": true
            },
            "languageList": [
                {
                    "value": "CN",
                    "label": "中文",
                },
                {
                    "value": "EN",
                    "label": "English",
                },
                {
                    "value": "TW",
                    "label": "繁體",
                }
            ],
            "title": { "CN": "民贵无动力设备管理系统", 'EN': "Mingui Non-Powered Euipment Management System", 'TW': "民貴無動力管理系統" }
        },
        "watch": {
            "language": function (value) {
                var self = this;
                document.title = self.title[value];
                utility.setLocalStorage("language", { "language": value });
                setTimeout(function () {
                    self.getBizParam();
                }, 500);
            }
        },
        "methods": {
            // 验证输入
            "validateInput": function () {
                var self = this;

                // 全局配置message
                self.$Message.config({
                    "top": 150,
                    "duration": 3
                });

                // 验证用户名
                if (utility.checkLen(self.loginInfo.userCode, 0)) {
                    self.$Message.error({ "CN": "请输入用户名", "EN": "Please Enter userCode", "TW": "請輸入用戶名" }[self.language]);
                    return false;
                }

                // 验证密码
                if (utility.checkLen(self.loginInfo.userPwd, 0)) {
                    self.$Message.error({ "CN": "请输入密码", "EN": "Please Enter Password", "TW": "請輸入密碼" }[self.language]);
                    return false;
                }

                return true;
            },

            // 执行登录
            "loginAction": function () {
                var self = this;

                if (self.loading) {
                    return;
                }

                // 先验证输入 
                if (self.validateInput()) {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.userLogin + "&userCode=" + self.loginInfo.userCode + "&userPwd=" + md5(self.loginInfo.userPwd).toUpperCase(),
                        actionUrl: CONFIG.SERVICE.userService,
                        beforeSendCallback: function () {
                            self.loading = true;
                        },
                        completeCallback: function () {
                            self.loading = false;
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                utility.setLocalStorage("userInfo", data.data);
                                utility.setLocalStorage("language", { "language": self.language });
                                setTimeout(function () {
                                    window.location.href = "/airport/www/module/index/index.html";
                                }, 500);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                }
            },
            // 获取枚举值保存在本地
            "getBizParam": function () {
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.commonService + "?action=" + CONFIG.ACTION.getBizParam,
                    actionUrl: CONFIG.SERVICE.commonService,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            utility.setLocalStorage("bizParam", data.data);
                        }
                    }
                });
            },
            // 获取省份数据
            "getProvinceList": function () {
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.commonService + "?action=" + CONFIG.ACTION.getProvinceList,
                    actionUrl: CONFIG.SERVICE.commonService,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            utility.setLocalStorage("provinceList", data.data);
                        }
                    }
                });
            }
        },
        "created": function () {
            var self = this;

            document.title = self.title[self.language];

            // 获取枚举值
            self.getBizParam();

            // 获取省份数据
            self.getProvinceList();

        }
    });

}())
