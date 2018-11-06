(function () {
    var language = utility.getLocalStorage("language");
    var userInfo = utility.getLocalStorage("userInfo");
    var pageVue = new Vue({
        "el": "#js-vue",
        "data": {
            "language": !!language ? language["language"] : "CN",
            "mapContainer": {
                "map": null,
                "viewInfo": {
                    "view": null,
                    "zoom": null,
                    "center": null,
                    "rotation": null,
                }, 
                "layersInfo": {
                    "layer": null,
                    "OSM": null,
                    "WMS": null,
                },
                "sourceInfo": {
                    "draw": null,
                    "markerVector": null
                },
                "controlsInfo": {
                    "mousePosition": null, // 鼠标位置
                    "scaleLine": null, // 比例尺
                    "overviewMap": null,
                    "fullScreen": null
                },
                "interactionInfo": {
                    "type": "None",
                    "draw": null
                },
                "featrueInfo": {
                    "gpsAccuracy": null,
                    "gpsPosition": null
                },
                "geolocationInfo": {
                    "geolocation": null,
                    "params": {
                        "tracking": false,
                        "errorInfo": ""
                    }
                },
                "overlayInfo": {
                    "gpsFeature": null
                },
                "geometryInfo": {
                    
                }
            },
            "modal": {
                "isVehicle": false,
                "isHistory": false,
                "isDefense": false,
                "isCamera": false,
                "isLayer": false,
                "isAlarm": false,
                "isSearch": false
            },
            "vehicleColumns" : [
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
            "vehicleDatas" : [
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
            "historyColumns" : [],
            "historyDatas" : [],
            "defensColumns" : [
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
                    "render": function(h, params) {
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
            "defensDatas" : [
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "protection": "布防",
                    "operation": "操作"
                },
            ],
            "cameraColumns" : [
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
                    "render": function(h, params) {
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
            "camersDatas" : [
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                },
                {
                    "name": "名称",
                    "describe": "描述",
                    "rtsp": "rtsp",
                    "": "方向",
                    "raduis": "半径",
                    "view": "视野角度",
                    "operation": "操作"
                }
            ],
            "layerColumns" : [],
            "layerDatas" : [],
            "alarmColumns" : [],
            "alarmDatas" : [],
            "searchColumns" : [
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
                    "render": function(h, params) {
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
            "searchDatas" : [
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
        },
        "watch": {
            
        },
        "methods": {
            // 初始化地图功能
            "init": function () {
                var self = this;
                var controls = self.generateControl();

                // 创建地图容器
                self.createdMap();

                // 添加图层
                self.addWMSLayer();

                // 获取各类型对象的引用
                self.getObjectType();

                // 添加控件
                self.addControls(self.mapContainer.controlsInfo);
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
            },

            // 添加图层
            "addWMSLayer": function () {
                var self = this;
                self.mapContainer.map.addLayer(new ol.layer.Tile({
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:surface_region&styles=&bbox=113.76931608,22.60251774,113.84250732,22.67499654&width=768&height=760&srs=EPSG:4326&format=application/openlayers"
                    })
                }));
                self.mapContainer.map.addLayer(new ol.layer.Tile({
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:line_polyline&styles=&bbox=113.76640439999998,22.59093897,113.84873603999999,22.696465319999998&width=599&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                }));
                self.mapContainer.map.addLayer(new ol.layer.Tile({
                    "source": new ol.source.TileWMS({
                        "url": "http://43.247.68.26:9090/geoserver/sz/wms?service=WMS&version=1.1.0&request=GetMap&layers=sz:point_position_point&styles=&bbox=113.786041,22.616661,113.824471,22.655542&width=759&height=768&srs=EPSG:4326&format=application/openlayers"
                    })
                }));
            },
            // 添加控件
            "addControls": function (controls) {
                var self = this;
                self.mapContainer.map.addControl(controls["mousePosition"]);
                self.mapContainer.map.addControl(controls["scaleLine"]);
                self.mapContainer.map.addControl(controls["overviewMap"]);
                self.mapContainer.map.addControl(controls["fullScreen"]);
            },
            // 添加标注
            "addOverlays": function () {
                var self = this;
            },
            // 获取各类型对象的引用
            "getObjectType": function () {
                var self = this;

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
            // 生成各类型控件
            "generateControl": function () {
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

                return self.mapContainer.controlsInfo;
            },
            // 生成绘制图层
            "setdrawVectorLayer": function () {
                var self = this;
                self.mapContainer.sourceInfo.draw = new ol.source.Vector({ "wrapX": false });
                self.mapContainer.layersInfo.drawVector = new ol.layer.Vector({
                    "source": self.mapContainer.sourceInfo.draw,
                    "style": new ol.style.Style({
                        "fill": new ol.style.Fill({
                            "color": "rgba(255,255,255,.2)"
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": "#ffcc33",
                            "width": 2
                        }),
                        "image": new ol.style.Circle({
                            "radius": 7,
                            "fill": new ol.style.Fill({
                                "color": "#ffcc33"
                            })
                        })
                    })
                });

                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.drawVector);
            },
            // 绘制
            "doDrawAction": function () {
                var self = this;
                var geometryFunction, maxPosition;

                self.mapContainer.map.removeInteraction(self.mapContainer.interactionInfo.draw);

                if (self.mapContainer.interactionInfo.type != "None") {

                    if (self.mapContainer.sourceInfo.draw == null) {
                        self.mapContainer.sourceInfo.draw = new ol.source.Vector({ "wrapX": false });
                        self.mapContainer.layersInfo.draw.setSource(self.mapContainer.sourceInfo.draw);
                    }

                    if (self.mapContainer.interactionInfo.type == "Square") {
                        self.mapContainer.interactionInfo.type = "Circle";
                        // 设置几何图形变更函数，即创建正多边形
                        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                    } else if (self.mapContainer.interactionInfo.type == "Box") {
                        self.mapContainer.interactionInfo.type = "LineString";
                        maxPosition = 2;
                        // 设置几何图形变更函数，即设置长方形的坐标点
                        geometryFunction = function (coordinates, geometry) {
                            if (!geometry) {
                                geometry = new ol.geom.Polygon(null); // 多边形
                            }
                            var start = coordinates[0];
                            var end = coordinates[1];

                            geometry.setCoordinates([
                                [start, [start[0], end[1]], end, [end[0], start[1]], start]
                            ]);

                            return geometry;
                        }
                    }

                    self.mapContainer.interactionInfo.draw = new ol.interaction.Draw({
                        "source": self.mapContainer.sourceInfo.draw,
                        "type": self.mapContainer.interactionInfo.type,
                        "geometryFunction": geometryFunction,
                        "maxPosition": maxPosition
                    });

                    self.mapContainer.map.addInteraction(self.mapContainer.interactionInfo.draw);
                } else {
                    self.mapContainer.sourceInfo.draw = null;
                    self.mapContainer.layersInfo.draw.setSource(self.mapContainer.sourceInfo.draw);
                }
            },
            // 设置图形样式
            "setGeomtryStyle": function (featrue) {
                var self = this;
                var style = self.mapContainer.geometryInfo.style;
                var type = self.mapContainer.geometryInfo.type;

                return new ol.style.Style({
                    "image": new ol.style.Circle({
                        "radius": parseInt(style[type].radius, 10),
                        "fill": new ol.style.Fill({
                            "color": style[type].fillColor,
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": style[type].strokeColor,
                            "width": parseInt(style[type].strokeWidth, 10)
                        })
                    }),
                    "text": new ol.style.Text({
                        "textAlign": style[type].align,
                        "textBaseline": style[type].baseline,
                        "font": style[type].fontFamily,
                        "text": featrue.get("name"),
                        "fill": new ol.style.Fill({
                            "color": style[type].fillColor
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": style[type].outlineColor,
                            "width": parseInt(style[type].outlineWidth, 10)
                        }),
                        "offsetX": parseInt(style[type].offsetX, 10),
                        "offsetY": parseInt(style[type].offsetY, 10),
                        "rotation": parseInt(style[type].rotation, 10)
                    })
                });
            },
            // 画点图层
            "drawPointLayer": function () {
                var self = this;
                var feature = new ol.Feature({
                    "geometry": new ol.geom.Point([0, 0]),
                    "name": "Point Feature"
                });

                self.mapContainer.layersInfo.point = new ol.layer.Vector({
                    "source": new ol.source.Vector({
                        "features": [feature]
                    }),
                    "style": self.setGeomtryStyle(feature)
                });

                return self.mapContainer.layersInfo.point;
            },
            // 画线图层
            "drawLineLayer": function () {
                var self = this;
                var feature = new ol.Feature({
                    "geometry": new ol.geom.LineString([1e7, 1e6], [1e6, 3e6]),
                    "name": "Line Feature"
                });

                self.mapContainer.layersInfo.line = new ol.layer.Vector({
                    "source": new ol.source.Vector({
                        "features": [feature]
                    }),
                    "style": self.setGeomtryStyle(feature)
                });

                return self.mapContainer.layersInfo.line;
            },
            // 画面图层
            "drawPolygonLayer": function () {
                var self = this;
                var feature = new ol.Feature({
                    "geometry": new ol.geom.Polygon([1e6, -1e6], [1e6, 3e6], [3e6, 1e6], [3e6, -1e6], [1e6, -1e6]),
                    "name": "Polygon Feature"
                });

                self.mapContainer.layersInfo.polygon = new ol.layer.Vector({
                    "source": new ol.source.Vector({
                        "features": [feature]
                    }),
                    "style": self.setGeomtryStyle(feature)
                });

                return self.mapContainer.layersInfo.polygon;
            },
            // 画各种图层
            "drawAllLaryer": function () {
                var self = this;

                self.mapContainer.map.addLayer(self.drawPointLayer());
                self.mapContainer.map.addLayer(self.drawLineLayer());
                self.mapContainer.map.addLayer(self.drawPolygonLayer());
            },
            // 创建标记样式
            "createMarkStyle": function (feature) {
                var self = this;

                return new ol.style.Style({
                    "image": new ol.style.Icon({
                        "anchor": [0.5, 60],
                        "anchorOrigin": "top-right",
                        "anchorXUnits": "fraction",
                        "anchorYUnits": "pixels",
                        "offsetOrigin": "top-right",
                        "offset": [0, 10],
                        "scale": 0.5,
                        "opacity": 0.75,
                        "src": "./img/icons/icon09.png"
                    }),
                    "text": new ol.style.Text({
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "font": "normal 14px 微软雅黑",
                        "text": feature.get("name"),
                        "fill": new ol.style.Fill({
                            "color": "#aa3300",
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": "#ffcc33",
                            "width": 2
                        })
                    })
                })
            },
            // 1: 通过矢量图层添加标记
            "addOverlayerByVector": function () {
                var self = this;
                var shenzhen = ol.proj.fromLonLat([113.8045, 22.6428]);
                var iconFeature = new ol.Feature({
                    "geometry": new ol.geom.Point(shenzhen),
                    "name": "深圳宝安机场", // 名称属性
                    "population": 2115 // 人口
                });

                iconFeature.setStyle(self.createMarkStyle(iconFeature));

                // 矢量标注的数据源
                self.mapContainer.sourceInfo.markerVector = new ol.source.Vector({
                    "features": [iconFeature]
                });

                // 矢量标图层
                self.mapContainer.layersInfo.markerVector = new ol.layer.Vector({
                    "source": self.mapContainer.sourceInfo.markerVector
                });

                self.mapContainer.map.addLayer(self.mapContainer.layersInfo.markerVector);
            },

            // 2: 通过叠加添加标注
            "addOverlayerByOverlayer": function () {
                var self = this;
                var shenzhen = ol.proj.fromLonLat([113.8045, 22.6428]);
                var marker = new ol.Overlay({
                    "position": shenzhen,
                    "positioning": "center-center",
                    "element": document.getElementById("marker"),
                    "stopEvent": false
                });

                self.mapContainer.map.addOverlay(marker);
                marker.getElement().innerHtml = "深圳宝安机场";
                var text = new ol.Overlay({
                    "position": shenzhen,
                    "element": document.getElementById("address"),
                });
                self.mapContainer.map.addOverlay(text);
                text.getElement().innerText = marker.getElement().title;
            },
            // 为地图容器设置点击事件
            "setMapClickEvent": function () {
                var self = this;

                self.mapContainer.map.on("click", function (event) {
                    var point = event.coordinate;
                    if (self.mapContainer.interactionInfo.type == "None") {
                        var newFeature = new ol.Feature({
                            "geometry": new ol.geom.Point(point),
                            "name": "标注点"
                        });
                        newFeature.setStyle(self.createMarkStyle(newFeature));
                        self.mapContainer.sourceInfo.markerVector.addFeature(newFeature);
                    }
                });
            },
            // 初始化定位导航
            "initGeolocation": function () {
                var self = this;

                // 创建定位控件
                self.createdGeolocation();

                // 绑定位置事件
                self.bindGeolacationEvent();

                // 精确模式定位
                self.addAccuracyFeature();

                // 添加定位点要素
                self.addPositionFeature();

                // 创建位置矢量图
                self.createdPositionVector();
            },
            // 创建定位导航控件
            "createdGeolocation": function () {
                var self = this;

                self.mapContainer.geolocationInfo.geolocation = new ol.Geolocation({
                    "projection": self.mapContainer.viewInfo.view.getProjection(), // 设置参考系
                    // 追踪参数
                    "trackingOptions": {
                        "maxnumAgs": 10000, // 最大周期
                        "enableHighAccuracy": true, // 启用高数度
                        "timeout": 600000 // 超时
                    }
                });
            },
            // 绑定位置事件
            "bindGeolacationEvent": function () {
                var self = this;

                // 添加定位控件的位置变更事件(更新面板的导航位置信息)
                self.mapContainer.geolocationInfo.geolocation.on("change", function (event) {
                    self.mapContainer.geolocationInfo.params.accuracy = self.mapContainer.geolocationInfo.geolocation.getAccuracy() + '[m]';
                    self.mapContainer.geolocationInfo.params.altitude = self.mapContainer.geolocationInfo.geolocation.getAltitude() + '[m]';
                    self.mapContainer.geolocationInfo.params.altitudeAccuracy = self.mapContainer.geolocationInfo.geolocation.getAltitudeAccuracy() + '[m]';
                    self.mapContainer.geolocationInfo.params.heading = self.mapContainer.geolocationInfo.geolocation.getHeading() + '[rad]';
                    self.mapContainer.geolocationInfo.params.speed = self.mapContainer.geolocationInfo.geolocation.getSpeed() + '[m/s]';
                });

                // 定位错误事件处理
                self.mapContainer.geolocationInfo.geolocation.on("error", function (error) {
                    self.mapContainer.geolocationInfo.params.errorInfo = error.message;
                });
            },
            // 精确模式定位点要素(在一定分辨率下显示)
            "addAccuracyFeature": function () {
                var self = this;

                self.mapContainer.featrueInfo.accuracy = new ol.Feature();
                self.mapContainer.geolocationInfo.geolocation.on("change:accuracyGeometry", function () {
                    self.mapContainer.featrueInfo.accuracy.setGeometry(self.mapContainer.geolocationInfo.geolocation.getAccuracyGeometry());
                });
            },
            // 添加定位点要素
            "addPositionFeature": function () {
                var self = this;

                self.mapContainer.featrueInfo.position = new ol.Feature();
                self.mapContainer.featrueInfo.position.setStyle(new ol.style.Style({
                    "image": new ol.style.Circle({
                        "radius": 6,
                        "fill": new ol.style.Fill({
                            "color": "#3399cc"
                        }),
                        "stroke": new ol.style.Stroke({
                            "color": "#fff",
                            "width": 2
                        })
                    })
                }));

                self.mapContainer.geolocationInfo.geolocation.on("change:position", function () {
                    var coordinate = self.mapContainer.geolocationInfo.geolocation.getPosition();
                    self.mapContainer.featrueInfo.position.setGeometry(coordinate ? new ol.geo.Point(coordinate) : null);
                });
            },
            // 创建定位点矢量图
            "createdPositionVector": function () {
                var self = this;

                self.mapContainer.layersInfo.geolocation = new ol.layer.Vector({
                    "source": new ol.source.Vector({
                        "features": [self.mapContainer.featrueInfo.accuracy, self.mapContainer.featrueInfo.position]
                    })
                });
            },
            // 显示 Modal
            "showModal": function(type) {
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
            }, 2000);
        }
    });

}())
