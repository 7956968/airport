(function () {
    var language = utility.getLocalStorage("language");
    var airPort = utility.getLocalStorage("airPort");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var userFuncList = utility.getLocalStorage("userFuncList");
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
                    if (userFuncList[key][i]["functionCode"] == "device_manage_secure_area") {
                        info.isDefense = true;
                    }
                    if (userFuncList[key][i]["functionCode"] == "device_manage_camera") {
                        info.isCamera = true;
                    }
                }
            }
        }
        return info;
    }());
    var pageVue = new Vue({
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
            //#region ??????
            "mapContainer": {
                // ????????????
                "map": null,
                // ????????????
                "viewInfo": {
                    "view": null,
                    "zoom": null,
                    "center": null,
                    "rotation": null,
                },
                // ????????????
                "layersInfo": {
                    "baiduVectorMap": null,
                    "baiduSatellite": null, // ?????????
                    "GPS": null, // GPS??????
                    "seat": null, // ??????
                    "layer": null, // ??????
                    "alarm": null, // ??????
                    "camera": null, // ?????????
                    "defens": null, // ??????
                    "vehicle": null, // ??????
                    "trajectory": null, // GPS??????
                    "airportLine": null, // ?????????
                    "airportPoint": null, // ?????????
                    "airportPolygo": null, // ?????????
                    "OSM": null, // ??????
                },
                // ????????????
                "sourceInfo": {
                    "seat": null, // ??????
                    "alarm": null, // ??????
                    "defens": null, // ??????
                    "camera": null, // ?????????
                    "vehicle": null, // ??????
                    "trajectory": null, // ?????????
                    "demo": null, // ?????????
                },
                // ????????????
                "controlsInfo": {
                    "scaleLine": null, // ?????????
                    "fullScreen": null,
                    "overviewMap": null,
                    "mousePosition": null, // ????????????
                },
                // ????????????
                "interactionInfo": {
                    "defens": null, // ??????,
                    "trajectory": null, // ?????????
                },
                // ????????????
                "featrueInfo": {
                    "clickPos": [], // ???????????????????????????
                    "clickId": null, // ???????????????????????? id
                    "circlePoint": {},
                    "clickName": null, // ??????????????????????????????
                    "vehiclePoint": {},
                    "trajectory": null, // ????????????
                },
                // ????????????
                "geolocationInfo": {
                    "GPS": null, // gps??????
                },
                // ??????
                "overlayInfo": {
                    "defens": null,
                    "camera": null,
                    "vehicle": null,
                    "vehicleList": {},
                    "trajectory": null,
                    "moveVehicle": null,
                },
                // ????????????
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

            //#region ?????????
            "modal": {
                "isLayer": false, // ????????????
                "isAlarm": false, // ????????????
                "isCamera": false, // ???????????????
                "isSearch": false, // ????????????
                "isVehicle": false, // ????????????
                "isHistory": false, // ????????????
                "isDefense": false, // ????????????
            },
            // ????????????[background,seat,alarm,vehicle,defens,camera]
            "layerControl": ["seat", "alarm", "vehicle", "defens", "camera"],
            //#endregion

            //#region ????????????
            "vehiclePageInfo": {
                "id": "", // ??????ID
                "count": 0,
                "pageNum": 1,
                "deptId": "", // ??????ID
                "pageSize": 15,
                "vehicleName": "", // ????????????
                "vehicleCode": "", // ????????????
                "gpsDeviceCode": "",
            },
            "vehiclePositonPageInfo": {
                "span": 1000, // ???????????????????????????????????????????????????????????????100?????? // ??????centerPosition+ span??????????????????????????????????????????????????????????????????????????????
                "count": 0,
                "pageNum": 1,
                "deptId": "", // ??????ID
                "pageSize": 15,
                "companyId": "", // ????????????ID
                "id": "", // ??????ID
                "vehicleName": "", // ????????????
                "vehicleCode": "", // ????????????
                "licenseNumber": "", // ?????????
                "gpsDeviceCode": "", // ??????????????????
                "vehicleTypeId": "", // ????????????ID
                "vehicleStatus": "", // ??????????????????
                "useStatus": -1, // ??????????????????
                "vehicleColorId": "", // ????????????ID
                "vehicleBrandId": "", // ????????????ID
                "centerPosition": "", // ??????????????????????????????????????????,??????
            },
            "vehicleItem": {
                "id": "", // ??????ID
                "speed": "", // ??????????????????/??????
                "power": "", // ???????????????????????????
                "deptId": "", // ??????ID
                "deptName": "", // ????????????
                "modifyTime": "", // ????????????
                "gpsDeviceId": "", // ????????????ID
                "companyName": "", // ????????????
                "vehicleName": "", // ????????????
                "vehicleCode": "", // ????????????
                "lastPosition": "", // ?????????????????????
                "vehicleTypeId": "", // ????????????ID
                "gpsDeviceCode": "", // ??????????????????
                "vehicleStatus": "", // ??????????????????ID
                "vehicleColorId": "", // ????????????ID
                "vehicleBrandId": "", // ????????????ID
                "vehicleStatusName": "", // ????????????????????????
            },
            "vehicleItemPop": null,
            "vehicleList": [],
            "isAddVehiclePosition": false,
            "isDbClickSearch": false,
            "terminalStatusList": bizParam["terminalStatus"], // ????????????
            "vehicleColorList": bizParam["vehicleColor"], // ????????????
            "vehicleTypeList": bizParam["vehicleType"], // ????????????
            "vehicleBrandList": bizParam["vehicleBrand"], // ????????????
            "secureAreaLimitTypeList": bizParam["secureAreaLimitType"], // ????????????
            "vehicleColumns": [
                {
                    "title": { "CN": "??????", "EN": "Name", "TW": "??????" }[language["language"]],
                    "key": "vehicleName"
                },
                {
                    "title": { "CN": "??????", "EN": "Type", "TW": "??????" }[language["language"]],
                    "key": "vehicleTypeId"
                },
                {
                    "title": { "CN": "??????", "EN": "Code", "TW": "??????" }[language["language"]],
                    "key": "vehicleCode"
                },
                {
                    "title": { "CN": "??????", "EN": "State", "TW": "??????" }[language["language"]],
                    "key": "vehicleStatus"
                }
            ],
            "vehicleDatas": [],
            "vehiclePositionItem": {
                "o": "", // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                "id": "", // ??????ID
                "speed": "", // ??????????????????/??????
                "power": "", // ???????????????????????????
                "deptId": "", // ??????ID
                "deptName": "", // ????????????
                "modifyTime": "", // ????????????
                "gpsDeviceId": "", // ????????????ID
                "companyName": "", // ????????????
                "vehicleName": "", // ????????????
                "vehicleCode": "", // ????????????
                "lastPosition": "", // ?????????????????????
                "vehicleTypeId": "", // ????????????ID
                "gpsDeviceCode": "", // ??????????????????
                "vehicleStatus": "", // ??????????????????ID
                "vehicleColorId": "", // ????????????ID
                "vehicleBrandId": "", // ????????????ID
                "vehicleStatusName": "", // ????????????????????????
            },
            "vehiclePositionList": [],
            "singleVehiclePageInfo": {
                "date": new Date(),
                "endTime": "", // ??????????????????
                "id": "", // ??????ID
                "beginTime": "", // ??????????????????
                "lastGpsTime": "",
                "vehicleCode": "", // ????????????
                "licenseNumber": "", // ?????????
                "gpsDeviceCode": "", // ??????????????????
            },
            "vehicleAddressDetail": "",
            "trackItem": {
                "coordinate": [],
                "licenseNumber": ""
            },
            "isTrackItem": false,
            "dateTimeInfo": {
                "date": new Date(),
                "beginDate": (function () {
                    var dateInfo = utility.getDateDetailInfo();
                    return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date;
                }()),
                "endDate": (function () {
                    var dateInfo = utility.getDateDetailInfo();
                    return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date;
                }()),
                "beginTime": "00:00:00",
                "endTime": "23:59:59"
            },
            "disabledDate": {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            "singleVehicleItem": {},
            //#endregion

            //#region ????????????
            "historyColumns": [],
            "historyDatas": [],
            //#endregion

            //#region ??????
            "isAddDefensAction": false,
            "isAddDefensDetailInfo": false,
            "isDrawDefening": false,
            "isDeleteDefens": false,
            "secureAreaStatusList": bizParam["secureAreaStatus"],
            "defensFunc": (function () {
                var func = JSON.stringify(userFuncList["menu_map"]);
                // ?????????????????????
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
                "opType": 1, // ???????????????1:???????????? 2:???????????????????????? 3:?????????????????????????????? 4:??????????????????
                "companyId": "",
                "deptId": "", // ??????ID?????????
                "deptIds": [], // ??????ID?????????
                "areaName": "", // ????????????
                "areaCode": "", // ????????????
                "secureStatus": "", // ???????????????701????????? 702????????? 703????????? 704?????????
                "areaRangeStr": "", // ??????????????????????????????????????????122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                "speedLimit": "", // ??????????????????????????????/??????
                "staySecond": "", // ????????????????????????(?????????)
                "canEnter": "", // ???????????????????????????720???????????? 721??????????????? 722???????????????
                "canExit": "", // ??????????????????????????? 720???????????? 723??????????????? 724???????????????
                "canStay": "", //??????????????????????????? 720???????????? 725??????????????? 726???????????????
                "remark": "", // ??????
                "createUserId": userInfo["id"], // ????????????ID??????????????????
                "modifyUserId": userInfo["id"], // ????????????ID??????????????????
            },
            "defensColumns": [
                {
                    "title": { "CN": "??????", "EN": "Name", "TW": "??????" }[language["language"]],
                    "key": "areaName",
                    "fixed": "left",
                    "width": 120
                },
                {
                    "title": { "CN": "??????", "EN": "Code", "TW": "??????" }[language["language"]],
                    "key": "areaCode",
                    "width": 120
                },
                {
                    "title": { "CN": "??????", "EN": "Status", "TW": "??????" }[language["language"]],
                    "key": "secureStatus",
                    "width": 120
                },
                {
                    "title": { "CN": "????????????", "EN": "Speed Limit", "TW": "????????????" }[language["language"]],
                    "key": "speedLimit",
                    "width": 120
                },
                {
                    "title": { "CN": "????????????", "EN": "Length Of Stay", "TW": "????????????" }[language["language"]],
                    "key": "staySecond",
                    "width": 120
                },
                {
                    "title": { "CN": "??????", "EN": "Operation", "TW": "??????" }[language["language"]],
                    "key": "operation",
                    "fixed": "right",
                    "width": 80,
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        // ?????????????????????
                        if (func.indexOf("device_manage_secure_area") != -1) {
                            label = { "CN": "??????", "EN": "Delete", "TW": "??????" }[language["language"]]
                        } else {
                            label = { "CN": "??????", "EN": "View", "TW": "??????" }[language["language"]]
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
                "701": { // ??????
                    fill: new ol.style.Fill({ //??????????????????????????????????????????
                        color: "rgba(4, 159, 228, 0.4)"
                    }),
                    stroke: new ol.style.Stroke({ //????????????
                        color: "rgba(33, 121, 160, 0.6)",
                        width: 3
                    }),
                },
                "702": { // ??????
                    fill: new ol.style.Fill({ //??????????????????????????????????????????
                        color: "rgba(255, 0, 0, 0.4)"
                    }),
                    stroke: new ol.style.Stroke({ //????????????
                        color: "rgba(5, 174, 253, .6)",
                        width: 2
                    }),
                },
                "703": { // ??????
                    fill: new ol.style.Fill({ //??????????????????????????????????????????
                        color: "rgba(255, 173, 51, 0.7)"
                    }),
                    stroke: new ol.style.Stroke({ //????????????
                        color: "rgba(99, 71, 31, 0.8)",
                        width: 3
                    }),
                },
                "704": { // ??????
                    fill: new ol.style.Fill({ //??????????????????????????????????????????
                        color: "rgba(180, 191, 195, 0.5)"
                    }),
                    stroke: new ol.style.Stroke({ //????????????
                        color: "rgba(122, 150, 162, 0.92)",
                        width: 3
                    }),
                },
            },

            //#endregion

            //#region ?????????
            "isAddCameraAction": false,
            "isAddcameraDetailInfo": false,
            "isDeleteCamera": false,
            "monitorStatusList": bizParam["monitorStatusId"], // ????????????
            "cameraFunc": (function () {
                var func = JSON.stringify(userFuncList["menu_map"]);
                // ?????????????????????
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
                "id": "", // ?????????ID
                "companyId": "", // ????????????ID 
                "companyName": "", // ????????????
                "deptId": "", // ??????ID?????????
                "deptIds": [], // ??????ID?????????
                "deptName": "", // ????????????
                "cameraName": "", // ???????????????
                "cameraCode": "", // ???????????????
                "cameraDesc": "", // ???????????????
                "cameraPositionStr": "", // ????????????
                "radius": "", // ????????????????????????????????????
                "angle": "", // ????????????
                "monitorStatus": "", // ????????????????????????
                "remark": "", // ??????
                "rtspLiveUrl": "", // Rtsp????????????
                "rtspHisUrl": "", // Rtsp????????????
                "createUserId": userInfo["id"], // ????????????ID??????????????????
                "modifyUserId": userInfo["id"], // ????????????ID??????????????????
            },
            "cameraColumns": [
                {
                    "title": { "CN": "??????", "EN": "Name", "TW": "??????" }[language["language"]],
                    "key": "cameraName",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": { "CN": "??????", "EN": "State", "TW": "??????" }[language["language"]],
                    "key": "monitorStatus",
                    "width": 100
                },
                {
                    "title": { "CN": "??????", "EN": "Company", "TW": "??????" }[language["language"]],
                    "key": "companyName",
                    "width": 150
                },
                {
                    "title": { "CN": "??????", "EN": "Code", "TW": "??????" }[language["language"]],
                    "key": "cameraCode",
                    "width": 150
                },
                {
                    "title": { "CN": "??????", "EN": "Describe", "TW": "??????" }[language["language"]],
                    "key": "cameraDesc",
                    "width": 150
                },
                {
                    "title": { "CN": "Rtsp????????????", "EN": "Live URL", "TW": "Rtsp????????????" }[language["language"]],
                    "key": "rtspLiveUrl",
                    "width": 150
                },
                {
                    "title": { "CN": "Rtsp????????????", "EN": "Delayed URL", "TW": "Rtsp????????????" }[language["language"]],
                    "key": "rtspHisUrl",
                    "width": 150
                },
                {
                    "title": { "CN": "????????????", "EN": "Angle", "TW": "????????????" }[language["language"]],
                    "key": "angle",
                    "width": 100
                },
                {
                    "title": { "CN": "??????", "EN": "Radius", "TW": "??????" }[language["language"]],
                    "key": "radius",
                    "width": 100
                },
                {
                    "title": { "CN": "??????", "EN": "Operation", "TW": "??????" }[language["language"]],
                    "key": "operation",
                    "width": 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        var func = JSON.stringify(userFuncList["menu_map"]);
                        var label = "";
                        // ?????????????????????
                        if (func.indexOf("device_manage_camera") != -1) {
                            label = { "CN": "??????", "EN": "Delete", "TW": "??????" }[language["language"]]
                        } else {
                            label = { "CN": "??????", "EN": "View", "TW": "??????" }[language["language"]]
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

            //#region ????????????
            "layerColumns": [],
            "layerDatas": [],
            //#endregion

            //#region ??????
            "alarmColumns": [],
            "alarmDatas": [],
            //#endregion

            //#region ????????????
            "isSearchLoading": false,
            "vehicleUseStatusList": bizParam["vehicleUseStatus"], // ??????????????????
            "searchColumns": [
                {
                    "title": { "CN": "?????????", "EN": "Plate No.", "TW": "?????????" }[language["language"]],
                    "key": "licenseNumber",
                    "fixed": "left",
                    "width": 130
                },
                {
                    "title": { "CN": "????????????", "EN": "Vehicle State", "TW": "????????????" }[language["language"]],
                    "key": "vehicleStatus",
                    "align": "center",
                    "width": 100
                },
                {
                    "title": { "CN": "????????????", "EN": "Vehicle Name", "TW": "????????????" }[language["language"]],
                    "key": "vehicleName",
                    "width": 130
                },
                {
                    "title": { "CN": "????????????", "EN": "Vehicle Number", "TW": "????????????" }[language["language"]],
                    "key": "vehicleCode",
                    "width": 130
                },
                {
                    "title": { "CN": "??????", "EN": "Operation", "TW": "??????" }[language["language"]],
                    "key": "operation",
                    "width": functionInfo.isViewVideo ? 120 : 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        var liveVideoBtn = h("Button", {
                            "props": {
                                "size": "small",
                            }
                        }, { "CN": "??????", "EN": "Detail", "TW": "??????" }[language["language"]]);
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
                                    }, "??????");

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
                                        }, "??????");
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
            "searchDatas": [],
            "vehicleFeature": {
                "circlePoint": new ol.style.Style({
                    "image": new ol.style.Circle({
                        "radius": 2,
                        "stroke": new ol.style.Stroke({
                            color: "rgb(32, 121, 109)",
                            width: 2
                        }),
                        "fill": new ol.style.Fill({
                            color: 'rgba(208, 219, 245, .3)',
                        })
                    })
                }),
                "trackFeature": {

                }
            },
            //#endregion

            // demoInfo
            "demoInfo": {
                coordinate: [
                    [113.297475, 23.415024],
                    [113.301002, 23.419066],
                    [113.301118, 23.418697],
                    [113.302135, 23.418963],
                    [113.30216, 23.419006],
                    [113.29979, 23.420711],
                    [113.298613, 23.41765],
                    [113.298226, 23.417125],
                    [113.297855, 23.417242],
                    [113.298047, 23.416347],
                    [113.298087, 23.416335],
                    [113.298082, 23.416337]
                ],
                time: [
                    '2019/7/10 03:01:13',
                    '2019/7/10 03:21:42',
                    '2019/7/10 04:36:07',
                    '2019/7/10 06:29:49',
                    '2019/7/10 15:46:49',
                    '2019/7/10 17:05:23',
                    '2019/7/11 04:36:15',
                    '2019/7/11 04:37:41',
                    '2019/7/11 05:55:50',
                    '2019/7/11 07:18:35',
                    '2019/7/11 08:46:16',
                    '2019/7/11 08:57:23',
                ],
                status: [
                    '??????',
                    '?????????',
                    '??????',
                    '?????????',
                    '??????',
                    '?????????',
                    '??????',
                    '?????????',
                    '??????',
                    '?????????',
                    '??????',
                    '?????????',
                ]
            }
        },

        //#region  ??????????????????
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
            // ??????
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
            // ????????????????????????
            "autoFocus": function () {
                var self = this;
                $("body").find(".detailInfoModal input").on("click", function () {
                    $(this).focus();
                });
            },
            // ?????? Modal
            "showModal": function (type) {
                var self = this;
                if (type != "isLayer") {
                    for (var key in self.modal) {
                        self.modal[key] = false;
                    }
                }
                self.modal[type] = true;
            },

            //#region ????????????
            // ?????????????????????
            "initMap": function (type) {
                var self = this;

                // ??????????????????????????????????????? // satellite vector
                self.createdMap(type);

                if (self.isShenZhen == true) {
                    // ??????????????????
                    self.createAirportLayer();
                }

                // ???????????????????????????,???????????????????????????????????????????????????
                self.createFeatureLayer();

                // ???????????????POP
                self.createPop("addCamera", "camera");

                if (self.isShenZhen == true) {
                    // ????????????POP
                    self.createPop("addDefensArea", "defens");
                }

                // ????????????
                self.createControls();

                // ??????GPS
                self.createdGPS();
            },
            // countNewCoor
            "countNewCoordinate": function (coordinate) {
                var result = gcoord.transform([parseFloat(coordinate[0]), parseFloat(coordinate[1])], gcoord.WGS84, gcoord.GCJ02);
                // return [coordinate[0] + 0.005511, coordinate[1] - 0.002568];
                console.log(result);
                return [result[0], result[1]];
                // return [coordinate[0] + 0.005551, coordinate[1] - 0.002691];
            },
            "transformLat": function (coordinate) {
                var self = this;
                // return ol.proj.transform(self.countNewCoordinate(coordinate), 'EPSG:3857', 'EPSG:4326');
                return ol.proj.fromLonLat(self.countNewCoordinate(coordinate));
            },
            // ????????????
            "baiduMap": function (type) {
                var self = this;
                // var gaoDeType = loadMapType["gaoDe"]();
                var baiduType = loadMapType["google"]();

                // satellite vector
                self.mapContainer.layersInfo.baiduVectorMap = baiduType["vector"];
                self.mapContainer.layersInfo.baiduSatellite = baiduType["satellite"];
                self.mapContainer.layersInfo.baiduSatellite.setVisible(false);
                self.mapContainer.map = new ol.Map({
                    "target": "map", // ????????????div???id
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
                        "center": self.transformLat(self.airPort), // [12959773,4853101],// (????????????) ????????????????????????
                        // "minResolution": 0.32858214173896974,
                        // "center": [12959773,4853101], // (??????????????????)????????????????????????
                        // "center": [121.8042311, 31.1477079], // (????????????????????????)????????????????????????
                        "zoom": 15, // ???????????????????????????
                        "minZoom": 3,
                        "maxZoom": 20,
                        // "projection": "EPSG:4326"
                    })
                });
            },
            // ????????????
            "createdMap": function (type) {
                var self = this;

                self.baiduMap(type);

                // ??????????????????????????????
                // ??????????????????
                self.mapContainer.layersInfo.layer = self.mapContainer.map.getLayers();

                // ??????????????????
                self.mapContainer.viewInfo.view = self.mapContainer.map.getView();

                // ????????????????????????
                self.mapContainer.viewInfo.zoom = self.mapContainer.viewInfo.view.getZoom();

                // ?????????????????????
                self.mapContainer.viewInfo.center = self.mapContainer.viewInfo.view.getCenter();

                // ????????????????????????
                self.mapContainer.viewInfo.rotation = self.mapContainer.viewInfo.view.getRotation();
            },
            // ????????????
            "bounce": function (t) {
                var s = 7.5625;
                var p = 2.75;
                var l;
                if (t < (1 / p)) {
                    l = s * t * t;
                } else {
                    if (t < (2 / p)) {
                        t -= (1.5 / p);
                        l = s * t * t + 0.75;
                    } else {
                        if (t < (2.5 / p)) {
                            t -= (2.25 / p);
                            l = s * t * t + 0.9375;
                        } else {
                            t -= (2.625 / p);
                            l = s * t * t + 0.984375;
                        }
                    }
                }
                return l;
            },
            // ????????????
            "setAnimation": function (coordinate, zoom) {
                var self = this;

                self.mapContainer.viewInfo.view.animate({
                    center: coordinate || self.transformLat([113.8077, 22.6286]),
                    duration: 1000,
                    zoom: zoom || 15
                });
            },
            // ????????????
            "resetView": function () {
                var self = this;
                self.setAnimation(self.transformLat(self.airPort), 15);
            },
            // ????????????????????????????????????????????????
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
            // ????????????????????????
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

                // ??????????????????
                createLayer("seat", false);

                // ??????????????????
                createLayer("alarm", false);

                createLayer("demo", false);

                if (self.functionInfo.isDefense == true) {
                    // ??????????????????
                    createLayer("defens", false);
                }

                if (self.functionInfo.isTrack == true) {
                    // ??????????????????
                    createLayer("trajectory", false);
                }

                // ??????????????????
                createLayer("vehicle", false);

                if (self.functionInfo.isCamera == true) {
                    // ?????????????????????
                    createLayer("camera", false);
                }

                // ??????GPS??????
                createLayer("GPS", false);
            },
            // ??????Pop???
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
            // ?????????????????????
            "createControls": function () {
                var self = this;

                // ??????????????????
                if (!self.mapContainer.controlsInfo.mousePosition) {
                    self.mapContainer.controlsInfo.mousePosition = new ol.control.MousePosition({
                        "undefinedHTML": "&nbsp;",
                        "projection": "EPSG:4326",
                        "className": "mousePositionInner",
                        "target": document.getElementById("mousePosition"),
                        "coordinateFormat": ol.coordinate.createStringXY(4),
                    });
                }

                // ???????????????
                if (!self.mapContainer.controlsInfo.scaleLine) {
                    self.mapContainer.controlsInfo.scaleLine = new ol.control.ScaleLine({
                        // ????????????????????????degrees???imerial???us???nautical???metric(????????????)
                        "units": "metric"
                    });
                }

                // ????????????
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
                            "center": self.airPort, // ????????????????????????
                            "zoom": 25 // ???????????????????????????
                        })
                    });
                }

                // ??????????????????
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

            //#region ??????
            // ??????????????????
            "createDefensFeature": function (item, callback) {
                var self = this;
                var defensFeature = null;
                var currentFeature = null;
                var coordinate = JSON.parse(item.areaRange)["coordinates"];
                if (!!self.mapContainer.sourceInfo.defens) {
                    currentFeature = self.mapContainer.sourceInfo.defens.getFeatureById("defens_" + item.id);
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
                // console.log(self.mapContainer.sourceInfo.defens);
                !!callback && callback(item.id, coordinate);
            },
            // ????????????????????????
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
            // ??????????????????????????????????????????
            "defensStatuChange": function (item) {
                console.log(item);
            },
            // ???????????????
            "drawAllDefens": function () {
                var self = this;
                for (var i = 0, len = self.defensList.length; i < len; i++) {
                    self.createDefensFeature(self.defensList[i]);
                }
            },
            // ????????????????????????
            "createDefensInteraction": function () {
                var self = this;

                self.isDrawDefening = true; // ????????????
                self.mapContainer.interactionInfo.defens = new ol.interaction.Draw({
                    "source": self.mapContainer.sourceInfo.defens,
                    "type": "Polygon",
                    "geomertyFunction": function (coordinates, geomerty) {
                        var coordinate = self.transformLat(coordinates);
                        if (!geomerty) {
                            geomerty = new ol.geom.Polygon(null);
                        }
                        var start = coordinate[0];
                        var end = coordinate[1];
                        geomerty.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[0]], start]
                        ]);
                        return geomerty
                    }
                });

                // ?????????????????????????????????????????????
                self.mapContainer.map.addInteraction(self.mapContainer.interactionInfo.defens);

                // ????????????????????????
                self.bindDefensDrawEndEvent();
            },
            // ?????????????????????????????????????????????
            "bindDefensDrawEndEvent": function () {
                var self = this;

                // ???????????????????????????
                self.mapContainer.interactionInfo.defens.on("drawend", function (event) {
                    var currentFeature = event.feature; // ?????????????????????????????????
                    var defensFeatures = self.mapContainer.sourceInfo.defens.getFeatures();
                    var geomeryt = currentFeature.getGeometry(); // ?????????????????????????????????
                    var coordinate = geomeryt.getCoordinates(); // ?????????????????????????????????
                    var featureId = "defens_" + (defensFeatures.length + 1);

                    // ??????????????????????????????id
                    currentFeature.setId(featureId);
                    currentFeature.set("name", "defens");

                    // ?????????????????????
                    self.defensAreaDetailInfo = {
                        "id": "",
                        "featureId": featureId,
                        "opType": 1, // ???????????????1:???????????? 2:???????????????????????? 3:?????????????????????????????? 4:??????????????????
                        "companyId": "",
                        "deptId": "", // ??????ID?????????
                        "deptIds": [], // ??????ID?????????
                        "areaName": "", // ????????????
                        "areaCode": "", // ????????????
                        "secureStatus": "", // ???????????????701????????? 702????????? 703????????? 704?????????
                        "areaRangeStr": (function () {
                            var coordArr = [];
                            var coordList = coordinate[0];

                            for (var i = 0, len = coordList.length; i < len; i++) {
                                coordArr.push(coordList[i].join(","));
                            }
                            return coordArr.join(";");
                        }()), // ??????????????????????????????????????????122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": "", // ??????????????????????????????/??????
                        "staySecond": "", // ????????????????????????(?????????)
                        "remark": "", // ??????
                        "createUserId": userInfo["id"], // ????????????ID??????????????????
                        "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                    };
                    // ????????????????????????????????????
                    self.showDefensPopLayer(featureId, coordinate);

                    // ??????????????????
                    self.deleteDefensAction();
                }, this);
            },
            // ???????????????
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
            // ??????????????????
            "getDefensAreaList": function (bool) {
                var self = this;
                // ?????????????????????????????????????????????
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
                                self.drawAllDefens(); // ??????????????????
                            }
                        }
                    });
                }, 500);
            },
            // ?????????????????????
            "defensPageSizeChange": function () {
                var self = this;
                self.defensPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getDefensAreaList(false);
                }, 200);
            },
            // ??????????????????
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
            // ?????????????????????
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
                // ??????pop???
                self.isAddDefensDetailInfo = false;

                setTimeout(function () {
                    self.isAddDefensDetailInfo = true;
                    self.mapContainer.overlayInfo.defens.setPosition(showDefensPopLayer(coordinate));
                    self.autoFocus();
                }, 500);
            },
            // ????????????????????????
            "addDefensAction": function () {
                var self = this;

                // ????????????????????????????????????
                self.mapContainer.map.removeInteraction(self.mapContainer.interactionInfo.defens);

                self.isAddDefensAction = true;
                self.createDefensInteraction();
            },
            // ????????????????????????
            "deleteDefensAction": function () {
                var self = this;

                // ????????????????????????????????????
                self.mapContainer.map.removeInteraction(self.mapContainer.interactionInfo.defens);
                self.isAddDefensAction = false;
                self.isDrawDefening = false;
            },
            // ?????????????????????
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
            // ????????????
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
                            "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getDefensAreaList(true);
                                setTimeout(function () {
                                    self.deleteLoading = false;
                                    self.isDeleteDefens = false;
                                    self.defensAreaDetailInfo = {
                                        "id": "",
                                        "opType": 1, // ???????????????1:???????????? 2:???????????????????????? 3:?????????????????????????????? 4:??????????????????
                                        "companyId": "",
                                        "deptId": "", // ??????ID?????????
                                        "deptIds": [], // ??????ID?????????
                                        "areaName": "", // ????????????
                                        "areaCode": "", // ????????????
                                        "secureStatus": "", // ???????????????701????????? 702????????? 703????????? 704?????????
                                        "areaRangeStr": "", // ??????????????????????????????????????????122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                                        "speedLimit": "", // ??????????????????????????????/??????
                                        "staySecond": "", // ????????????????????????(?????????)
                                        "remark": "", // ??????
                                        "createUserId": userInfo["id"], // ????????????ID??????????????????
                                        "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                                    };
                                }, 500);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                }
            },
            // ????????????????????????????????????
            "uploadDefensAreaDetailInfoToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.saveSecureArea,
                    actionUrl: CONFIG.SERVICE.areaService,
                    dataObj: {
                        "id": self.defensAreaDetailInfo.id,
                        "opType": self.defensAreaDetailInfo.opType, // ???????????????1:???????????? 2:???????????????????????? 3:?????????????????????????????? 4:??????????????????
                        "companyId": self.defensAreaDetailInfo.companyId,
                        "deptId": self.defensAreaDetailInfo.deptIds[self.defensAreaDetailInfo.deptIds.length - 1] || 0, // ??????ID?????????
                        "areaName": encodeURI(self.defensAreaDetailInfo.areaName), // ????????????
                        "areaCode": encodeURI(self.defensAreaDetailInfo.areaCode), // ????????????
                        "secureStatus": self.defensAreaDetailInfo.secureStatus, // ???????????????701????????? 702????????? 703????????? 704?????????
                        "areaRangeStr": self.defensAreaDetailInfo.areaRangeStr, // ??????????????????????????????????????????122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": self.defensAreaDetailInfo.speedLimit, // ??????????????????????????????/??????
                        "staySecond": self.defensAreaDetailInfo.staySecond, // ????????????????????????(?????????)
                        "canEnter": self.defensAreaDetailInfo.canEnter || 720, // ????????????????????????
                        "canExit": self.defensAreaDetailInfo.canExit || 720, // ????????????????????????
                        "canStay": self.defensAreaDetailInfo.canStay || 720, // ???????????????????????????
                        "remark": encodeURI(self.defensAreaDetailInfo.remark), // ??????
                        "createUserId": self.defensAreaDetailInfo.createUserId, // ????????????ID??????????????????
                        "modifyUserId": self.defensAreaDetailInfo.modifyUserId, // ????????????ID??????????????????
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

            //#region ?????????
            // ????????????????????????
            "createCameraFeature": function (areaRangeStr, id, callback) {
                var self = this;
                var cameraFeature = null;
                var cameraFeatures = self.mapContainer.sourceInfo.camera.getFeatures();
                var featureId = "camera_" + (cameraFeatures.length + 1);
                var currentFeature = null;
                var coordinate = null;

                // ??????????????????????????????
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
                    // ??????????????????????????????
                    if (!!!id) {
                        // ?????????????????????
                        self.cameraDetailInfo = {
                            "id": "",
                            "featureId": featureId,
                            "id": "", // ?????????ID
                            "companyId": "", // ????????????ID 
                            "companyName": "", // ????????????
                            "deptId": "", // ??????ID?????????
                            "deptIds": [], // ??????ID?????????
                            "deptName": "", // ????????????
                            "cameraName": "", // ???????????????
                            "cameraCode": "", // ???????????????
                            "cameraDesc": "", // ???????????????
                            "cameraPositionStr": coordinate.join(","), // ????????????
                            "radius": "", // ????????????????????????????????????
                            "angle": "", // ????????????
                            "monitorStatus": "", // ????????????????????????
                            "remark": "", // ??????
                            "rtspLiveUrl": "", // Rtsp????????????
                            "rtspHisUrl": "", // Rtsp????????????
                            "createUserId": userInfo["id"], // ????????????ID??????????????????
                            "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                        };
                    }
                }

                !!callback && callback(id, self.transformLat(coordinate));
                self.isAddCameraAction = false;
            },

            // ????????????
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
            // ????????????????????????
            "showCameraPopLayer": function (featureId, coordinate) {
                var self = this;
                for (var d = 0, dlen = self.cameraList.length; d < dlen; d++) {
                    if (featureId == self.cameraList[d]["id"]) {
                        self.cameraDetailInfo = self.cameraList[d];
                        break;
                    }
                }
                self.getDepartmentList('cameraDetailInfo');
                // ??????pop???
                self.isAddcameraDetailInfo = false;
                setTimeout(function () {
                    self.isAddcameraDetailInfo = true;
                    self.mapContainer.overlayInfo.camera.setPosition(coordinate);
                    self.autoFocus();
                }, 500);
            },
            // ?????????????????????
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
            // ??????????????????????????????
            "formatCameraData": function () {
                var self = this;
                for (var i = 0, len = self.cameraList.length; i < len; i++) {
                    self.camersDatas.push({
                        "id": self.cameraList[i]["id"], // ?????????ID
                        "companyId": self.cameraList[i]["companyId"], // ????????????ID 
                        "companyName": decodeURI(self.cameraList[i]["companyName"]), // ????????????
                        "deptId": self.cameraList[i]["deptId"], // ??????ID?????????
                        "deptName": decodeURI(self.cameraList[i]["deptName"]), // ????????????
                        "cameraName": decodeURI(self.cameraList[i]["cameraName"]), // ???????????????
                        "cameraCode": decodeURI(self.cameraList[i]["cameraCode"]), // ???????????????
                        "cameraDesc": decodeURI(self.cameraList[i]["cameraDesc"]), // ???????????????
                        "radius": self.cameraList[i]["radius"], // ????????????????????????????????????
                        "cameraPositionStr": self.cameraList[i]["cameraPositionStr"], // ????????????
                        "angle": self.cameraList[i]["angle"], // ????????????
                        "monitorStatus": self.cameraList[i]["monitorStatusName"], // ????????????????????????
                        "remark": decodeURI(self.cameraList[i]["remark"]), // ??????
                        "rtspLiveUrl": self.cameraList[i]["rtspLiveUrl"], // Rtsp????????????
                        "rtspHisUrl": self.cameraList[i]["rtspHisUrl"], // Rtsp????????????
                    });
                }
            },
            // ???????????????????????????
            "getCameraList": function (bool) {
                var self = this;
                self.camersDatas = [];
                self.cameraList = [];
                // ?????????????????????????????????????????????
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
            // ?????????????????????
            "cameraPageSizeChange": function () {
                var self = this;
                self.cameraPageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getCameraList(false);
                }, 200);
            },
            // ????????????????????????
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
            // ???????????????
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
                            "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                        },
                        successCallback: function (data) {
                            if (data.code == 200) {
                                self.getCameraList(true);
                                setTimeout(function () {
                                    self.deleteLoading = false;
                                    self.isDeleteCamera = false;
                                    self.cameraDetailInfo = {
                                        "id": "", // ?????????ID
                                        "companyId": "", // ????????????ID 
                                        "companyName": "", // ????????????
                                        "deptId": "", // ??????ID?????????
                                        "deptIds": [], // ??????ID?????????
                                        "deptName": "", // ????????????
                                        "cameraName": "", // ???????????????
                                        "cameraCode": "", // ???????????????
                                        "cameraDesc": "", // ???????????????
                                        "cameraPositionStr": "", // ????????????
                                        "radius": "", // ????????????????????????????????????
                                        "angle": "", // ????????????
                                        "monitorStatus": "", // ????????????????????????
                                        "remark": "", // ??????
                                        "rtspLiveUrl": "", // Rtsp????????????
                                        "rtspHisUrl": "", // Rtsp????????????
                                        "createUserId": userInfo["id"], // ????????????ID??????????????????
                                        "modifyUserId": userInfo["id"], // ????????????ID??????????????????
                                    };
                                }, 500);
                            } else {
                                self.$Message.error(data.message);
                            }
                        }
                    });
                }
            },
            // ????????????????????????????????????
            "uploadCameraDetailInfoToServer": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deviceService + "?action=" + CONFIG.ACTION.saveCamera,
                    actionUrl: CONFIG.SERVICE.deviceService,
                    dataObj: {
                        "id": self.cameraDetailInfo.id, // ?????????ID
                        "companyId": self.cameraDetailInfo.companyId, // ????????????ID 
                        "deptId": self.cameraDetailInfo.deptIds[self.cameraDetailInfo.deptIds.length - 1] || 0, // ??????ID?????????
                        "cameraName": encodeURI(self.cameraDetailInfo.cameraName), // ???????????????
                        "cameraCode": encodeURI(self.cameraDetailInfo.cameraCode), // ???????????????
                        "cameraDesc": encodeURI(self.cameraDetailInfo.cameraDesc), // ???????????????
                        "radius": self.cameraDetailInfo.radius, // ????????????????????????????????????
                        "angle": self.cameraDetailInfo.angle, // ????????????
                        "cameraPositionStr": self.cameraDetailInfo.cameraPositionStr, // ????????????
                        "monitorStatus": self.cameraDetailInfo.monitorStatus, // ????????????????????????
                        "remark": encodeURI(self.cameraDetailInfo.remark), // ??????
                        "rtspLiveUrl": self.cameraDetailInfo.rtspLiveUrl, // Rtsp????????????
                        "rtspHisUrl": self.cameraDetailInfo.rtspHisUrl, // Rtsp????????????
                        "createUserId": userInfo["id"], // ????????????ID??????????????????
                        "modifyUserId": userInfo["id"], // ????????????ID??????????????????
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

            //#region ????????????
            // ?????????????????????
            "formatVehicle": function () {
                var self = this;
                self.vehicleDatas = [];
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    self.vehicleDatas.push({
                        "vehicleCode": self.vehicleList[i]["vehicleCode"], //"??????",
                        "vehicleTypeId": self.vehicleList[i]["vehicleTypeName"], //"??????",
                        "vehicleName": self.vehicleList[i]["vehicleName"], //"??????",
                        "vehicleStatus": (function () {
                            var state = ""; // terminalStatusList
                            for (var s = 0, slen = self.terminalStatusList.length; s < slen; s++) {
                                if (self.terminalStatusList[s]["type"] == self.vehicleList[i]["vehicleStatus"]) {
                                    state = self.terminalStatusList[s]["name"];
                                    break;
                                }
                            }
                            return state;
                        }()), //"??????",
                    });
                }
            },
            // ????????????????????????
            "getVehicleList": function (bool) {
                var self = this;
                // ?????????????????????????????????????????????
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
            // ??????????????????
            "vehiclePageSizeChange": function () {
                var self = this;
                self.vehiclePageInfo.pageNum = parseInt(value, 10);
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },

            // ??????????????????
            "createVehicleFeature": function (item, index, callback) {
                var self = this;
                var vehicleFeature = null;
                var coordinate = JSON.parse(item["lastPosition"])["coordinates"];
                var iconSrc = "/airport/assets/img/success.gif";
                var vehicleType = (function () {
                    var type = {};
                    for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
                        type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
                    }
                    return type;
                }());
                var vehicleIcon = (vehicleType[item.vehicleTypeName] + item.vehicleStatus) || item.vehicleStatus;
                var scale = 0.2;
                var zoom = self.mapContainer.viewInfo.view.getZoom();

                iconSrc = "/airport/assets/img/" + vehicleIcon + ".gif?v=" + Date.parse(new Date());

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

                // console.log(iconSrc);

                var vehiclePoint = new ol.style.Style({
                    "image": new ol.style.Icon({
                        "scale": scale,
                        "src": iconSrc,
                        "anchor": [0.5, 0.5],
                        "anchorYUnits": "pixels",
                        "anchorXUnits": "fraction",
                        "offsetOrigin": "bottom-right",
                        "anchorOrigin": "bottom-right",
                    })
                });

                // ???????????????????????? 
                if (self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"]) {
                    self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"].setCoordinates(self.transformLat(coordinate));
                    self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"].setCoordinates(self.transformLat(coordinate));
                    if (self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "--" + index])) {
                        self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "Circle"]).setStyle(self.vehicleFeature.circlePoint);
                        self.mapContainer.sourceInfo.vehicle.getFeatureById([item["id"] + "--" + index]).setStyle(vehiclePoint);
                    }
                } else {
                    if (self.isAddVehiclePosition == true) {
                        self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"] = new ol.geom.Point(self.transformLat(coordinate));
                        circleFeatrue = new ol.Feature({
                            "name": "vehicle",
                            "geometry": self.mapContainer.featrueInfo.circlePoint[item["id"] + "Circle"],
                        });
                        circleFeatrue.setStyle(self.vehicleFeature.circlePoint);
                        self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"] = new ol.geom.Point(self.transformLat(coordinate));
                        vehicleFeature = new ol.Feature({
                            "name": "vehicle",
                            "geometry": self.mapContainer.featrueInfo.vehiclePoint[item["id"] + "Vehicle"],
                        });
                        vehicleFeature.setStyle(vehiclePoint);
                        circleFeatrue.setId(item["id"] + "Circle");
                        vehicleFeature.setId(item["id"] + "--" + index);
                        self.mapContainer.sourceInfo.vehicle.addFeature(circleFeatrue);
                        self.mapContainer.sourceInfo.vehicle.addFeature(vehicleFeature);
                    }
                }
                self.isAddVehiclePosition = false;
                !!callback && callback(self.transformLat(coordinate));
            },
            // ?????????????????????
            "clearAllVehicle": function () {
                var self = this;
                self.mapContainer.sourceInfo.vehicle.clear();
                self.mapContainer.featrueInfo.vehiclePoint = {};
                self.mapContainer.featrueInfo.circlePoint = {};
                if (!!self.mapContainer.overlayInfo["vehicle"]) {
                    self.mapContainer.overlayInfo["vehicle"].setPosition(undefined);
                }
            },
            // 
            "setSingleVehicle": function () {
                var self = this;
                self.isTrackItem = true;
                self.mapContainer.sourceInfo.vehicle.clear();
                self.mapContainer.featrueInfo.vehiclePoint = {};
                self.mapContainer.featrueInfo.circlePoint = {};
            },
            // ????????????????????????????????????
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
            // ????????????Pop
            "showVehicleOverLayer": function (coordinate) {
                var self = this;
                var view = self.mapContainer.map.getView().getZoom();
                // ????????????????????????
                self.singleVehiclePageInfo.vehicleId = self.vehicleItemPop.id;// ??????ID
                self.singleVehiclePageInfo.vehicleCode = self.vehicleItemPop.vehicleCode;// ????????????
                self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;// ?????????
                self.singleVehiclePageInfo.lastGpsTime = self.vehicleItemPop.lastGpsTime;// ?????????
                self.singleVehiclePageInfo.lastPosition = self.vehicleItemPop.lastPosition;// ?????????
                // self.singleVehiclePageInfo.address = "";// ?????????
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
                self.getAdressDetail(coordinate, self.singleVehiclePageInfo);
                self.setAnimation(coordinate, view);
                $("body").on("click", "#popup-closer--vehicle", function () {
                    $("body").find("#ol-vehicle").hide();
                    self.isTrackItem = false;
                    self.mapContainer.overlayInfo["vehicle"].setPosition(undefined);
                });
            },
            // ??????????????????????????????
            "showVehicleRowData": function (item, index) {
                var self = this;
                self.isAddVehiclePosition = true;
                self.vehicleItem = self.vehicleList[index];
                self.vehicleItemPop = self.vehicleItem;

                if (!!self.vehicleItemPop.lastPosition) {
                    self.setSingleVehicle();
                    self.createVehicleFeature(self.vehiclePositionItem, index, function (coordinate) {
                        self.showVehicleOverLayer(coordinate);
                    });
                } else {
                    self.$Message.error("????????????????????????");
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                }
            },
            // ????????????????????????????????????
            "showRowDataPosition": function (item, index) {
                var self = this;
                self.isAddVehiclePosition = true;
                self.vehiclePositionItem = self.vehiclePositionList[index];
                self.vehicleItemPop = self.vehiclePositionItem;
                self.trackItem = self.vehicleItemPop;

                if (!!self.vehicleItemPop.lastPosition) {
                    if (JSON.parse(self.vehicleItemPop.lastPosition).coordinates[0] == 0 || JSON.parse(self.vehicleItemPop.lastPosition).coordinates[1] == 0) {
                        self.$Message.error("????????????????????????");
                    } else {
                        self.setSingleVehicle();
                        self.createVehicleFeature(self.vehiclePositionItem, index, function (coordinate) {
                            self.showVehicleOverLayer(coordinate);
                        });
                    }
                } else {
                    self.$Message.error("????????????????????????");
                }
            },
            // ?????????????????????
            "drawAlVehicle": function () {
                var self = this;
                var targetItem = null;

                if (self.isTrackItem) {
                    for (var t = 0, tlen = self.vehiclePositionList.length; t < tlen; t++) {
                        if (self.trackItem.licenseNumber == self.vehiclePositionList[t]['licenseNumber']) {
                            // targetItem =  self.vehiclePositionList[t];
                            self.setVehicleRowData(t);
                            break;
                        }
                    }
                    if (targetItem) {
                        // var view = self.mapContainer.map.getView().getZoom();
                        // self.setAnimation(self.transformLat(JSON.parse(targetItem["lastPosition"])["coordinates"]), view);
                        // setTimeout(function () {
                        //     self.showVehicleOverLayer(self.transformLat(JSON.parse(targetItem["lastPosition"])["coordinates"]));
                        // }, 1200);
                    }
                } else {
                    for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
                        self.setVehicleRowData(i);
                    }
                }

            },
            // ?????????????????????????????????????????????????????????
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

                self.trackItem = self.vehicleItemPop;

                if (self.vehicleItemPop) {
                    if (!!self.vehicleItemPop.lastPosition) {
                        self.setSingleVehicle();
                        coordinate = JSON.parse(self.vehicleItemPop["lastPosition"])["coordinates"];
                        self.createVehicleFeature(self.vehicleItemPop, index, function () {
                            self.showVehicleOverLayer(self.transformLat(coordinate));
                        });
                    } else {
                        self.$Message.error("????????????????????????");
                        self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                    }
                } else {
                    self.$Message.error("??????????????????");
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                }
            },
            // ???????????????????????????
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
            // ??????????????????
            "cancelAreaSearch": function () {
                var self = this;
                self.vehiclePositonPageInfo.centerPosition = "";
                self.vehiclePositonPageInfo.span = 1000;
                self.clearAllVehicle();
                self.getAllVehiclePositonList();
            },
            // ????????????????????????
            "searchTimeVehicle": function () {
                var self = this;
                self.clearAllVehicle();
                self.getAllVehiclePositonList();
            },
            // ????????????????????????????????????
            "getAllVehiclePositonList": function () {
                var self = this;
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getAllVehiclePositonList,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        "span": self.vehiclePositonPageInfo.span || 1000, //"", // ???????????????????????????????????????????????????????????????100?????? // ??????centerPosition+ span??????????????????????????????????????????????????????????????????????????????
                        "deptId": self.vehiclePositonPageInfo.deptId, //"", // ??????ID
                        "pageNum": self.vehiclePositonPageInfo.pageNum, //0,
                        "pageSize": self.vehiclePositonPageInfo.pageSize, //5,
                        "id": self.vehiclePositonPageInfo.id, //"", // ??????ID
                        "companyId": self.vehiclePositonPageInfo.companyId, //"", // ????????????ID
                        "gpsDeviceCode": self.vehiclePositonPageInfo.gpsDeviceCode, //"", // ??????????????????
                        "vehicleTypeId": self.vehiclePositonPageInfo.vehicleTypeId, //"", // ????????????ID
                        "vehicleStatus": self.vehiclePositonPageInfo.vehicleStatus, //"", // ??????????????????
                        "useStatus": self.vehiclePositonPageInfo.useStatus, //"", // ??????????????????
                        "vehicleColorId": self.vehiclePositonPageInfo.vehicleColorId, //"", // ????????????ID
                        "vehicleBrandId": self.vehiclePositonPageInfo.vehicleBrandId, //"", // ????????????ID
                        "centerPosition": self.vehiclePositonPageInfo.centerPosition, //"", // ??????????????????????????????????????????,??????
                        "vehicleName": encodeURI(self.vehiclePositonPageInfo.vehicleName), //"", // ????????????
                        "vehicleCode": encodeURI(self.vehiclePositonPageInfo.vehicleCode), //"", // ????????????
                        "licenseNumber": encodeURI(self.vehiclePositonPageInfo.licenseNumber), //"", // ?????????
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
                            self.formatVehiclePositon(); // ?????????????????????
                            self.drawAlVehicle(); // ???????????????
                        }
                    }
                });
            },
            // ??????????????????
            "getBeginDate": function (value) {
                var self = this;
                self.dateTimeInfo.beginDate = value;
            },
            // ??????????????????
            "getEndDate": function (value) {
                var self = this;
                self.dateTimeInfo.endDate = value;
            },
            // ????????????
            "getBeginTime": function (value) {
                var self = this;
                self.dateTimeInfo.beginTime = value;
            },
            "getEndTime": function (value) {
                var self = this;
                self.dateTimeInfo.endTime = value;
            },
            // ??????????????????
            "getAdressDetail": function (coordinate, target) {
                var self = this;
                if (!!target.lastPosition) {
                    var convertor = new BMap.Convertor();
                    target.sourceCoor = JSON.parse(target.lastPosition)['coordinates'];
                    target.point = new BMap.Point(target.sourceCoor[0], target.sourceCoor[1]);
                    convertor.translate([target.point], 1, 5, function (data) {
                        target.gc = new BMap.Geocoder();
                        target.gc.getLocation(data.points[0], function (rs) {
                            target.address = rs.address;
                        });
                    });
                }
            },
            // ???????????????????????????
            "formatTrajectoryInfo": function () {
                var self = this;
                var track = null;
                var coordinate = [];
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
                            "coordinate": self.transformLat([parseFloat(trackArr[0], 10), parseFloat(trackArr[1], 10)]),
                            "vehicleCode": self.singleVehicleItem.vehicleCode,
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
                    coordinate.push(trajectoryArr[t]["coordinate"]);
                }
                self.mapContainer.animationInfo.coordinates = coordinate;
                self.mapContainer.animationInfo.trajectoryInfo = trajectoryArr;
            },
            // ???????????????????????????????????????
            "getSingleVehicleTrack": function (bool) {
                var self = this;
                var timeDiff = null;

                self.clearTrack(); // ???????????????

                if (self.dateTimeInfo.beginDate.length == 0) {
                    self.dateTimeInfo.beginDate = (function () {
                        var dateInfo = utility.getDateDetailInfo();
                        return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date;
                    }())
                }

                if (self.dateTimeInfo.beginTime.length == 0) {
                    self.dateTimeInfo.beginTime = "00:00:00";
                }

                if (self.dateTimeInfo.endDate.length == 0) {
                    self.dateTimeInfo.endDate = (function () {
                        var dateInfo = utility.getDateDetailInfo();
                        return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date;
                    }())
                }

                if (self.dateTimeInfo.endTime.length == 0) {
                    self.dateTimeInfo.endTime = "23:59:59";
                }

                self.singleVehiclePageInfo.beginTime = self.dateTimeInfo.beginDate + " " + self.dateTimeInfo.beginTime;
                self.singleVehiclePageInfo.endTime = self.dateTimeInfo.endDate + " " + self.dateTimeInfo.endTime;

                console.log(self.singleVehiclePageInfo.beginTime);
                console.log(self.singleVehiclePageInfo.endTime);

                timeDiff = utility.timeDiff(self.singleVehiclePageInfo.beginTime, self.singleVehiclePageInfo.endTime);

                self.$Message.destroy();

                if (timeDiff.isOver == false) {
                    self.$Message.error("??????????????????????????????");
                    return;
                }

                if (timeDiff.day > 3) {
                    self.$Message.error("????????????????????????3???");
                    return;
                }

                self.$Message.loading({
                    "content": "??????????????????..."
                });

                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getSingleVehicleTrack,
                    actionUrl: CONFIG.SERVICE.vehicleService,
                    dataObj: {
                        // "id": self.singleVehiclePageInfo.vehicleId, // ??????ID
                        "gpsDeviceCode": self.singleVehiclePageInfo.gpsDeviceCode, // ??????ID
                        // "vehicleCode": encodeURI(self.singleVehiclePageInfo.vehicleCode), // ????????????
                        "licenseNumber": encodeURI(self.singleVehiclePageInfo.licenseNumber), // ????????????
                        "beginTime": self.singleVehiclePageInfo.beginTime, // ????????????
                        "endTime": self.singleVehiclePageInfo.endTime, // ????????????
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

                            // ??????????????????
                            if (self.singleVehicleItem.track) {
                                track = self.vehicleItemPop["track"].split("/");
                                coorArr = track[track.length - 1].split(",");
                                coordinate = self.transformLat([parseFloat(coorArr[0], 10), parseFloat(coorArr[1], 10)]);
                                self.showVehicleOverLayer(coordinate);
                                self.formatTrajectoryInfo(); // ?????????????????????
                                self.clearTrack(); // ???????????????
                                self.drawTrajPoint(); // ??????????????????
                                self.drawTrajectory(); // ?????????
                                self.createTrajOverLayer(); // ??????????????????????????????

                                // if (view < 16) {
                                //     view = 16;
                                // }
                                // var view = self.mapContainer.map.getView().getZoom();
                                // self.setAnimation(self.mapContainer.animationInfo.coordinates[Math.ceil(Math.random() * self.mapContainer.animationInfo.coordinates.length)], view);

                                setTimeout(function () {
                                    self.$Message.destroy();
                                    if (bool == true) {
                                        self.startVehicleAnimation();
                                    }
                                }, 3000);
                            } else {
                                self.$Message.destroy();
                                self.$Message.error(self.singleVehiclePageInfo.beginTime + "  " + self.singleVehiclePageInfo.endTime + "????????????????????????");
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
            // ?????????????????????
            "drawTrajectory": function () {
                var self = this;
                var coordinates = self.mapContainer.animationInfo.coordinates;

                self.$Message.destroy();
                self.$Message.loading({
                    "content": "??????????????????..."
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
            // ????????????????????????
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
            // ???????????????????????????
            "drawDbClickVehicle": function (coordinates) {
                var self = this;
                self.isDbClickSearch = true;
                if (!!!self.mapContainer.overlayInfo["dbClickVehicle"]) {
                    self.mapContainer.overlayInfo["dbClickVehicle"] = new ol.Overlay({
                        "autoPan": true,
                        "stopEvent": false,
                        "positioning": "center-center",
                        "element": document.getElementById("ol-dbClickSearch"),
                        "autoPanAnimation": { "duration": 250 },
                    });
                    self.mapContainer.map.addOverlay(self.mapContainer.overlayInfo["dbClickVehicle"]);
                }
                self.mapContainer.overlayInfo["dbClickVehicle"].setPosition(coordinates);
                $("body").find("#ol-dbClickSearch").css({ opacity: 1 });
                self.setAnimation(coordinates, 15);
                setTimeout(function () {
                    if (self.isDbClickSearch == true) {
                        self.hiddenTwink();
                    }
                }, 5000);
            },
            // ??????????????????
            "hiddenTwink": function () {
                var self = this;
                if (!!self.mapContainer.overlayInfo["dbClickVehicle"]) {
                    self.mapContainer.overlayInfo["dbClickVehicle"].setPosition(undefined);
                }
                $("body").find("#ol-dbClickSearch").css({ opacity: 0 });
                self.isDbClickSearch = false;
            },
            // ??????????????????
            "startVehicleAnimation": function () {
                var self = this;
                var coordinates = self.mapContainer.animationInfo.coordinates;
                self.cancelTrack();
                if (!!!self.singleVehicleItem.track || self.singleVehicleItem.track.length == 0) {
                    self.getSingleVehicleTrack(true);
                    return;
                } else {
                    self.drawTrajPoint(); // ??????????????????
                    self.drawTrajectory(); // ?????????
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
            // ??????????????????
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
            "cancelTrack": function () {
                var self = this;
                self.isTrackItem = false;
            },
            // ??????????????????
            "clearTrack": function () {
                var self = this;
                self.cancelTrack();
                self.stopVehicleAnimation(false);
                self.mapContainer.sourceInfo.trajectory.clear();
                if (!!self.mapContainer.overlayInfo["trajectory"]) {
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined)
                }
            },
            // ????????????????????????
            "drawTrajPoint": function () {
                var self = this;
                var len = self.mapContainer.animationInfo.trajectoryInfo.length;
                var flag = 5;

                if (len > 30000) {
                    flag = 500;
                } else if (len > 20000) {
                    flag = 300;
                } else if (len > 10000) {
                    flag = 150;
                } else if (len > 8000) {
                    flag = 120;
                } else if (len > 6000) {
                    flag = 100;
                } else if (len > 4000) {
                    flag = 50;
                } else if (len > 2000) {
                    flag = 20;
                }

                for (var i = 0; i < len; i = i + flag) {
                    if (!!self.mapContainer.animationInfo.trajectoryInfo[i]) {
                        var pointFeature = new ol.Feature({
                            "name": "trajPoint",
                            "geometry": new ol.geom.Point(self.mapContainer.animationInfo.trajectoryInfo[i]["coordinate"]),
                        });
                        pointFeature.set("coordinate", self.mapContainer.animationInfo.trajectoryInfo[i]["coordinate"]);
                        pointFeature.setId("trajPoint-" + i);
                        pointFeature.setStyle(self.vehicleFeature.circlePoint);
                        self.mapContainer.sourceInfo.trajectory.addFeature(pointFeature);
                    }
                }
            },
            // ??????????????????overlayer
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
            // ??????????????????Pop
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
                    self.isTrackItem = false;
                    self.mapContainer.overlayInfo["trajectory"].setPosition(undefined);
                });
            },
            // ????????????
            "showLiveVideo": function (vehicleInfo, isBackPlay) {
                var self = this;
                var port = "8080";
                // var port = "9090";
                var url = "http://43.247.68.26:" + port + "/airport/www/module/liveVideo/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;

                if (isBackPlay) {
                    url = "http://43.247.68.26:" + port + "/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                }

                if (vehicleInfo.providerId == 2) {
                    if (isBackPlay) {
                        url = "http://43.247.68.26:" + port + "/airport/www/module/playBack/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&isBackPlay=" + isBackPlay;
                    } else {
                        url = "http://43.247.68.26:" + port + "/airport/www/module/liveVideoTest1/liveVideo.html?vehicleInfo=" + encodeURI(JSON.stringify(vehicleInfo)) + "&id=" + userInfo["id"] + "&userToken=" + userInfo["userToken"] + "&isBackPlay=" + isBackPlay;
                    }
                }
                window.open(
                    url,
                    "liveVideo",
                    "toolbar=yes, location=0, directories=no, status=0, menubar=0, scrollbars=1, resizable=1, copyhistory=1, width=" + window.outerWidth + ", height=" + (window.outerHeight - 50)
                );
            },
            //#endregion

            //#region GPS ??????
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

                // self.mapContainer.geolocationInfo.GPS.setTracking(false); // ??????????????????

                // self.mapContainer.geolocationInfo.GPS.on("error", function (error) {
                //     console.log("geolocationError:" + error.message);
                // });

                // self.mapContainer.geolocationInfo.GPS.on("change", function () {
                //     console.log(self.mapContainer.geolocationInfo.GPS.getPosition());
                // });

                // self.getLocation();

            },
            // ??????????????????
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
                    console.log("???????????????");
                }
            },
            //#endregion

            // ??????????????????
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
            // ?????????????????????
            "formatSuperiorDeprt": function (list) {
                var self = this;
                var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(/subDeptList/g, 'children');
                self.departmentList = JSON.parse(listInfo);
            },
            // ??????????????????
            "getDepartmentList": function (type) {
                var self = this;
                self.departmentList = [];
                utility.interactWithServer({
                    url: CONFIG.HOST + CONFIG.SERVICE.deptService + "?action=" + CONFIG.ACTION.getDeptTreeList,
                    actionUrl: CONFIG.SERVICE.deptService,
                    dataObj: {
                        id: 0,
                        pageSize: 10000,
                        companyId: self[type]["companyId"] || 0, // ??????ID
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
            // ????????????????????????
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

            // 
            // ????????????????????????
            "drawDemoPoint": function () {
                var self = this;
                for (var i = 0, len = self.demoInfo.coordinate.length; i < len; i++) {
                    var pointFeature = new ol.Feature({
                        "name": "trajPoint",
                        "geometry": new ol.geom.Point(self.transformLat(self.demoInfo.coordinate[i])),
                    });
                    pointFeature.set("coordinate", self.transformLat(self.demoInfo.coordinate[i]));
                    pointFeature.setId("demo-" + i);
                    pointFeature.setStyle(new ol.style.Style({
                        "image": new ol.style.Circle({
                            "radius": 3,
                            "stroke": new ol.style.Stroke({
                                color: '#2d8cf0',
                                width: 3
                            }),
                            "file": new ol.style.Fill({
                                color: '#2d8cf0',
                            })
                        }),
                        "text": new ol.style.Text({
                            "text": self.demoInfo.status[i] + " " + self.demoInfo.time[i],
                            "offsetX": 5,
                            "offsetY": 15,
                            "overflow": true,
                            "file": new ol.style.Fill({
                                color: '#ffffff',
                            }),
                            "backgroundFill": new ol.style.Fill({
                                color: '#ffffff',
                            }),
                        })
                    }));
                    self.mapContainer.sourceInfo.demo.addFeature(pointFeature);
                }
            },
        },
        "created": function () {
            var self = this;
            var timePosition = null;

            self.isShenZhen = (self.airPort.join(",") == "113.8077,22.6286");

            // ??????????????????????????????????????????????????????????????????????????????
            utility.isLogin(false);

            self.$Message.config({
                top: 180,
                duration: 3
            });

            // ?????????????????????
            setTimeout(function () {
                self.initMap("vector"); // satellite
                self.getVehicleList(true);
                if (self.functionInfo.isCamera) {
                    self.getCameraList(true); // ???????????????????????????
                }
                if (self.functionInfo.isDefense) {
                    self.getDefensAreaList(true); // ????????????
                }
                
                self.getCompanyList();// ????????????
                self.getAllVehiclePositonList(); // ????????????????????????

                timePosition = setInterval(function () {
                    self.getVehicleList(true);
                    self.getAllVehiclePositonList(); // ????????????????????????
                }, 5000);

                setInterval(function () {
                    var fromInfo = utility.getSessionStorage("fromInfo") || null;
                    // ????????????????????????????????????
                    if (!!fromInfo) {
                        self.showModal(fromInfo.type);
                        self.vehiclePositonPageInfo.vehicleStatus = fromInfo.vehicleStatus;
                        setTimeout(function () {
                            utility.cleanSessionStorage();
                        }, 2000);
                    }
                }, 100);

                // ????????????
                self.mapContainer.map.on("singleclick", function (event) {
                    var coordinate = event.coordinate;
                    var nodeName = event.originalEvent.target.nodeName.toLowerCase();
                    var clickFeature = self.mapContainer.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
                        return feature;
                    });
                    // ????????????????????????????????????????????????????????????????????????
                    if (nodeName == "canvas" && !!clickFeature) {
                        self.mapContainer.featrueInfo.clickId = clickFeature.getId();
                        self.mapContainer.featrueInfo.clickName = clickFeature.get("name");
                        self.mapContainer.featrueInfo.clickPos = event.pixel;

                        switch (self.mapContainer.featrueInfo.clickName) {
                            case "camera":
                                self.showCameraPopLayer(self.mapContainer.featrueInfo.clickId, coordinate);
                                break;
                            case "defens":
                                self.showDefensPopLayer(self.mapContainer.featrueInfo.clickId, coordinate);
                                break;
                            case "vehicle":
                                self.showVehiclePositionByClick(self.mapContainer.featrueInfo.clickId);
                                break;
                            case "trajPoint":
                                self.showTrajPopLayer(coordinate, self.mapContainer.featrueInfo.clickId);
                                break;
                            default:
                                console.log(clickFeature);
                        }

                    } else {
                        // ???????????????
                        if (self.isAddCameraAction == true) {
                            self.createCameraFeature(coordinate, "", function (id, coordinate) {
                                self.showCameraPopLayer("", coordinate);
                            });
                        }
                    }
                });

                // ????????????
                self.mapContainer.map.on("dblclick", function (event) {
                    var coordinate = event.coordinate;
                    self.vehiclePositonPageInfo.centerPosition = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326').join(",");
                    self.drawDbClickVehicle(coordinate);
                });

                self.$watch('vehiclePositonPageInfo', function () {
                    var fromInfo = utility.getSessionStorage("fromInfo") || null;
                    self.clearAllVehicle();

                    clearInterval(timePosition);
                    self.getAllVehiclePositonList();
                    timePosition = setInterval(function () {
                        self.getAllVehiclePositonList(); // ????????????????????????
                    }, 5000);
                }, { deep: true });

                if ($('.radar')[0]) {
                    new Radar($('.radar')[0]).init({ scanSpeed: 2 });  // ???????????????????????????deg????????????360?????????
                }

            }, 2000);
        }
    });

}())
