(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "userInfo": userInfo,
            "language": !!language ? language["language"] : "CN",
            "title": { "CN": "航空地面服务特种车辆管理系统", 'EN': "Mingui Non-Powered Euipment Management System", 'TW': "民貴無動力管理系統" },
            "tabList": {
                "Welcom": null,
                "Maps": null,
                "OrganizeManage": null,
                "DepartmentManage": null,
                "UserManage": null,
                "DepartUser": null,
                "RoleManage": null,
                "DataGroup": null,
                "VehicleManage": null,
                "VehicleMaintenance": null,
                "TerminalManage": null,
                "SectorsManage": null,
                "VideoCamera": null,
                "Alarm": null,
                "OnlineDetail": null,
                "UsageStatistics": null,
                "TerminalUse": null,
                "ViolationStatistics": null,
                "OperationSituation": null,
                "Mileage": null,
                "InsideTheFence": null,
                "SystemLog": null,
                "MessageList": null,
                "TerminalParame": null,
                "BaiduMap": null,
            },
            "iframeList": {
                "Welcom": null,
                "Maps": null,
                "OrganizeManage": null,
                "DepartmentManage": null,
                "UserManage": null,
                "DepartUser": null,
                "RoleManage": null,
                "DataGroup": null,
                "VehicleManage": null,
                "VehicleMaintenance": null,
                "TerminalManage": null,
                "SectorsManage": null,
                "VideoCamera": null,
                "Alarm": null,
                "OnlineDetail": null,
                "UsageStatistics": null,
                "TerminalUse": null,
                "ViolationStatistics": null,
                "OperationSituation": null,
                "Mileage": null,
                "InsideTheFence": null,
                "SystemLog": null,
                "MessageList": null,
                "TerminalParame": null,
                "BaiduMap": null,
            },
            "userFuncList": userFuncList,
            "innerWidth": window.innerWidth,
            "isModalLoading": false,
            "isModifyPass": false,
            "oldPass": "",
            "newPass": "",
            "modifyInfo": {
                "oldUserPwd": "",
                "newUserPwd": ""
            }
        },
        "methods": {
            // 退出
            "logout": function () {
                var self = this;
                utility.interactWithServer({
                    "url": CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.userLogout,
                    "actionUrl": CONFIG.SERVICE.userService,
                    "successCallback": function (data) {
                        if (data.code == 200) {
                            utility.setLocalStorage("userInfo", null);
                            utility.setLocalStorage("userFuncList", null);
                            setTimeout(function() {
                                window.location.href = "/airport/www/login.html";
                            }, 150);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 修改密码
            "modifyPassAction": function() {
                var self = this;
                var oldPass = $("body").find("#oldPass input").val();
                var newPass = $("body").find("#newPass input").val();

                if(utility.checkLen($.trim(oldPass), 0)) {
                    self.$Message.error("旧密码不能为空");
                    return;
                }
                if(utility.checkLen($.trim(newPass), 0)) {
                    self.$Message.error("新密码不能为空");
                    return;
                }
                if($.trim(oldPass)==$.trim(newPass)) {
                    self.$Message.error("旧密码不能与新密码一样");
                    return;
                }
                
                utility.interactWithServer({
                    "url": CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.changeUserPwd,
                    "actionUrl": CONFIG.SERVICE.userService,
                    "dataObj": {
                        "oldUserPwd": md5(oldPass).toUpperCase(),
                        "newUserPwd": md5(newPass).toUpperCase(),
                    },
                    "successCallback": function (data) {
                        if (data.code != 200) {
                            self.$Message.error(data.message);   
                        }
                    }
                });
            },
            // 显示修改密码
            "showModifyPass": function() {
                var self = this;
                var idEle = $("body").find("#js-modifyPass");
                if(idEle.hasClass("isShow")) {
                    idEle.removeClass("isShow");
                    idEle.hide();
                } else {
                    idEle.addClass("isShow");
                    idEle.show();
                }
            },
            // 判断是否重复
            "isDuplicate": function (obj, type, bool) {
                var self = this;
                for(var key in self[obj]) {
                    if(self[obj].hasOwnProperty(key)) {
                        if(!!self[obj][key]) {
                            self[obj][key][type] = bool;
                        }
                    }
                }
            },
            // 切换显示状态
            "switchStatu": function (id) {
                var self = this;
                
                self.isDuplicate("tabList", "isActive", false);
                self.isDuplicate("iframeList", "isActive", false);

                setTimeout(function() {
                    self.tabList[id]["isActive"] = true;
                    self.iframeList[id]["isActive"] = true;
                }, 200);
            },
            // 设置tab
            "setTabItem": function (src, id) {
                var self = this;

                self.isDuplicate("tabList", "isActive", false);
                self.isDuplicate("iframeList", "isActive", false);

                self.tabList[id] = {
                    "isDelete": false,
                    "isActive": true,
                    "html": '<p class="item">'+$("#nav_" + id).html()+'</p>' + (id!='Welcom'?'<span class="close"><i>X</i></span>':'')
                };
                
                self.iframeList[id] = {
                    "src": src+"?v=" + Date.parse(new Date()),
                    "isActive": true,
                    "isDelete": false,
                };
            },
            // tab切换
            "switchTab": function (id, event) {
                var self = this;
                var target = event.target;

                // 如果点击的是关闭
                if ($(target).hasClass("close") || $(target).text() == "X") {
                    self.closeTab(id);
                } else {
                    self.switchStatu(id);
                }
            },
            // 关闭tab
            "closeTab": function (id) {
                var self = this;
                var preId = $("body").find("#tab_" + id).prev().attr("id").split("_")[1];

                // 如果关闭的是当前激活的tab
                if($("body").find("#tab_" + id).hasClass("active")) {
                    self.tabList[id]["isDelete"] = true;
                    self.iframeList[id]["isDelete"] = true;

                    self.tabList[preId]["isActive"] = true;
                    self.iframeList[preId]["isActive"] = true;
                } else {
                    self.tabList[id]["isDelete"] = true;
                    self.iframeList[id]["isDelete"] = true;
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
        },
        "created": function () {
            var self = this;

            document.title = self.title[self.language];

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(true);

            // 获取枚举值
            self.getBizParam();

            setTimeout(function() {
                self.setTabItem("/airport/www/module/welcom/welcom.html", "Welcom");
            }, 1000);

            setInterval(function() {
                self.getBizParam();
            }, 60000);
        },
        "mounted": function() {
            var self = this;
        }
    });

}())
