(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "title": { "CN": "民贵无动力设备管理系统", 'EN': "Mingui Non-Powered Euipment Management System", 'TW': "民貴無動力管理系統" },
            "tabList": [],
            "iframeList": []
        },
        "watch": {
            "language": function (value) {
                var self = this;
            }
        },
        "methods": {
            // 退出
            "logout": function () {
                var self = this;
                window.location.href = "/airport/www/login.html";
            },
            // 判断是否重复
            "isIframeDuplicate": function (id) {
                var self = this;
                var bool = false;

                for (var i = 0, len = self.iframeList.length; i < len; i++) {
                    if (self.iframeList[i]["id"] == id) {
                        bool = true;
                        break;
                    }
                }
                return bool;
            },
            // 切换显示状态
            "switchStatu": function (id) {
                var self = this;
                $("body").find("iframe").hide();
                $("body").find(".tabItem").removeClass("active");
                setTimeout(function() {
                    $("body").find("#iframe_" + id).show();
                    $("body").find("#tab_" + id).addClass("active");
                }, 500); 
            },
            // 设置tab
            "setTabItem": function (src, id) {
                var self = this;

                // 如果 tab 还没有存在,则添加tab
                if (!self.isIframeDuplicate(id)) {
                    self.tabList.push({
                        "id": id,
                        "html": '<p class="item">'+$("#nav_" + id).html()+'</p>' + '<span class="close"><i>X</i></span>'
                    });
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

                // 先处理tab
                for (var t = 0, tlen = self.tabList.length; t < tlen; t++) {
                    if (id == self.tabList[t]["id"]) {
                        $("body").find(".tabItem").removeClass("active");
                        $("body").find("#tab_" + self.tabList[t]["id"]).prev().addClass("active");
                        self.tabList.splice(t, 1);
                        break;
                    }
                }

                // 处理iframe
                for (var i = 0, ilen = self.iframeList.length; i < ilen; i++) {
                    if (id == self.iframeList[i]["id"]) {
                        $("body").find("iframe").hide();
                        $("body").find("#iframe_" + self.iframeList[i]["id"]).prev().show();
                        self.iframeList.splice(i, 1);
                        break;
                    }
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
