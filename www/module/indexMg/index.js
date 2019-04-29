(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "userInfo": userInfo,
            "language": !!language ? language["language"] : "CN",
            "title": { "CN": "深圳市民贵科技有限公司", 'EN': "Mingui Non-Powered Euipment Management System", 'TW': "民貴無動力管理系統" },
            "tabList": [],
            "iframeList": [],
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
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.userLogout,
                    actionUrl: CONFIG.SERVICE.userService,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            utility.setLocalStorage("userInfo", null);
                            utility.setLocalStorage("userFuncList", null);
                            setTimeout(function() {
                                window.location.href = "/airport/www/indexMg.html";
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
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.changeUserPwd,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "oldUserPwd": md5(oldPass).toUpperCase(),
                        "newUserPwd": md5(newPass).toUpperCase(),
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            
                        } else {
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
            "isDuplicate": function (type,id) {
                var self = this;
                var bool = false;

                for (var i = 0, len = self[type].length; i < len; i++) {
                    if (self[type][i]["id"] == id) {
                        bool = true;
                        break;
                    }
                }
                return bool;
            },
            // 切换显示状态
            "switchStatu": function (id) {
                var self = this;
                $("body").find("iframe").css({ "zIndex": -100, "opacity": 0});
                $("body").find("#iframe_" + id).addClass("show").css({ "zIndex": 10000, "opacity": 1});
                $("body").find(".tabItem").removeClass("active");
                setTimeout(function() {
                    $("body").find("#tab_" + id).show().addClass("active show");
                }, 50);
            },
            // 设置tab
            "setTabItem": function (src, id) {
                var self = this;

                // 如果 tab 还没有存在,则添加tab
                if (!self.isDuplicate("tabList", id)) {
                    self.tabList.push({
                        "id": id,
                        "html": '<p class="item">'+$("#nav_" + id).html()+'</p>' + '<span class="close"><i>X</i></span>'
                    });
                }
                // 如果 iframe 还没有存在
                if (!self.isDuplicate("iframeList", id)) {
                    self.iframeList.push({
                        "id": id,
                        "src": src
                    });
                }
                // 切换显示状态
                self.switchStatu(id);
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
                var aId = "";

                // 获取激活的tab的id
                for (var i = 0, len = $("body").find(".tabItem").length; i < len; i++) {
                    if($($("body").find(".tabItem")[i]).hasClass("active")) {
                        aId = $($("body").find(".tabItem")[i]).attr("id").split("_")[1];
                    }
                }
                $("body").find("iframe").css({ "zIndex": -100, "opacity": 0});

                // 如果关闭的是当前激活的tab
                if($("body").find("#tab_" + id).hasClass("active")) {
                    $("body").find("#tab_" + id).removeClass("show active").hide().prevAll(".show").last().addClass("active");
                    $("body").find("#iframe_" + id).removeClass("show").prevAll(".show").last().css({ "zIndex": 10000, "opacity": 1 });
                } else {
                    $("body").find("#tab_" + id).removeClass("show active").hide();
                    $("body").find("#tab_" + aId).addClass("show active");
                    $("body").find("#iframe_" + id).removeClass("show");
                    $("body").find("#iframe_" + aId).addClass("show").css({"zIndex": 10000, "opacity": 1 });
                }
            }
        },
        "created": function () {
            var self = this;

            document.title = self.title[self.language];

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(true);
        }
    });

}())
