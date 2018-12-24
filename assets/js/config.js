/**
 * @description: 项目配置文件
 */
var CONFIG = (function (CONFIG) {
    // 服务器信息配置
    // CONFIG.HOST = LOCATION;
    CONFIG.HOST = "https://test2.cityeasyplay.com";

    // 接口服务
    CONFIG.SERVICE = {
        "commonService": "/airportCore/base/commonService", // 基础服务
        "userService": "/airportCore/base/userService", // 用户服务
        "companyService": "/airportCore/base/companyService", // 公司服务
        "deptService": "/airportCore/base/deptService", // 部门服务
        "deptUserService": "/airportCore/base/deptUserService", // 部门服务
        "groupService": "/airportCore/base/groupService", // 业务组服务
        "permissionService": "/airportCore/base/permissionService", // 权限服务
        "vehicleService": "/airportCore/core/vehicleService", // 车辆服务
        "deviceService": "/airportCore/core/deviceService", // 设备服务
        "areaService": "/airportCore/core/areaService", // 防区服务
    };

    // 接口动作
    CONFIG.ACTION = {
        // commonService： 基础服务
        "getProvinceList": "getProvinceList", // 获取省份列表接口
        "getCityList": "getCityList", // 获取城市列表接口
        "getDistrictList": "getDistrictList", // 获取区县列表接口
        "getBizParam": "getBizParam", // 获取业务枚举值接口

        // companyService： 公司服务
        "saveCompany": "saveCompany", // 新增/修改公司接口
        "getCompanyList": "getCompanyList", // 获取公司列表数据接口
        "getCompany": "getCompany", // 根据ID获取公司信息
        "delCompany": "delCompany", // 删除公司接口 

        // deptService：部门服务
        "saveDept": "saveDept", // 新增修改部门接口
        "getDeptList": "getDeptList", // 获取部门列表数据接口
        "getDept": "getDept", // 根据部门ID获取部门信息接口
        "delDept": "delDept", // 删除部门接口

        // deptUserService：部门用户
        "saveDeptUser": "saveDeptUser", // 新增部门员工接口
        "getDeptUserList": "getDeptUserList", // 获取部门员工列表数据接口
        "delDeptUser": "delDeptUser", // 删除部门员工接口

        // userService：用户服务
        "userLogin": "userLogin", // 用户登录接口
        "saveUser": "saveUser", // 新增修改用户接口
        "getUserList": "getUserList", // 获取用户列表数据接口
        "getUser": "getUser", // 根据ID获取用户信息接口
        "delUser": "delUser", // 删除用户接口 
        "getUserLogList": "getUserLogList", // 获取用户操作日志列表数据接口

        // groupService：业务组服务
        "saveGroup": "saveGroup", // 新增修改业务对象分组接口
        "getGroupList": "getGroupList", // 获取业务分组列表接口
        "delGroup": "delGroup", // 删除业务对象组接口
        "saveGroupMember": "saveGroupMember", // 新增业务对象组成员接口
        "saveUserGroupDataRes": "saveUserGroupDataRes", // 新增、修改用户组的数据访问权限接口
        "getUserGroupDataResList": "getUserGroupDataResList", // 获取用户组可访问的业务数据对象列表接口
        "getGroupMemberList": "getGroupMemberList", // 获取业务对象分组成员列表接口
        "delGroupMember": "delGroupMember", // 删除业务对象组成员接口

        // permissionService：权限服务
        "saveRole": "saveRole", // 新增修改系统角色接口
        "getRoleList": "getRoleList", // 获取系统角色列表数据接口
        "delRole": "delRole", // 删除角色接口
        "saveRoleFunction": "saveRoleFunction", // 新增角色可用功能接口
        "getFunctionList": "getFunctionList", // 获取系统操作权限功能项目列表接口
        "getFunctionTreeList": "getFunctionTreeList", // 获取系统操作权限功能项（树型结构）
        "getRoleFunctionList": "getRoleFunctionList", // 获取角色可用功能列表数据接口
        "delRoleFunction": "delRoleFunction", // 删除系统角色可用功能接口
        "saveRoleUser": "saveRoleUser", // 新增角色下属用户接口
        "getRoleUserList": "getRoleUserList", // 获取角色下属用户列表数据接口
        "delRoleUser": "delRoleUser", // 删除系统角色可用功能接口

        // vehicleService：车辆服务
        "saveVehicle": "saveVehicle", // 删除系统角色可用功能接口
        "getVehicleList": "getVehicleList", // 获取车辆列表数据接口
        "delVehicle": "delVehicle", // 删除车辆接口
        "saveDevice": "saveDevice", // 新增修改定位终端接口
        "getDeviceList": "getDeviceList", // 获取定位设备列表数据接口
        "delDevice": "delDevice", // 删除设备接口

        // deviceService：设备服务
        "saveCamera": "saveCamera", // 新增修改摄像机信息接口
        "getCameraList": "getCameraList", // 获取摄像头列表数据接口
        "delCamera": "delCamera", // 删除摄像头接口

        // areaService：防区服务
        "saveSecureArea": "saveSecureArea", // 新增修改防区接口
        "getSecureAreaList": "getSecureAreaList", // 获取防区列表数据接口
        "delSecureArea": "delSecureArea", // 删除防区接口
        "savePoi": "savePoi", // 新增修改地图POI位置标记接口
        "getPoiList": "getPoiList", // 获取地图POI标记列表数据接口
        "delPoi": "delPoi", // 删除POI地图标记接口
    };
    
    return CONFIG;
}(CONFIG || {}));