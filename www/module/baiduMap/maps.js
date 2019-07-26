(function () {
    var language = utility.getLocalStorage("language");
    var airPort = utility.getLocalStorage("airPort");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var userFuncList = utility.getLocalStorage("userFuncList");
    var deviceList = userFuncList["menu_device"];
    var functionInfo = (function () {
        var info = {
            isViewVideo: false,
            isSearch: false,
            isTrack: false,
        };
        for (var key in userFuncList) {
            if (userFuncList.hasOwnProperty(key)) {
                for (var i = 0, len = userFuncList[key].length; i < len; i++) {
                    if (userFuncList[key][i]["functionCode"] == "device_manage_view_video") {
                        info.isViewVideo = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "map_query_live_vehicle") {
                        info.isSearch = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "map_view_track") {
                        info.isTrack = true;
                    }
                }
            }
        }
        return info;
    }());
    window.pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "functionInfo": functionInfo,
            "isShenZhen": false,
            "deleteLoading": false,
            "addLoading": false,
            "language": !!language ? language["language"] : "CN",
            "airPort": !!airPort ? [parseFloat(airPort.airPort.split(",")[0], 10), parseFloat(airPort.airPort.split(",")[1], 10)] : [113.8077, 22.6286],
            "companyList": [],
            "departmentList": [],
            "userFuncList": userFuncList,
            "searchId": "",
            "searchCode": "",
            //#region openlayers 地图
            "mapContainer": {
                // 地图引用
                "map": null,
                // 视图信息
                "viewInfo": {
                    "view": null,
                    "zoom": null,
                    "center": null,
                    "rotation": null,
                },
                // 图层信息
                "layersInfo": {
                    "baiduVectorMap": null,
                    "baiduSatellite": null, // 卫星图
                    "GPS": null, // GPS定位
                    "seat": null, // 机位
                    "layer": null, // 图层
                    "alarm": null, // 告警
                    "camera": null, // 摄像机
                    "defens": null, // 防区
                    "vehicle": null, // 车辆
                    "trajectory": null, // GPS定位
                    "airportLine": null, // 机场线
                    "airportPoint": null, // 机场点
                    "airportPolygo": null, // 机场面
                    "OSM": null, // 底图
                },
                // 资源信息
                "sourceInfo": {
                    "seat": null, // 机位
                    "alarm": null, // 告警
                    "defens": null, // 防区
                    "camera": null, // 摄像机
                    "vehicle": null, // 车辆
                    "trajectory": null, // 摄像机
                },
                // 控件信息
                "controlsInfo": {
                    "scaleLine": null, // 比例尺
                    "fullScreen": null,
                    "overviewMap": null,
                    "mousePosition": null, // 鼠标位置
                },
                // 交互信息
                "interactionInfo": {
                    "defens": null, // 防区,
                    "trajectory": null, // 轨迹图
                },
                // 特性信息
                "featrueInfo": {
                    "clickPos": [], // 当前点击要素的位置
                    "clickId": null, // 当前点击的要素的 id
                    "circlePoint": {},
                    "clickName": null, // 当前点击的要素的名称
                    "vehiclePoint": {},
                    "trajectory": null, // 动画车辆
                },
                // 定位信息
                "geolocationInfo": {
                    "GPS": null, // gps控件
                },
                // 叠加
                "overlayInfo": {
                    "defens": null,
                    "camera": null,
                    "vehicle": null,
                    "vehicleList": {},
                    "trajectory": null,
                    "moveVehicle": null,
                },
                // 动画信息
                "animationInfo": {
                    "speed": 90,
                    "index": 0,
                    "time": null,
                    "point": null,
                    "isMoved": false,
                    "coordinates": [],
                    "coordinateLen": 0,
                    "trajectoryInfo": [],
                    "vectorContext": null,
                    "trajectoryItem": null,
                }
            },
            //#endregion

            //#region baiduMap
            "baiduMapInfo": {
                map: null,
                markers: [],
                markerClusterer: null,
                vehicle: {},
                animationInfo: {
                    timeInterval: null,
                    coordinates: [],
                    trajectoryInfo: [],
                    curveInfo: null,
                    pointInfo: null,
                    speed: 90,
                    trajectoryItem: {
                        "time": "",
                        "speed": "",
                        "coordinate": [],
                        "vehicleCode": "",
                        "companyName": "",
                        "deptName": "",
                        "vehicleName": "",
                        "licenseNumber": "",
                        "lastGpsTime": "",
                        "vehicleTypeName": "",
                        "address": ""
                    }
                },
            },
            //#endregion
            //#region 弹出层
            "modal": {
                "isLayer": false, // 图层控件
                "isAlarm": false, // 告警管理
                "isCamera": false, // 摄像机管理
                "isSearch": false, // 车辆搜索
                "isVehicle": false, // 车辆管理
                "isHistory": false, // 历史轨迹
                "isDefense": false, // 防区管理
            },
            // 图层控制[background,seat,alarm,vehicle,defens,camera]
            "layerControl": ["seat", "alarm", "vehicle", "defens", "camera"],
            //#endregion

            //#region 车辆管理
            "vehiclePageInfo": {
                "id": "", // 车辆ID
                "count": 0,
                "pageNum": 1,
                "deptId": "", // 部门ID
                "pageSize": 15,
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "gpsDeviceCode": "",
            },
            "vehiclePositonPageInfo": {
                "span": 1000, // 距离查询中间点的距离（密），不指定则默认为100米。 // 通过centerPosition+ span两个参数可以联合查询距离中心点多少米内的车辆最近位置
                "count": 0,
                "pageNum": 1,
                "deptId": "", // 部门ID
                "pageSize": 15,
                "companyId": "", // 所属公司ID
                "id": "", // 车辆ID
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "licenseNumber": "", // 车牌号
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleTypeId": "", // 车辆类型ID
                "vehicleStatus": "", // 车辆运动状态
                "useStatus": -1, // 车辆使用状态
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleBrandId": "", // 车辆品牌ID
                "centerPosition": "", // 查询中心点坐标，格式为：经度,纬度
            },
            "vehicleItem": {
                "id": "", // 车辆ID
                "speed": "", // 当前速度（米/秒）
                "power": "", // 终端电量（百分比）
                "deptId": "", // 部门ID
                "deptName": "", // 部门名称
                "modifyTime": "", // 修改时间
                "gpsDeviceId": "", // 定位终端ID
                "companyName": "", // 公司名称
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编号
                "lastPosition": "", // 当前经纬度坐标
                "vehicleTypeId": "", // 车辆类型ID
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleStatus": "", // 车辆运行状态ID
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleBrandId": "", // 车辆品牌ID
                "vehicleStatusName": "", // 车辆运行状态名称
            },
            "vehicleItemPop": null,
            "vehicleList": [],
            "isAddVehiclePosition": false,
            "isDbClickSearch": false,
            "terminalStatusList": bizParam["terminalStatus"], // 车辆状态
            "vehicleColorList": bizParam["vehicleColor"], // 车辆颜色
            "vehicleTypeList": bizParam["vehicleType"], // 车辆类型
            "vehicleBrandList": bizParam["vehicleBrand"], // 车辆品牌
            "secureAreaLimitTypeList": bizParam["secureAreaLimitType"], // 车辆品牌
            "vehicleColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "类型", "EN": "Type", "TW": "類型" }[language["language"]],
                    "key": "vehicleTypeId"
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "vehicleStatus"
                }
            ],
            "vehicleDatas": [],
            "vehiclePositionItem": {
                "o": "", // 显示序号，最近运动的序号值越小，前端自行根据浏览器可承受的渲染能力限制，按序号分段地加载显示
                "id": "", // 车辆ID
                "speed": "", // 当前速度（米/秒）
                "power": "", // 终端电量（百分比）
                "deptId": "", // 部门ID
                "deptName": "", // 部门名称
                "modifyTime": "", // 修改时间
                "gpsDeviceId": "", // 定位终端ID
                "companyName": "", // 公司名称
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编号
                "lastPosition": "", // 当前经纬度坐标
                "vehicleTypeId": "", // 车辆类型ID
                "gpsDeviceCode": "", // 定位终端编号
                "vehicleStatus": "", // 车辆运行状态ID
                "vehicleColorId": "", // 车辆颜色ID
                "vehicleBrandId": "", // 车辆品牌ID
                "vehicleStatusName": "", // 车辆运行状态名称
            },
            "vehiclePositionList": [],
            "singleVehiclePageInfo": {
                "date": new Date(),
                "endTime": (function () {
                    var dateInfo = utility.getDateDetailInfo();
                    return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date + " " + "23:59:59"
                }()), // 查询结束时间
                "id": "", // 车辆ID
                "beginTime": (function () {
                    var dateInfo = utility.getDateDetailInfo();
                    return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date + " " + "00:00:00"
                }()), // 查询开始时间
                "lastGpsTime": "",
                "vehicleCode": "", // 车辆编码
                "licenseNumber": "", // 车牌号
                "gpsDeviceCode": "", // 定位终端编号
            },
            "singleVehicleItem": {},
            //#endregion

            //#region 历史轨迹
            "historyColumns": [],
            "historyDatas": [],
            //#endregion

            //#region 防区
            "isAddDefensAction": false,
            "isAddDefensDetailInfo": false,
            "isDrawDefening": false,
            "isDeleteDefens": false,
            "secureAreaStatusList": bizParam["secureAreaStatus"],
            "defensFunc": (function () {
                var func = JSON.stringify(userFuncList["menu_map"]);
                // 如果是管理防区
                if (func.indexOf("device_manage_secure_area") != -1) {
                    return true;
                } else {
                    return false;
                }
            }()),
            "defensPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "areaName": "",
                "companyId": "",
                "secureStatus": "",
            },
            "defensAreaDetailInfo": {
                "id": "",
                "featureId": "",
                "opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                "companyId": "",
                "deptId": "", // 部门ID，可选
                "deptIds": [], // 部门ID，可选
                "areaName": "", // 防区名称
                "areaCode": "", // 防区编码
                "secureStatus": "", // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                "areaRangeStr": "", // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                "speedLimit": "", // 行驶速度限制上限（米/秒）
                "staySecond": "", // 最大允许停留时长(单位秒)
                "canEnter": "", // 是否允许车辆进入：720：不设限 721：禁止驶入 722：允许驶入
                "canExit": "", // 是否允许车辆驶出： 720：不设限 723：禁止驶出 724：允许驶出
                "canStay": "", //是否允许车辆停留： 720：不设限 725：禁止停留 726：允许停留
                "remark": "", // 备注
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "defensColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "areaName",
                    "fixed": "left",
                    "width": 120
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "areaCode",
                    "width": 120
                },
                {
                    "title": { "CN": "状态", "EN": "Status", "TW": "狀態" }[language["language"]],
                    "key": "secureStatus",
                    "width": 120
                },
                {
                    "title": { "CN": "速度上限", "EN": "Speed Limit", "TW": "速度上限" }[language["language"]],
                    "key": "speedLimit",
                    "width": 120
                },
                {
                    "title": { "CN": "停留时长", "EN": "Length Of Stay", "TW": "停留時長" }[language["language"]],
                    "key": "staySecond",
                    "width": 120
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "fixed": "right",
                    "width": 80,
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        // 如果是管理防区
                        if (func.indexOf("device_manage_secure_area") != -1) {
                            label = { "CN": "删除", "EN": "Delete", "TW": "删除" }[language["language"]]
                        } else {
                            label = { "CN": "查看", "EN": "View", "TW": "查看" }[language["language"]]
                        }
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "error",
                                    "size": "small"
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.selectDefensArea(params);
                                    }
                                }
                            }, label)
                        ]);
                    }
                }
            ],
            "defensDatas": [],
            "defensList": [],
            "defensColor": {
                // secureStatus
                "701": { // 草稿
                    fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: "rgba(4, 159, 228, 0.4)"
                    }),
                    stroke: new ol.style.Stroke({ //边界样式
                        color: "rgba(33, 121, 160, 0.6)",
                        width: 3
                    }),
                },
                "702": { // 布防
                    fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: "rgba(255, 0, 0, 0.4)"
                    }),
                    stroke: new ol.style.Stroke({ //边界样式
                        color: "rgba(5, 174, 253, .6)",
                        width: 2
                    }),
                },
                "703": { // 撤防
                    fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: "rgba(255, 173, 51, 0.7)"
                    }),
                    stroke: new ol.style.Stroke({ //边界样式
                        color: "rgba(99, 71, 31, 0.8)",
                        width: 3
                    }),
                },
                "704": { // 无效
                    fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: "rgba(180, 191, 195, 0.5)"
                    }),
                    stroke: new ol.style.Stroke({ //边界样式
                        color: "rgba(122, 150, 162, 0.92)",
                        width: 3
                    }),
                },
            },

            //#endregion

            //#region 摄像机
            "isAddCameraAction": false,
            "isAddcameraDetailInfo": false,
            "isDeleteCamera": false,
            "monitorStatusList": bizParam["monitorStatusId"], // 监控状态
            "cameraFunc": (function () {
                var func = JSON.stringify(userFuncList["menu_map"]);
                // 如果是管理防区
                if (func.indexOf("device_manage_camera") != -1) {
                    return true;
                } else {
                    return false;
                }
            }()),
            "cameraPageInfo": {
                "count": 0,
                "pageNum": 1,
                "pageSize": 15,
                "monitorStatus": ""
            },
            "cameraDetailInfo": {
                "id": "", // 摄像机ID
                "companyId": "", // 所属公司ID 
                "companyName": "", // 公司名称
                "deptId": "", // 部门ID，可选
                "deptIds": [], // 部门ID，可选
                "deptName": "", // 部门名称
                "cameraName": "", // 摄像机名称
                "cameraCode": "", // 摄像机编码
                "cameraDesc": "", // 摄像机描述
                "cameraPositionStr": "", // 位置坐标
                "radius": "", // 摄像头监控半径（单位米）
                "angle": "", // 视野角度
                "monitorStatus": "", // 摄像头监控状态：
                "remark": "", // 备注
                "rtspLiveUrl": "", // Rtsp直播地址
                "rtspHisUrl": "", // Rtsp录播地址
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "cameraColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "cameraName",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "monitorStatus",
                    "width": 100
                },
                {
                    "title": { "CN": "公司", "EN": "Company", "TW": "公司" }[language["language"]],
                    "key": "companyName",
                    "width": 150
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "cameraCode",
                    "width": 150
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "cameraDesc",
                    "width": 150
                },
                {
                    "title": { "CN": "Rtsp直播地址", "EN": "Live URL", "TW": "Rtsp直播地址" }[language["language"]],
                    "key": "rtspLiveUrl",
                    "width": 150
                },
                {
                    "title": { "CN": "Rtsp录播地址", "EN": "Delayed URL", "TW": "Rtsp錄播地址" }[language["language"]],
                    "key": "rtspHisUrl",
                    "width": 150
                },
                {
                    "title": { "CN": "视野角度", "EN": "Angle", "TW": "視野角度" }[language["language"]],
                    "key": "angle",
                    "width": 100
                },
                {
                    "title": { "CN": "半径", "EN": "Radius", "TW": "半徑" }[language["language"]],
                    "key": "radius",
                    "width": 100
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        // 如果是管理防区
                        if (func.indexOf("device_manage_camera") != -1) {
                            label = { "CN": "删除", "EN": "Delete", "TW": "删除" }[language["language"]]
                        } else {
                            label = { "CN": "查看", "EN": "View", "TW": "查看" }[language["language"]]
                        }
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "error",
                                    "size": "small"
                                },
                                "on": {
                                    "click": function () {
                                        pageVue.selectCamera(params);
                                    }
                                }
                            }, label)
                        ]);
                    }
                }
            ],
            "camersDatas": [],
            "cameraList": [],
            //#endregion

            //#region 图层控制
            "layerColumns": [],
            "layerDatas": [],
            //#endregion

            //#region 告警
            "alarmColumns": [],
            "alarmDatas": [],
            //#endregion

            //#region 车辆查询
            "isSearchLoading": false,
            "vehicleUseStatusList": bizParam["vehicleUseStatus"], // 车辆使用状态
            "searchColumns": [
                {
                    "title": { "CN": "车牌号", "EN": "Plate No.", "TW": "車牌號" }[language["language"]],
                    "key": "licenseNumber",
                    "fixed": "left",
                    "width": 130
                },
                {
                    "title": { "CN": "运动状态", "EN": "Vehicle State", "TW": "車輛狀態" }[language["language"]],
                    "key": "vehicleStatus",
                    "align": "center",
                    "width": 100
                },
                {
                    "title": { "CN": "车辆名称", "EN": "Vehicle Name", "TW": "車輛名稱" }[language["language"]],
                    "key": "vehicleName",
                    "width": 130
                },
                {
                    "title": { "CN": "车辆编号", "EN": "Vehicle Number", "TW": "車輛編號" }[language["language"]],
                    "key": "vehicleCode",
                    "width": 130
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": functionInfo.isViewVideo ? 120 : 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        var liveVideoBtn = h("Button", {
                            "props": {
                                "size": "small",
                            }
                        }, { "CN": "详情", "EN": "Detail", "TW": "詳情" }[language["language"]]);
                        var backVideoBtn = null;

                        if (functionInfo.isViewVideo) {
                            if (pageVue.vehiclePositionList[params.index]['licenseNumber'] && pageVue.vehiclePositionList[params.index]['providerId'] < 100) {
                                if (pageVue.vehiclePositionList[params.index]['vehicleStatus'] == 401 || pageVue.vehiclePositionList[params.index]['vehicleStatus'] == 402) {
                                    liveVideoBtn = h("Button", {
                                        "props": {
                                            "type": "primary",
                                            "size": "small",
                                        },
                                        "on": {
                                            "click": function () {
                                                pageVue.showLiveVideo(pageVue.vehiclePositionList[params.index], 0)
                                            }
                                        }
                                    }, "实时");

                                    if (pageVue.vehiclePositionList[params.index]["providerId"] != 2) {
                                        backVideoBtn = h("Button", {
                                            "props": {
                                                "size": "small",
                                                "type": "warning",
                                            },
                                            "class": "backPlay",
                                            "style": {
                                                "marginLeft": '2px'
                                            },
                                            "on": {
                                                "click": function () {
                                                    pageVue.showLiveVideo(pageVue.vehiclePositionList[params.index], 1)
                                                }
                                            }
                                        }, "回放");
                                    }
                                }
                            }
                        }
                        return h("div", [
                            liveVideoBtn,
                            backVideoBtn
                        ]);
                    }
                }
            ],
            "searchDatas": []
            //#endregion
        },

        //#region  监听属性变化
        "watch": {
            "layerControl": function (value) {
                var self = this;
                var isSeat = (value.indexOf("seat") != -1);
                var isSatellite = (value.indexOf("satellite") != -1);
                var isAlarm = (value.indexOf("alarm") != -1);
                var isDefense = (value.indexOf("defens") != -1);
                var isCamera = (value.indexOf("camera") != -1);
                var isVehicle = (value.indexOf("vehicle") != -1);
                var isBackground = (value.indexOf("background") != -1);
                timeOut = null;

                if (self.isShenZhen) {
                    self.mapContainer.layersInfo.airportLine.setVisible(isBackground);
                    self.mapContainer.layersInfo.airportPoint.setVisible(isBackground);
                    self.mapContainer.layersInfo.airportPolygo.setVisible(isBackground);
                    self.mapContainer.layersInfo.defens.setVisible(isDefense);
                    self.mapContainer.layersInfo.camera.setVisible(isCamera);
                    self.mapContainer.layersInfo.seat.setVisible(isSeat);
                    self.mapContainer.layersInfo.alarm.setVisible(isAlarm);
                }

                // // satellite vector
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    if (isSatellite) {
                        self.mapContainer.layersInfo.baiduVectorMap.setVisible(false);
                        self.mapContainer.layersInfo.baiduSatellite.setVisible(true);
                        self.mapContainer.viewInfo.view.setMaxZoom(18);
                    } else {
                        self.mapContainer.layersInfo.baiduVectorMap.setVisible(true);
                        self.mapContainer.layersInfo.baiduSatellite.setVisible(false);
                        self.mapContainer.viewInfo.view.setMaxZoom(20);
                    }
                }, 50);


                self.mapContainer.layersInfo.vehicle.setVisible(isVehicle);

            },
        },
        //#endregion

        "methods": {

            //#region openlayers ma
            // 刷新
            "refresh": function () {
                var hrefInfo = window.location.href.split("?");
                // console.log(hrefInfo[0] + "v=" + Date.parse(new Date()));
                window.location.href = hrefInfo[0] + "?v=" + Date.parse(new Date());
            },
            // searchMap
            "searchMap": function () {
                var self = this;
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    if (self.searchCode == self.vehicleList[i]["vehicleCode"]) {
                        self.searchId = self.vehicleList[i]["id"];
                        self.showVehicleRowData({}, i);
                        break;
                    }
                }
            },
            // 设置自动获取焦点
            "autoFocus": function () {
                var self = this;
                $("body").find(".detailInfoModal input").on("click", function () {
                    $(this).focus();
                });
            },
            // 显示 Modal
            "showModal": function (type) {
                var self = this;
                if (type != "isLayer") {
                    for (var key in self.modal) {
                        self.modal[key] = false;
                    }
                }
                self.modal[type] = true;
            },

            //#region 基础方法
            // 初始化地图功能
            "initMap": function (type) {
                var self = this;

                // 创建地图容器，设置背景地图 // satellite vector
                self.createdMap(type);

                if (self.isShenZhen == true) {
                    // 创建机场图层
                    self.createAirportLayer();
                }

                // 创建各主要要素图层,如：机位，告警，车辆，摄像机，防区
                self.createFeatureLayer();

                // 添加摄像机POP
                self.createPop("addCamera", "camera");

                if (self.isShenZhen == true) {
                    // 添加防区POP
                    self.createPop("addDefensArea", "defens");
                }

                // 添加控件
                self.createControls();

                // 添加GPS
                self.createdGPS();
            },
            // countNewCoor
            "countNewCoordinate": function (coordinate) {
                return [coordinate[0] + 0.00552, coordinate[1] - 0.00250]
                // return [coordinate[0], coordinate[1]]
            },
            "transformLat": function (coordinate) {
                var self = this;
                // return ol.proj.transform(self.countNewCoordinate(coordinate), 'EPSG:3857', 'EPSG:4326');
                return ol.proj.fromLonLat(self.countNewCoordinate(coordinate));
            },
            // 百度地图
            "baiduMap": function (type) {
                var self = this;
                // var gaoDeType = loadMapType["gaoDe"]();
                var baiduType = loadMapType["google"]();

                // satellite vector
                self.mapContainer.layersInfo.baiduVectorMap = baiduType["vector"];
                self.mapContainer.layersInfo.baiduSatellite = baiduType["satellite"];
                self.mapContainer.layersInfo.baiduSatellite.setVisible(false);
                self.mapContainer.map = new ol.Map({
                    "target": "map", // 地图容器div的id
                    "layers": [
                        self.mapContainer.layersInfo.baiduSatellite,
                        self.mapContainer.layersInfo.baiduVectorMap,

                    ],
                    "controls": ol.control.defaults({
                        attribution: false
                    }),
                    "loadTilesWhileAnimating": true,
                    // hdms = ol.proj.transform(self.airPort, 'EPSG:3857', 'EPSG:4326')
                    // self.transformLat(self.airPort),
                    "view": new ol.View({
                        "center": self.transformLat(self.airPort), // [12959773,4853101],// (深圳机场) 地图初始化中心点
                        // "minResolution": 0.32858214173896974,
                        // "center": [12959773,4853101], // (上海虹桥机场)地图初始化中心点
                        // "center": [121.8042311, 31.1477079], // (上海浦东国际机场)地图初始化中心点
                        "zoom": 15, // 地图初始化显示级别
                        "minZoom": 3,
                        "maxZoom": 20,
                        // "projection": "EPSG:4326"
                    })
                });
            },
            // 创建地图
            "createdMap": function (type) {
                var self = this;

                self.baiduMap(type);

                // 获取有所图层
                self.mapContainer.layersInfo.layer = self.mapContainer.map.getLayers();

                // 获取地图引用
                self.mapContainer.viewInfo.view = self.mapContainer.map.getView();

                // 获取地图显示级别
                self.mapContainer.viewInfo.zoom = self.mapContainer.viewInfo.view.getZoom();

                // 获取地图中心点
                self.mapContainer.viewInfo.center = self.mapContainer.viewInfo.view.getCenter();

                // 获取地图旋转角度
                self.mapContainer.viewInfo.rotation = self.mapContainer.viewInfo.view.getRotation();
            },
            // 设置动画
            "setAnimation": function (coordinate, zoom) {
                var self = this;

                self.mapContainer.viewInfo.view.animate({
                    center: coordinate || self.transformLat([113.8077, 22.6286]),
                    duration: 1000,
                    zoom: zoom || 16
                });
            },
            // 重置视图
            "resetView": function () {
                var self = this;
                self.setAnimation(self.transformLat(self.airPort), 16);
            },
            // 添加机场背景图层，初始化时不显示
            "createAirportLayer": function () {
                var self = this;

                self.mapContainer.layersInfo.airportPoint = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "https://www.minguicloud.com/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:surface_region&styles=&bbox=113.76931608,22.60251774,113.84250732,22.67499654&width=768&height=760&srs=EPSG:4326&format=application/openlayers"
                    })
                });
                self.mapContainer.layersInfo.airportLine = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "https://www.minguicloud.com/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:line_polyline&styles=&bbox=113.76640439999998,22.59093897,113.84873603999999,22.696465319999998&width=599&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                });
                self.mapContainer.layersInfo.airportPolygo = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "https://www.minguicloud.com/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:point_position_point&styles=&bbox=113.786041,22.616661,113.824471,22.655542&width=759&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                });

                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportPoint);
                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportLine);
                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportPolygo);
            },
            // 创建各种要素图层
            "createFeatureLayer": function () {
                var self = this;

                function createLayer(type, bool) {

                    if (bool == false) {
                        self.mapContainer.sourceInfo[type] = new ol.source.Vector({
                            "features": []
                        });
                    } else {
                        self.mapContainer.sourceInfo[type] = new ol.source.Cluster({
                            "distance": 30,
                            "source": new ol.source.Vector({
                                "features": []
                            })
                        });
                    }
                    self.mapContainer.layersInfo[type] = new ol.layer.Vector({
                        "source": self.mapContainer.sourceInfo[type]
                    });

                    self.mapContainer.map.addLayer(self.mapContainer.layersInfo[type]);
                }

                // 创建机位图层
                createLayer("seat", false);

                // 创建告警图层
                createLayer("alarm", false);

                if (self.isShenZhen == true) {
                    // 创建防区图层
                    createLayer("defens", false);
                }

                // 创建车辆轨迹
                createLayer("trajectory", false);

                // 创建车辆图层
                createLayer("vehicle", false);

                if (self.isShenZhen == true) {
                    // 创建摄像机图层
                    createLayer("camera", false);
                }

                // 创建GPS图层
                createLayer("GPS", false);
            },
            // 创建Pop层
            "createPop": function (id, type) {
                var self = this;
                self.mapContainer.overlayInfo[type] = new ol.Overlay({
                    "autoPan": true,
                    "stopEvent": false,
                    "positioning": "top-center",
                    "element": document.getElementById(id),
                    "autoPanAnimation": { "duration": 250 },
                });
                self.mapContainer.map.addOverlay(self.mapContainer.overlayInfo[type]);
                self.mapContainer.overlayInfo[type].setPosition(undefined);
            },
            // 生成各类型控件
            "createControls": function () {
                var self = this;

                // 鼠标位置控件
                if (!self.mapContainer.controlsInfo.mousePosition) {
                    self.mapContainer.controlsInfo.mousePosition = new ol.control.MousePosition({
                        "undefinedHTML": "&nbsp;",
                        "projection": "EPSG:4326",
                        "className": "mousePositionInner",
                        "target": document.getElementById("mousePosition"),
                        "coordinateFormat": ol.coordinate.createStringXY(4),
                    });
                }

                // 比例尺控件
                if (!self.mapContainer.controlsInfo.scaleLine) {
                    self.mapContainer.controlsInfo.scaleLine = new ol.control.ScaleLine({
                        // 设置比例尺单位为degrees、imerial、us、nautical或metric(度量单位)
                        "units": "metric"
                    });
                }

                // 鹰眼控件
                if (!self.mapContainer.controlsInfo.overviewMap) {
                    self.mapContainer.controlsInfo.overviewMap = new ol.control.OverviewMap({
                        "className": "overViewMap",
                        "layers": [
                            self.mapContainer.layersInfo.baiduSatellite,
                            self.mapContainer.layersInfo.baiduVectorMap,
                        ],
                        "collapseLabel": "\u00BB",
                        "label": "\u00AB",
                        "collapsed": false,
                        "view": new ol.View({
                            "center": self.airPort, // 地图初始化中心点
                            "zoom": 25, // 地图初始化显示级别
                            // "projection": "EPSG:4326"
                        })
                    });
                }

                // 全屏显示控件
                if (!self.mapContainer.controlsInfo.fullScreen) {
                    self.mapContainer.controlsInfo.fullScreen = new ol.control.FullScreen();
                }

                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.mousePosition);
                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.scaleLine);
                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.overviewMap);
                self.mapContainer.map.addControl(new ol.control.ZoomSlider());
                // self.mapContainer.map.addControl(self.mapContainer.controlsInfo.fullScreen);
            },
            //#endregion

            //#region 防区
            // 创建防区要素
            "createDefensFeature": function (item, callback) {
                var self = this;
                var defensFeature = null;
                var currentFeature = null;
                var coordinate = JSON.parse(item.areaRange)["coordinates"];

                if (!!self.mapContainer.sourceInfo.defens) {
                    currentFeature = self.mapContainer.sourceInfo.defens.getFeatureById("defens_" + item.id);
                } else {
                    return;
                }

                if (currentFeature) {
                    currentFeature.setStyle(new ol.style.Style(self.defensColor[item.secureStatus]));
                } else {
                    defensFeature = new ol.Feature({
                        "geometry": new ol.geom.Polygon(coordinate),
                        "name": "defens"
                    });
                    defensFeature.setId("defens_" + item.id);
                    defensFeature.setStyle(new ol.style.Style(self.defensColor[item.secureStatus]));
                    self.mapContainer.sourceInfo.defens.addFeature(defensFeature);
                }
                !!callback && callback(item.id, coordinate);
            },
            // 选择行时设置防区
            "setDefensRowData": function (item, index) {
                var self = this;
                self.defensAreaDetailInfo = self.defensList[index];
                self.defensAreaDetailInfo.remark = decodeURI(self.defensList[index]["remark"]);
                self.defensAreaDetailInfo.deptId = [self.defensList[index]["deptId"]];
                self.defensAreaDetailInfo.opType = 2;
                self.getDepartmentList('defensAreaDetailInfo');
                self.createDefensFeature(self.defensAreaDetailInfo, function (id, coordinate) {
                    self.showDefensPopLayer("defens_" + id, coordinate);
                });
            },
            // 防区状态变化时，改变防区颜色
            "defensStatuChange": function (item) {
                console.log(item);
            },
            // 画所有防区
            "drawAllDefens": function () {
                var self = this;
                for (var i = 0, len = self.defensList.length; i < len; i++) {
                    self.createDefensFeature(self.defensList[i]);
                }
            },
            // 创建交互矢量控件
            "createDefensInteraction": function () {
                var self = this;

                self.isDrawDefening = true; // 正在绘制
                self.mapContainer.interactionInfo.defens = new ol.interaction.Draw({
                    "source": self.mapContainer.sourceInfo.defens,
                    "type": "Polygon",
                    "geomertyFunction": function (coordinates, geomerty) {
                        if (!geomerty) {
                            geomerty = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geomerty.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[0]], start]
                        ]);
                        return geomerty
                    }
                });

                // 把绘制交互矢量控件添加到地图中
                self.mapContainer.map.addInteraction(self.mapContainer.interactionInfo.defens);

                // 绑定绘制结束事件
                self.bindDefensDrawEndEvent();
            },
            // 为新绘制的防区添加绘制结束事件
            "bindDefensDrawEndEvent": function () {
                var self = this;

                // 当多边形绘制完成后
                self.mapContainer.interactionInfo.defens.on("drawend", function (event) {
                    var currentFeature = event.feature; // 返回当前所绘制的多边形
                    var defensFeatures = self.mapContainer.sourceInfo.defens.getFeatures();
                    var geomeryt = currentFeature.getGeometry(); // 获取当前要素的几何信息
                    var coordinate = geomeryt.getCoordinates(); // 获取几何图形的坐标信息
                    var featureId = "defens_" + (defensFeatures.length + 1);

                    // 设置当前绘制的要素的id
                    currentFeature.setId(featureId);
                    currentFeature.set("name", "defens");

                    // 初始化输入信息
                    self.defensAreaDetailInfo = {
                        "id": "",
                        "featureId": featureId,
                        "opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                        "companyId": "",
                        "deptId": "", // 部门ID，可选
                        "deptIds": [], // 部门ID，可选
                        "areaName": "", // 防区名称
                        "areaCode": "", // 防区编码
                        "secureStatus": "", // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                        "areaRangeStr": (function () {
                            var coordArr = [];
                            var coordList = coordinate[0];

                            for (var i = 0, len = coordList.length; i < len; i++) {
                                coordArr.push(coordList[i].join(","));
                            }
                            return coordArr.join(";");
                        }()), // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": "", // 行驶速度限制上限（米/秒）
                        "staySecond": "", // 最大允许停留时长(单位秒)
                        "remark": "", // 备注
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    };
                    // 设置当前绘制防区详细信息
                    self.showDefensPopLayer(featureId, coordinate);

                    // 删除绘制控件
                    self.deleteDefensAction();
                }, this);
            },
            // 格式化防区
            "formatDefensData": function () {
                var self = this;
                for (var i = 0, len = self.defensList.length; i < len; i++) {
                    self.defensDatas.push({
                        "areaName": decodeURI(self.defensList[i]["areaName"]),
                        "areaCode": decodeURI(self.defensList[i]["areaCode"]),
                        "secureStatus": (function () {
                            var status = "";
                            for (var d = 0, dlen = self.secureAreaStatusList.length; d < dlen; d++) {
                                if (self.secureAreaStatusList[d]["type"] == self.defensList[i]["secureStatus"]) {
                                    status = self.secureAreaStatusList[d]["name"];
                                    break;
                                }
                            }
                            return status;
                        }()),
                        "speedLimit": self.defensList[i]["speedLimit"],
                        "staySecond": self.defensList[i]["staySecond"],
                    });
                }
            },
            // 获取防区列表
            "getDefensAreaList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.defensDatas = [];
                    self.defensList = [];
                    self.defensPageInfo.pageNum = 1;
                }
                setTimeout(function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.getSecureAreaList,
                        actionUrl: CONFIG.SERVICE.areaService,
                        dataObj: self.defensPageInfo,
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.defensList = data.data;
                                self.defensPageInfo.count = data.count;
                                self.formatDefensData();
                                self.drawAllDefens(); // 画所有的防区
                            }
                        }
                    });
                }, 500);
            },
            // 页数改变的时候
            "defensPageSizeChange": function () {
                var self = this;
                self.defensPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getDefensAreaList(false);
                }, 200);
            },
            // 选择一个防区
            "selectDefensArea": function (params) {
                var self = this;
                var coordinate = JSON.parse(self.defensList[params.index].areaRange)["coordinates"];

                if (self.isDeleteDefens == false) {
                    self.defensAreaDetailInfo = self.defensList[params.index];
                    self.isAddDefensDetailInfo = false;
                    setTimeout(function () {
                        self.isAddDefensDetailInfo = true;
                        self.mapContainer.overlayInfo.defens.setPosition([coordinate]);
                        self.autoFocus();
                    }, 200);
                }
            },
            // 显示防区弹出层
            "showDefensPopLayer": function (featureId, coordinate) {
                var self = this;
                var index = parseInt(featureId.split("_")[1], 10);
                for (var d = 0, dlen = self.defensList.length; d < dlen; d++) {
                    if (index == self.defensList[d]["id"]) {
                        self.defensAreaDetailInfo = self.defensList[d];
                        break;
                    }
                }
                self.getDepartmentList('defensAreaDetailInfo');
                // 添加pop层
                self.isAddDefensDetailInfo = false;

                setTimeout(function () {
                    self.isAddDefensDetailInfo = true;
                    self.mapContainer.overlayInfo.defens.setPosition(coordinate);
                    self.autoFocus();
                }, 500);
            },
            // 启动添加绘制控件
            "addDefensAction": function () {
                var self = this;

                // 先删除已经添加的绘制控件
                self.mapContainer.map.removeInteraction(self.mapContainer.interactionInfo.defens);

                self.isAddDefensAction = true;
                self.createDefensInteraction();
            },
            // 取消添加绘制控件
            "deleteDefensAction": function () {
                var self = this;

                // 先删除已经添加的绘制控件
                self.mapContainer.map.removeInteraction(self.mapContainer.interactionInfo.defens);
                self.isAddDefensAction = false;
                self.isDrawDefening = false;
            },
            // 关闭防区弹出层
            "closeDefensLayer": function () {
                var self = this;
                var selectFeature = null;
                var featureId = self.defensAreaDetailInfo.id || self.defensAreaDetailInfo.featureId;
                if (!!!self.defensAreaDetailInfo.id) {
                    self.isAddDefensDetailInfo = false;
                    selectFeature = self.mapContainer.sourceInfo.defens.getFeatureById(featureId);
                    self.mapContainer.sourceInfo.defens.removeFeature(selectFeature);
                }
            },
            // 删除防区
            "deleteDefensArea": function () {
                var self = this;
                var selectFeature = null;
                var featureId = self.defensAreaDetailInfo.id || self.defensAreaDetailInfo.featureId;

                self.isAddDefensDetailInfo = false;
                selectFeature = self.mapContainer.sourceInfo.defens.getFeatureById(featureId);
                self.mapContainer.sourceInfo.defens.removeFeature(selectFeature);

                if (!!self.defensAreaDetailInfo.id) {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.delSecureArea,
                        actionUrl: CONFIG.SERVICE.areaService,
                        dataObj: {
                            "ids": self.defensAreaDetailInfo.id,
                            "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getDefensAreaList(true);
                                setTimeout(function () {
                                    self.deleteLoading = false;
                                    self.isDeleteDefens = false;
                                    self.defensAreaDetailInfo = {
                                        "id": "",
                                        "opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                                        "companyId": "",
                                        "deptId": "", // 部门ID，可选
                                        "deptIds": [], // 部门ID，可选
                                        "areaName": "", // 防区名称
                                        "areaCode": "", // 防区编码
                                        "secureStatus": "", // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                                        "areaRangeStr": "", // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                                        "speedLimit": "", // 行驶速度限制上限（米/秒）
                                        "staySecond": "", // 最大允许停留时长(单位秒)
                                        "remark": "", // 备注
                                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                                    };
                                }, 500);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                }
            },
            // 把把防区信息提交到服务器
            "uploadDefensAreaDetailInfoToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.saveSecureArea,
                    actionUrl: CONFIG.SERVICE.areaService,
                    dataObj: {
                        "id": self.defensAreaDetailInfo.id,
                        "opType": self.defensAreaDetailInfo.opType, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                        "companyId": self.defensAreaDetailInfo.companyId,
                        "deptId": self.defensAreaDetailInfo.deptIds[self.defensAreaDetailInfo.deptIds.length - 1] || 0, // 部门ID，可选
                        "areaName": encodeURI(self.defensAreaDetailInfo.areaName), // 防区名称
                        "areaCode": encodeURI(self.defensAreaDetailInfo.areaCode), // 防区编码
                        "secureStatus": self.defensAreaDetailInfo.secureStatus, // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                        "areaRangeStr": self.defensAreaDetailInfo.areaRangeStr, // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": self.defensAreaDetailInfo.speedLimit, // 行驶速度限制上限（米/秒）
                        "staySecond": self.defensAreaDetailInfo.staySecond, // 最大允许停留时长(单位秒)
                        "canEnter": self.defensAreaDetailInfo.canEnter || 720, // 是否允许车辆进入
                        "canExit": self.defensAreaDetailInfo.canExit || 720, // 是否允许车辆驶出
                        "canStay": self.defensAreaDetailInfo.canStay || 720, // 是否允许车辆停留：
                        "remark": encodeURI(self.defensAreaDetailInfo.remark), // 备注
                        "createUserId": self.defensAreaDetailInfo.createUserId, // 创建用户ID，新增时必传
                        "modifyUserId": self.defensAreaDetailInfo.modifyUserId, // 修改用户ID，修改时必传
                    }, // self.defensAreaDetailInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var currentFeature = self.mapContainer.sourceInfo.defens.getFeatureById("defens_" + self.defensAreaDetailInfo.id);
                            self.getDefensAreaList(true);
                            setTimeout(function () {
                                self.isAddDefensDetailInfo = false;
                                self.addLoading = false;
                            }, 500);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            //#endregion

            //#region 摄像机
            // 添加摄像机要素点
            "createCameraFeature": function (areaRangeStr, id, callback) {
                var self = this;
                var cameraFeature = null;
                var cameraFeatures = self.mapContainer.sourceInfo.camera.getFeatures();
                var featureId = "camera_" + (cameraFeatures.length + 1);
                var currentFeature = null;
                var coordinate = null;

                // 如果是创建新的摄像机
                if (!!id) {
                    currentFeature = self.mapContainer.sourceInfo.camera.getFeatureById(id);
                    coordinate = JSON.parse(areaRangeStr)["coordinates"];
                    if (!!currentFeature) {
                        self.mapContainer.sourceInfo.camera.removeFeature(currentFeature);
                    }
                } else {
                    coordinate = areaRangeStr;
                }

                if (self.isAddCameraAction == true) {
                    cameraFeature = new ol.Feature({
                        "geometry": new ol.geom.Point(self.transformLat(coordinate)),
                        "name": "camera"
                    });
                    cameraFeature.setId(featureId);
                    cameraFeature.setStyle(new ol.style.Style({
                        "image": new ol.style.Icon({
                            "anchor": [0.5, 0.5],
                            "anchorOrigin": "top-right",
                            "anchorXUnits": "fraction",
                            "anchorYUnits": "pixels",
                            "offsetOrigin": "top-right",
                            "scale": .2,
                            "src": "/airport/assets/img/camera.png"
                        })
                    }));
                    cameraFeature.setId(id || featureId);
                    self.mapContainer.sourceInfo.camera.addFeature(cameraFeature);
                    // 如果是创建新的摄像机
                    if (!!!id) {
                        // 初始化输入信息
                        self.cameraDetailInfo = {
                            "id": "",
                            "featureId": featureId,
                            "id": "", // 摄像机ID
                            "companyId": "", // 所属公司ID 
                            "companyName": "", // 公司名称
                            "deptId": "", // 部门ID，可选
                            "deptIds": [], // 部门ID，可选
                            "deptName": "", // 部门名称
                            "cameraName": "", // 摄像机名称
                            "cameraCode": "", // 摄像机编码
                            "cameraDesc": "", // 摄像机描述
                            "cameraPositionStr": coordinate.join(","), // 位置坐标
                            "radius": "", // 摄像头监控半径（单位米）
                            "angle": "", // 视野角度
                            "monitorStatus": "", // 摄像头监控状态：
                            "remark": "", // 备注
                            "rtspLiveUrl": "", // Rtsp直播地址
                            "rtspHisUrl": "", // Rtsp录播地址
                            "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                            "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        };
                    }
                }

                !!callback && callback(id, self.transformLat(coordinate));
                self.isAddCameraAction = false;
            },

            // 画摄像机
            "drawAllCamera": function () {
                var self = this;
                for (var i = 0, len = self.cameraList.length; i < len; i++) {
                    self.isAddCameraAction = true;
                    self.createCameraFeature(self.cameraList[i]["cameraPosition"], self.cameraList[i]["id"]);
                    self.isAddCameraAction = false;
                }
            },

            "setCameraRowData": function (item, index) {
                var self = this;
                self.cameraDetailInfo = self.cameraList[index];
                self.cameraDetailInfo.remark = decodeURI(self.cameraList[index]["remark"]);
                self.cameraDetailInfo.cameraName = decodeURI(self.cameraList[index]["cameraName"]);
                self.cameraDetailInfo.cameraCode = decodeURI(self.cameraList[index]["cameraCode"]);
                self.cameraDetailInfo.cameraDesc = decodeURI(self.cameraList[index]["cameraDesc"]);
                self.cameraDetailInfo.deptId = [self.cameraList[index]["deptId"]];
                self.isAddCameraAction = true;

                self.createCameraFeature(self.cameraList[index]["cameraPosition"], self.cameraList[index]["id"], function (id, coordinate) {
                    self.setAnimation(coordinate, 18);
                    self.showCameraPopLayer(id, coordinate);
                });
            },
            // 显示摄像机弹出层
            "showCameraPopLayer": function (featureId, coordinate) {
                var self = this;
                for (var d = 0, dlen = self.cameraList.length; d < dlen; d++) {
                    if (featureId == self.cameraList[d]["id"]) {
                        self.cameraDetailInfo = self.cameraList[d];
                        break;
                    }
                }
                self.getDepartmentList('cameraDetailInfo');
                // 添加pop层
                self.isAddcameraDetailInfo = false;
                setTimeout(function () {
                    self.isAddcameraDetailInfo = true;
                    self.mapContainer.overlayInfo.camera.setPosition(coordinate);
                    self.autoFocus();
                }, 500);
            },
            // 选择一个摄像机
            "selectCamera": function (params) {
                var self = this;
                var coordinate = JSON.parse(self.cameraList[params.index].areaRange.value.replace(/\(/g, "[").replace(/\)/g, "]"));

                if (self.isDeleteCamera == false) {
                    self.cameraDetailInfo = self.cameraList[params.index];
                    self.isAddcameraDetailInfo = false;
                    setTimeout(function () {
                        self.isAddcameraDetailInfo = true;
                        self.mapContainer.overlayInfo.camera.setPosition(self.transformLat([coordinate]));
                        self.autoFocus();
                    }, 200);
                }
            },
            // 格式化摄像机列表数据
            "formatCameraData": function () {
                var self = this;
                for (var i = 0, len = self.cameraList.length; i < len; i++) {
                    self.camersDatas.push({
                        "id": self.cameraList[i]["id"], // 摄像机ID
                        "companyId": self.cameraList[i]["companyId"], // 所属公司ID 
                        "companyName": decodeURI(self.cameraList[i]["companyName"]), // 公司名称
                        "deptId": self.cameraList[i]["deptId"], // 部门ID，可选
                        "deptName": decodeURI(self.cameraList[i]["deptName"]), // 部门名称
                        "cameraName": decodeURI(self.cameraList[i]["cameraName"]), // 摄像机名称
                        "cameraCode": decodeURI(self.cameraList[i]["cameraCode"]), // 摄像机编码
                        "cameraDesc": decodeURI(self.cameraList[i]["cameraDesc"]), // 摄像机描述
                        "radius": self.cameraList[i]["radius"], // 摄像头监控半径（单位米）
                        "cameraPositionStr": self.cameraList[i]["cameraPositionStr"], // 位置坐标
                        "angle": self.cameraList[i]["angle"], // 视野角度
                        "monitorStatus": self.cameraList[i]["monitorStatusName"], // 摄像头监控状态：
                        "remark": decodeURI(self.cameraList[i]["remark"]), // 备注
                        "rtspLiveUrl": self.cameraList[i]["rtspLiveUrl"], // Rtsp直播地址
                        "rtspHisUrl": self.cameraList[i]["rtspHisUrl"], // Rtsp录播地址
                    });
                }
            },
            // 获取摄像机列表数据
            "getCameraList": function (bool) {
                var self = this;
                self.camersDatas = [];
                self.cameraList = [];
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.cameraPageInfo.pageNum = 1;
                }
                setTimeout(function () {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.getCameraList,
                        actionUrl: CONFIG.SERVICE.deviceService,
                        dataObj: self.cameraPageInfo,
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.cameraList = data.data;
                                self.cameraPageInfo.count = data.count;
                                self.formatCameraData();
                                self.drawAllCamera();
                            }
                        }
                    });
                }, 500);
            },
            // 页数改变的时候
            "cameraPageSizeChange": function () {
                var self = this;
                self.cameraPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getCameraList(false);
                }, 200);
            },
            // 关闭摄像机弹出层
            "closeCameraLayer": function () {
                var self = this;
                var selectFeature = null;
                var featureId = self.cameraDetailInfo.id || self.cameraDetailInfo.featureId;

                if (!!!self.cameraDetailInfo.id) {
                    self.isAddcameraDetailInfo = false;
                    selectFeature = self.mapContainer.sourceInfo.camera.getFeatureById(featureId);
                    self.mapContainer.sourceInfo.camera.removeFeature(selectFeature);
                }
            },
            // 删除摄像机
            "deleteCamera": function (event) {
                var self = this;
                var selectFeature = null;
                var featureId = self.cameraDetailInfo.id || self.cameraDetailInfo.featureId;

                self.isAddcameraDetailInfo = false;
                selectFeature = self.mapContainer.sourceInfo.camera.getFeatureById(featureId);
                self.mapContainer.sourceInfo.camera.removeFeature(selectFeature);

                if (!!self.cameraDetailInfo.id) {
                    utility.interactWithServer({
                        url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.delCamera,
                        actionUrl: CONFIG.SERVICE.deviceService,
                        dataObj: {
                            "ids": self.cameraDetailInfo.id,
                            "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getCameraList(true);
                                setTimeout(function () {
                                    self.deleteLoading = false;
                                    self.isDeleteCamera = false;
                                    self.cameraDetailInfo = {
                                        "id": "", // 摄像机ID
                                        "companyId": "", // 所属公司ID 
                                        "companyName": "", // 公司名称
                                        "deptId": "", // 部门ID，可选
                                        "deptIds": [], // 部门ID，可选
                                        "deptName": "", // 部门名称
                                        "cameraName": "", // 摄像机名称
                                        "cameraCode": "", // 摄像机编码
                                        "cameraDesc": "", // 摄像机描述
                                        "cameraPositionStr": "", // 位置坐标
                                        "radius": "", // 摄像头监控半径（单位米）
                                        "angle": "", // 视野角度
                                        "monitorStatus": "", // 摄像头监控状态：
                                        "remark": "", // 备注
                                        "rtspLiveUrl": "", // Rtsp直播地址
                                        "rtspHisUrl": "", // Rtsp录播地址
                                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                                    };
                                }, 500);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                }
            },
            // 把摄像机数据提交到服务器
            "uploadCameraDetailInfoToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.saveCamera,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "id": self.cameraDetailInfo.id, // 摄像机ID
                        "companyId": self.cameraDetailInfo.companyId, // 所属公司ID 
                        "deptId": self.cameraDetailInfo.deptIds[self.cameraDetailInfo.deptIds.length - 1] || 0, // 部门ID，可选
                        "cameraName": encodeURI(self.cameraDetailInfo.cameraName), // 摄像机名称
                        "cameraCode": encodeURI(self.cameraDetailInfo.cameraCode), // 摄像机编码
                        "cameraDesc": encodeURI(self.cameraDetailInfo.cameraDesc), // 摄像机描述
                        "radius": self.cameraDetailInfo.radius, // 摄像头监控半径（单位米）
                        "angle": self.cameraDetailInfo.angle, // 视野角度
                        "cameraPositionStr": self.cameraDetailInfo.cameraPositionStr, // 位置坐标
                        "monitorStatus": self.cameraDetailInfo.monitorStatus, // 摄像头监控状态：
                        "remark": encodeURI(self.cameraDetailInfo.remark), // 备注
                        "rtspLiveUrl": self.cameraDetailInfo.rtspLiveUrl, // Rtsp直播地址
                        "rtspHisUrl": self.cameraDetailInfo.rtspHisUrl, // Rtsp录播地址
                        "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                        "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
                    }, // self.defensAreaDetailInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.getCameraList(true);
                            setTimeout(function () {
                                self.isAddcameraDetailInfo = false;
                                self.addLoading = false;
                            }, 500);
                        } else {
                            self.$Message.error(data.message);
                        }
                    }
                });
            },
            //#endregion

            //#region 车辆管理
            // 格式化车辆信息
            "formatVehicle": function () {
                var self = this;
                self.vehicleDatas = [];
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    self.vehicleDatas.push({
                        "vehicleCode": self.vehicleList[i]["vehicleCode"], //"编码",
                        "vehicleTypeId": self.vehicleList[i]["vehicleTypeName"], //"类型",
                        "vehicleName": self.vehicleList[i]["vehicleName"], //"名称",
                        "vehicleStatus": (function () {
                            var state = ""; // terminalStatusList
                            for (var s = 0, slen = self.terminalStatusList.length; s < slen; s++) {
                                if (self.terminalStatusList[s]["type"] == self.vehicleList[i]["vehicleStatus"]) {
                                    state = self.terminalStatusList[s]["name"];
                                    break;
                                }
                            }
                            return state;
                        }()), //"状态",
                    });
                }
            },
            // 获取车辆管理信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                self.vehicleDatas = [];
                self.vehicleList = [];
                if (bool == true) {
                    self.vehiclePageInfo.pageNum = 1;
                }
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getVehicleList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: self.vehiclePageInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.vehicleList = data.data;
                            self.vehiclePageInfo.count = data.count;
                            self.formatVehicle();
                        }
                    }
                });
            },
            // 当页数改变后
            "vehiclePageSizeChange": function () {
                var self = this;
                self.vehiclePageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },

            // 添加车辆要素
            "createVehicleFeature": function (item, index, callback) {
                var self = this;
                var vehicleFeature = null;
                var coordinate = JSON.parse(item["lastPosition"])["coordinates"];
                var iconSrc = "/airport/assets/img/success.gif";
                var circleColor = "rgb(32, 121, 109)";
                var vehicleType = (function () {
                    var type = {};
                    for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
                        type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
                    }
                    return type;
                }());
                var vehicleIcon = (vehicleType[item.vehicleTypeName] + item.vehicleStatus) || "warning";
                var scale = 0.2;
                var radius = 4;
                var width = 2;
                var zoom = self.mapContainer.viewInfo.view.getZoom();

                iconSrc = "/airport/assets/img/" + vehicleIcon + ".gif";

                if (coordinate[0] == 0 && coordinate[1] == 0) {
                    return;
                }

                if (zoom < 8) {
                    scale = 0.01;
                    radius = 0;
                    width = 0;
                } else if (zoom < 10) {
                    scale = 0.05;
                    radius = 0;
                    width = 0;
                } else if (zoom < 11.5) {
                    scale = 0.06;
                    radius = 0;
                    width = 0;
                } else if (zoom < 12.5) {
                    scale = 0.08;
                    radius = 0;
                    width = 0;
                } else if (zoom < 13.5) {
                    scale = 0.08;
                    radius = 0;
                    width = 0;
                } else if (zoom < 14.5) {
                    scale = 0.12;
                    radius = 2;
                    width = 1;
                } else {
                    scale = 0.2;
                    radius = 4;
                    width = 2;
                }

                // 如果车辆已经存在 
                if (self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"]) {
                    // self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"].setCoordinates(self.transformLat(coordinate));
                    // self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"].setCoordinates(self.transformLat(coordinate));
                    self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"].setCoordinates(self.transformLat(coordinate));
                    self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"].setCoordinates(self.transformLat(coordinate));
                    if (self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "--" + index])) {
                        self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "Circle"]).setStyle(new ol.style.Style({
                            "image": new ol.style.Circle({
                                "radius": radius,
                                "stroke": new ol.style.Stroke({
                                    color: circleColor,
                                    width: width
                                }),
                                "fill": new ol.style.Fill({
                                    color: 'rgba(208, 219, 245, .3)',
                                })
                            })
                        }));
                        self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "--" + index]).setStyle(new ol.style.Style({
                            "image": new ol.style.Icon({
                                "scale": scale,
                                "src": iconSrc,
                                "anchor": [0.5, 0.5],
                                "anchorYUnits": "pixels",
                                "anchorXUnits": "fraction",
                                "offsetOrigin": "bottom-right",
                                "anchorOrigin": "bottom-right",
                            })
                        }));
                    }
                } else {
                    if (self.isAddVehiclePosition == true) {
                        self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"] = new ol.geom.Point(self.transformLat(coordinate));
                        circleFeatrue = new ol.Feature({
                            "name": "vehicle",
                            "geometry": self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"],
                        });
                        circleFeatrue.setStyle(new ol.style.Style({
                            "image": new ol.style.Circle({
                                "radius": 4,
                                "scale": scale,
                                "stroke": new ol.style.Stroke({
                                    color: circleColor,
                                    width: 2
                                }),
                                "fill": new ol.style.Fill({
                                    color: 'rgba(208, 219, 245, .3)',
                                })
                            })
                        }));
                        self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"] = new ol.geom.Point(self.transformLat(coordinate));
                        vehicleFeature = new ol.Feature({
                            "name": "vehicle",
                            "geometry": self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"],
                        });
                        vehicleFeature.setStyle(new ol.style.Style({
                            "image": new ol.style.Icon({
                                "scale": scale,
                                "src": iconSrc,
                                "anchor": [0.5, 0.5],
                                "anchorYUnits": "pixels",
                                "anchorXUnits": "fraction",
                                "offsetOrigin": "bottom-right",
                                "anchorOrigin": "bottom-right",
                            })
                        }));
                        circleFeatrue.setId(item["id"] + "Circle");
                        vehicleFeature.setId(item["id"] + "--" + index);
                        self.mapContainer.sourceInfo.vehicle.addFeature(circleFeatrue);
                        self.mapContainer.sourceInfo.vehicle.addFeature(vehicleFeature);
                    }
                }
                self.isAddVehiclePosition = false;
                !!callback && callback(self.transformLat(coordinate));
            },
            // 清除所有的车辆
            "clearAllVehicle": function () {
                var self = this;
                // self.mapContainer.sourceInfo.vehicle.clear();
                // self.mapContainer.featrueInfo.vehiclePoint = {};
                // self.mapContainer.featrueInfo.circlePoint = {};
                // if (!!self.mapContainer.overlayInfo["vehicle"]) {
                //     self.mapContainer.overlayInfo["vehicle"].setPosition(undefined);
                // }
                self.baiduMapInfo.markerClusterer.clearMarkers(self.baiduMapInfo.markers);
            },

            // 通过选择显示实时车辆信息
            "setVehicleRowData": function (index, callback) {
                var self = this;
                self.isAddVehiclePosition = true;
                self.vehiclePositionItem = self.vehiclePositionList[index];
                if (self.vehiclePositionItem.lastPosition) {
                    self.createVehicleFeature(self.vehiclePositionItem, index, function (coordinate) {
                        !!callback && callback(coordinate);
                    });
                }
            },
            // 显赫车辆Pop
            "showVehicleOverLayer": function (coordinate) {
                var self = this;
                var view = self.mapContainer.map.getView().getZoom();
                // 设置轨迹查询数据
                self.singleVehiclePageInfo.vehicleId = self.vehicleItemPop.id;// 车辆ID
                self.singleVehiclePageInfo.vehicleCode = self.vehicleItemPop.vehicleCode;// 车辆编码
                self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;// 车牌号
                self.singleVehiclePageInfo.lastGpsTime = self.vehicleItemPop.lastGpsTime;// 车牌号
                $("body").find("#ol-vehicle").show();
                if (!!!self.mapContainer.overlayInfo["vehicle"]) {
                    self.mapContainer.overlayInfo["vehicle"] = new ol.Overlay({
                        "autoPan": true,
                        "stopEvent": false,
                        "positioning": "top-center",
                        "element": document.getElementById("ol-vehicle"),
                        "autoPanAnimation": { "duration": 250 },
                    });
                    self.mapContainer.map.addOverlay(self.mapContainer.overlayInfo["vehicle"]);
                }
                self.mapContainer.overlayInfo["vehicle"].setPosition(coordinate);
                if (view < 16) {
                    view = 16;
                }
                self.getAdressDetail(coordinate, self.vehicleItemPop);
                self.setAnimation(coordinate, view);
                $("body").on("click", "#popup-closer--vehicle", function () {
                    $("body").find("#ol-vehicle").hide();
                    self.mapContainer.overlayInfo["vehicle"].setPosition(undefined);
                });
            },
            // 显示车辆管理详细信息
            "showVehicleRowData": function (item, index) {
                var self = this;
                self.isAddVehiclePosition = true;
                self.vehicleItem = self.vehicleList[index];
                self.vehicleItemPop = self.vehicleItem;

                // self.createVehicleFeature(self.vehicleItem, index, function (coordinate) {
                //     self.showVehicleOverLayer(coordinate);
                // });

                if (!!self.vehicleItemPop.lastPosition) {
                    self.createVehicleFeature(self.vehiclePositionItem, index, function (coordinate) {
                        self.showVehicleOverLayer(coordinate);
                    });
                } else {
                    self.$Message.error("没有车辆定位数据");
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                }
            },
            // 点击行时显示详细车辆位置
            "showRowDataPosition": function (item, index) {
                var self = this;
                self.isAddVehiclePosition = true;
                self.vehiclePositionItem = self.vehiclePositionList[index];
                self.vehicleItemPop = self.vehiclePositionItem;

                if (!!self.vehicleItemPop.lastPosition) {
                    if (JSON.parse(self.vehicleItemPop.lastPosition).coordinates[0] == 0 || JSON.parse(self.vehicleItemPop.lastPosition).coordinates[1] == 0) {
                        self.$Message.error("没有车辆定位数据");
                    } else {
                        self.createVehicleFeature(self.vehiclePositionItem, index, function (coordinate) {
                            self.showVehicleOverLayer(coordinate);
                        });
                    }
                } else {
                    self.$Message.error("没有车辆定位数据");
                }
            },
            // 画所有实时车辆
            "drawAlVehicle": function () {
                var self = this;
                for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
                    self.setVehicleRowData(i);
                }
            },
            // 点击当前的车辆时，显示当前车辆详细位置
            "showVehiclePositionByClick": function (featureId) {
                var self = this;
                var featureIdInfo = featureId.split("--");
                var id = parseInt(featureIdInfo[0], 10);
                var index = parseInt(featureIdInfo[1], 10);
                var coordinate = [];

                self.clearTrack();
                self.singleVehicleItem.track = "";

                self.isAddVehiclePosition = true;
                self.vehicleItemPop = (function () {
                    var item = null;
                    for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
                        if (id == self.vehiclePositionList[i]["id"]) {
                            item = self.vehiclePositionList[i];
                            break;
                        }
                    }
                    return item;
                }());

                if (self.vehicleItemPop) {
                    if (!!self.vehicleItemPop.lastPosition) {
                        coordinate = JSON.parse(self.vehicleItemPop["lastPosition"])["coordinates"];
                        self.createVehicleFeature(self.vehicleItemPop, index, function () {
                            self.showVehicleOverLayer(self.transformLat(coordinate));
                        });
                    } else {
                        self.$Message.error("没有车辆定位数据");
                        self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                    }
                } else {
                    self.$Message.error("没有车辆信息");
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                }
            },
            // 格式化实时车辆信息
            "formatVehiclePositon": function () {
                var self = this;
                for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
                    self.searchDatas.push({
                        "o": self.vehiclePositionList[i]["o"], //"",
                        "id": self.vehiclePositionList[i]["id"], //"",
                        "speed": self.vehiclePositionList[i]["speed"], //"",
                        "power": self.vehiclePositionList[i]["power"], //"",
                        "deptId": self.vehiclePositionList[i]["deptId"], //"",
                        "deptName": self.vehiclePositionList[i]["deptName"], //"",
                        "modifyTime": self.vehiclePositionList[i]["modifyTime"], //"",
                        "gpsDeviceId": self.vehiclePositionList[i]["gpsDeviceId"], //"",
                        "companyName": self.vehiclePositionList[i]["companyName"], //"",
                        "vehicleName": self.vehiclePositionList[i]["vehicleName"], //"",
                        "vehicleCode": self.vehiclePositionList[i]["vehicleCode"], //"",
                        "licenseNumber": self.vehiclePositionList[i]["licenseNumber"], //"",
                        "lastPosition": !!self.vehiclePositionList[i]["lastPosition"] ? JSON.parse(self.vehiclePositionList[i]["lastPosition"])["coordinates"] : null, //"",
                        "vehicleTypeId": self.vehiclePositionList[i]["vehicleTypeName"], //"",
                        "gpsDeviceCode": self.vehiclePositionList[i]["gpsDeviceCode"], //"",
                        "providerId": self.vehiclePositionList[i]["providerId"], //"",
                        "vehicleStatus": (function () {
                            var vehicleStatusNameList = $.grep(self.terminalStatusList, function (item) {
                                return item.type == self.vehiclePositionList[i]["vehicleStatus"];
                            });
                            if (!vehicleStatusNameList || vehicleStatusNameList.length == 0) {
                                return "--";
                            }

                            return vehicleStatusNameList[0]["name"];
                        })(), //self.vehiclePositionList[i]["vehicleStatus"], //"",
                        "useStatus": self.vehiclePositionList[i]["useStatusName"], //self.vehiclePositionList[i]["vehicleStatus"], //"",
                        "vehicleColorId": self.vehiclePositionList[i]["vehicleColorName"], //"",
                        "vehicleBrandId": self.vehiclePositionList[i]["vehicleBrandName"], //"",
                        "vehicleStatusName": self.vehiclePositionList[i]["vehicleStatusName"], //"",
                        "cellClassName": {
                            "vehicleStatus": "_" + self.vehiclePositionList[i]["vehicleStatus"]
                        }
                    });
                }
            },
            // 取消范围查询
            "cancelAreaSearch": function () {
                var self = this;
                self.vehiclePositonPageInfo.centerPosition = "";
                self.vehiclePositonPageInfo.span = 1000;
                self.clearAllVehicle();
                self.getAllVehiclePositonList();
            },
            // 查询实时车辆数据
            "searchTimeVehicle": function () {
                var self = this;
                self.clearAllVehicle();
                self.getAllVehiclePositonList();
            },
            // 获取车辆最新位置数据接口
            "getAllVehiclePositonList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getAllVehiclePositonList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "span": self.vehiclePositonPageInfo.span || 1000, //"", // 距离查询中间点的距离（密），不指定则默认为100米。 // 通过centerPosition+ span两个参数可以联合查询距离中心点多少米内的车辆最近位置
                        "deptId": self.vehiclePositonPageInfo.deptId, //"", // 部门ID
                        "pageNum": self.vehiclePositonPageInfo.pageNum, //0,
                        "pageSize": self.vehiclePositonPageInfo.pageSize, //5,
                        "id": self.vehiclePositonPageInfo.id, //"", // 车辆ID
                        "companyId": self.vehiclePositonPageInfo.companyId, //"", // 所属公司ID
                        "gpsDeviceCode": self.vehiclePositonPageInfo.gpsDeviceCode, //"", // 定位终端编号
                        "vehicleTypeId": self.vehiclePositonPageInfo.vehicleTypeId, //"", // 车辆类型ID
                        "vehicleStatus": self.vehiclePositonPageInfo.vehicleStatus, //"", // 车辆运行状态
                        "useStatus": self.vehiclePositonPageInfo.useStatus, //"", // 车辆运行状态
                        "vehicleColorId": self.vehiclePositonPageInfo.vehicleColorId, //"", // 车辆颜色ID
                        "vehicleBrandId": self.vehiclePositonPageInfo.vehicleBrandId, //"", // 车辆品牌ID
                        "centerPosition": self.vehiclePositonPageInfo.centerPosition, //"", // 查询中心点坐标，格式为：经度,纬度
                        "vehicleName": encodeURI(self.vehiclePositonPageInfo.vehicleName), //"", // 车辆名称
                        "vehicleCode": encodeURI(self.vehiclePositonPageInfo.vehicleCode), //"", // 车辆编码
                        "licenseNumber": encodeURI(self.vehiclePositonPageInfo.licenseNumber), //"", // 车牌号
                    }, //self.vehiclePositonPageInfo,
                    beforeSendCallback: function () {
                        self.isSearchLoading = true;
                    },
                    completeCallback: function () {
                        self.isSearchLoading = false;
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.searchDatas = [];
                            self.vehiclePositionList = data.data.sort(function (a, b) {
                                return a.vehicleStatus - b.vehicleStatus;
                            });
                            self.vehiclePositonPageInfo.count = data.count;
                            self.formatVehiclePositon(); // 格式化车辆数据
                            // self.drawAlVehicle(); // 画所有车辆

                            // 画百度车辆

                            self.drawAlVehicleByBaidu();
                        }
                    }
                });
            },
            // 获取开始时间
            "getBeginDate": function (value) {
                var self = this;
                if (!!value) {
                    self.singleVehiclePageInfo.beginTime = value + " " + "00:00:00";
                    self.singleVehiclePageInfo.endTime = value + " " + "23:59:59";
                } else {
                    var dateInfo = utility.getDateDetailInfo();
                    self.singleVehiclePageInfo.beginTime = dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date + " " + "00:00:00";
                    self.singleVehiclePageInfo.endTime = dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date + " " + "23:59:59";
                }
            },
            // 获取详细地址
            "getAdressDetail": function (coordinate, target) {
                target.sourceCoor = ol.proj.transform([coordinate[0], coordinate[1]], 'EPSG:3857', 'EPSG:4326');
                target.point = new BMap.Point(target.sourceCoor[0], target.sourceCoor[1]);
                // return [coordinate[0] + 0.00604, coordinate[1] - 0.00250]
                target.gc = new BMap.Geocoder();
                target.gc.getLocation(target.point, function (rs) {
                    var addComp = rs.addressComponents;
                    target.address = "";
                    // target.address = "商圈(" + rs.business + ")" + addComp.province + ", " + addComp.city + ", " + addComp.district + (!!addComp.street?", " + addComp.street:'') + (!!addComp.streetNumber?", " + addComp.streetNumber:'');
                    // self.mapContainer.animationInfo.trajectoryItem.address = rs.address;
                });
            },
            // 获取时间
            "getTime": function (value) {
                var self = this;
                var beginTime = self.singleVehiclePageInfo.beginTime;
                var endTime = self.singleVehiclePageInfo.endTime;

                self.singleVehiclePageInfo.beginTime = beginTime.split(" ")[0] + " " + value[0];
                self.singleVehiclePageInfo.endTime = endTime.split(" ")[0] + " " + value[1];
            },
            // 格式化轨迹坐标数据
            "formatTrajectoryInfo": function () {
                var self = this;
                var track = null;
                var trajectoryArr = [];
                var trajectoryInfo = [];
                if (!!self.singleVehicleItem && self.singleVehicleItem.track) {
                    track = self.singleVehicleItem.track.split("/");
                    for (var i = 0, len = track.length; i < len; i++) {
                        var trackArr = track[i].split(",");
                        trajectoryInfo.push({
                            "time": (function () {
                                var timeInfo = utility.getDateDetailInfo(trackArr[2]);
                                return timeInfo.year + "-" + timeInfo.month + "-" + timeInfo.date + " " + timeInfo.hour + ":" + timeInfo.min + ":" + timeInfo.second;
                            }()),
                            "speed": trackArr[3],
                            "coordinate": [parseFloat(trackArr[0], 10), parseFloat(trackArr[1], 10)], //self.transformLat([parseFloat(trackArr[0], 10), parseFloat(trackArr[1], 10)]),
                            "vehicleCode": self.singleVehicleItem.vehicleCode,
                            "vehicleStatus": self.singleVehicleItem.vehicleStatus,
                            "companyName": self.singleVehicleItem.companyName,
                            "deptName": self.singleVehicleItem.deptName,
                            "vehicleName": self.singleVehicleItem.vehicleName,
                            "licenseNumber": self.singleVehicleItem.licenseNumber,
                            "lastGpsTime": self.singleVehicleItem.lastGpsTime,
                            "vehicleTypeName": self.singleVehicleItem.vehicleTypeName,
                        });


                    }
                }
                trajectoryArr = trajectoryInfo.sort(function (a, b) {
                    return a.time - b.time;
                });
                for (var t = 0, tlen = trajectoryArr.length; t < tlen; t++) {
                    self.convertorByBaidu(trajectoryArr[t]["coordinate"], function (point) {
                        self.baiduMapInfo.animationInfo.coordinates.push(point);
                    });
                }

                // self.mapContainer.animationInfo.coordinates = coordinate;
                // self.mapContainer.animationInfo.trajectoryInfo = trajectoryArr;
                self.baiduMapInfo.animationInfo.trajectoryInfo = trajectoryArr;
            },
            // 获取指定车辆的运动轨迹数据
            "getSingleVehicleTrack": function (bool) {
                var self = this;

                // 先清空原有轨迹
                self.clearTrack();
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "正在加载轨迹..."
                });
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getSingleVehicleTrack,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        // "id": self.singleVehiclePageInfo.vehicleId, // 车辆ID
                        "gpsDeviceCode": self.singleVehiclePageInfo.gpsDeviceCode, // 车辆ID
                        // "vehicleCode": encodeURI(self.singleVehiclePageInfo.vehicleCode), // 车辆编码
                        "licenseNumber": encodeURI(self.singleVehiclePageInfo.licenseNumber), // 车辆编码
                        "beginTime": self.singleVehiclePageInfo.beginTime, // 车辆编码
                        "endTime": self.singleVehiclePageInfo.endTime, // 车辆编码
                    }, //self.vehiclePositonPageInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var coordinate = [];
                            var coorArr = [];
                            var track = [];
                            var view = self.mapContainer.map.getView().getZoom();

                            self.singleVehicleItem = data.data;
                            self.vehicleItemPop = data.data;

                            self.showModal("isHistory");

                            // 如果轨迹信息
                            if (self.singleVehicleItem.track) {
                                track = self.vehicleItemPop["track"].split("/");
                                coorArr = track[track.length - 1].split(",");
                                coordinate = self.transformLat([parseFloat(coorArr[0], 10), parseFloat(coorArr[1], 10)]);
                                self.showVehicleOverLayer(coordinate);
                                self.formatTrajectoryInfo(); // 格式化轨迹数据
                                self.clearTrack(); // 先清除轨迹
                                self.drawTrajPoint(); // 画轨迹上的点
                                self.drawTrajectory(); // 画轨迹
                                self.createTrajOverLayer(); // 画轨迹点上的详细信息
                                if (view < 16) {
                                    view = 16;
                                }

                                self.setAnimation(self.mapContainer.animationInfo.coordinates[Math.ceil(Math.random() * self.mapContainer.animationInfo.coordinates.length)], view);
                                setTimeout(function () {
                                    self.$Message.destroy();
                                    if (bool == true) {
                                        self.startVehicleAnimation();
                                    }
                                }, 3000);
                            } else {
                                var endTime = self.singleVehiclePageInfo.endTime;
                                self.$Message.destroy();
                                self.$Message.error(self.singleVehiclePageInfo.beginTime + "  " + endTime.split(" ")[1] + "查询不到轨迹数据");
                                setTimeout(function () {
                                    self.$Message.destroy();
                                }, 3000);
                            }
                        } else {
                            self.$Message.destroy();
                            self.$Message.error(data.message);
                            setTimeout(function () {
                                self.$Message.destroy();
                            }, 3000);
                        }

                    },
                    errorCallback: function () {
                        self.$Message.destroy();
                    }
                });
            },
            // 画车辆轨迹线路
            "drawTrajectory": function () {
                var self = this;
                var coordinates = self.mapContainer.animationInfo.coordinates;

                self.$Message.destroy();
                self.$Message.loading({
                    "content": "正在绘制轨迹..."
                });

                for (var i = 0, len = coordinates.length; i < len; i++) {
                    if (i < len - 1) {
                        var LineString = new ol.geom.LineString(coordinates.slice(i, i + 2));
                        var lineFeature = new ol.Feature({
                            geometry: LineString,
                            name: "trajectoryLine"
                        });

                        lineFeature.setStyle(new ol.style.Style({
                            "stroke": new ol.style.Stroke({
                                "width": 5,
                                "color": "#ffad33"
                            }),
                            "fill": new ol.style.Fill({
                                "color": "rgba(0,0,0,0)"
                            })
                        }));
                        lineFeature.setId("trajectoryLine" + i);
                        self.mapContainer.sourceInfo.trajectory.addFeature(lineFeature);
                    }
                }

                self.$Message.destroy();
            },
            // 创建轨迹上的车辆
            "drawTrajectoryVehicle": function () {
                var self = this;
                var vehicleType = (function () {
                    var type = {};
                    for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
                        type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
                    }
                    return type;
                }());
                var vehicleIcon = vehicleType[self.vehicleItemPop.vehicleTypeName] + self.vehicleItemPop.vehicleStatus;

                iconSrc = "/airport/assets/img/" + vehicleIcon + ".gif";

                $("body").find("#ol-moveVehicle").css({
                    "background": "url(" + iconSrc + ") no-repeat left center",
                    "background-size": "100%"
                });
                $("body").find("#ol-moveVehicle").show();
                if (!!!self.mapContainer.overlayInfo["moveVehicle"]) {
                    self.mapContainer.overlayInfo["moveVehicle"] = new ol.Overlay({
                        "autoPan": true,
                        "stopEvent": false,
                        "positioning": "bottom-left",
                        "element": document.getElementById("ol-moveVehicle"),
                        "autoPanAnimation": { "duration": 250 },
                    });
                    self.mapContainer.map.addOverlay(self.mapContainer.overlayInfo["moveVehicle"]);
                }
                self.mapContainer.overlayInfo["moveVehicle"].setPosition(self.mapContainer.animationInfo.coordinates[self.mapContainer.animationInfo.index]);
            },
            // 双击时显示查询图标
            "drawDbClickVehicle": function (point, pixel) {
                var self = this;
                self.isDbClickSearch = true;
                $("body").find("#ol-dbClickSearch").css({ opacity: 1 });
                self.baiduMapInfo.map.panTo(point);
                setTimeout(function () {
                    if (self.isDbClickSearch == true) {
                        self.hiddenTwink();
                    }
                }, 5000);
            },
            // 隐藏查询动画
            "hiddenTwink": function () {
                var self = this;
                $("body").find("#ol-dbClickSearch").css({ opacity: 0 });
                self.isDbClickSearch = false;
            },
            // 车辆开始运动
            "startVehicleAnimation": function () {
                var self = this;
                var coordinates = self.mapContainer.animationInfo.coordinates;

                if (!!!self.singleVehicleItem.track || self.singleVehicleItem.track.length == 0) {
                    self.getSingleVehicleTrack(true);
                    return;
                } else {
                    self.drawTrajPoint(); // 画轨迹上的点
                    self.drawTrajectory(); // 画轨迹
                }

                if (self.mapContainer.animationInfo.isMoved == true) {
                    self.stopVehicleAnimation(false);
                } else {
                    // self.setAnimation(coordinates[0], 17);
                    self.drawTrajectoryVehicle();
                    self.mapContainer.animationInfo.isMoved = true;
                    clearInterval(self.mapContainer.animationInfo.time);
                    self.mapContainer.animationInfo.index = 0;
                    self.mapContainer.animationInfo.time = setInterval(function () {
                        self.mapContainer.animationInfo.index = self.mapContainer.animationInfo.index + 1;
                        if (self.mapContainer.animationInfo.index >= self.mapContainer.animationInfo.coordinates.length) {
                            self.stopVehicleAnimation(true);
                            clearInterval(self.mapContainer.animationInfo.time);
                        } else {
                            // self.mapContainer.animationInfo.point.setCoordinates(coordinates[self.mapContainer.animationInfo.index]);
                            self.mapContainer.overlayInfo["moveVehicle"].setPosition(coordinates[self.mapContainer.animationInfo.index]);
                        }
                    }, (55 + (55 - self.mapContainer.animationInfo.speed)) * 10);
                }
            },
            // 停止车辆运动
            "stopVehicleAnimation": function (ended) {
                var self = this;
                var coordinates = self.mapContainer.animationInfo.coordinates;
                var coord = ended ? coordinates[coordinates.length - 1] : coordinates[0];
                self.mapContainer.animationInfo.isMoved = false;
                self.mapContainer.animationInfo.index = 0;
                clearInterval(self.mapContainer.animationInfo.time);
                if (self.mapContainer.overlayInfo["moveVehicle"]) {
                    setTimeout(function () {
                        $("body").find("#ol-moveVehicle").hide();
                        self.mapContainer.overlayInfo["moveVehicle"].setPosition(undefined);
                    }, 1000);
                    // self.mapContainer.featrueInfo.trajectory.getGeometry().setCoordinates(coord);
                    // self.mapContainer.sourceInfo.trajectory.removeFeature(self.mapContainer.sourceInfo.trajectory.getFeatureById("trajectoryVehicle"));
                }
            },
            // 清空轨迹数据
            "clearTrack": function () {
                var self = pageVue;
                // self.stopVehicleAnimation(false);
                self.baiduMapInfo.map.removeOverlay(self.baiduMapInfo.animationInfo.curveInfo);
                self.baiduMapInfo.map.removeOverlay(self.baiduMapInfo.animationInfo.pointInfo);
            },
            // 画轨迹上的各个点
            "drawTrajPoint": function () {
                var self = this;
                for (var i = 0, len = self.mapContainer.animationInfo.trajectoryInfo.length; i < len; i++) {
                    var pointFeature = new ol.Feature({
                        "name": "trajPoint",
                        "geometry": new ol.geom.Point(self.mapContainer.animationInfo.trajectoryInfo[i]["coordinate"]),
                    });
                    pointFeature.set("coordinate", self.mapContainer.animationInfo.trajectoryInfo[i]["coordinate"]);
                    pointFeature.setId("trajPoint-" + i);
                    pointFeature.setStyle(new ol.style.Style({
                        "image": new ol.style.Circle({
                            "radius": 3,
                            "stroke": new ol.style.Stroke({
                                color: 'rgba(0, 0, 255, .7)',
                                width: 2
                            }),
                            "file": new ol.style.Fill({
                                color: 'rgba(0, 0, 255, .7)',
                            })
                        })
                    }));
                    self.mapContainer.sourceInfo.trajectory.addFeature(pointFeature);
                }
            },
            // 创建轨迹车辆overlayer
            "createTrajOverLayer": function () {
                var self = this;
                $("body").find("#popup").show();
                self.mapContainer.overlayInfo["trajectory"] = new ol.Overlay({
                    "autoPan": true,
                    "stopEvent": false,
                    "positioning": "top-center",
                    "element": document.getElementById("popup"),
                    "autoPanAnimation": { "duration": 250 },
                });
                self.mapContainer.map.addOverlay(self.mapContainer.overlayInfo["trajectory"]);
                self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
            },
            // 显示轨迹车辆Pop
            "showTrajPopLayer": function (coordinate, id) {
                var self = this;
                var index = parseInt(id.split("-")[1]);
                var coordinateInfo = coordinate; //self.mapContainer.sourceInfo.trajectory.getFeatureById(id).get("coordinate");
                $("body").find("#popup").show();
                self.mapContainer.overlayInfo["trajectory"].setPosition(coordinateInfo);
                self.mapContainer.animationInfo.trajectoryItem = self.mapContainer.animationInfo.trajectoryInfo[index];
                self.getAdressDetail(coordinateInfo, self.mapContainer.animationInfo.trajectoryItem);
                $("body").on("click", "#popup-closer", function () {
                    $("body").find("#popup").hide();
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                });
            },
            // 显示视屏
            "showLiveVideo": function (vehicleInfo, isBackPlay) {
                var self = this;
                var url = "http://43.247.68.26:8080/airport/www/module/liveVideo/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;

                if (isBackPlay) {
                    url = "http://43.247.68.26:8080/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                }

                if (vehicleInfo.providerId == 2) {
                    if (isBackPlay) {
                        url = "http://43.247.68.26:8080/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                    } else {
                        url = "http://43.247.68.26:8080/airport/www/module/liveVideoTest1/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                    }
                }
                window.open(
                    url,
                    "liveVideo",
                    "toolbar=yes, location=0, directories=no, status=0, menubar=0, scrollbars=1, resizable=1, copyhistory=1, width=" + window.outerWidth + ", height=" + (window.outerHeight - 50)
                );
            },
            //#endregion

            //#region GPS 定位
            "createdGPS": function () {
                var self = this;
                // self.mapContainer.geolocationInfo.GPS = new ol.Geolocation({
                //     "projection": self.mapContainer.viewInfo.view.getProjection(),
                //     "trackingOptions": {
                //         "maximumAge": 10000,
                //         "enableHighAccuracy": true,
                //         "timeout": 600000
                //     }
                // });

                // self.mapContainer.geolocationInfo.GPS.setTracking(false); // 启动位置跟踪

                // self.mapContainer.geolocationInfo.GPS.on("error", function (error) {
                //     console.log("geolocationError:" + error.message);
                // });

                // self.mapContainer.geolocationInfo.GPS.on("change", function () {
                //     console.log(self.mapContainer.geolocationInfo.GPS.getPosition());
                // });

                // self.getLocation();

            },
            // 获取定位信息
            "getLocation": function () {
                var self = this;

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        self.setAnimation([position.coords.longitude, position.coords.latitude]);
                    }, function (error) {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("User denied the request for Geolocation.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log("Location information is unavailable.");
                                break;
                            case error.TIMEOUT:
                                console.log("The request to get user location timed out.");
                                break;
                            case error.UNKNOWN_ERROR:
                                console.log("An unknown error occurred.");
                                break;
                        }
                    });
                } else {
                    console.log("不支持定位");
                }
            },
            //#endregion

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
            "getSuper": function (list, value, arr) {
                var self = this;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].value == value) {
                        arr.push(value);
                        if (list[i].paraDeptId == 0) {
                            return;
                        }
                        self.getSuper(self.departmentList, list[i].paraDeptId, arr);
                    } else {
                        self.getSuper(list[i]["children"], value, arr);
                    }
                }
            },
            // 格式化上级部门
            "formatSuperiorDeprt": function (list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.departmentList = JSON.parse(listInfo);
            },
            // 获取部门信息
            "getDepartmentList": function (type) {
                var self = this;
                self.departmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0, // 公司ID
                    },
                    successCallback: function (data) {
                        if (data.code == 200) {
                            var arr = [];
                            self[type]["deptIds"] = [];
                            self.formatSuperiorDeprt(data.data);
                            self.getSuper(self.departmentList, self[type]["deptId"], arr);
                            self[type]["deptIds"] = arr.reverse();
                        }
                    }
                });
            },
            // 修改车辆位置接口
            "updateVehiclePosition": function (coordinate) {
                var self = this;
                var dateInfo = utility.getDateDetailInfo();
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.updateVehiclePosition,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        id: "",
                        vehicleCode: self.searchCode,
                        positionStr: coordinate.join(","),
                        positionTime: dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date + " " + dateInfo.hour + ":" + (dateInfo.min + 2) + ":" + dateInfo.second
                    },
                    successCallback: function (data) {
                    }
                });
            },
            //#endregion 

            //#region  百度地图
            "createBaiDuMap": function () {
                var self = this;
                self.baiduMapInfo.map = new BMap.Map("baiduMap");
                self.baiduMapInfo.map.disableDoubleClickZoom();
                self.baiduMapInfo.map.centerAndZoom(new BMap.Point(self.airPort[0], self.airPort[1]), 16);
                self.baiduMapInfo.map.enableScrollWheelZoom(true);
                self.baiduMapInfo.map.addControl(new BMap.NavigationControl({ offset: new BMap.Size(5, 50) }));
                self.baiduMapInfo.map.addControl(new BMap.ScaleControl());
                self.baiduMapInfo.map.addControl(new BMap.OverviewMapControl());
                self.baiduMapInfo.map.addControl(new BMap.MapTypeControl({ offset: new BMap.Size(0, 150) }));

                self.drawAlVehicleByBaidu();
            },
            // 转换成百度坐标
            "convertorByBaidu": function (coordinate, callback) {
                var self = this;
                var x_pi = 3.14159265358979324 * 3000.0 / 180.0;  //圆周率转换量
                var lon = coordinate[0];
                var lat = coordinate[1];
                var x = lon;
                var y = lat;
                var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                var ret1 = z * Math.cos(theta) + 0.0065 + 0.00552;
                var ret2 = z * Math.sin(theta) + 0.006 - 0.00250;
                var point = new BMap.Point(ret1, ret2);

                !!callback && callback(point);
            },
            // setAnimation
            "setAnimationByBaidu": function (coordinates) {
                var self = this;
                self.convertorByBaidu(coordinates, function (point) {
                    self.baiduMapInfo.map.panTo(point);
                });
            },
            // 画车辆
            "createVehicleByBaidu": function (item) {
                var self = this;
                var coordinate = JSON.parse(item["lastPosition"])["coordinates"];
                // var pt = new BMap.Point(coordinate[0], coordinate[1]);
                var iconSrc = "https://test2.cityeasyplay.com//airport/assets/car/success.gif";
                var vehicleType = (function () {
                    var type = {};
                    for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
                        type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
                    }
                    return type;
                }());
                var vehicleIcon = (vehicleType[item.vehicleTypeName] + item.vehicleStatus) || "warning";

                iconSrc = "https://test2.cityeasyplay.com//airport/assets/car/" + vehicleIcon + ".gif";

                var myIcon = new BMap.Icon(iconSrc, new BMap.Size(28, 35));

                if (!self.baiduMapInfo.vehicle[item['licenseNumber']]) {
                    self.baiduMapInfo.vehicle[item['licenseNumber']] = {
                        info: item
                    }
                }
                self.baiduMapInfo.vehicle[item['licenseNumber']]["info"] = item;

                if (self.baiduMapInfo.vehicle[item['licenseNumber']]['marker']) {
                    self.convertorByBaidu(coordinate, function (point) {
                        self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'].setIcon(myIcon);
                        self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'].setPosition(point);
                    });
                } else {
                    self.convertorByBaidu(coordinate, function (point) {
                        var marker = new BMap.Marker(point, { icon: myIcon });  // 创建标注
                        self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'] = marker;
                        self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'].removeEventListener("click");
                        self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'].addEventListener("click", function (e) {
                            var mk = this;
                            self.vehicleItemPop = item;
                            self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;
                            self.baiduMapInfo.map.panTo(mk.getPosition());
                            setTimeout(function () {
                                mk.openInfoWindow(new BMap.InfoWindow($("#ol-vehicle").html()));
                            }, 1000);
                        });
                        self.baiduMapInfo.markers.push(marker);
                        // self.baiduMapInfo.map.addOverlay(marker);
                    });
                }
            },
            // 在地图上画车辆
            "drawAlVehicleByBaidu": function () {
                var self = this;
                self.baiduMapInfo.markers = [];
                for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
                    self.createVehicleByBaidu(self.vehiclePositionList[i]);
                }

                setTimeout(function () {
                    self.baiduMapInfo.markerClusterer = new BMapLib.MarkerClusterer(self.baiduMapInfo.map, { markers: self.baiduMapInfo.markers });
                }, 2000);
            },
            // 点击行 跳转到对应的位置
            "showPositionByBaidu": function (item, index) {
                var self = this;
                var coordinates = [];
                var lastPosition = "";
                self.isAddVehiclePosition = true;
                self.vehiclePositionItem = self.vehiclePositionList[index];
                self.vehicleItemPop = self.vehiclePositionItem;
                self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;
                lastPosition = self.vehicleItemPop.lastPosition;

                if (!!lastPosition) {
                    coordinates = JSON.parse(lastPosition).coordinates
                    if (coordinates[0] == 0 || coordinates[1] == 0) {
                        self.$Message.error("没有车辆定位数据");
                    } else {
                        self.baiduMapInfo.map.setZoom(19);
                        self.convertorByBaidu(coordinates, function (point) {
                            self.baiduMapInfo.map.panTo(point);
                            setTimeout(function () {
                                self.baiduMapInfo.vehicle[item['licenseNumber']]['marker'].openInfoWindow(new BMap.InfoWindow($("#ol-vehicle").html()));
                            }, 1000);
                        });
                    }
                } else {
                    self.$Message.error("没有车辆定位数据");
                }
            },
            // 清空轨迹
            "clearTrackByBaidu": function () {
                var self = this;
                self.baiduMapInfo.map.removeOverlay(self.baiduMapInfo.animationInfo.curveInfo);
            },
            // 画轨迹
            "drawTrajectoryByBaidu": function () {
                var self = this;
                var curvePoints = [];

                if (!!self.baiduMapInfo.animationInfo.curveInfo) {
                    self.baiduMapInfo.map.removeOverlay(self.baiduMapInfo.animationInfo.curveInfo);
                    self.baiduMapInfo.map.removeOverlay(self.baiduMapInfo.animationInfo.pointInfo);
                }
                self.baiduMapInfo.animationInfo.curveInfo = new BMap.Polyline(self.baiduMapInfo.animationInfo.coordinates, {
                    strokeColor: "blue",
                    strokeWeight: 3,
                    strokeOpacity: .5
                });
                self.baiduMapInfo.animationInfo.pointInfo = new BMap.PointCollection(self.baiduMapInfo.animationInfo.coordinates, {
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_CIRCLE,
                    color: '#d340c3'
                });
                self.baiduMapInfo.animationInfo.pointInfo.addEventListener('click', function (e) {
                    var index = 0;
                    for (var i = 0, len = self.baiduMapInfo.animationInfo.coordinates.length; i < len; i++) {
                        if (e.point.equals(self.baiduMapInfo.animationInfo.coordinates[i])) {
                            index = i;
                            break;
                        }
                    }
                    self.baiduMapInfo.animationInfo.trajectoryItem = self.baiduMapInfo.animationInfo.trajectoryInfo[index];
                    self.baiduMapInfo.map.panTo(e.point);
                    setTimeout(function () {
                        self.baiduMapInfo.map.openInfoWindow(new BMap.InfoWindow($("#trajectoryItem").html()), e.point);
                    }, 500);
                });
                self.baiduMapInfo.map.addOverlay(self.baiduMapInfo.animationInfo.pointInfo);
                self.baiduMapInfo.map.addOverlay(self.baiduMapInfo.animationInfo.curveInfo); //添加到地图中

            },
            "getSingleVehicleTrackByBaidu": function () {
                var self = pageVue;
                // 先清空原有轨迹
                self.clearTrack();
                self.$Message.destroy();
                self.$Message.loading({
                    "content": "正在加载轨迹..."
                });
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getSingleVehicleTrack,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        // "id": self.singleVehiclePageInfo.vehicleId, // 车辆ID
                        "gpsDeviceCode": self.singleVehiclePageInfo.gpsDeviceCode, // 车辆ID
                        // "vehicleCode": encodeURI(self.singleVehiclePageInfo.vehicleCode), // 车辆编码
                        "licenseNumber": encodeURI(self.singleVehiclePageInfo.licenseNumber), // 车辆编码
                        "beginTime": self.singleVehiclePageInfo.beginTime, // 车辆编码
                        "endTime": self.singleVehiclePageInfo.endTime, // 车辆编码
                    }, //self.vehiclePositonPageInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
                            self.singleVehicleItem = data.data;
                            self.vehicleItemPop = data.data;

                            self.showModal("isHistory");

                            // 如果轨迹信息
                            if (self.singleVehicleItem.track) {
                                self.formatTrajectoryInfo(); // 格式化轨迹数据
                                self.drawTrajectoryByBaidu();

                            } else {
                                var endTime = self.singleVehiclePageInfo.endTime;
                                self.$Message.destroy();
                                self.$Message.error(self.singleVehiclePageInfo.beginTime + "  " + endTime.split(" ")[1] + "查询不到轨迹数据");
                                setTimeout(function () {
                                    self.$Message.destroy();
                                }, 3000);
                            }
                        } else {
                            self.$Message.destroy();
                            self.$Message.error(data.message);
                            setTimeout(function () {
                                self.$Message.destroy();
                            }, 3000);
                        }

                    },
                    errorCallback: function () {
                        self.$Message.destroy();
                    }
                });
            },
            // 轨迹回放
            "playBackByBaidu": function () {
                var self = pageVue;
                var item = self.vehicleItemPop;
                var index = 0;
                var coordinate = self.baiduMapInfo.animationInfo.coordinates;
                var trajectoryInfo = self.baiduMapInfo.animationInfo.trajectoryInfo;
                var vehicleType = (function () {
                    var type = {};
                    for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
                        type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
                    }
                    return type;
                }());
                var vehicleIcon = (vehicleType[item.vehicleTypeName] + item.vehicleStatus) || "warning";
console.log(trajectoryInfo);
                iconSrc = "https://test2.cityeasyplay.com//airport/assets/car/" + vehicleIcon + ".gif";

                var myIcon = new BMap.Icon(iconSrc, new BMap.Size(28, 35));
                var marker = new BMap.Marker(coordinate[index], { icon: myIcon });  // 创建标注
                self.baiduMapInfo.map.addOverlay(marker);
                self.baiduMapInfo.map.panTo(coordinate[index]);
                self.baiduMapInfo.animationInfo.timeInterval = setInterval(function () {
                    if (index < coordinate.length) {
                        index++;
                        vehicleIcon = (vehicleType[trajectoryInfo[index].vehicleTypeName] + trajectoryInfo[index].vehicleStatus) || "warning";
                        iconSrc = "https://test2.cityeasyplay.com//airport/assets/car/" + vehicleIcon + ".gif";
                        // myIcon = new BMap.Icon(iconSrc, new BMap.Size(28, 35));
                        myIcon.setImageUrl(iconSrc);

                        // marker.setIcon(myIcon);
                        marker.setPosition(coordinate[index]);
                        self.baiduMapInfo.map.panTo(coordinate[index]);
                    } else {
                        clearInterval(self.baiduMapInfo.animationInfo.timeInterval);
                    }
                }, (55 + (55 - self.baiduMapInfo.animationInfo.speed)) * 10);

            },
            //#endregion
        },
        "created": function () {
            var self = this;
            var timePosition = null;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            self.$Message.config({
                top: 180,
                duration: 3
            });

            setTimeout(function () {
                self.createBaiDuMap();
                self.getVehicleList(true);
                self.getAllVehiclePositonList(); // 获取所有实时车辆
                self.showModal("isSearch");

                // 双击地图
                self.baiduMapInfo.map.addEventListener("dblclick", function (e) {
                    // self.vehiclePositonPageInfo.centerPosition = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326').join(",");
                    console.log(e);
                    console.log(self.baiduMapInfo.map.pointToPixel(e.point));
                    // self.drawDbClickVehicle(point, pixel);
                });

                // self.$watch('vehiclePositonPageInfo', function () {
                //     var fromInfo = utility.getSessionStorage("fromInfo") || null;
                //     self.clearAllVehicle();
                //     if (fromInfo == null || (!!fromInfo && fromInfo.type == "isSearch")) {
                //         self.showModal("isSearch");
                //     }
                //     clearInterval(timePosition);
                //     self.getAllVehiclePositonList();
                //     timePosition = setInterval(function () {
                //         self.getAllVehiclePositonList(); // 获取所有实时车辆
                //     }, 5000);
                // }, { deep: true });

                if ($('.radar')[0]) {
                    new Radar($('.radar')[0]).init({ scanSpeed: 2 });  // 扫描的速度，单位为deg，必须为360的约数
                }
            }, 2000);

            timePosition = setInterval(function () {
                self.getVehicleList(true);
                self.getAllVehiclePositonList(); // 获取所有实时车辆
            }, 5000);

            // // 初始化地图数据
            // setTimeout(function () {
            //     self.initMap("vector"); // satellite
            //     self.getVehicleList(true);
            //     if (self.isShenZhen) {
            //         self.getCameraList(true); // 获取摄像机列表数据
            //     }
            //     self.getDefensAreaList(true); // 获取防区
            //     self.getCompanyList();// 获取公司
            //     self.getAllVehiclePositonList(); // 获取所有实时车辆

            //     // self.showModal("isSearch");

            //     timePosition = setInterval(function () {
            //         self.getVehicleList(true);
            //         self.getAllVehiclePositonList(); // 获取所有实时车辆
            //     }, 5000);

            //     setInterval(function () {
            //         var fromInfo = utility.getSessionStorage("fromInfo") || null;
            //         // 初始化时显示实时查询模块
            //         if (!!fromInfo) {
            //             // self.showModal(fromInfo.type);
            //             self.vehiclePositonPageInfo.vehicleStatus = fromInfo.vehicleStatus;
            //             setTimeout(function () {
            //                 utility.cleanSessionStorage();
            //             }, 2000);
            //         }
            //     }, 100);

            //     // 点击地图
            //     self.mapContainer.map.on("singleclick", function (event) {
            //         var coordinate = event.coordinate;
            //         var nodeName = event.originalEvent.target.nodeName.toLowerCase();
            //         var clickFeature = self.mapContainer.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
            //             return feature;
            //         });
            //         // 先判断点击的地方有没有要素，如果没有，则设置要素
            //         if (nodeName == "canvas" && !!clickFeature) {
            //             self.mapContainer.featrueInfo.clickId = clickFeature.getId();
            //             self.mapContainer.featrueInfo.clickName = clickFeature.get("name");
            //             self.mapContainer.featrueInfo.clickPos = event.pixel;

            //             switch (self.mapContainer.featrueInfo.clickName) {
            //                 case "camera":
            //                     self.showCameraPopLayer(self.mapContainer.featrueInfo.clickId, coordinate);
            //                     break;
            //                 case "defens":
            //                     self.showDefensPopLayer(self.mapContainer.featrueInfo.clickId, coordinate);
            //                     break;
            //                 case "vehicle":
            //                     self.showVehiclePositionByClick(self.mapContainer.featrueInfo.clickId);
            //                     break;
            //                 case "trajPoint":
            //                     self.showTrajPopLayer(coordinate, self.mapContainer.featrueInfo.clickId);
            //                     break;
            //                 default:
            //                     console.log(clickFeature);
            //             }

            //         } else {
            //             // 添加摄像机
            //             if (self.isAddCameraAction == true) {
            //                 self.createCameraFeature(coordinate, "", function (id, coordinate) {
            //                     self.showCameraPopLayer("", coordinate);
            //                 });
            //             }
            //         }
            //     });

            //     // 监听视图变化
            //     self.mapContainer.map.getView().on('change:resolution', function (event) {
            //         self.drawAlVehicle();
            //     });

            //     // 双击地图
            //     self.mapContainer.map.on("dblclick", function (event) {
            //         var coordinate = event.coordinate;
            //         self.vehiclePositonPageInfo.centerPosition = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326').join(",");
            //         self.drawDbClickVehicle(coordinate);
            //     });

            //     self.$watch('vehiclePositonPageInfo', function () {
            //         var fromInfo = utility.getSessionStorage("fromInfo") || null;
            //         self.clearAllVehicle();
            //         if (fromInfo == null || (!!fromInfo && fromInfo.type == "isSearch")) {
            //             // self.showModal("isSearch");
            //         }
            //         clearInterval(timePosition);
            //         self.getAllVehiclePositonList();
            //         timePosition = setInterval(function () {
            //             self.getAllVehiclePositonList(); // 获取所有实时车辆
            //         }, 5000);
            //     }, { deep: true });

            //     if ($('.radar')[0]) {
            //         new Radar($('.radar')[0]).init({ scanSpeed: 2 });  // 扫描的速度，单位为deg，必须为360的约数
            //     }

            //     self.mapContainer.viewInfo.view.on('change:resolution', function (e) {
            //         // console.log(e);
            //     });
            // }, 2000);
        },
        mouted: function () {
            var self = this;

        }
    });

    setTimeout(function () {
        window.mapFun = {
            "getSingleVehicleTrackByBaidu": function () {
                pageVue.getSingleVehicleTrackByBaidu();
            },
            "showLiveVideo": function (vehicleInfo, isBackPlay) {
                pageVue.showLiveVideo(vehicleInfo, isBackPlay);
            },
            "clearTrack": function () {
                console.log("1111");
                pageVue.clearTrack();
            },
            "playBackByBaidu": function() {
                pageVue.playBackByBaidu();
            }
        };
    }, 3000);

}())
