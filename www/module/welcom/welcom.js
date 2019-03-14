(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "isTableLoading": false,
            "innerHeight": window.innerHeight/6,
            "resizeTime": null,
            "copyRight": { "CN": "@copyRight 民贵无动力设备管理系统", 'EN': "@copyRight Mingui Non-Powered Euipment Management System", 'TW': "@copyRight 民貴無動力管理系統" }[language["language"]],
            // 车辆信息
            "vehicleInfo": {
                "list": [],
                "_401": 0,
                "_402": 0,
                "_403": 0,
                "_404": 0,
                "_405": 0,
                "_406": 0,
                "_407": 0,
                "_408": 0,
                "count": 0
            },
            "isloadDefen": false,
            "timeDefensTableList": [],
            "defenColumList": [
                {
                    "title": { "CN": "车辆", "EN": "Vehicle Name", "TW": "車輛" }[language["language"]],
                    "key": "vehicleName",
                    "fixed": "left",
                    "width": 110,
                    "render": function (h, params) {
                        var vehicleName = pageVue.timeDefensTableList[params.index]["vehicleName"];
                        var vehicleCode = pageVue.timeDefensTableList[params.index]["vehicleCode"];
                        return h("div", vehicleName+"["+vehicleCode+"]");
                    }
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "crossTypeName",
                    "width": 100
                },
                {
                    "title": { "CN": "位置", "EN": "Position", "TW": "位置" }[language["language"]],
                    "key": "areaName",
                    "width": 110
                },
                {
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "crossTime",
                    "fixed": "right",
                    "width": 140
                }
            ],
            "msgTableList": [],
            "msgColumList": [
                {
                    "title": { "CN": "车辆", "EN": "Vehicle Name", "TW": "車輛" }[language["language"]],
                    "key": "vehicleName",
                    "render": function (h, params) {
                        var vehicleName = pageVue.timeDefensTableList[params.index]["vehicleName"];
                        var vehicleCode = pageVue.timeDefensTableList[params.index]["vehicleCode"];
                        return h("div", vehicleName+"["+vehicleCode+"]");
                    }
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "crossTypeName"
                },
                {
                    "title": { "CN": "时间", "EN": "Time", "TW": "時間" }[language["language"]],
                    "key": "crossTime",
                    "width": 150
                }
            ]
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
            },
            // 数据汇总
            "setTotalEchart": function () {
                var self = this;
                var myChart = echarts.init(document.getElementById('totalEchart'));
                // Generate data
                var category = [];
                var dottedBase = +new Date();
                var lineData = [];
                var recLineData = [];
                var allData = [];

                for (var i = 0; i < 20; i++) {
                    var date = new Date(dottedBase -= 3600 * 24 * 1000);
                    category.push([
                        date.getFullYear(),
                        date.getMonth() + 1,
                        date.getDate()
                    ].join('-'));
                    var b = parseInt(Math.random() * 1000);
                    var d = parseInt(Math.random() * 1000);
                    allData.push(d + b);
                    lineData.push(b);
                    recLineData.push(d);
                }

                // option
                option = {
                    backgroundColor: '#0f375f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        top: 20,
                        data: ['挂车使用频率', '拖头使用频率', '所有车辆统计'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    xAxis: {
                        data: category,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: { show: false },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    series: [{
                        name: '所有车辆统计',
                        type: 'line',
                        smooth: true,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 15,
                        data: allData
                    }, {
                        name: '挂车使用频率',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 5,
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: '#14c8d4' },
                                        { offset: 1, color: '#43eec6' }
                                    ]
                                )
                            }
                        },
                        data: lineData
                    }, {
                        name: '拖头使用频率',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 5,
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: 'rgba(20,200,212,0.5)' },
                                        { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                                        { offset: 1, color: 'rgba(20,200,212,0)' }
                                    ]
                                )
                            }
                        },
                        z: -12,
                        data: recLineData
                    }]
                };
                myChart.setOption(option);
            },
            // 车辆统计
            "setVehicleEchart": function () {
                var self = this;
                var myChart = echarts.init(document.getElementById('vehicleEchart'));

                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}:{c}({d}%)"
                    },
                    legend: {
                        show: false
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                { value: 335, name: '牵引车', selected: true },
                                { value: 679, name: '拖挂车' },
                                { value: 1548, name: '三面卡' }
                            ]
                        },
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}:}{c}{per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 12,
                                            lineHeight: 24
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [1, 2],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data: [
                                { value: 35, name: '驶入' },
                                { value: 10, name: '驶出' },
                                { value: 24, name: '静止' },
                                { value: 13, name: '防区内行驶' }
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
            },
            // 车载终端
            "setTerminateState": function () {
                var self = this;
                var myChart = echarts.init(document.getElementById("terminateEchart"));

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['正在静止', '活动', '开始进入休眠', '运动传感器故障', '侧翻', '离线', 'GPS未定位', '电压采集失败'],
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    textStyle: {
                        color: "#ffffff"
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                            nameTextStyle: {
                                color: "#ffffff"
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            nameTextStyle: {
                                color: "#ffffff"
                            }
                        }
                    ],
                    series: [
                        {
                            name: '正在静止',
                            type: 'bar',
                            data: [200, 302, 310, 340, 390, 330, 320]
                        },
                        {
                            name: '活动',
                            type: 'bar',
                            stack: '活动',
                            data: [200, 120, 100, 140, 300, 200, 201]
                        },
                        {
                            name: '开始进入休眠',
                            type: 'bar',
                            stack: '开始进入休眠',
                            data: [220, 120, 110, 240, 200, 300, 100]
                        },
                        {
                            name: '运动传感器故障',
                            type: 'bar',
                            stack: '运动传感器故障',
                            data: [100, 302, 210, 104, 190, 300, 100]
                        },
                        {
                            name: '侧翻',
                            type: 'bar',
                            data: [620, 180, 640, 260, 160, 160, 100],
                        },
                        {
                            name: '离线',
                            type: 'bar',
                            barWidth: 5,
                            stack: '离线',
                            data: [600, 320, 710, 740, 900, 300, 200]
                        },
                        {
                            name: 'GPS未定位',
                            type: 'bar',
                            stack: 'GPS未定位',
                            data: [200, 320, 110, 140, 900, 300, 200]
                        },
                        {
                            name: '电压采集失败',
                            type: 'bar',
                            stack: '电压采集失败',
                            data: [600, 720, 710, 740, 100, 100, 100]
                        }
                    ]
                };

                myChart.setOption(option);
            },
            // 实时防区信息
            "getCrossAreaList": function () {
                var self = this;
                // 如果是查询，则重新从第一页开始
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getCrossAreaList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "pageNum": 1,
                        "pageSize": 50,
                    },
                    beforeSendCallback: function () {
                        self.isloadDefen = true;
                    },
                    completeCallback: function () {
                        self.isloadDefen = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.timeDefensTableList = data.data;
                            self.msgTableList = data.data;
                        }
                    }
                });
            },
            // 格式化车辆数据
            "formatVehicle": function() {
                var self = this;

                for(var i = 0, len = self.vehicleInfo.list.length; i < len; i++) {
                    if(self.vehicleInfo.list[i]["vehicleStatus"] == 401) {
                        self.vehicleInfo["_401"] = self.vehicleInfo["_401"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 402) {
                        self.vehicleInfo["_402"] = self.vehicleInfo["_402"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 403) {
                        self.vehicleInfo["_403"] = self.vehicleInfo["_403"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 404) {
                        self.vehicleInfo["_404"] = self.vehicleInfo["_404"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 405) {
                        self.vehicleInfo["_405"] = self.vehicleInfo["_405"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 406) {
                        self.vehicleInfo["_406"] = self.vehicleInfo["_406"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 407) {
                        self.vehicleInfo["_407"] = self.vehicleInfo["_407"] + 1;
                    } else if(self.vehicleInfo.list[i]["vehicleStatus"] == 408) {
                        self.vehicleInfo["_408"] = self.vehicleInfo["_408"] + 1;
                    }
                }
            },
            // 获取车辆信息
            "getVehicleList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        id: "",
                        pageSize: 10000, 
                    },
                    beforeSendCallback: function () {
                        self.isTableLoading = true;
                    },
                    completeCallback: function () {
                        self.isTableLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleInfo["_401"] = 130;
                            self.vehicleInfo["_402"] = 640;
                            self.vehicleInfo["_403"] = 200;
                            self.vehicleInfo["_404"] = 100;
                            self.vehicleInfo["_405"] = 120;
                            self.vehicleInfo["_406"] = 110;
                            self.vehicleInfo["_407"] = 140;
                            self.vehicleInfo["_408"] = 190;
                            self.vehicleInfo.count = 1530;
                            // self.vehicleInfo.count = data.count;
                            self.vehicleInfo.list = data.data;
                            // self.formatVehicle();
                        }
                    }
                });
            },
            // 跳转到地图页面
            "toMapPage": function(vehicleStatus) {
                var self = this;
                utility.setSessionStorage("fromInfo", {
                    type: "isSearch",
                    vehicleStatus: vehicleStatus
                });
                setTimeout(function() {
                    $(window.parent.document).find("#nav_Maps").bind("click");
                    $(window.parent.document).find("#nav_Maps").trigger("click");
                }, 200);
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            // 实时防区信息
            self.getCrossAreaList();

            // 车辆数据
            self.getVehicleList();

            setInterval(function() {
                self.msgTableList = [];
                self.timeDefensTableList = [];
                setTimeout(function() {
                    self.getCrossAreaList();
                    self.getVehicleList();
                }, 500);
            }, 15000);
            
            // 当窗口变化时，重新调整高度
            $(window).resize(function() {
                clearTimeout(self.resizeTime);
                self.resizeTime = setTimeout(function(){
                    window.location.href = window.location.href;
                }, 500);
            });
        },
        "mounted": function () {
            var self = this;
            setTimeout(function () {
                self.setTotalEchart(); // 数据汇总
                self.setVehicleEchart(); // 车辆统计
                self.setTerminateState(); // 车辆终端
            }, 500);
        }
    });

}())
