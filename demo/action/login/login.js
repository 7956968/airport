(function () {
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "loading": false,
            "loginInfo": {
                "userCode": "",
                "userPwd":  "",
                "remember": true
            },
        },
        "methods": {
            "loginAction": function() {
                var self = this;
                window.location.href = "./index.html"
            },
        },
        "created": function () {
            var self = this;
        }
    });

}())
