(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "deleteLoading": false,
            "addLoading": false,
            "language": !!language ? language["language"] : "CN",

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
                    "camera": null // 摄像机
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
            "vehicleDatas": [
                {
                    "number": "编号",
                    "plate": "车牌",
                    "state": "状态",
                },
                {
                    "number": "编号",
                    "plate": "车牌",
                    "state": "状态",
                },
                {
                    "number": "编号",
                    "plate": "车牌",
                    "state": "状态",
                },
                {
                    "number": "编号",
                    "plate": "车牌",
                    "state": "状态",
                },
                {
                    "number": "编号",
                    "plate": "车牌",
                    "state": "状态",
                }
            ],
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
            "defensAreaDetailInfo": {
                "featureId": null,
                "coordinate": null,
                "name": "",
                "protection": "",
                "speed": ""
            },
            "defensColumns": [
                {
                    "title": { "CN": "名称", "EN": "Name", "TW": "名稱" }[language["language"]],
                    "key": "name"
                },
                {
                    "title": { "CN": "布防", "EN": "protection", "TW": "布防" }[language["language"]],
                    "key": "protection"
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
                                }
                            }, { "CN": "删除", "EN": "Delete", "TW": "删除" }[language["language"]])
                        ]);
                    }
                }
            ],
            "defensDatas": [],
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

        //#region 
        // 监听属性变化
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
                        "center": [113.8045, 22.6428], // 地图初始化中心点
                        "zoom": 13, // 地图初始化显示级别
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
                        // "view": self.mapContainer.viewInfo.view
                    });
                }

                // 全屏显示控件
                if (!self.mapContainer.controlsInfo.fullScreen) {
                    self.mapContainer.controlsInfo.fullScreen = new ol.control.FullScreen();
                }

                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.mousePosition);
                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.scaleLine);
                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.overviewMap);
                self.mapContainer.map.addControl(self.mapContainer.controlsInfo.fullScreen);
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

                    // 设置当前绘制防区详细信息
                    self.showDefensPopLayer(featureId, coordinate);

                    // 删除绘制控件
                    self.deleteDefensAction();
                }, this);
            },
            // 选择一个防区
            "selectDefensArea": function (event) {
                var self = this;
                var coordinate = null;

                if (self.isDeleteDefens == false) {
                    coordinate = event.coordinate;
                    self.defensAreaDetailInfo = event;
                    self.isAddDefensDetailInfo = false;
                    setTimeout(function () {
                        self.isAddDefensDetailInfo = true;
                        self.mapContainer.overlayInfo.defens.setPosition(coordinate);
                        self.autoFocus();
                    }, 200);
                }
            },
            // 显示防区弹出层
            "showDefensPopLayer": function (featureId, coordinate) {
                var self = this;
                // 添加pop层
                self.isAddDefensDetailInfo = false;
                self.defensAreaDetailInfo = (function () {
                    var detailInfo = {
                        "featureId": featureId,
                        "coordinate": coordinate,
                        "name": "",
                        "protection": "",
                        "speed": ""
                    };
                    for (var i = 0, len = self.defensDatas.length; i < len; i++) {
                        if (self.defensDatas[i]["featureId"] == featureId) {
                            detailInfo = self.defensDatas[i];
                            break;
                        }
                    }
                    return detailInfo;
                })();
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
                var featureId = self.defensAreaDetailInfo.featureId;

                self.defensAreaDetailInfo = {
                    "featureId": null,
                    "coordinate": null,
                    "name": "",
                    "protection": "",
                    "speed": ""
                };
                self.isAddDefensDetailInfo = false;
                selectFeature = self.mapContainer.sourceInfo.defens.getFeatureById(featureId);
                self.mapContainer.sourceInfo.defens.removeFeature(selectFeature);

                // 删除表格行
                for (var i = 0, len = self.defensDatas.length; i < len; i++) {
                    if (self.defensDatas[i]["featureId"] == featureId) {
                        self.defensDatas.splice(i, 1);
                        break;
                    }
                }
                setTimeout(function () {
                    self.deleteLoading = false;
                    self.isDeleteDefens = false;
                }, 500);
            },
            // 把把防区信息提交到服务器
            "uploadDefensAreaDetailInfoToServer": function () {
                var self = this;

                self.defensDatas.push(self.defensAreaDetailInfo);
                setTimeout(function () {
                    self.isAddDefensDetailInfo = false;
                    self.addLoading = false;
                }, 500);

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
                self.modal[type] = !self.modal[type];
            }
        },
        "created": function () {
            var self = this;

            // 判断是否已经登录，如果没有登录，则直接退出到登录页面
            utility.isLogin(false);

            // 初始化地图数据
            setTimeout(function () {
                self.init();

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
