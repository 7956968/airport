function Radar(radarContainer) {
    radarContainer.innerHTML = '<div class="radar-map-container">\
                                    <div class="radar-map"></div>\
                                </div>\
                                <div class="changing-number-container" data-number="1234567890456"></div>\
                                <div class="risk-points"></div>\
                                <div class="scanning-circle">\
                                    <div class="radar-scanner">\
                                        <div class="inner-scanner"></div>\
                                        <div class="outer-scanner">\
                                            <div class="scanner-container">\
                                                <div class="umbrella"></div>\
                                                <div class="scanner-decoration">\
                                                    <div class="thin-border"></div>\
                                                    <div class="small-ellipse"></div>\
                                                    <div class="small-ellipse"></div>\
                                                    <div class="small-ellipse"></div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>';

    this._container = radarContainer;
    this._containerWidth = this._container.offsetWidth;
    this._containerHeight = this._container.offsetHeight;
    this._centerX = this._containerWidth / 2;
    this._centerY = this._containerHeight / 2;

    // 跟风险点"蒙版"有关的变量
    this._maskCtx = (function (cw, ch) {
        var c = document.createElement('canvas');
        c.width = cw;
        c.height = ch;
        return c.getContext('2d');
    })(this._containerWidth, this._containerHeight);
    this._maskSectorDegree = 60;  // 雷达扇形所占角度
    this._maskStartDegree = 0;  // 雷达扇形开始扫描的角度
    this._scanSpeed = 2;  // 雷达扫描速度，单位为deg

    this._outerScanner = this._container.querySelector('.outer-scanner');  // 外层雷达扫描器

    this._riskPointsContainer = this._container.querySelector('.risk-points');

    this._allRiskPointsArr = [];  // 保存所有风险点的数组，改变雷达扫描速度时要用到这些信息
    this._tmpRiskPointsArr = [];  // 初始化时保存所有的风险点，雷达扫描过程中会遍历这个数组，并把当前扫描到的风险点从这个数组移动到保存风险点的对象中，雷达扫描玩一遍之后这个数组为空。这样做避免雷达扫描时重复遍历风险点，特别是当有很多风险点的时候
    this._riskPoints = {};  // 以扫描角度为键值保存风险点信息

    this._riskElements = [];  // 与风险点相关的虚线圆圈、红旗、信息面面和位置信息

    this._curRoamingIndex = 0;  // 当前漫游的风险点索引

    this._radarMap = this._container.querySelector('.radar-map');

    this._roamingDuration = 0;  // 两个风险点之间漫游时长

    this._changingNumberContainer = this._container.querySelector('.changing-number-container');  // 不断变化的数字
}

/* 外部调用的方法 */
Radar.prototype.init = function (options) {

    options.scanSpeed && (this._scanSpeed = parseInt(options.scanSpeed));

    this._createCanvasElements();
    this._drawLineAndCircle();
    this._drawDashedCircle();
    this._drawDashedEmptyCircle();
    this._drawScannerSector();
    this._animate();
};

// 创建canvas标签
Radar.prototype._createCanvasElements = function () {
    var scanningCircleElement = this._container.querySelector('.scanning-circle');

    // 绘制雷达静止的线框和圆圈用到的canvas
    var canvas = document.createElement('canvas');
    canvas.width = this._containerWidth;
    canvas.height = this._containerHeight;
    scanningCircleElement.appendChild(canvas);
    this._lineAndCircleCanvas = canvas;

    // 绘制内部旋转的 "虚线" 圆圈用到的canvas
    this._dashedCircleCanvas = canvas.cloneNode(true);
    this._dashedCircleCanvas.className = 'scanning-dashed-circle';
    scanningCircleElement.appendChild(this._dashedCircleCanvas);

    // 绘制内部旋转的 "空心虚线" 圆圈用到的canvas
    this._dashedEmptyCircleCanvas = canvas.cloneNode(true);
    this._dashedEmptyCircleCanvas.className = 'scanning-dashed-empty-circle';
    scanningCircleElement.appendChild(this._dashedEmptyCircleCanvas);
};


// 动画
Radar.prototype._animate = function () {
    this._rotateRiskPointMask();
    this._requestId = requestAnimationFrame(arguments.callee.bind(this));
};

// 绘制雷达静止的线框和圆圈
Radar.prototype._drawLineAndCircle = function () {
    var radius = this._containerHeight / 2,
        ctx = this._lineAndCircleCanvas.getContext('2d');
    // 最外层圆圈
    var lineWidth = 5;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#0146C2';
    ctx.beginPath();
    ctx.arc(this._centerX, this._centerY, radius - lineWidth / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    // 内部圆圈
    ctx.fillStyle = 'rgba(30,199,230,.5)';
    ctx.beginPath();
    ctx.arc(this._centerX, this._centerY, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    var totalCircle = 8;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(30,199,230,.5)';
    for (var i = 0; i < totalCircle - 1; i++) {
        ctx.beginPath();
        ctx.arc(this._centerX, this._centerY, radius / totalCircle * (i + 1), 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }
    // 内部直线
    var totalLines = 14;
    ctx.save();
    ctx.lineWidth = 0.3;
    ctx.translate(this._centerX, this._centerY);
    ctx.rotate(Math.PI / totalLines);
    for (var i = 0; i < totalLines; i++) {
        ctx.rotate(Math.PI * 2 / totalLines);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius + lineWidth);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
    // 内部虚线
    ctx.save();
    ctx.setLineDash([2, 8]);
    ctx.translate(this._centerX, this._centerY);
    for (var i = 0; i < totalLines / 2; i++) {
        ctx.rotate(Math.PI * 4 / totalLines);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius + lineWidth);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
};

// 绘制内部旋转的 "虚线" 圆圈
Radar.prototype._drawDashedCircle = function () {
    var ctx = this._dashedCircleCanvas.getContext('2d');

    ctx.clearRect(-this._centerX, -this._centerY, this._dashedCircleCanvas.width, this._dashedCircleCanvas.height);
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 5;
    ctx.translate(this._centerX, this._centerY);

    var radius = this._containerHeight / 2 / 8 * 7 - ctx.lineWidth / 2;

    ctx.strokeStyle = '#016FB7';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 5);
    ctx.stroke();

    ctx.strokeStyle = '#23B2D8';
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 6);
    ctx.stroke();

    ctx.strokeStyle = '#80DEF9';
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 18);
    ctx.stroke();

    ctx.strokeStyle = '#085BAF';
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 9);
    ctx.stroke();
};

// 绘制内部旋转的空心虚线圆圈
Radar.prototype._drawDashedEmptyCircle = function () {
    var ctx = this._dashedEmptyCircleCanvas.getContext('2d');

    ctx.clearRect(-this._centerX, -this._centerY, this._dashedEmptyCircleCanvas.width, this._dashedEmptyCircleCanvas.height);
    ctx.strokeStyle = '#5298D3';
    ctx.globalAlpha = 0.3;
    ctx.translate(this._centerX, this._centerY);

    var radius = this._containerHeight / 2 / 8 * 6,
        radiusDeviation = 5,  // 空心虚线的高度
        innerRadius = radius - radiusDeviation;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 5);
    ctx.arc(0, 0, innerRadius, Math.PI / 5, 0, true);
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 6);
    ctx.arc(0, 0, innerRadius, Math.PI / 6, 0, true);
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 18);
    ctx.arc(0, 0, innerRadius, Math.PI / 18, 0, true);
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI / 9);
    ctx.arc(0, 0, innerRadius, Math.PI / 9, 0, true);
    ctx.closePath();
    ctx.stroke();
};

// 绘制雷达扫描锥形渐变扇形
Radar.prototype._drawScannerSector = function () {
    // 创建canvas元素
    var c = document.createElement('canvas');
    c.width = c.height = this._containerHeight;
    this._outerScanner.querySelector('.umbrella').appendChild(c);
    // 绘制锥形渐变
    var ctx = c.getContext('2d');
    var sectorCnt = 10;  // 用10块扇形模拟锥形渐变
    var startDeg = -90, endDeg;
    var sectorRadius = this._containerHeight / 2;
    ctx.translate(sectorRadius, sectorRadius);
    ctx.fillStyle = 'rgba(19, 182, 206, 0.2)';
    for (var i = 0; i < sectorCnt; i++) {
        endDeg = startDeg + this._maskSectorDegree - this._maskSectorDegree / sectorCnt * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, sectorRadius);
        ctx.arc(0, 0, sectorRadius, Math.PI / 180 * (startDeg - 180), Math.PI / 180 * endDeg);
        ctx.closePath();
        ctx.fill();
    }
};

// 旋转只显示风险点的区域
Radar.prototype._rotateRiskPointMask = function () {
    function angleToRadian(angle) {
        return Math.PI / 180 * angle;
    }
    this._maskStartDegree = this._maskStartDegree % 360;

    this._maskCtx.beginPath();
    this._maskCtx.moveTo(this._centerX, this._centerY);
    this._maskCtx.arc(this._centerX, this._centerY, this._containerHeight / 2, angleToRadian(this._maskStartDegree), angleToRadian(this._maskStartDegree + this._maskSectorDegree));
    this._maskCtx.lineTo(this._centerX, this._centerY);
    this._maskCtx.closePath();

    // 控制风险点的显示
    var riskPointIndex = '_deg_' + this._maskStartDegree;
    if (!this._riskPoints[riskPointIndex] && this._tmpRiskPointsArr.length > 0) {
        // todo: 这里先判断this._riskPoints[riskPointIndex]可能会出现不去处理this._tmpRiskPointsArr的情况，特别是当风险点在某一块区域很密集的时候,而且后面添加的风险点都会另开一组
        var that = this;
        this._tmpRiskPointsArr.forEach(function (point) {
            if (that._maskCtx.isPointInPath(point.x, point.y)) {
                // 把当前扫描到的风险点缓存起来
                if (!that._riskPoints[riskPointIndex]) {
                    var riskPointGroup = document.createElement('div');  // 相同索引的风险点放在一组
                    riskPointGroup.className = 'risk-point-group';
                    that._riskPointsContainer.appendChild(riskPointGroup);
                    that._riskPoints[riskPointIndex] = riskPointGroup;
                }
                that._riskPoints[riskPointIndex].appendChild(point.target);
                point._willDelete = true;  // 将要删除的标记
            }
        });

        // 遍历完之后删除已处理过的风险点
        this._tmpRiskPointsArr = this._tmpRiskPointsArr.filter(function (pointItem) {
            var flag = !pointItem._willDelete;
            delete pointItem._willDelete;
            return flag;
        });
    }
    this._riskPoints[riskPointIndex] && this._riskPoints[riskPointIndex].classList.add('flashing');

    // 旋转雷达扫描扇形
    this._outerScanner.style.transform = 'rotate(' + this._maskStartDegree + 'deg) translateZ(0)';
    this._maskStartDegree -= this._scanSpeed;
};
