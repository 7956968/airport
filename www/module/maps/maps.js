(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var bizParam = utility.getLocalStorage("bizParam");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "deleteLoading": false,
            "addLoading": false,
            "language": !!language ? language["language"] : "CN",
            "companyList": [],

            //#region 地图
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
                    "layer": null,
                    "airportPoint": null,
                    "airportLine": null,
                    "airportPolygo": null,
                    "seat": null, // 机位
                    "defens": null, // 防区
                    "vehicle": null, // 车辆
                    "alarm": null, // 告警
                    "camera": null, // 摄像机
                    "GPS": null, // GPS定位
                },
                // 资源信息
                "sourceInfo": {
                    "seat": null, // 机位
                    "defens": null, // 防区
                    "vehicle": null, // 车辆
                    "alarm": null, // 告警
                    "camera": null // 摄像机
                },
                // 控件信息
                "controlsInfo": {
                    "mousePosition": null, // 鼠标位置
                    "scaleLine": null, // 比例尺
                    "overviewMap": null,
                    "fullScreen": null
                },
                // 交互信息
                "interactionInfo": {
                    "defens": null, // 防区
                },
                // 特性信息
                "featrueInfo": {
                    "clickName": null, // 当前点击的要素的名称
                    "clickId": null, // 当前点击的要素的 id
                    "clickPos": [] // 当前点击要素的位置
                },
                // 定位信息
                "geolocationInfo": {
                    "GPS": null, // gps控件
                },
                // 叠加
                "overlayInfo": {
                    "camera": null,
                    "defens": null
                },
                // 几何图形信息
                "geometryInfo": {

                }
            },
            //#endregion

            //#region 弹出层
            "modal": {
                "isVehicle": false, // 车辆管理
                "isHistory": false, // 历史轨迹
                "isDefense": false, // 防区管理
                "isCamera": false, // 摄像机管理
                "isLayer": false, // 图层控件
                "isAlarm": false, // 告警管理
                "isSearch": false // 车辆搜索
            },
            "layerControl": ["seat", "alarm", "vehicle", "defens", "camera"],
            //#endregion

            //#region 车辆管理
            "vehiclePageInfo": {
                "count": 0,
                "pageSize": 15,
                "pageNum": 0,
                "deptId": "", // 部门ID
                "id": "", // 车辆ID
                "vehicleName": "", // 车辆名称
                "vehicleCode": "", // 车辆编码
                "gpsDeviceCode": "",
            },
            "vehicleItem": null,
            "vehicleList": [],
            "terminalStatusList": bizParam["terminalStatus"],
            "vehicleColumns": [
                {
                    "title": { "CN": "编号", "EN": "Number", "TW": "編號" }[language["language"]],
                    "key": "number"
                },
                {
                    "title": { "CN": "车牌号", "EN": "License Plate", "TW": "車牌號" }[language["language"]],
                    "key": "plate"
                },
                {
                    "title": { "CN": "状态", "EN": "State", "TW": "狀態" }[language["language"]],
                    "key": "state"
                }
            ],
            "vehicleDatas": [],
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
            "defensAreaDetailInfo": {
                "id": "",
                "featureId": "",
                "opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
                "companyId": "",
                "deptId": "", // 部门ID，可选
                "areaName": "", // 防区名称
                "areaCode": "", // 防区编码
                "secureStatus": "", // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                "areaRangeStr": "", // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                "speedLimit": "", // 行驶速度限制上限（米/秒）
                "staySecond": "", // 最大允许停留时长(单位秒)
                "remark": "", // 备注
                "createUserId": userInfo["id"], // 创建用户ID，新增时必传
                "modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
            },
            "defensColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "areaName"
                },
                {
                    "title": { "CN": "编码", "EN": "Code", "TW": "編碼" }[language["language"]],
                    "key": "areaCode"
                },
                {
                    "title": { "CN": "状态", "EN": "Status", "TW": "狀態" }[language["language"]],
                    "key": "secureStatus"
                },
                {
                    "title": { "CN": "速度上限", "EN": "Speed Limit", "TW": "速度上限" }[language["language"]],
                    "key": "speedLimit"
                },
                {
                    "title": { "CN": "停留时长", "EN": "Length Of Stay", "TW": "停留時長" }[language["language"]],
                    "key": "staySecond"
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 80,
                    "render": function (h, params) {
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
                            }, { "CN": "删除", "EN": "Delete", "TW": "删除" }[language["language"]])
                        ]);
                    }
                }
            ],
            "defensDatas": [],
            "defensList": [],
            "defensPageInfo": {
                "id": "",
                "count": 0,
                "pageNum": 0,
                "pageSize": 15,
                "areaName": "",
                "companyId": "",
                "secureStatus": "",
            },
            //#endregion

            //#region 摄像机
            "isAddCameraAction": false,
            "isAddcameraDetailInfo": false,
            "isDeleteCamera": false,
            "cameraColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "name",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": { "CN": "描述", "EN": "Describe", "TW": "描述" }[language["language"]],
                    "key": "describe",
                    "width": 150
                },
                {
                    "title": { "CN": "rtsp", "EN": "rtsp", "TW": "rtsp" }[language["language"]],
                    "key": "rtsp",
                    "width": 200
                },
                {
                    "title": { "CN": "方向", "EN": "direction", "TW": "方向" }[language["language"]],
                    "key": "direction",
                    "width": 100
                },
                {
                    "title": { "CN": "半径", "EN": "raduis", "TW": "半徑" }[language["language"]],
                    "key": "raduis",
                    "width": 100
                },
                {
                    "title": { "CN": "视野角度", "EN": "Angle of view", "TW": "視野角度" }[language["language"]],
                    "key": "view",
                    "width": 100
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        return h("div", [
                            h("Button", {
                                "props": {
                                    "type": "error",
                                    "size": "small"
                                }
                            }, { "CN": "删除", "EN": "Delete", "TW": "删除" }[language["language"]])
                        ]);
                    }
                }
            ],
            "cameraDetailInfo": {
                "featureId": null,
                "coordinate": null,
                "name": "",
                "describe": "",
                "rtsp": "",
                "direction": "",
                "raduis": "",
                "view": ""
            },
            "camersDatas": [],
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
            "searchColumns": [
                {
                    "title": { "CN": "车辆编号", "EN": "Vehicle Number", "TW": "車輛編號" }[language["language"]],
                    "key": "number",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": { "CN": "车牌", "EN": "License Plate", "TW": "車牌" }[language["language"]],
                    "key": "plate",
                    "width": 100
                },
                {
                    "title": { "CN": "车辆类型", "EN": "Vehicle Type", "TW": "車輛類型" }[language["language"]],
                    "key": "type",
                    "width": 100
                },
                {
                    "title": { "CN": "归属公司", "EN": "Ownership Company", "TW": "歸屬公司" }[language["language"]],
                    "key": "company",
                    "width": 100
                },
                {
                    "title": { "CN": "车辆颜色", "EN": "Vehicle Color", "TW": "車輛顔色" }[language["language"]],
                    "key": "color",
                    "width": 100
                },
                {
                    "title": { "CN": "车辆品牌", "EN": "Vehicle Brand", "TW": "車輛品牌" }[language["language"]],
                    "key": "brand",
                    "width": 100
                },
                {
                    "title": { "CN": "操作", "EN": "Operation", "TW": "操作" }[language["language"]],
                    "key": "operation",
                    "width": 80,
                    "fixed": "right",
                    "render": function (h, params) {
                        return h("div", [
                            h("Icon", {
                                "props": {
                                    "type": "ios-trash-outline"
                                }
                            })
                        ]);
                    }
                }
            ],
            "searchDatas": [
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                },
                {
                    "number": "车辆编号",
                    "plate": "车牌",
                    "type": "车辆类型",
                    "company": "归属公司",
                    "color": "车辆颜色",
                    "brand": "车辆品牌",
                    "operation": "操作"
                }
            ]
            //#endregion
        },

        //#region  监听属性变化
        "watch": {
            "layerControl": function (value) {
                var self = this;
                var isBackground = (value.indexOf("background") != -1);
                var isSeat = (value.indexOf("seat") != -1);
                var isAlarm = (value.indexOf("alarm") != -1);
                var isVehicle = (value.indexOf("vehicle") != -1);
                var isdefens = (value.indexOf("defens") != -1);
                var isCamera = (value.indexOf("camera") != -1);

                self.mapContainer.layersInfo.airportPoint.setVisible(isBackground);
                self.mapContainer.layersInfo.airportLine.setVisible(isBackground);
                self.mapContainer.layersInfo.airportPolygo.setVisible(isBackground);

                self.mapContainer.layersInfo.seat.setVisible(isSeat);
                self.mapContainer.layersInfo.alarm.setVisible(isAlarm);
                self.mapContainer.layersInfo.vehicle.setVisible(isVehicle);
                self.mapContainer.layersInfo.defens.setVisible(isdefens);
                self.mapContainer.layersInfo.camera.setVisible(isCamera);
            }
        },
        //#endregion

        "methods": {
            // 刷新
            "refresh": function () {
                window.location.href = window.location.href;
            },
            //#region 基础方法
            // 初始化地图功能
            "init": function () {
                var self = this;

                // 创建地图容器，设置背景地图
                self.createdMap();

                // 创建机场图层
                self.createAirportLayer();

                // 创建各主要要素图层,如：机位，告警，车辆，摄像机，防区
                self.createFeatureLayer();

                // 添加摄像机POP
                self.createPop("addCamera", "camera");

                // 添加防区POP
                self.createPop("addDefensArea", "defens");

                // 添加控件
                self.createControls();

                // 添加GPS
                self.createdGPS();
            },
            // 创建地图
            "createdMap": function () {
                var self = this;

                self.mapContainer.map = new ol.Map({
                    "target": "map", // 地图容器div的id
                    "layers": [
                        new ol.layer.Tile({
                            "source": new ol.source.OSM()
                        })
                    ],
                    "view": new ol.View({
                        "center": [113.8077, 22.6286], // 地图初始化中心点
                        "zoom": 16, // 地图初始化显示级别
                        // "minZoom": 15, // 最小级别
                        // "maxZoom": 12, // 最大级别
                        "projection": "EPSG:4326"
                    })
                    // "loadTilesWhileAnimating": true // 加载碎片地图时开启动画效果
                });

                // 获取各类型对象的引用
                // 获取图层
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

            // 添加机场背景图层，初始化时不显示
            "createAirportLayer": function () {
                var self = this;

                self.mapContainer.layersInfo.airportPoint = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:surface_region&styles=&bbox=113.76931608,22.60251774,113.84250732,22.67499654&width=768&height=760&srs=EPSG:4326&format=application/openlayers"
                    })
                });
                self.mapContainer.layersInfo.airportLine = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:line_polyline&styles=&bbox=113.76640439999998,22.59093897,113.84873603999999,22.696465319999998&width=599&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                });
                self.mapContainer.layersInfo.airportPolygo = new ol.layer.Tile({
                    "visible": false,
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:point_position_point&styles=&bbox=113.786041,22.616661,113.824471,22.655542&width=759&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                });

                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportPoint);
                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportLine);
                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.airportPolygo);
            },
            // 创建各种要素图层
            "createFeatureLayer": function () {
                var self = this;

                function createLayer(type) {
                    self.mapContainer.sourceInfo[type] = new ol.source.Vector({
                        "features": []
                    });
                    self.mapContainer.layersInfo[type] = new ol.layer.Vector({
                        "source": self.mapContainer.sourceInfo[type]
                    });

                    self.mapContainer.map.addLayer(self.mapContainer.layersInfo[type]);
                }

                // 创建机位图层
                createLayer("seat");

                // 创建告警图层
                createLayer("alarm");

                // 创建车辆图层
                createLayer("vehicle");

                // 创建防区图层
                createLayer("defens");

                // 创建摄像机图层
                createLayer("camera");

                // 创建GPS图层
                createLayer("GPS");
            },
            // 创建Pop层
            "createPop": function (id, type) {
                var self = this;
                self.mapContainer.overlayInfo[type] = new ol.Overlay({
                    "element": document.getElementById(id),
                    "autoPan": true,
                    "positioning": "top-center",
                    "stopEvent": false,
                    "autoPanAnimation": {
                        "duration": 250
                    }
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
                        "coordinateFormat": ol.coordinate.createStringXY(4),
                        "projection": "EPSG:4326",
                        "className": "mousePositionInner",
                        "target": document.getElementById("mousePosition"),
                        "undefinedHTML": "&nbsp;"
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
                            new ol.layer.Tile({
                                "source": new ol.source.OSM({
                                    "url": "http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
                                })
                            })
                        ],
                        "collapseLabel": "\u00BB",
                        "label": "\u00AB",
                        "collapsed": false,
                        "view": new ol.View({
                            "center": [113.8077, 22.6286], // 地图初始化中心点
                            "zoom": 25, // 地图初始化显示级别
                            "projection": "EPSG:4326"
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
                // self.mapContainer.map.addControl(self.mapContainer.controlsInfo.fullScreen);
            },
            //#endregion

            // 设置自动获取焦点
            "autoFocus": function () {
                var self = this;
                $("body").find(".detailInfoModal input").on("click", function () {
                    $(this).focus();
                });
            },

            //#region 防区
            // 创建防区要素
            "createDefensFeature": function (areaRangeStr, id) {
                var self = this;
                var defensFeature = null;
                var currentFeature = self.mapContainer.sourceInfo.defens.getFeatureById(id);
                var coordinate = (function () {
                    var coorArr = areaRangeStr.replace(/\(/g, "[").replace(/\)/g, "]");
                    return [JSON.parse(coorArr)];
                }());

                if (!!currentFeature) {
                    self.mapContainer.sourceInfo.defens.removeFeature(currentFeature);
                }

                defensFeature = new ol.Feature({
                    "geometry": new ol.geom.Polygon(coordinate),
                    "name": "defens"
                });
                defensFeature.setId(id);
                self.mapContainer.sourceInfo.defens.addFeature(defensFeature);

                self.showDefensPopLayer(id, coordinate);
            },
            "setDefensRowData": function (item, index) {
                var self = this;
                self.defensAreaDetailInfo = self.defensList[index];
                self.defensAreaDetailInfo.remark = decodeURI(self.defensList[index]["remark"]);
                self.defensAreaDetailInfo.opType = 2;
                self.createDefensFeature(self.defensList[index]["areaRange"]["value"], self.defensList[index]["id"]);
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
                    self.defensPageInfo.pageNum = 0;
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
                            }
                        }
                    });
                }, 500);
            },
            // 页数改变的时候
            "defensPageSizeChange": function () {
                var self = this;
                self.defensPageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getDefensAreaList(false);
                }, 200);
            },
            // 选择一个防区
            "selectDefensArea": function (params) {
                var self = this;

                if (self.isDeleteDefens == false) {
                    self.defensAreaDetailInfo = self.defensList[params.index];
                    self.isAddDefensDetailInfo = false;
                    setTimeout(function () {
                        self.isAddDefensDetailInfo = true;
                        self.mapContainer.overlayInfo.defens.setPosition([[[113.80963683128357, 22.631996870040894], [113.8097870349884, 22.62787699699402], [113.80701899528503, 22.6288640499115], [113.80738377571106, 22.63058066368103], [113.8082206249237, 22.631481885910034], [113.80963683128357, 22.631996870040894]]]);
                        self.autoFocus();
                    }, 200);
                }
            },
            // 显示防区弹出层
            "showDefensPopLayer": function (featureId, coordinate) {
                var self = this;
                for (var d = 0, dlen = self.defensList.length; d < dlen; d++) {
                    if (featureId == self.defensList[d]["id"]) {
                        self.defensAreaDetailInfo = self.defensList[d];
                        break;
                    }
                }
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
                        "deptId": self.defensAreaDetailInfo.deptId, // 部门ID，可选
                        "areaName": encodeURI(self.defensAreaDetailInfo.areaName), // 防区名称
                        "areaCode": encodeURI(self.defensAreaDetailInfo.areaCode), // 防区编码
                        "secureStatus": self.defensAreaDetailInfo.secureStatus, // 防区状态：701：草稿 702：布防 703：撤防 704：无效
                        "areaRangeStr": self.defensAreaDetailInfo.areaRangeStr, // 防区位置坐标的字符串，格式为122.13337670595,37.543569056875;122.12651025087,37.473874537832,
                        "speedLimit": self.defensAreaDetailInfo.speedLimit, // 行驶速度限制上限（米/秒）
                        "staySecond": self.defensAreaDetailInfo.staySecond, // 最大允许停留时长(单位秒)
                        "remark": encodeURI(self.defensAreaDetailInfo.remark), // 备注
                        "createUserId": self.defensAreaDetailInfo.createUserId, // 创建用户ID，新增时必传
                        "modifyUserId": self.defensAreaDetailInfo.modifyUserId, // 修改用户ID，修改时必传
                    }, // self.defensAreaDetailInfo,
                    successCallback: function (data) {
                        if (data.code == 200) {
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
            "createCameraFeature": function (coordinate) {
                var self = this;
                var cameraFeature = null;
                var len = self.mapContainer.sourceInfo.camera.getFeatures().length;
                var featureId = "camera_" + (len + 1);
                var featureName = "camera";

                if (self.isAddCameraAction) {
                    cameraFeature = new ol.Feature({
                        "geometry": new ol.geom.Point(coordinate),
                        "name": featureName
                    });
                    cameraFeature.setId(featureId);
                    cameraFeature.setStyle(new ol.style.Style({
                        "image": new ol.style.Icon({
                            "anchor": [0.5, 0.5],
                            "anchorOrigin": "top-right",
                            "anchorXUnits": "fraction",
                            "anchorYUnits": "pixels",
                            "offsetOrigin": "top-right",
                            "opacity": 0.75,
                            "src": "/airport/assets/img/camera.png"
                        })
                    }));
                    self.mapContainer.sourceInfo.camera.addFeature(cameraFeature);

                    self.isAddCameraAction = false;
                    self.mapContainer.featrueInfo.clickId = featureId;
                    self.mapContainer.featrueInfo.clickName = featureName;

                    // 添加完摄像机后，显示摄像机详细信息层
                    self.showCameraPopLayer(featureId, coordinate);
                }
            },
            // 显示摄像机弹出层
            "showCameraPopLayer": function (featureId, coordinate) {
                var self = this;
                // 添加pop层
                self.isAddcameraDetailInfo = false;
                self.cameraDetailInfo = (function () {
                    var detailInfo = {
                        "featureId": featureId,
                        "coordinate": coordinate,
                        "name": "",
                        "describe": "",
                        "rtsp": "",
                        "direction": "",
                        "raduis": "",
                        "view": ""
                    };
                    for (var i = 0, len = self.camersDatas.length; i < len; i++) {
                        if (self.camersDatas[i]["featureId"] == featureId) {
                            detailInfo = self.camersDatas[i];
                            break;
                        }
                    }
                    return detailInfo;
                })();
                setTimeout(function () {
                    self.isAddcameraDetailInfo = true;
                    self.mapContainer.overlayInfo.camera.setPosition(coordinate);
                    self.autoFocus();
                }, 500);
            },
            // 选择一个摄像机
            "selectCamera": function (event) {
                var self = this;
                var coordinate = null;

                if (self.isDeleteCamera == false) {
                    coordinate = event.coordinate;
                    self.cameraDetailInfo = event;
                    self.isAddcameraDetailInfo = false;
                    setTimeout(function () {
                        self.isAddcameraDetailInfo = true;
                        self.mapContainer.overlayInfo.camera.setPosition(coordinate);
                        self.autoFocus();
                    }, 200);
                }
            },
            // 删除摄像机
            "deleteCamera": function (event) {
                var self = this;
                var selectFeature = null;
                var featureId = self.cameraDetailInfo.featureId;

                self.cameraDetailInfo = {
                    "featureId": null,
                    "coordinate": null,
                    "name": "",
                    "describe": "",
                    "rtsp": "",
                    "direction": "",
                    "raduis": "",
                    "view": ""
                };
                self.isAddcameraDetailInfo = false;
                selectFeature = self.mapContainer.sourceInfo.camera.getFeatureById(featureId);
                self.mapContainer.sourceInfo.camera.removeFeature(selectFeature);

                // 删除表格行
                for (var i = 0, len = self.camersDatas.length; i < len; i++) {
                    if (self.camersDatas[i]["featureId"] == featureId) {
                        self.camersDatas.splice(i, 1);
                        break;
                    }
                }
                setTimeout(function () {
                    self.deleteLoading = false;
                    self.isDeleteCamera = false;
                }, 500);
            },
            // 把摄像机数据提交到服务器
            "uploadCameraDetailInfoToServer": function () {
                var self = this;
                self.camersDatas.push(self.cameraDetailInfo);
                self.addLoading = !self.addLoading;
                self.isAddcameraDetailInfo = !self.isAddcameraDetailInfo;

                setTimeout(function () {
                    self.addLoading = !self.addLoading;
                }, 500);
            },
            //#endregion

            // 显示 Modal
            "showModal": function (type) {
                var self = this;
                for (var key in self.modal) {
                    self.modal[key] = false;
                }
                self.modal[type] = true;
            },

            //#region 车辆管理
            // 格式化车辆信息
            "formatVehicle": function () {
                var self = this;
                for (var i = 0, len = self.vehicleList.length; i < len; i++) {
                    self.vehicleDatas({
                        "number": self.vehicleList[i]["vehicleCode"], //"编号",
                        "vehicleName": self.vehicleList[i]["vehicleName"], //"车牌",
                        "state": (function () {
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
            // 获取车辆信息
            "getVehicleList": function (bool) {
                var self = this;
                // 如果是查询，则重新从第一页开始
                if (bool == true) {
                    self.vehicleDatas = [];
                    self.vehiclePageInfo.pageNum = 0;
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
                self.vehiclePageInfo.pageNum = parseInt(value, 10) - 1;
                setTimeout(function () {
                    self.getVehicleList(false);
                }, 200);
            },
            //#endregion

            //#region GPS 定位
            "createdGPS": function () {
                var self = this;
                self.mapContainer.geolocationInfo.GPS = new ol.Geolocation({
                    "projection": self.mapContainer.viewInfo.view.getProjection(),
                    "trackingOptions": {
                        "maximumAge": 10000,
                        "enableHighAccuracy": true,
                        "timeout": 600000
                    }
                });
                self.mapContainer.geolocationInfo.GPS.setTracking(true); // 启动位置跟踪

                console.log(self.mapContainer.geolocationInfo.GPS);

                self.createdPositionFeature();
                self.createdAccuracyFreature();

                self.mapContainer.geolocationInfo.GPS.on("error", function (error) {
                    console.log(error.message);
                });

            },
            // 创建矢量点
            "createdPositionFeature": function () {
                var self = this;
                var positionFeature = new ol.Feature();
                positionFeature.setStyle(new ol.style.Style({
                    "image": new ol.style.Circle({
                        "raduis": 6,
                        "fill": new ol.style.Fill({
                            "color": "#3399cc"
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": "#fff",
                            "width": 2
                        })
                    })
                }));
                self.mapContainer.sourceInfo.GPS.addFeature(positionFeature);

                self.mapContainer.geolocationInfo.GPS.on("change:position", function () {
                    var coordinates = self.mapContainer.geolocationInfo.GPS.getPosition();
                    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
                });
            },
            // 创建矢量圆
            "createdAccuracyFreature": function () {
                var self = this;
                var accuracyFeature = new ol.Feature();
                self.mapContainer.sourceInfo.GPS.addFeature(accuracyFeature);
                self.mapContainer.geolocationInfo.GPS.on("change:accuracyGeometry", function () {
                    accuracyFeature.setGeometry(self.mapContainer.geolocationInfo.GPS.getAccuracyGeometry());
                });
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
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            // 初始化地图数据
            setTimeout(function () {
                self.init();

                // 获取车辆信息
                self.getVehicleList(true);

                // 获取防区
                self.getDefensAreaList(true);

                // 获取公司
                self.getCompanyList();

                self.mapContainer.map.on("click", function (event) {
                    var coordinate = event.coordinate;
                    var nodeName = event.originalEvent.target.nodeName.toLowerCase();
                    var clickFeature = self.mapContainer.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
                        return feature;
                    });

                    // 先判断点击的地方有没有要素，如果没有，则设置要素
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
                            default:
                                console.log(clickFeature);
                        }

                    } else {
                        // 添加摄像机
                        self.createCameraFeature(coordinate);
                    }
                });
            }, 2000);
        }
    });

}())
