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
                // {
                //     "value": "EN",
                //     "label": "English",
                // },
                // {
                //     "value": "TW",
                //     "label": "繁體",
                // }
            ],
            "airPort": "113.2926,23.3925",
            "airPortList": [
                {
                    "value": "113.2926,23.3925",
                    "label": "广州白云机场",
                }
            ],
            "title": "民贵车辆管理系统"
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

            // 重新格式化功能菜单
            "formatFunMenu": function(data) {
                var self = this;
                var funcInfo = {
                    "menu_map": [],
                    "menu_org": [],
                    "menu_device": [],
                    "menu_report": [],
                    "menu_system": []
                };
                var funcList = data["userFuncList"];
                for(var i = 0, len = funcList.length; i < len; i++) {
                    if(funcList[i]["functionCode"].indexOf("map_")!=-1 || 
                        funcList[i]["functionCode"] == 'device_manage_vehicle' || 
                        funcList[i]["functionCode"] == 'device_view_secure_area' || 
                        funcList[i]["functionCode"] == 'device_manage_secure_area' || 
                        funcList[i]["functionCode"] == 'device_manage_camera' || 
                        funcList[i]["functionCode"] == 'device_view_camera'
                    ) {
                        funcInfo["menu_map"].push(funcList[i]);
                    }
                    if(funcList[i]["functionCode"].indexOf("org_manage_")!=-1) {
                        funcInfo["menu_org"].push(funcList[i]);
                    }
                    if(funcList[i]["functionCode"].indexOf("device_manage_")!=-1) {
                        funcInfo["menu_device"].push(funcList[i]);
                    }
                    if(funcList[i]["functionCode"].indexOf("report_")!=-1) {
                        funcInfo["menu_report"].push(funcList[i]);
                    }
                    if(funcList[i]["functionCode"].indexOf("system_")!=-1) {
                        funcInfo["menu_system"].push(funcList[i]);
                    }
                }
                utility.setLocalStorage("userFuncList", funcInfo);
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
                                utility.setLocalStorage("airPort", { "airPort": self.airPort });
                                utility.setLocalStorage("demo", { "demo": true });
                                self.formatFunMenu(data.data);

                                setTimeout(function () {
                                    window.location.href = "/airport/www/module/indexMg/index.html";
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

            // document.title = self.title[self.language];

            // 获取枚举值
            self.getBizParam();

            // 获取省份数据
            self.getProvinceList();

            document.onkeydown = function(e) {
                var e = e || event;
                var keyCode = e.keyCode || e.while || e.charCode;
                if(keyCode == 13) {
                    self.loginAction();
                }
            }
        }
    });

}())
