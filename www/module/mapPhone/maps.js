(function () {
	var language = utility.getLocalStorage("language");
	var airPort = utility.getLocalStorage("airPort");
	var userInfo = utility.getLocalStorage("userInfo");
	var bizParam = utility.getLocalStorage("bizParam");
	var userFuncList = utility.getLocalStorage("userFuncList");
	// 用户权限
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
	Vue.use(VueBaiduMap.default, {
		ak: 'eCaU3zoABU2Ggtuc8vAoTrkc'
	});

	// Vue.use(VueBaiduMap.BmlMarkerClusterer);

	window.pageVue = new Vue({
		"el": "#js-vue",
		"components": {
			"bml-marker-clusterer": VueBaiduMap.BmlMarkerClusterer
		},
		"data": {
			"functionInfo": functionInfo,
			"isShenZhen": false,
			"deleteLoading": false,
			"addLoading": false,
			"zoomNum": 0.00995467,
			"language": !!language ? language["language"] : "CN",
			"airPort": !!airPort ? [parseFloat(airPort.airPort.split(",")[0], 10), parseFloat(airPort.airPort.split(",")[1],
				10)] : [113.8077, 22.6286],
			"companyList": [],
			"departmentList": [],
			"userFuncList": userFuncList,
			"searchId": "",
			"searchCode": "",
			"openInfoWidth": 0,
			"openInfoHeight": 0,
			"isSlide": false,
			"myPosition": {
				icon: {
					url: CONFIG.HOST + "/airport/assets/img/pos_marker.png",
					size: {
						width: 19,
						height: 31
					}
				},
				position: {
					lng: 0,
					lat: 0,
				},
				animation: ""
			},

			//#region baiduMap
			"baiduMapInfo": {
				BMap: null,
				map: null,
				mapType: "BMAP_HYBRID_MAP", //"BMAP_NORMAL_MAP", //"BMAP_HYBRID_MAP", // 此地图类型展示卫星视图: BMAP_SATELLITE_MAP 此地图类型展示卫星和路网的混合视图: BMAP_HYBRID_MAP
				center: {
					lng: 0,
					lat: 0
				},
				zoom: 18,
				overviewMapControl: null,
				speed: 60,
				vehicleMarkers: {},
				markerClusterer: null,
				openInfoWindow: {
					type: "",
					show: false,
					show: false,
					position: {
						lng: 0,
						lat: 0
					},
				},
				animationInfo: {
					timeInterval: null,
					coordinates: [],
					trajectoryInfo: [],
					curveInfo: [], // 轨迹线
					pointInfo: [], // 轨迹点
					zeroPointInfo: [],
					startPoint: {
						url: CONFIG.HOST + "/airport/assets/img/start.png",
						size: {
							width: 30,
							height: 42
						}
					},
					endPoint: {
						url: CONFIG.HOST + "/airport/assets/img/end.png",
						size: {
							width: 30,
							height: 42
						}
					},
					moveVehicle: null,
					speed: 90,
					trajectoryItem: {
						"time": "",
						"speed": "",
						"coordinate": [],
						"position": {
							lng: 0,
							lat: 0
						},
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
				camera: {},
				cameraClusterer: null,
				cameraMarkers: [],
				defensList: {},
				defensPath: [],
				isCloseDefensPath: false,
				defensPathEdit: true,
				layersInfo: {
					isSeat: true,
					isAlarm: true,
					isVehicle: true,
					isDefense: true,
					isCamera: true,
				}
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
			"vehicleColumns": [{
					"title": {
						"CN": "名称",
						"EN": "Name",
						"TW": "名稱"
					} [language["language"]],
					"key": "vehicleName"
				},
				{
					"title": {
						"CN": "类型",
						"EN": "Type",
						"TW": "類型"
					} [language["language"]],
					"key": "vehicleTypeId"
				},
				{
					"title": {
						"CN": "编码",
						"EN": "Code",
						"TW": "編碼"
					} [language["language"]],
					"key": "vehicleCode"
				},
				{
					"title": {
						"CN": "状态",
						"EN": "State",
						"TW": "狀態"
					} [language["language"]],
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
				"endTime": "", // 查询结束时间
				"id": "", // 车辆ID
				"beginTime": "", // 查询开始时间
				"lastGpsTime": "",
				"vehicleCode": "", // 车辆编码
				"licenseNumber": "", // 车牌号
				"gpsDeviceCode": "", // 定位终端编号
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
			"defensColumns": [{
					"title": {
						"CN": "名称",
						"EN": "Name",
						"TW": "名稱"
					} [language["language"]],
					"key": "areaName",
					"width": 125
				},
				{
					"title": {
						"CN": "编码",
						"EN": "Code",
						"TW": "編碼"
					} [language["language"]],
					"key": "areaCode",
					"width": 125
				}
			],
			"defensDatas": [],
			"defensList": [],
			"defensColor": {
				"_701": { // 草稿
					fill: "rgb(4, 159, 228)",
					stroke: "rgb(33, 121, 160)",
				},
				"_702": { // 布防
					fill: "rgb(255, 0, 0)",
					stroke: "rgba(5, 174, 253)",
				},
				"_703": { // 撤防
					fill: "rgb(255, 173, 51)",
					stroke: "rgba(99, 71, 31)",
				},
				"_704": { // 无效
					fill: "rgb(180, 191, 195)",
					stroke: "rgba(122, 150, 162)",
				},
			},

			//#endregion

			//#region 摄像机
			"isAddCameraAction": false,
			"isAddcameraDetailInfo": false,
			"isDeleteCamera": false,
			"monitorStatusList": bizParam["monitorStatusId"], // 监控状态
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
			"cameraColumns": [{
					"title": {
						"CN": "名称",
						"EN": "Name",
						"TW": "名稱"
					} [language["language"]],
					"key": "cameraName",
					"width": 125
				},
				{
					"title": {
						"CN": "状态",
						"EN": "State",
						"TW": "狀態"
					} [language["language"]],
					"key": "monitorStatus",
					"width": 125
				}
			],
			"camersDatas": [],
			"cameraList": [],
			//#endregion

			//#region 告警
			"alarmColumns": [],
			"alarmDatas": [],
			//#endregion

			//#region 车辆查询
			"isSearchLoading": false,
			"vehicleUseStatusList": bizParam["vehicleUseStatus"], // 车辆使用状态
			"vehicleTypeInfo": (function () {
				var type = {};
				for (var i = 0, len = bizParam["vehicleType"].length; i < len; i++) {
					type[bizParam["vehicleType"][i]["name"]] = bizParam["vehicleType"][i]["type"] + "";
				}
				return type;
			}()),
			"searchColumns": [{
					"title": {
						"CN": "车牌号",
						"EN": "Plate No.",
						"TW": "車牌號"
					} [language["language"]],
					"key": "licenseNumber"
				},
				{
					"title": {
						"CN": "运动状态",
						"EN": "Vehicle State",
						"TW": "車輛狀態"
					} [language["language"]],
					"key": "vehicleStatus",
					"align": "center"
				}
			],
			"searchDatas": []
			//#endregion
		},
		//#endregion

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

				self.baiduMapInfo.layersInfo.isVehicle = isVehicle;
				self.baiduMapInfo.layersInfo.isCamera = isCamera;
				self.baiduMapInfo.layersInfo.isDefense = isDefense;
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
				for (var key in self.modal) {
					self.modal[key] = false;
				}
				self.modal[type] = true;
				self.isSlide = false;
			},
			// 显示侧边栏
			"showSlide": function () {
				var self = this;
				self.isSlide = !self.isSlide;
			},
			// 重置视图
			"resetView": function () {
				var self = this;
				self.baiduMapInfo.map.centerAndZoom(new BMap.Point(self.airPort[0], self.airPort[1]), 14);
			},

			// 获取公司列表
			"getCompanyList": function () {
				var self = this;
				utility.interactWithServer({
					appType: 1,
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
				var listInfo = JSON.stringify(list).replace(/id/g, 'value').replace(/deptName/g, 'label').replace(
					/subDeptList/g, 'children');
				self.departmentList = JSON.parse(listInfo);
			},

			// 获取部门信息
			"getDepartmentList": function (type) {
				var self = this;
				self.departmentList = [];
				utility.interactWithServer({
					appType: 1,
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

			// 关闭POP
			"openInfoWindowClose": function () {
				var self = this;
				self.baiduMapInfo.openInfoWindow.show = false;
				self.baiduMapInfo.openInfoWindow.type = "";
				self.isTrackItem = false;
				self.openInfoWidth = 0;
				self.openInfoHeight = 0;
				self.vehiclePositonPageInfo.licenseNumber = "";
				self.getAllVehiclePositonList();
				if (self.baiduMapInfo.animationInfo.pointInfo.length == 0) {
					self.isTrackItem = false;
					// self.drawAlVehicleByBaidu();
				}
			},

			// 切换地图类型
			"setLayerTypeNormal": function (event) {
				var self = this;
				self.baiduMapInfo.mapType = "BMAP_NORMAL_MAP";
			},
			"setLayerTypeHybrid": function (event) {
				var self = this;
				self.baiduMapInfo.mapType = "BMAP_HYBRID_MAP";
			},
			// 隐藏版权信息
			"hindBaiduCopyRight": function () {
				$("body").find(".anchorBL").css({
					display: "none"
				});
				$("body").find(".BMap_scaleCtrl").css({
					display: "block"
				});
			},

			//#region 地图操作
			// 当地图可用的时候
			"baiduMapHandle": function (baiduMap) {
				var self = this;
				self.baiduMapInfo.center.lng = self.airPort[0];
				self.baiduMapInfo.center.lat = self.airPort[1];
				self.baiduMapInfo.zoom = 14;

				self.baiduMapInfo.map = baiduMap.map;
				BMap = baiduMap.BMap;

				self.getAllVehiclePositonList(); // 获取所有实时车辆
				self.getCompanyList(); // 获取公司
				if (self.functionInfo.isCamera) {
					self.getCameraList(true); // 获取摄像机列表数据
				}
				if (self.functionInfo.isDefense) {
					self.getDefensAreaList(true); // 获取防区
				}

				self.getAllVehicleInterval();

				self.baiduMapInfo.overviewMapControl = new BMap.OverviewMapControl({
					isOpen: true,
					size: new BMap.Size(100, 80)
				});
				self.baiduMapInfo.map.addControl(self.baiduMapInfo.overviewMapControl);

				if ($('.radar')[0]) {
					new Radar($('.radar')[0]).init({
						scanSpeed: 2
					}); // 扫描的速度，单位为deg，必须为360的约数
				}

				setInterval(function () {
					// self.getMyLocation(false);
				}, 2000);
			},
			// zoomEnd
			"zoomEnd": function (option) {
				var self = this;
				if (!!self.baiduMapInfo.map) {
					if (self.baiduMapInfo.map.getZoom() == 16) {
						self.zoomNum = 0.00595467;
					} else if (self.baiduMapInfo.map.getZoom() == 17) {
						self.zoomNum = 0.00195467;
					} else if (self.baiduMapInfo.map.getZoom() == 18) {
						self.zoomNum = 0.00099867;
					} else if (self.baiduMapInfo.map.getZoom() == 19) {
						self.zoomNum = 0.00079867;
					}
				}
				self.isSlide = false;
			},
			// dragstart
			"dragstart": function () {
				var self = this;
				self.isSlide = false;
			},
			// 点击地图
			"baiduMapClick": function (option) {
				var self = this;
				self.isSlide = false;

				if (option.target.De.length > 0) {
					// self.baiduMapInfo.map.setZoom(19);
					// self.baiduMapInfo.map.panTo(new BMap.Point(option.point.lng, option.point.lat));
				}

				if (option.overlay == null) {
					// 如果是画摄像机
					if (self.isAddCameraAction == true) {

						if (self.baiduMapInfo.layersInfo.isCamera == false) {
							self.$Message.destroy();
							self.$Message.error("请在图层控制开启摄像机层");
							return;
						}
						self.cameraDetailInfo = {
							"id": "",
							"companyId": "", // 所属公司ID 
							"companyName": "", // 公司名称
							"deptId": "", // 部门ID，可选
							"deptIds": [], // 部门ID，可选
							"deptName": "", // 部门名称
							"cameraName": "", // 摄像机名称
							"cameraCode": "", // 摄像机编码
							"cameraDesc": "", // 摄像机描述
							"cameraPosition": JSON.stringify({
								"coordinates": [option.point.lng, option.point.lat]
							}),
							"cameraPositionStr": option.point.lng + "," + option.point.lat, // 位置坐标
							"radius": "", // 摄像头监控半径（单位米）
							"angle": "", // 视野角度
							"monitorStatus": "", // 摄像头监控状态：
							"remark": "", // 备注
							"rtspLiveUrl": "", // Rtsp直播地址
							"rtspHisUrl": "", // Rtsp录播地址
							"index": self.baiduMapInfo.cameraMarkers.length,
							"createUserId": userInfo["id"], // 创建用户ID，新增时必传
							"modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
						};

						self.createCameraFeature(self.cameraDetailInfo, function (id, coordinate) {
							self.baiduMapInfo.map.panTo(new BMap.Point(option.point.lng, option.point.lat));
							self.baiduMapInfo.openInfoWindow.position = {
								lng: option.point.lng,
								lat: option.point.lat,
							};
							self.openInfoWidth = 300;
							self.openInfoHeight = 0;
							self.baiduMapInfo.openInfoWindow.type = "isCameraPop";
							self.baiduMapInfo.openInfoWindow.show = true;
							self.isAddCameraAction = false;
						});
					} else if (self.isAddDefensAction == true) {
						if (self.baiduMapInfo.layersInfo.isDefense == false) {
							self.$Message.destroy();
							self.$Message.error("请在图层控制开启防区层");
							return;
						}
						self.baiduMapInfo.defensPath.push({
							lng: option.point.lng,
							lat: option.point.lat
						});

						if (self.baiduMapInfo.defensPath.length >= 3) {
							self.baiduMapInfo.isCloseDefensPath = true;
						} else {
							self.baiduMapInfo.isCloseDefensPath = false;
						}

						self.defensAreaDetailInfo = {
							"id": "",
							"opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
							"companyId": "",
							"fill": "#ffffff",
							"stroke": "blue",
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
						};

						var pathArr = [];
						var path = self.baiduMapInfo.defensPath;
						if (path.length > 0) {
							for (var i = 0, len = path.length; i < len; i++) {
								pathArr.push(self.convertorByBaiduToGPS([path[i].lng, path[i].lat]).join(","));
							}
							pathArr.push(pathArr[0]);
							self.defensAreaDetailInfo.areaRangeStr = pathArr.join(";");
						}
					}
				}
			},

			// 获取我的定位
			"getMyLocation": function (isPan) {
				var self = this;
				var statuInfo = {
					"_0": "检索成功",
					"_1": "城市列表",
					"_2": "位置结果未知",
					"_3": "导航结果未知",
					"_4": "非法密钥",
					"_5": "非法请",
					"_6": "没有权限",
					"_7": "服务不可用",
					"_8": "超时",
				};
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function (r) {
					if (this.getStatus() == 0) {

						self.myPosition.position.lng = r.point.lng;
						self.myPosition.position.lat = r.point.lat;
						self.myPosition.animation = BMAP_ANIMATION_BOUNCE;
						if (isPan == true) {
							self.baiduMapInfo.map.setZoom(19);
							self.baiduMapInfo.map.panTo(new BMap.Point(r.point.lng, r.point.lat));
						}
					} else {
						self.$Message.error(statuInfo["_" + this.getStatus()]);
					}
				}, {
					enableHighAccuracy: true
				});

				//关于状态码
				//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
				//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
				//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
				//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
				//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
				//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
				//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
				//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
				//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)

				// self.getMyLocationByH5(isPan);
			},

			// 原生定位
			getMyLocationByH5: function (isPan) {
				var self = this;
				var lat = 0;
				var lng = 0;
				var coords = null;

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						coords = position.coords;
						lat = coords.latitude;
						lng = coords.longitude;
						utility.convertorByBaidu([lng, lat], gcoord, BMap, function (point, lng, lat) {
							self.myPosition.position.lng = lng;
							self.myPosition.position.lat = lat;
							self.myPosition.animation = BMAP_ANIMATION_BOUNCE;
							if (isPan == true) {
								self.baiduMapInfo.map.setZoom(19);
								// self.baiduMapInfo.map.panTo(new BMap.Point(r.point.lng, r.point.lat));
								self.baiduMapInfo.map.panTo(point);
							}
						});
					}, function (err) {
						switch (err) {
							case err.PERMISSION_DENIED:
								self.$Message.error("您拒绝了共享位置，可手动选择城市。");
								console.log("您拒绝了共享位置，可手动选择城市。");
								break;
							case err.POSITION_UNAVAILABLE:
								self.$Message.error("无法获取当前位置");
								console.log("无法获取当前位置");
								break;
							case err.TIMEOUT:
								self.$Message.error("获取位置超时");
								console.log("获取位置超时");
								break;
							default:
								self.$Message.error("未知错误");
								console.log("未知错误");
								break;
						}
					}, {
						enableHighAcuracy: true, //位置是否精确获取
						timeout: 5000, //获取位置允许的最长时间
						maximumAge: 1000 //多久更新获取一次位置
					});
				}
			},

			// 重置范围查询
			"resetClickSearch": function () {
				$("#ol-dbClickSearch").css({
					opacity: 0,
					left: "-300px",
					top: "auto",
					bottom: "120px"
				});
			},

			// 双击地图
			"dbClickBaiduMap": function (event) {
				var self = this;
				var pixel = event.pixel;
				var point = event.point;
				self.isTrackItem = false;
				$("#ol-dbClickSearch").css({
					opacity: 1,
					left: pixel.x - 160,
					top: pixel.y - 120,
					bottom: "auto"
				});
				self.isSlide = false;
				setTimeout(function () {
					self.convertorByBaiduToGPS([point.lng, point.lat], function (lng, lat) {
						self.baiduMapInfo.vehicleMarkers = {};
						self.vehiclePositonPageInfo.centerPosition = lng.toFixed(6) + "," + lat.toFixed(6);
						self.getAllVehiclePositonList();
						self.modal.isSearch = true;
					});
				}, 2000);
			},

			// 取消范围查询
			"cancelAreaSearch": function () {
				var self = this;
				self.vehiclePositonPageInfo.centerPosition = "";
				self.vehiclePositonPageInfo.span = 1000;
				self.getAllVehiclePositonList();
			},

			// 结束防区编辑转态
			"endDefensEdite": function () {
				var self = this;
				if (self.isAddDefensAction == true) {
					self.deleteDefensAction();
				}
			},
			//#endregion

			// 转换成百度坐标
			"convertorByBaidu": function (coordinate, callback) {
				var self = this;
				var result = gcoord.transform([parseFloat(coordinate[0]), parseFloat(coordinate[1])], gcoord.WGS84, gcoord.BD09);
				var point = new BMap.Point(result[0], result[1]);

				!!callback && callback(point, result[0], result[1]);
			},
			// 通过百度API转换坐标
			"convertorByBaiduToGPS": function (coordinate, callback) {
				var self = this;
				var result = gcoord.transform([parseFloat(coordinate[0]), parseFloat(coordinate[1])], gcoord.BD09, gcoord.WGS84);

				!!callback && callback(result[0], result[1]);
				return result;
			},
			// setAnimation
			"setAnimationByBaidu": function (coordinates) {
				var self = this;
				self.convertorByBaidu(coordinates, function (point) {
					self.baiduMapInfo.map.panTo(new BMap.Point(point.lng, (point.lat + self.zoomNum)));
				});
			},

			//#region 防区
			// 选择行时设置防区
			"setDefensRowData": function (item, index) {
				var self = this;
				var coordinates = [];
				var coordinate = [];
				self.defensAreaDetailInfo = self.defensList[index];
				self.defensAreaDetailInfo.remark = decodeURI(self.defensList[index]["remark"]);
				self.defensAreaDetailInfo.opType = 2;
				if (!self.defensAreaDetailInfo.areaRange) {
					self.$Message.error("没有防区定位数据");
					return;
				}

				coordinates = JSON.parse(self.defensAreaDetailInfo.areaRange)["coordinates"][0];
				coordinate = utility.convertorByBaidu(coordinates[0], gcoord, BMap);
				self.getDepartmentList('defensAreaDetailInfo');
				self.openInfoWidth = 550;
				self.openInfoHeight = 290;
				self.baiduMapInfo.openInfoWindow.position = {
					lng: coordinate[0],
					lat: coordinate[1]
				};
				self.baiduMapInfo.openInfoWindow.type = "isDefenPop";
				self.baiduMapInfo.openInfoWindow.show = true;
				self.baiduMapInfo.map.setZoom(18);
				self.baiduMapInfo.map.panTo(new BMap.Point(coordinate[0] - 0.00089867, coordinate[1] + 0.00059867));
			},
			// 
			"showDefensPop": function (polygon, event) {
				var self = this;
				var point = event.point;
				self.defensAreaDetailInfo = polygon.item;

				self.getDepartmentList('defensAreaDetailInfo');
				self.openInfoWidth = 240;
				self.openInfoHeight = 400;
				self.baiduMapInfo.openInfoWindow.position = {
					lng: point.lng,
					lat: point.lat
				};
				self.baiduMapInfo.openInfoWindow.type = "isDefenPop";
				self.baiduMapInfo.openInfoWindow.show = true;
				self.baiduMapInfo.map.panTo(new BMap.Point(point.lng, point.lat + self.zoomNum));
				self.modal.isDefense = false;
			},
			// 防区状态变化时，改变防区颜色
			"defensStatuChange": function (item, value) {
				var self = this;
				if (!!item.id) {
					self.baiduMapInfo.defensList["_" + item.id]["fill"] = self.defensColor["_" + value]["fill"];
					self.baiduMapInfo.defensList["_" + item.id]["stroke"] = self.defensColor["_" + value]["stroke"];
				} else {
					self.defensAreaDetailInfo.fill = self.defensColor["_" + value]["fill"];
					self.defensAreaDetailInfo.stroke = self.defensColor["_" + value]["stroke"];
				}

			},
			// 画所有防区
			// 画所有防区
			"drawAllDefens": function () {
				var self = this;
				for (var i = 0, len = self.defensList.length; i < len; i++) {
					if (self.defensList[i].areaRange) {
						var coordinate = JSON.parse(self.defensList[i].areaRange)["coordinates"][0];
						var positionPath = (function () {
							var position = [];
							for (var c = 0, clen = coordinate.length; c < clen; c++) {
								utility.convertorByBaidu(coordinate[c], gcoord, BMap, function (point, lng, lat) {
									position.push({
										lng: lng,
										lat: lat
									});
								});
							}
							return position;
						}());
						if (!!self.baiduMapInfo.defensList["_" + self.defensList[i]["id"]]) {
							self.baiduMapInfo.defensList["_" + self.defensList[i]["id"]]["paths"] = positionPath;
						} else {
							self.baiduMapInfo.defensList["_" + self.defensList[i]["id"]] = {
								id: "_" + self.defensList[i]["id"],
								canEdit: false,
								style: !!self.functionInfo.isDefense ? "dashed" : "solid",
								fill: self.defensColor["_" + self.defensList[i]["secureStatus"]]["fill"],
								stroke: self.defensColor["_" + self.defensList[i]["secureStatus"]]["stroke"],
								paths: positionPath,
								item: self.defensList[i]
							}
						}

					}
				}
			},
			// 为新绘制的防区添加绘制结束事件
			"updateDefensPath": function (item, event) {
				var self = this;
				var pathArr = [];
				var path = event.target.getPath();

				self.defensAreaDetailInfo = item;
				self.defensAreaDetailInfo.remark = decodeURI(item["remark"]);
				self.getDepartmentList('defensAreaDetailInfo');

				if (path.length > 0) {
					for (var i = 0, len = path.length; i < len; i++) {
						pathArr.push(self.convertorByBaiduToGPS([path[i].lng, path[i].lat]).join(","));
					}
					// 实现区域闭环
					pathArr.push(pathArr[0]);
					self.defensAreaDetailInfo.areaRangeStr = pathArr.join(";");

					if (!!item.id) {
						self.defensAreaDetailInfo.opType = 3;
						setTimeout(function () {
							// self.uploadDefensAreaDetailInfoToServer();
						}, 500);
					}
				}
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
						appType: 1,
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

			// 启动添加绘制控件
			"addDefensAction": function () {
				var self = this;
				self.isAddDefensAction = true;
				self.baiduMapInfo.defensPath = [];
			},
			// 取消添加绘制控件
			"deleteDefensAction": function () {
				var self = this;
				self.isAddDefensAction = false;
				self.showDefensPop(self.defensAreaDetailInfo, {
					point: self.baiduMapInfo.defensPath[0]
				});
			},
			// 删除防区
			"deleteDefensArea": function () {
				var self = this;

				self.baiduMapInfo.openInfoWindow.type = "";
				self.baiduMapInfo.openInfoWindow.show = false;

				if (!!self.defensAreaDetailInfo.id) {
					if (self.addLoading == false) {
						utility.interactWithServer({
							appType: 1,
							url: CONFIG.HOST + CONFIG.SERVICE.areaService + "?action=" + CONFIG.ACTION.delSecureArea,
							actionUrl: CONFIG.SERVICE.areaService,
							dataObj: {
								"ids": self.defensAreaDetailInfo.id,
								"modifyUserId": userInfo["id"], // 修改用户ID，修改时必传
							},
							beforeSendCallback: function () {
								self.addLoading = true;
							},
							completeCallback: function () {
								self.addLoading = false;
							},
							successCallback: function (data) {
								if (data.code == 200) {
									self.getDefensAreaList(true);
									self.deleteLoading = false;
									self.isDeleteDefens = false;
									self.defensAreaDetailInfo = {
										"id": "",
										"opType": 1, // 操作状态：1:新增防区 2:修改防区基本信息 3:修改防区地理坐标信息 4:修改防区状态
										"companyId": "",
										"fill": "#ffffff",
										"stroke": "blue",
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
									};
								} else {
									self.$Message.error(data.message);
								}
							}
						});
					}
				} else {
					self.baiduMapInfo.defensPath = [];
				}
			},
			// 把把防区信息提交到服务器
			"uploadDefensAreaDetailInfoToServer": function () {
				var self = this;
				if (self.addLoading == false) {
					utility.interactWithServer({
						appType: 1,
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
						},
						beforeSendCallback: function () {
							self.addLoading = true;
						},
						completeCallback: function () {
							self.addLoading = false;
						},
						successCallback: function (data) {
							if (data.code == 200) {
								self.getDefensAreaList(true);
								self.baiduMapInfo.defensPath = [];
							} else {
								self.$Message.error(data.message);
							}
						}
					});
				}
			},
			//#endregion

			//#region 摄像机
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
						appType: 1,
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

			// 添加摄像机要素点
			"createCameraFeature": function (item, callback) {
				var self = this;
				var coordinate = JSON.parse(item.cameraPosition)["coordinates"];

				self.baiduMapInfo.cameraMarkers.push({
					icon: {
						url: CONFIG.HOST + "/airport/assets/img/camera.png?v=" + Date.parse(new Date()),
						size: {
							width: 50,
							height: 50
						}
					},
					position: {
						lng: coordinate[0],
						lat: coordinate[1],
					},
					item: item
				});
				!!callback && callback(item.id, coordinate);
			},

			// 拖拽摄像机
			"dragendCamera": function (index, event) {
				var self = this;
				var point = event.point;
				self.cameraDetailInfo = self.baiduMapInfo.cameraMarkers[index].item;
				self.cameraDetailInfo.cameraPosition = JSON.stringify({
					"coordinates": [point.lng, point.lat]
				});
				self.cameraDetailInfo.cameraPositionStr = point.lng + "," + point.lat; // 位置坐标
				self.baiduMapInfo.cameraMarkers[index]["position"] = {
					lng: point.lng,
					lat: point.lat,
				};
				self.baiduMapInfo.openInfoWindow.position = {
					lng: point.lng,
					lat: point.lat,
				};

				if (!!self.cameraDetailInfo.id) {
					self.uploadCameraDetailInfoToServer();
				}
			},

			// 画摄像机
			"drawAllCamera": function () {
				var self = this;
				self.baiduMapInfo.cameraMarkers = [];
				for (var i = 0, len = self.cameraList.length; i < len; i++) {
					self.createCameraFeature(self.cameraList[i]);
				}
			},

			// 点击摄像机列表显示摄像机POP
			"setCameraRowData": function (item, index) {
				var self = this;
				var coordinates = [];
				self.cameraDetailInfo = self.cameraList[index];
				self.cameraDetailInfo.remark = decodeURI(self.cameraList[index]["remark"]);
				self.cameraDetailInfo.cameraName = decodeURI(self.cameraList[index]["cameraName"]);
				self.cameraDetailInfo.cameraCode = decodeURI(self.cameraList[index]["cameraCode"]);
				self.cameraDetailInfo.cameraDesc = decodeURI(self.cameraList[index]["cameraDesc"]);
				coordinates = JSON.parse(self.cameraDetailInfo.cameraPosition)["coordinates"];
				self.getDepartmentList('cameraDetailInfo');
				self.openInfoWidth = 200;
				self.openInfoHeight = 400;
				self.baiduMapInfo.openInfoWindow.position = {
					lng: coordinates[0],
					lat: coordinates[1],
				};
				self.baiduMapInfo.map.panTo(new BMap.Point(coordinates[0], coordinates[1] + 0.00855467));
				self.baiduMapInfo.openInfoWindow.type = "isCameraPop";
				self.baiduMapInfo.openInfoWindow.show = true;
				self.modal.isCamera = false;
			},

			// 点击地图摄像机显示摄像机POP
			"cameraOpenPop": function (marker, event) {
				var self = this;
				self.baiduMapInfo.openInfoWindow.type = "";
				self.baiduMapInfo.openInfoWindow.show = false;
				self.getDepartmentList('cameraDetailInfo');
				self.openInfoWidth = 200;
				self.openInfoHeight = 400;
				setTimeout(function () {
					self.baiduMapInfo.openInfoWindow.show = true;
					self.baiduMapInfo.openInfoWindow.position = marker.position;
					self.baiduMapInfo.openInfoWindow.type = "isCameraPop";
					self.cameraDetailInfo = marker.item;
					self.baiduMapInfo.map.panTo(new BMap.Point(marker.position.lng, marker.position.lat + 0.00855467));
					self.modal.isCamera = false;
				}, 250);
			},

			// 页数改变的时候
			"cameraPageSizeChange": function () {
				var self = this;
				self.cameraPageInfo.pageNum = parseInt(value, 10);
				setTimeout(function () {
					self.getCameraList(false);
				}, 200);
			},
			// 删除摄像机
			"deleteCamera": function (event) {
				var self = this;
				self.baiduMapInfo.openInfoWindow.type = "";
				self.baiduMapInfo.openInfoWindow.show = false;
				if (!!self.cameraDetailInfo.id) {
					utility.interactWithServer({
						appType: 1,
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
				} else {
					self.baiduMapInfo.cameraMarkers.splice(self.cameraDetailInfo.index, 1);
				}
			},
			// 把摄像机数据提交到服务器
			"uploadCameraDetailInfoToServer": function () {
				var self = this;
				utility.interactWithServer({
					appType: 1,
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
								self.baiduMapInfo.openInfoWindow.type = "";
								self.baiduMapInfo.openInfoWindow.show = false;
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
			// 获取车辆最新位置数据接口
			"getAllVehiclePositonList": function () {
				var self = this;
				utility.interactWithServer({
					appType: 1,
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
							self.vehiclePositionList = data.data;
							self.vehiclePositonPageInfo.count = data.count;
							self.formatVehiclePositon(); // 格式化车辆数据
							self.resetClickSearch();
							self.drawAlVehicleByBaidu(); /// 画百度车辆
						}
					}
				});
			},

			// 格式化实时车辆信息
			"formatVehiclePositon": function () {
				var self = this;
				var list = [];
				for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
					list.push({
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
						"lastPosition": !!self.vehiclePositionList[i]["lastPosition"] ? JSON.parse(self.vehiclePositionList[i][
							"lastPosition"
						])["coordinates"] : null, //"",
						"lastPositionAddress": "",
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

				self.searchDatas = list;

				// for (var a = 0; a < self.searchDatas.length; a++) {
				//     (function (a) {
				// 		self.searchDatas[a]["lastPositionAddress"] = "";
				//         if (!!self.searchDatas[a].lastPosition) {
				// 			var position = self.searchDatas[a].lastPosition;
				//             if (position[0] != 0 && position[1] != 0) {
				//                 utility.convertorByBaidu(position, gcoord, BMap, function (point, lng, lat) {
				//                     utility.getAdressDetail([lng, lat], BMap, function (address) {
				//                         self.searchDatas[a]["lastPositionAddress"] = address;
				//                     });
				//                 });
				//             } else {
				//                 self.searchDatas[a]["lastPositionAddress"] = "--";
				//             }
				//         } else {
				//             self.searchDatas[a]["lastPositionAddress"] = "--";
				//         }
				//     }(a));
				// }
			},

			// 查询实时车辆数据
			"searchTimeVehicle": function () {
				var self = this;
				self.getAllVehiclePositonList();
			},

			// 获取开始时间
			"getBeginDate": function (value) {
				var self = this;
				self.dateTimeInfo.beginDate = value;
			},
			// 获取开始时间
			"getEndDate": function (value) {
				var self = this;
				self.dateTimeInfo.endDate = value;
			},
			// 获取时间
			"getBeginTime": function (value) {
				var self = this;
				self.dateTimeInfo.beginTime = value;
			},
			"getEndTime": function (value) {
				var self = this;
				self.dateTimeInfo.endTime = value;
			},

			// 获取详细地址
			"getAdressDetail": function (coordinate, target, callback) {
				var self = this;
				target.gc = new BMap.Geocoder();
				target.sourceCoor = coordinate;
				target.point = new BMap.Point(target.sourceCoor[0], target.sourceCoor[1]);
				target.gc.getLocation(target.point, function (rs) {
					if (rs.surroundingPois.length > 0) {
						target.address = rs.surroundingPois[0]["address"] + "(" + rs.surroundingPois[0]["title"] + ")";
					} else {
						target.address = rs.address;
					}!!callback && callback();
				});
			},

			// 画车辆
			"createVehicleByBaidu": function (item, callback) {
				var self = this;
				if (!item["lastPosition"]) {
					return;
				}
				var coordinate = JSON.parse(item["lastPosition"])["coordinates"];
				var iconSrc = CONFIG.HOST + "/airport/assets/car/success.gif";
				var vehicleIcon = (self.vehicleTypeInfo[item.vehicleTypeName] + item.vehicleStatus) || item.vehicleStatus;
				var now = Date.parse(new Date());
				var lastGpsTime = Date.parse(item.lastGpsTime.replace(/\-/g, "/"));
                var lastOnTime = Date.parse(item.lastOnlineTime.replace(/\-/g, "/"));
                var gpsDay = Math.floor((now - lastGpsTime) / (24 * 3600 * 1000));
                var onday = Math.floor((now - lastOnTime) / (24 * 3600 * 1000));
                item['isOverTime'] = false;
                item['isOnTime'] = false;
                if (gpsDay >= 1) {
                    vehicleIcon = self.vehicleTypeInfo[item.vehicleTypeName] + 406 || 406;
                    item['isOverTime'] = true;
                }

                if (onday >= 1) {
                    item['isOnTime'] = true;
                }

				iconSrc = CONFIG.HOST + "/airport/assets/car/" + vehicleIcon + ".gif?v=" + Date.parse(new Date());

				self.convertorByBaidu(coordinate, function (point, lng, lat) {
					if (!!self.baiduMapInfo.vehicleMarkers["_" + item.id]) {
						if (!(self.baiduMapInfo.vehicleMarkers["_" + item.id].position.lng - lng == 0 && self.baiduMapInfo.vehicleMarkers[
								"_" + item.id].position.lat - lat == 0)) {
							self.baiduMapInfo.vehicleMarkers["_" + item.id]["item"] = item;
							self.baiduMapInfo.vehicleMarkers["_" + item.id]["zIndex"] = self.baiduMapInfo.vehicleMarkers["_" + item.id]
								["zIndex"] || 0;
							self.baiduMapInfo.vehicleMarkers["_" + item.id]["position"] = {
								lng: lng,
								lat: lat
							};
						}
					} else {
						self.baiduMapInfo.vehicleMarkers["_" + item.id] = {
							id: "_" + item.id,
							icon: {
								url: iconSrc,
								size: {
									width: 28,
									height: 35
								}
							},
							position: {
								lng: lng,
								lat: lat,
							},
							zIndex: 0,
							top: false,
							animation: "",
							item: item
						};
					}

					!!callback && callback(lng, lat);
				});
			},

			// 鼠标指向的车辆在最上层
			"setVehicleTop": function (marker, event) {
				var self = this;
				if (!!self.baiduMapInfo.vehicleMarkers[marker.id]) {
					self.baiduMapInfo.vehicleMarkers[marker.id]["zIndex"] = 10000000000;
					self.baiduMapInfo.vehicleMarkers[marker.id]["top"] = true;
					self.baiduMapInfo.vehicleMarkers[marker.id]["animation"] = "";
				}
				self.openInfoWidth = 300;
				self.openInfoHeight = 0;
				self.modal.isSearch = false;
			},

			// 鼠标指向的车辆在最上层
			"cancelVehicleTop": function (marker, event) {
				var self = this;
				if (!!self.baiduMapInfo.vehicleMarkers[marker.id]) {
					self.baiduMapInfo.vehicleMarkers[marker.id]["zIndex"] = 0;
					self.baiduMapInfo.vehicleMarkers[marker.id]["top"] = false;
					self.baiduMapInfo.vehicleMarkers[marker.id]["animation"] = "";
				}
			},

			// 显示车辆POP
			"vehicleOpenPop": function (marker, event) {
				var self = this;

				self.baiduMapInfo.openInfoWindow.show = false;
				self.baiduMapInfo.openInfoWindow.type = "";
				self.isTrackItem = true;
				self.openInfoWidth = 200;
				self.openInfoHeight = 0;
				setTimeout(function () {
					self.vehicleItemPop = marker.item;
					self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;
					self.trackItem.licenseNumber = self.vehicleItemPop.licenseNumber;
					self.getAdressDetail([marker.position.lng, marker.position.lat], self.vehicleItemPop, function () {
						self.baiduMapInfo.openInfoWindow.show = true;
						self.baiduMapInfo.openInfoWindow.type = "isVehiclePopInfo";
						self.baiduMapInfo.openInfoWindow.position = marker.position;
						self.baiduMapInfo.map.panTo(new BMap.Point(marker.position.lng, marker.position.lat + self.zoomNum));
						self.drawAlVehicleByBaidu();
						self.modal.isSearch = false;
					});
				}, 250);

			},

			// 在地图上画所有的车辆
			"drawAlVehicleByBaidu": function () {
				var self = this;

				if (self.isTrackItem) {
					self.baiduMapInfo.vehicleMarkers = {};
					for (var t = 0, tlen = self.vehiclePositionList.length; t < tlen; t++) {
						if (self.trackItem.licenseNumber == self.vehiclePositionList[t]['licenseNumber']) {
							self.createVehicleByBaidu(self.vehiclePositionList[t], function (lng, lat) {
								if (self.baiduMapInfo.openInfoWindow.type == "isVehiclePopInfo") {
									self.baiduMapInfo.openInfoWindow.position = {
										lng: lng,
										lat: lat
									};
								}
							});
							break;
						}
					}
				} else {
					for (var i = 0, len = self.vehiclePositionList.length; i < len; i++) {
						self.createVehicleByBaidu(self.vehiclePositionList[i]);
					}
				}
			},

			// 点击车辆列表行跳转到对应的位置
			"showPositionByBaidu": function (item, index) {
				var self = this;
				var coordinates = [];
				var lastPosition = "";
				self.vehiclePositionItem = self.vehiclePositionList[index];
				self.vehicleItemPop = self.vehiclePositionItem;
				self.singleVehiclePageInfo.licenseNumber = self.vehicleItemPop.licenseNumber;
				lastPosition = self.vehicleItemPop.lastPosition;

				if (!!lastPosition) {
					coordinates = JSON.parse(lastPosition).coordinates
					if (coordinates[0] == 0 || coordinates[1] == 0) {
						self.$Message.error("没有车辆定位数据");
					} else {
						self.setAnimationByBaidu(coordinates);

						self.openInfoWidth = 200;
						self.openInfoHeight = 0;
						self.modal.isSearch = false;

						self.convertorByBaidu(coordinates, function (point, lng, lat) {
							self.getAdressDetail([lng, lat], self.vehicleItemPop, function () {
								self.baiduMapInfo.openInfoWindow.position = {
									lng: lng,
									lat: lat,
								};
								self.baiduMapInfo.openInfoWindow.type = "isVehiclePopInfo";
								self.baiduMapInfo.openInfoWindow.show = true;
								self.isTrackItem = true;
								self.trackItem.licenseNumber = self.singleVehiclePageInfo.licenseNumber;
								self.drawAlVehicleByBaidu();
							});
						});
					}
				} else {
					self.$Message.error("没有车辆定位数据");
				}
			},

			// 清空轨迹
			"clearTrackByBaidu": function () {
				var self = this;
				self.baiduMapInfo.animationInfo.curveInfo = [];
				self.baiduMapInfo.animationInfo.pointInfo = [];
				self.baiduMapInfo.animationInfo.coordinates = [];
				self.baiduMapInfo.animationInfo.trajectoryInfo = [];
				self.baiduMapInfo.animationInfo.moveVehicle = null;
				self.isTrackItem = false;
				self.trackItem.licenseNumber = "";
				clearInterval(self.baiduMapInfo.animationInfo.timeInterval);
				self.drawAlVehicleByBaidu();
			},

			// 显示轨迹点信息
			"showTrackPointInfo": function (event) {
				var self = this;
				var index = 0;

				for (var i = 0, len = self.baiduMapInfo.animationInfo.trajectoryInfo.length; i < len; i++) {
					if (JSON.stringify(event.point) == JSON.stringify(self.baiduMapInfo.animationInfo.trajectoryInfo[i]["point"])) {
						index = i;
						break;
					}
				}

				self.baiduMapInfo.animationInfo.trajectoryItem = self.baiduMapInfo.animationInfo.trajectoryInfo[index];
				self.getAdressDetail([event.point.lng, event.point.lat], self.baiduMapInfo.animationInfo.trajectoryItem, function () {
					self.baiduMapInfo.map.panTo(event.point);
					self.openInfoWidth = 200;
					self.openInfoHeight = 0;
					self.baiduMapInfo.openInfoWindow.position = {
						lng: event.point.lng,
						lat: event.point.lat,
					};
					self.baiduMapInfo.openInfoWindow.type = "isTrajectPoint";
					self.baiduMapInfo.openInfoWindow.show = true;
				});
			},

			// 根据秒数算出时间
			"countTimeBySeconds": function (timediff) {
				var days = Math.floor(timediff / (24 * 3600 * 1000)); //计算出相差天数
				var leave1 = timediff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
				var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
				var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
				var minutes = Math.floor(leave2 / (60 * 1000));
				//计算相差秒数
				var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
				var seconds = Math.round(leave3 / 1000);

				return {
					"day": days,
					"hour": hours,
					"minute": minutes,
					"second": seconds,
				}
			},

			// 格式化轨迹坐标数据
			"formatTrajectoryInfo": function () {
				var self = this;
				var track = null;
				var len = 0;
				var zeroInfo = {};
				var zeroPoint = [];
				var flag = 0;
				var flag2 = 0;
				var coordinates = [];
				var trajectoryInfo = [];

				if (!!self.singleVehicleItem && self.singleVehicleItem.track) {
					track = self.singleVehicleItem.track.split("/");
					len = track.length;

					for (var z = 0; z < len; z++) {
						var zTrackArr = track[z].split(",");
						if (zTrackArr[3] != 0 && (z > 0 && z < len - 1)) {
							flag++;
						} else {
							zeroInfo["_" + flag] = [];
						}
					}

					for (var i = 0; i < len; i++) {
						var trackArr = track[i].split(",");
						var pushItem = {
							"time": (function () {
								var timeInfo = utility.getDateDetailInfo(trackArr[2]);
								return timeInfo.year + "-" + timeInfo.month + "-" + timeInfo.date + " " + timeInfo.hour + ":" + timeInfo.min + ":" + timeInfo.second;
							}()),
							"timeStmp": Date.parse(new Date(trackArr[2])),
							"speed": trackArr[3],
							"point": null,
							"coordinate": [parseFloat(trackArr[0], 10), parseFloat(trackArr[1], 10)], //self.transformLat([parseFloat(trackArr[0], 10), parseFloat(trackArr[1], 10)]),
							"vehicleCode": self.singleVehicleItem.vehicleCode,
							"vehicleStatus": self.singleVehicleItem.vehicleStatus,
							"companyName": self.singleVehicleItem.companyName,
							"deptName": self.singleVehicleItem.deptName,
							"vehicleName": self.singleVehicleItem.vehicleName,
							"licenseNumber": self.singleVehicleItem.licenseNumber,
							"lastGpsTime": self.singleVehicleItem.lastGpsTime,
							"vehicleTypeName": self.singleVehicleItem.vehicleTypeName,
							"stayTime": !!parseFloat(trackArr[4], 10) ? self.countTimeBySeconds(parseFloat(trackArr[4], 10) * 1000) : null,
						};

						if (i == 0 || i == len - 1) {
							trajectoryInfo.push(pushItem);
						}

						if (trackArr[3] != 0 && (i > 0 && i < len - 1)) {
							flag2++;
							trajectoryInfo.push(pushItem);
						} else {
							zeroInfo["_" + flag2].push(pushItem);
						}
					}
				}

				for (var key in zeroInfo) {
					if (zeroInfo.hasOwnProperty(key)) {
						var item = zeroInfo[key];
						if (item.length > 0) {
							if (item.length >= 2) {
								var timeDiff = utility.timeDiff(item[0]["lastGpsTime"], item[item.length - 1]["lastGpsTime"]);
								if (timeDiff.timeStamp == 0) {
									item[0]["stayTime"] = null;
								} else {
									item[0]["stayTime"] = timeDiff;
								}
							}
							trajectoryInfo.push(item[0]);
						}
					}
				}

				trajectoryInfo = trajectoryInfo.sort(function (a, b) {
					return a.timeStmp - b.timeStmp;
				});

				for (var t = 0; t < trajectoryInfo.length; t++) {

					self.convertorByBaidu(trajectoryInfo[t]["coordinate"], function (point, lng, lat) {
						coordinates.push({
							lng: lng,
							lat: lat,
						});
						trajectoryInfo[t]["point"] = {
							lng: lng,
							lat: lat,
						};
						if (!!trajectoryInfo[t].stayTime) {
							zeroPoint.push({
								lng: lng,
								lat: lat,
							});
						}
					});
				}

				self.baiduMapInfo.animationInfo.trajectoryInfo = trajectoryInfo;
				self.baiduMapInfo.animationInfo.coordinates = coordinates;
				self.baiduMapInfo.animationInfo.pointInfo = coordinates;
				self.baiduMapInfo.animationInfo.zeroPointInfo = zeroPoint;
				self.baiduMapInfo.animationInfo.curveInfo = coordinates;

			},

			// 获取单台车的轨迹
			"getSingleVehicleTrackByBaidu": function () {
				var self = this;

				// 先清空原有轨迹
				self.clearTrackByBaidu();

				// 如果没有选日期，则设置为当天日期
				if (self.dateTimeInfo.beginDate.length == 0) {
					self.dateTimeInfo.beginDate = (function () {
						var dateInfo = utility.getDateDetailInfo();
						return dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.date;
					}())
				}
				if (self.dateTimeInfo.beginTime.length == 0) {
					self.dateTimeInfo.beginTime = "00:00:00";
				}

				// 如果没有选日期，则设置为当天日期
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

				// 计算两个时间差
				timeDiff = utility.timeDiff(self.singleVehiclePageInfo.beginTime, self.singleVehiclePageInfo.endTime);

				self.$Message.destroy();

				if (timeDiff.isOver == false) {
					self.$Message.error("开始时间大于结束时间");
					return;
				}

				if (timeDiff.day > 3) {
					self.$Message.error("时间跨度不能超过3天");
					return;
				}

				self.$Message.loading({
					"content": "正在加载轨迹..."
				});
				utility.interactWithServer({
					appType: 1,
					url: CONFIG.HOST + CONFIG.SERVICE.vehicleService + "?action=" + CONFIG.ACTION.getSingleVehicleTrack,
					actionUrl: CONFIG.SERVICE.vehicleService,
					dataObj: {
						"gpsDeviceCode": self.singleVehiclePageInfo.gpsDeviceCode, // 车辆ID
						"licenseNumber": encodeURI(self.singleVehiclePageInfo.licenseNumber), // 车辆编码
						"beginTime": self.singleVehiclePageInfo.beginTime, // 车辆编码
						"endTime": self.singleVehiclePageInfo.endTime, // 车辆编码
					},
					successCallback: function (data) {
						if (data.code == 200) {
							self.singleVehicleItem = data.data;

							// 如果有轨迹信息
							if (self.singleVehicleItem.track) {
								self.formatTrajectoryInfo(); // 格式化轨迹数据
								self.modal.isHistory = false;
							} else {
								self.$Message.destroy();
								self.$Message.error(self.singleVehiclePageInfo.beginTime + "  " + self.singleVehiclePageInfo.endTime + "查询不到轨迹数据");
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
				var self = this;
				if (self.baiduMapInfo.animationInfo.pointInfo.length == 0) {
					self.$Message.destroy();
					self.$Message.error("没有回放轨迹");
					return;
				}
				var index = 0;
				var item = self.vehicleItemPop;
				var coordinates = self.baiduMapInfo.animationInfo.coordinates;
				var vehicleIcon = (self.vehicleTypeInfo[item.vehicleTypeName] + item.vehicleStatus) || item.vehicleStatus;
				self.baiduMapInfo.animationInfo.moveVehicle = {
					icon: {
						url: CONFIG.HOST + "/airport/assets/car/" + vehicleIcon + ".gif?v=" + Date.parse(new Date()),
						size: {
							width: 28,
							height: 35
						}
					},
					position: {
						lng: coordinates[index].lng,
						lat: coordinates[index].lat,
					},
					zIndex: 100000,
					top: true,
				};
				self.baiduMapInfo.map.setZoom(14);
				self.baiduMapInfo.openInfoWindow.show = false; // 隐藏弹出层
				self.baiduMapInfo.map.panTo(new BMap.Point(coordinates[index].lng, coordinates[index].lat));
				self.baiduMapInfo.animationInfo.timeInterval = setInterval(function () {
					if (index < coordinates.length) {
						index++;
						self.baiduMapInfo.animationInfo.moveVehicle.position = coordinates[index];
						self.baiduMapInfo.map.panTo(new BMap.Point(coordinates[index].lng, coordinates[index].lat));
					} else {
						self.baiduMapInfo.animationInfo.moveVehicle = null;
						clearInterval(self.baiduMapInfo.animationInfo.timeInterval);
					}
				}, (55 + (55 - self.baiduMapInfo.animationInfo.speed)) * 10);

			},

			// 实时获取车辆数据
			"getAllVehicleInterval": function () {
				var self = this;
				self.timePosition = setInterval(function () {
					if (!(self.baiduMapInfo.openInfoWindow.type == "isCameraPop" || self.baiduMapInfo.openInfoWindow.type ==
							"isDefenPop")) {
						self.getAllVehiclePositonList(); // 获取所有实时车辆
					}
				}, 10000);
			},
			//#endregion

		},
		"created": function () {
			var self = this;

			// 判断是否已经登录，如果没有登录，则直接退出到登录页面
			utility.isLogin(false);

			self.$Message.config({
				top: 180,
				duration: 3
			});
			self.showModal("isLayer");

			setTimeout(function () {
				self.hindBaiduCopyRight();
			}, 5000);

			self.$watch('vehiclePositonPageInfo', function () {
				clearInterval(self.timePosition);
				self.getAllVehiclePositonList();
				self.getAllVehicleInterval();
			}, {
				deep: true
			});
		},
		mouted: function () {
			var self = this;
		}
	});

}());