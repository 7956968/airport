(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN"
        },
        "watch": {

        },
        "methods": {
            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            "isLogin": function () {
                var self = this;

                // 判断是否有用户信息
                if (!userInfo) {
                    alert("请先登录！");
                    window.parent.window.location.href = "/airport/www/login.html";
                }
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);
        }
    });

}())
