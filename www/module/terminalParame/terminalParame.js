(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "tableHeight": (function () {
                var containerHeight = $(".tableContainer").height();
                return containerHeight - 100;
            }()),
            "loading": false,
            "type": 1,
            "userInfo": userInfo,
            "oldPass": "",
            "newPass": "",
            "companyList": [],
            "sexTypeList": bizParam["sexType"],
        },
        "watch": {},
        "methods": {
            "reLogin": function() {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.userLogin + "&userCode=" + self.userInfo.userCode + "&userPwd=" + md5(self.newPass).toUpperCase(),
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
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            // 修改密码
            "modifyPassAction": function() {
                var self = this;
                self.$Message.config({
                    top: 150,
                    duration: 3
                });
                self.loading = true;
                if(utility.checkLen($.trim(self.oldPass), 0)) {
                    self.$Message.error("旧密码不能为空");
                    self.loading = false;
                    return;
                }
                if($.trim(self.newPass).length<=5) {
                    self.$Message.error("新密码长度为6为以上字符");
                    self.loading = false;
                    return;
                }
                if(!utility.checkPass($.trim(self.newPass))) {
                    self.$Message.error("新密码格式不正确");
                    self.loading = false;
                    return;
                }
                if($.trim(self.oldPass)==$.trim(self.newPass)) {
                    self.$Message.error("旧密码不能与新密码一样");
                    self.loading = false;
                    return;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.changeUserPwd,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "oldUserPwd": md5(self.oldPass).toUpperCase(),
                        "newUserPwd": md5(self.newPass).toUpperCase(),
                    },
                    completeCallback: function () {
                        self.loading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.$Message.success("修改成功!");
                            self.reLogin();
                        } else {
                            if(data.code == 1056) {
                                self.$Message.error("旧密码错误");
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    }
                });
            },
            // 修改用户信息
            "modifyUserInfoAction": function() {
                var self = this;
                var dateInfo = utility.getDateDetailInfo(self.userInfo.birthday);
                self.$Message.config({
                    top: 150,
                    duration: 3
                });
                self.loading = true;

                // if(utility.checkLen($.trim(self.userInfo.userCode), 0)) {
                //     self.$Message.error("用户账号不能为空");
                //     self.loading = false;
                //     return;
                // }
                // if(utility.checkLen($.trim(self.userInfo.userName), 0)) {
                //     self.$Message.error("用户名不能为空");
                //     self.loading = false;
                //     return;
                // }
                // if(utility.checkLen($.trim(self.userInfo.userSeq), 0)) {
                //     self.$Message.error("工号不能为空");
                //     self.loading = false;
                //     return;
                // }
                // if(utility.checkLen($.trim(self.userInfo.mobile), 0)) {
                //     self.$Message.error("手机号不能为空");
                //     self.loading = false;
                //     return;
                // }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.userService + "?action=" + CONFIG.ACTION.saveUser,
                    actionUrl: CONFIG.SERVICE.userService,
                    dataObj: {
                        "id": self.userInfo.id, // 员工ID，修改员工信息时必传
                        "userCode": self.userInfo.userCode, // 用户帐号名
                        "userPwd": self.userInfo.userPwd, // 用户密码. 说明： 1、	创建时不设置则默认为123456; 2、修改用户时不设置则不修改原有密码
                        "companyId": self.userInfo.companyId, //所属公司ID，手动从公司列表选择
                        "userSeq": self.userInfo.userSeq, // 员工工号
                        "userName": encodeURI(self.userInfo.userName), // 员工姓名
                        "sex": self.userInfo.sex, // 员工性别
                        "birthday": dateInfo.year + '-' + dateInfo.month + "-" + dateInfo.date, // 员工生日
                        "mobile": self.userInfo.mobile, // 员工手机号
                        "telephone": self.userInfo.telephone, // 员工办公电话号
                        "email": self.userInfo.email, // 员工邮箱
                        "remark": encodeURI(self.userInfo.remark), // 员工备注
                        "status": self.userInfo.status, // 员工帐号状态，默认值911表示正常： 911：正常 912：冻结 913：作废                
                        "idNo": self.userInfo.idNo, // 身份证号
                        "address": encodeURI(self.userInfo.address), // 员工家庭住址
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    },
                    completeCallback: function () {
                        self.loading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.$Message.success("修改成功!");
                            utility.setLocalStorage("userInfo", self.userInfo);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            "getLogByCode": function(code) {
                var self = this;
                self.type = code;
            },
            // 获取公司列表
            "getCompanyList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.companyService + "?action=" + CONFIG.ACTION.getCompanyList,
                    actionUrl: CONFIG.SERVICE.companyService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.companyList = data.data;
                        }
                    }
                });
            },
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            self.userInfo.address = decodeURI(self.userInfo.address);

            setTimeout(function () {
                self.getCompanyList();
            }, 500);
        }
    });

}())
