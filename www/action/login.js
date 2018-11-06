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
                "userName": !!userInfo ? userInfo["userName"] : "",
                "password": !!userInfo ? userInfo["password"] : "",
                "remember": !!userInfo ? userInfo["remember"] : true
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
                if (utility.checkLen(self.loginInfo.userName, 0)) {
                    self.$Message.error({ "CN": "请输入用户名", "EN": "Please Enter userName", "TW": "請輸入用戶名" }[self.language]);
                    return false;
                }

                // 验证密码
                if (utility.checkLen(self.loginInfo.password, 0)) {
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
                    self.loading = true;
                    utility.setLocalStorage("language", { "language": self.language });
                    utility.setLocalStorage("userInfo", self.loginInfo);
                    setTimeout(function () {
                        window.location.href = "/airport/www/module/index/index.html";
                    }, 500);
                }

            }
        },
        "created": function () {
            var self = this;

            document.title = self.title[self.language];

        }
    });

}())
