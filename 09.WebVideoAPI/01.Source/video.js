const VideoMode_1 = 1,
    VideoMode_4 = 4,
    VideoMode_6 = 6,
    VideoMode_8 = 8,
    VideoMode_9 = 9,
    VideoMode_16 = 16,
    VideoMode_25 = 25,
    VideoMode_36 = 36,
    VideoMode_49 = 49,
    VideoMode_64 = 64;

const RatioMode_4_3 = 1,
    RatioMode_16_9 = 2,
    RatioMode_Fill = 3;

var videoRatio = RatioMode_16_9;

function setVideoRatio(ratio) {
   // if (videoRatio == ratio && !vsclient.UI.isMobile) {
    //    return;
  //  }

    if (videoRatio === RatioMode_4_3) {
        $('.video_container').removeClass('ratio_4_3');
    } else if (videoRatio === RatioMode_16_9) {
        $('.video_container').removeClass('ratio_16_9');
    }

    videoRatio = ratio;
    if (videoRatio === RatioMode_4_3) {
        $('.video_container').addClass('ratio_4_3');
    } else if (videoRatio === RatioMode_16_9) {
        $('.video_container').addClass('ratio_16_9');
    }

    vsclient.UI.updateVideoSize();
}


function VideoContext(page, maxVideoNum, currVideoMode) {
    this.maxVideoNum = maxVideoNum
    this.isPlaying = []
    this.players = []
    this.videoParams = []
    this.currVideoWnd = 0
    this.videoMode = currVideoMode
    this.lastVideoMode = currVideoMode
    this.isOneVideoMode = (currVideoMode === VideoMode_1)
    if (page) {
        this.idPrefix = page.settings.placeHolderPrefix
        this.pageId = page.settings.id
    } else {
        this.idPrefix = "monitor_";
        this.pageId = "video_page";
    }

    //for drag & drop video window
    this.isReadyForDragging = false
    this.isDraggingVideo = false
    this.dragingVideo
    
    for (var i = 0; i < this.maxVideoNum; ++i) {
        this.isPlaying.push(false);
        this.players.push(null);
        this.videoParams.push({});
    }

    this.initVideoPanel();
}


VideoContext.prototype.videoWnd = function(index) {
    return $('.' + this.getCtrlClass() + '.video' + index)
}

VideoContext.prototype.setLayout = function(videoMode) {
    if (videoMode === this.videoMode) {
        return;
    }

    var ctrlClass = '.' + this.getCtrlClass()
    $(ctrlClass + '.curr_video_mode').removeClass('curr_video_mode');

    this.lastVideoMode = this.videoMode;
    this.videoMode = videoMode;

    if (videoMode === VideoMode_1) {
        this.isOneVideoMode = true;
        if ($(ctrlClass + '.curr_wnd').length === 0) {
            this.videoWnd(0).addClass('curr_wnd');
        }
    } else {
        this.isOneVideoMode = false;
    }

    var video_area = $('#' + this.idPrefix + 'video_area');
    video_area.removeClass('video_mode_' + this.lastVideoMode).addClass('video_mode_' + this.videoMode)
    $(ctrlClass + '.video_mode_btn_' + this.videoMode).addClass('curr_video_mode')

    this.updateVideoPos();
    this.updateVideoSize();
}

VideoContext.prototype.updateVideoPos = function() { 
    var needSetPos = true;
    switch (this.videoMode) {
        case VideoMode_1:
        case VideoMode_6:
        case VideoMode_8: 
            needSetPos = false;
            break;
    }

    if (this.videoMode === VideoMode_1) {
        $(this.getCtrlClass() + '.curr_wnd').removeAttr('style');
        return;
    }

    var factor = Math.sqrt(this.videoMode);
    var base = 100.0 / factor;
    for (var i = 0; i < this.videoMode; ++i) {
        if (needSetPos) {
            this.videoWnd(i).css({
                "top": base * Math.floor(i / factor) + '%',
                "left": base * (i % factor) + '%'
            });
        } else {
            this.videoWnd(i).removeAttr('style');
        }
    }
}

VideoContext.prototype.updateVideoSize = function() {
   // var isMobile=null;
   // if(vsclient)
  //  {
  //      isMobile= vsclient.UI.isMobile || false;
  //  }
    var isMobile =false;
    $('.' + this.getCtrlClass() + '.video_container').each(function() {
        if (videoRatio === RatioMode_4_3) {
            var maxWidth = this.parentNode.clientWidth;
            var maxHeight = this.parentNode.clientHeight - 21;
            if (maxHeight > maxWidth * 0.75) {
                $(this).css({
                    "width": "100%",
                    "height": maxWidth * 0.75 + "px",
                    "top": (maxHeight - maxWidth * 0.75) / 2 + 21 + "px",
                    "left": "0"
                });
            } else {
                $(this).css({
                    "width": maxHeight * 1.333 + "px",
                    "height": maxHeight + "px",
                    "top": "21px",
                    "left": (maxWidth - maxHeight * 1.333) / 2 + "px"
                })
            }
        } else if (videoRatio === RatioMode_16_9) {
            var maxWidth = this.parentNode.clientWidth;
            var maxHeight = this.parentNode.clientHeight - 21;
            if (maxHeight > maxWidth * 0.5625) {
                $(this).css({
                    "width": "100%",
                    "height": maxWidth * 0.5625 + "px",
                    "top": (maxHeight - maxWidth * 0.5625) / 2 + 21 + "px",
                    "left": "0"
                });
            } else {
                $(this).css({
                    "width": maxHeight * 1.777 + "px",
                    "height": maxHeight + "px",
                    "top": "21px",
                    "left": (maxWidth - maxHeight * 1.777) / 2 + "px"
                })
            }
        } else {
            $(this).css({
                "width": "100%",
                "height": isMobile ? "100%" : "calc(100% - 21px)",
                "top": isMobile ? "0" : "21px",
                "left": "0"
            });
        }
    });
}


VideoContext.prototype.isChannelPlaying = function(frontId, channel) {
    for (var i = 0; i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            continue;
        }

        var param = this.videoParams[i];
        if (frontId === param.frontId && channel === param.channel) {
            return true;
        }
   }

    return false;
}


VideoContext.prototype.getChannelPlayingIndex = function(frontId, channel) {
    for (var i = 0; i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            continue;
        }

        var param = this.videoParams[i];
        if (frontId === param.frontId && channel === param.channel) {
            return i;
        }
   }

    return -1;
}

VideoContext.prototype.updateVideoOnlineStatus = function(frontId, online) {
    for (var i = 0; i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            continue
        }

        if (this.videoParams[i].frontId === frontId) {
            if (!online) {
                this.videoWnd(i).addClass("offline").removeClass('video_displaying')
                this.players[i].stop()
            } else {
                this.videoWnd(i).removeClass("offline")
                this.players[i].reset()                
            }
        }
    }
}

VideoContext.prototype.updateVideoAlarmStatus = function(frontId, alarm) {
    for (var i = 0; i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            continue
        }

        if (this.videoParams[i].frontId === frontId) {
            this.setVideoAlarmStatus(i, alarm)
        }
    }
}

VideoContext.prototype.setVideoAlarmStatus = function(index, alarm) {
    if (alarm) {
        this.videoWnd(index).addClass("alarming");
    } else {
        this.videoWnd(index).removeClass("alarming");
    }
}


VideoContext.prototype.updateVideoListenIcon = function () {
    if (isListening || isTalking) {
        for (var i = 0; i < this.maxVideoNum; ++i) {
            if (!this.isPlaying[i]) {
                continue;
            }
    
            if (this.videoParams[i].frontId === listenParam.frontId &&
                this.videoParams[i].channel === listenParam.channel) {
                this.videoWnd(i).addClass(isTalking ? "talking" : "listening");
                break;
            }
        }
    } else {
        $('.' + this.getCtrlClass() + ".listening").removeClass("listening");
        $('.' + this.getCtrlClass() + ".talking").removeClass("talking");
    }
}


VideoContext.prototype.getCurrWnd = function() {
    var currWnd = $('.' + this.getCtrlClass() + '.curr_wnd');
    if (currWnd.length > 0) {
        return currWnd[0].index;
    }

    return -1;
}


VideoContext.prototype.snapshot = function(index) {
    this.players[index].snapshot(this.videoParams[index].title);
}


VideoContext.prototype.getIdelPlayer = function(onCurrWnd) {
    if (onCurrWnd) {
        var currWnd = $('.' + this.getCtrlClass() + '.curr_wnd');
        if (currWnd.length > 0) {
            var index = currWnd[0].index;
            if (!this.isPlaying[index]) {
                return index;
            }
        }
    }

    var i = 0;
    for (;i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            return i;
        }
    }

    return -1;
}

VideoContext.prototype.startPlayRealtimeStream = function(frontId, channel, name, onCurrWnd) {
    var playerIndex = this.getIdelPlayer(onCurrWnd);
    if (playerIndex < 0) {
        return;
    }

    this.startPlayRealtimeStreamAtWnd(frontId, channel, name, playerIndex);
}

VideoContext.prototype.startPlayRealtimeStreamAtWnd = function(frontId, channel, name, playerIndex) {
    this.isPlaying[playerIndex] = true;
    this.videoParams[playerIndex] = {
        frontId: frontId,
        channel: channel,
        isPreviewStream: !isChannelPrevewMainStream(frontId, channel),
        title: name
    };

    var videoIndexClass = '.' + this.getCtrlClass() + '.video' + playerIndex;
    $(videoIndexClass).addClass('playing');
    var videoFrame = $(videoIndexClass + ' .video_container').get(0);
    $(videoIndexClass + ' .video_title').text(name);
    var videoElement = document.createElement("video");
    videoElement.controls = false;
    videoFrame.appendChild(videoElement);
    this.players[playerIndex] =  new Player(videoElement, frontId, channel,this.videoParams[playerIndex].isPreviewStream);
    var self = this
    this.players[playerIndex].beforeVideoDisplaying = function() {
        var index = self.getChannelPlayingIndex(frontId, channel)
        var videoIndexClass = '.' + self.getCtrlClass() + '.video' + index;
        $(videoIndexClass).addClass('video_displaying')
    }
    this.players[playerIndex].afterVideoDisplaying = function() {
        var index = self.getChannelPlayingIndex(frontId, channel)
        var videoIndexClass = '.' + self.getCtrlClass() + '.video' + index;
        $(videoIndexClass).removeClass('video_displaying')
    }
    this.players[playerIndex].onStreamError = function() {
        setTimeout(function() {
            console.log("restart playing " + frontId + " " + channel)
            self.restartChannelPlaying(frontId, channel)
        }, 300)
    }

    this.players[playerIndex].start();

    if (isListening || isTalking) {
        if (listenParam.frontId === frontId && listenParam.channel === channel) {
            $(videoIndexClass).addClass(isTalking ? 'talking' : 'listening');
        }
    }
    
    this.setVideoAlarmStatus(playerIndex, isFrontAlarming(this.videoParams[playerIndex].frontId))                    
}

VideoContext.prototype.restartChannelPlaying = function(frontId, channel) {
    for (var i = 0; i < this.maxVideoNum; ++i) {
        if (!this.isPlaying[i]) {
            continue;
        }

        var param = this.videoParams[i];
        if (frontId === param.frontId && channel === param.channel) {
            this.stopPlay(i);
            this.startPlayRealtimeStreamAtWnd(frontId, channel, param.title, i);
            return;
        }
   }
}


VideoContext.prototype.stopPlay = function(index) {
    if (!this.isPlaying[index]) {
        return;
    }

    this.players[index].stop();
    this.players[index] = null;
    this.videoParams[index] = {};
    this.isPlaying[index] = false;

    var videoWnd = this.videoWnd(index)
    videoWnd.removeClass('playing').removeClass('listening').removeClass('talking').removeClass('alarming').removeClass('video_displaying').removeClass('offline');
    videoWnd.find('.video_title').text('');
    videoWnd.find('video').remove();
}

VideoContext.prototype.stopFrontPlay = function(index) {
    if (!this.isPlaying[index]) {
        return;
    }

    var frontID = this.videoParams[index].frontId;
    for (var i = 0;i < this.maxVideoNum;++i) {
        if (this.isPlaying[i] && this.videoParams[i].frontId === frontID) {
            this.stopPlay(i);
        }
    }
}

VideoContext.prototype.stopAllPlayer = function() {
    for (var i = 0;i < this.maxVideoNum; ++i) {
        this.stopPlay(i);
    }
}

VideoContext.prototype.startRecord = function (index) {
    this.players[index].startRecording(this.videoParams[index].title);
    $('#' + this.getVideoCtrlId('record_btn', index)).addClass("btn_on");
}

VideoContext.prototype.stopRecord = function (index) {
    this.players[index].stopRecording();
    $('#' + this.getVideoCtrlId('record_btn', index)).removeClass("btn_on");
}

VideoContext.prototype.isVideoAreaListening = function(index) {
    if (!this.isPlaying[index] || !isListening) {
        return false;
    }

    if (this.videoParams[index].frontId !== listenParam.frontId || this.videoParams[index].channel !== listenParam.channel) {
        return false;
    }

    return true;
}

VideoContext.prototype.getVideoCtrlId = function (ctrlName, index) {
    return this.idPrefix + ctrlName + '_' + index
}

VideoContext.prototype.videoId = function (index) {
    return '.' + this.getCtrlClass() + '.video' + index
}

VideoContext.prototype.getCtrlClass = function () {
    return this.idPrefix + 'ctrl'
}

VideoContext.prototype.initVideoPanel = function () {
    var ctrlClass = this.getCtrlClass()

    var videoPanel = $('#' + this.pageId + ' .video_panel');

   // if (true) {
        var ctrlBar = $('<div id="' + this.idPrefix + 'video_ctrl_bar" class="video_ctrl_bar">')

        videoPanel.append(ctrlBar);
    
        var self = this
        var videoModes = [VideoMode_64, VideoMode_49, VideoMode_36, VideoMode_25,
            VideoMode_16, VideoMode_9, VideoMode_8, VideoMode_6, VideoMode_4, VideoMode_1
        ]
        videoModes.forEach(function (value) {
            if (value <= self.maxVideoNum) {
                var isBmpBtn = (value < VideoMode_25)
                var videoModeBtn = $('<button class="' + ctrlClass + ' video_mode_btn video_mode_btn_' + value + (isBmpBtn ? ' bmp_btn' : '') + ((value === self.videoMode) ? ' curr_video_mode' : '') + '">' + (isBmpBtn ? '' : value) + '</button>')
                ctrlBar.append(videoModeBtn)
                videoModeBtn.videoMode = value
    
                videoModeBtn.click(function () {
                    self.setLayout(value)
                });
            }
        })
   // }

    var videoArea = $('<div id="' + this.idPrefix + 'video_area" class="video_area video_mode_' + this.videoMode + '"></div>')
    videoPanel.append(videoArea)

    this.createVideoGrid(videoArea);
   // if (!vsclient.UI.isMobile) {
        this.initVideoAreaMenu(videoArea);
  //  }
}

VideoContext.prototype.initVideoAreaMenu = function(videoArea) {
    // var self = this
    // videoArea.contextMenu({
    //     selector: '.quad_video.' + this.getCtrlClass(), 
    //     build: function ($trigger, e) {
    //         var target = $trigger[0];
    //         var index = target.index;
    //         return {
    //             zIndex:1001,
    //             items: {
    //                 closevideo: {
    //                     name: "关闭视频",
    //                     disabled: !self.isPlaying[index],
    //                     callback: function() {
    //                         self.stopPlay(index);
    //                     }
    //                 },
    //                 closefrontvideo: {
    //                     name: "关闭前端视频",
    //                     disabled: !self.isPlaying[index],
    //                     callback: function() {
    //                         self.stopFrontPlay(index);
    //                     }
    //                 },
    //                 sep1: "---------",
    //                 snapshot: {
    //                     name: "抓图",
    //                     disabled: !self.isPlaying[index],
    //                     callback: function() {
    //                         self.players[index].snapshot(self.videoParams[index].title);
    //                     }
    //                 },
    //                 viewMainStream: {
    //                     name:"预览主码流",
    //                     disabled: !self.isPlaying[index],
    //                     icon: function() {
    //                         if (isChannelPrevewMainStream(
    //                             self.videoParams[index].frontId, 
    //                             self.videoParams[index].channel)) 
    //                             return "context-menu-icon context-menu-icon--fa fa fa-check-square";
    //                         else 
    //                             return "";
    //                     },
    //                     callback: function() {
    //                         toggleChannelPreviewMainStream(self.videoParams[index].frontId, 
    //                             self.videoParams[index].channel);
    //                         vsclient.UI.restartChannelPlaying(
    //                             self.videoParams[index].frontId, 
    //                             self.videoParams[index].channel);
    //                     }
    //                 },
    //                 sep3: "---------",
    //                 startrecord: {
    //                     name: "开始录像",
    //                     disabled: !self.isPlaying[index] || self.players[index].isRecording,
    //                     callback: function() {
    //                         self.startRecord(index);
    //                     }
    //                 },
    //                 stoprecord: {
    //                     name: "停止录像",
    //                     disabled: !self.isPlaying[index] || !self.players[index].isRecording,
    //                     callback: function() {
    //                         self.stopRecord(index);
    //                     }
    //                 },
    //                 sep4: "---------",
    //                 startaudio: {
    //                     name: "启动监听",
    //                     disabled: isTalking || isListening || !self.isPlaying[index],
    //                     callback: function() {
    //                         vsclient.UI.startListening(self.videoParams[index])
    //                     }
    //                 },
    //                 stopaudio: {
    //                     name: "停止监听",
    //                     disabled: !self.isVideoAreaListening(index),
    //                     callback: function() {
    //                         vsclient.UI.stopListening();
    //                     }
    //                 },
    //                 sep5: "---------",
    //                 videoratio: {
    //                     name: "显示比例",
    //                     items: {
    //                         ratio4_3:{
    //                             name:"4:3",
    //                             icon: function() {
    //                                 if (videoRatio === RatioMode_4_3) 
    //                                     return "context-menu-icon context-menu-icon--fa fa fa-check-square";
    //                                 else 
    //                                     return "";
    //                             },
    //                             callback: function() {
    //                                 setVideoRatio(RatioMode_4_3);
    //                             }
    //                         },
    //                         ratio16_9:{
    //                             name:"16:9",
    //                             icon: function() {
    //                                 return (videoRatio === RatioMode_16_9) ? "context-menu-icon context-menu-icon--fa fa fa-check-square" : "";
    //                             },
    //                             callback: function() {
    //                                 setVideoRatio(RatioMode_16_9);
    //                             }
    //                         },
    //                         fill:{
    //                             name:"填充",
    //                             icon: function() {
    //                                 return (videoRatio === RatioMode_Fill) ? "context-menu-icon context-menu-icon--fa fa fa-check-square" : "";
    //                             },
    //                             callback: function() {
    //                                 setVideoRatio(RatioMode_Fill);
    //                             }
    //                         }
    //                     }
    //                 },
    //                 sep2: "---------",
    //                 closeallvideo: {
    //                     name: "关闭所有视频",
    //                     callback: function() {
    //                         self.stopAllPlayer()
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });
}

VideoContext.prototype.createVideoGrid = function(videoArea) {
    var videoModes = [VideoMode_49, VideoMode_36, VideoMode_25,
        VideoMode_16, VideoMode_9, VideoMode_8, VideoMode_6, VideoMode_4
    ]

    var ratioClass = ""
    if (videoRatio == RatioMode_4_3) {
        ratioClass = " ratio_4_3"
    } else if (videoRatio == RatioMode_16_9) {
        ratioClass = " ratio_16_9"
    }

    var self = this
    var ctrlClass = this.getCtrlClass()
    for (var i = 0; i < this.maxVideoNum; ++i) {
        var classes = "quad_video video" + i + ' ' + ctrlClass

        videoModes.forEach(function (mode) {
            if (mode > self.maxVideoNum) {
                return
            }

            if (i < mode) {
                classes += " VideoMode_" + mode;
            }
        })

        var titleBarHtml = '';
       // if (!vsclient.UI.isMobile) {
            titleBarHtml = 
                '<div class="video_title_bar">\
                    <div class="video_title"></div>\
                    <div class="video_index">' + (i + 1) + '</div>\
                    <button class="channel_status_icon listen_icon"></button>\
                    <button class="channel_status_icon alarm_icon"></button>\
                    <button class="video_func_btn snapshot_btn"></button>\
                    <button class="video_func_btn record_btn" id="' + this.getVideoCtrlId('record_btn', i) +'"></button>\
                </div>';
     //   }
        var videoCell = $(
            '<div class="' + classes + '">\
                <div class="video_border">' + titleBarHtml +
                '<div class="video_container' + ratioClass + ' ' + ctrlClass + '">\
                    <div class="video_cover">\
                        <span class="video_label1">正在获取视频...</span>\
                        <span class="video_label2">前端下线</span>\
                    </div>\
                </div>\
                </div>\
            </div>')
        videoArea.append(videoCell)

        videoCell[0].index = i
        videoCell.find('.video_func_btn').each(function () {
            this.index = i
        });

        videoCell.click(function () {
            if ($(this).hasClass('curr_wnd')) {
                return;
            }

            $('.' + ctrlClass + '.curr_wnd').removeClass('curr_wnd');
            $(this).addClass('curr_wnd');
        });

        videoCell.dblclick(function () {
            self.isOneVideoMode = !self.isOneVideoMode;
            if (self.isOneVideoMode) {
                self.setLayout(VideoMode_1);
            } else {
                self.setLayout(self.lastVideoMode);
            }
        });

        videoCell.find('.record_btn').click(function () {
            if ($(this).hasClass('btn_on')) {
                self.stopRecord(this.index);
            } else {
                self.startRecord(this.index);
            }
        });
        videoCell.find(".snapshot_btn").click(function () {
            self.players[this.index].snapshot(self.videoParams[this.index].title);
        });

        videoCell.mousedown(function(e) {
            self.isReadyForDragging = true;
            self.isDraggingVideo = false;
    
            e = e || window.event;
            e.preventDefault();
    
            $(this).mousemove(function() {
                self.isReadyForDragging = false;
                self.isDraggingVideo = true;
                self.dragingVideo = this.index;
    
                $(this).off('mousemove');
    
                $(this.parentNode).addClass('dragging');
                document.onmouseup = function() {
                    document.onmouseup = null;
                    self.isDraggingVideo = false;
                    $('#' + self.idPrefix + 'video_area').removeClass('dragging');            
                };
            });
    
        }).mouseup(function() {
            if (self.isReadyForDragging) {
                self.isReadyForDragging = false;
                $(this).off('mousemove');
                return;
            }
    
            document.onmouseup = null;
    
            if (!self.isDraggingVideo) {
                return;
            }
    
            self.isDraggingVideo = false;
            $(this.parentNode).removeClass('dragging');
    
            var index = this.index;
            if (index === self.dragingVideo) {
                return;
            }
            self.swapVideoWnd(self.dragingVideo, index);
        });
    }
}


VideoContext.prototype.swapVideoWnd = function(fromWnd, toWnd) {
    console.log(fromWnd + ',' + toWnd);

    if (!this.isPlaying[fromWnd] && !this.isPlaying[toWnd]) {
        return;
    }

    var tmp = this.videoParams[fromWnd];
    this.videoParams[fromWnd] = this.videoParams[toWnd];
    this.videoParams[toWnd] = tmp;

    tmp = this.players[fromWnd];
    this.players[fromWnd] = this.players[toWnd];
    this.players[toWnd] = tmp;

    this.setVideoAlarmStatus(fromWnd, false)
    this.setVideoAlarmStatus(toWnd, false)

    var toVideoId = this.videoId(toWnd)
    var fromVideoId = this.videoId(fromWnd)
    var toVideo = null;
    if (this.isPlaying[toWnd]) {
        toVideo = $(toVideoId + ' video');
    }
    if (this.isPlaying[fromWnd]) {
        var fromVideo = $(fromVideoId  + ' video');
        var toWndDiv = $(toVideoId + ' .video_container');
        fromVideo.appendTo(toWndDiv);
        $(toVideoId + ' .video_title').text(this.videoParams[toWnd].title);
        var toVideoWnd = $(toVideoId)
        toVideoWnd.addClass('playing');
        this.setVideoAlarmStatus(toWnd, isFrontAlarming(this.videoParams[toWnd].frontId))
        if (vsclient.UI.isFrontOnline(this.videoParams[toWnd].frontId)) {
            toVideoWnd.removeClass('offline')
        } else {
            toVideoWnd.addClass('offline')
        }
        if (this.players[toWnd].isPlaying()) {
            toVideoWnd.addClass('video_displaying')            
            fromVideo[0].play();
        } else {
            toVideoWnd.removeClass('video_displaying')
        }
        if (this.players[toWnd].isRecording) {
            $('#' + this.getVideoCtrlId('record_btn', toWnd)).addClass("btn_on");            
        } else {
            $('#' + this.getVideoCtrlId('record_btn', toWnd)).removeClass("btn_on");            
        }
    } else {
        $(toVideoId + ' .video_title').text('');
        $(toVideoId).removeClass('playing').removeClass('video_displaying').removeClass('offline');        
        $('#' + this.getVideoCtrlId('record_btn', toWnd)).removeClass("btn_on");            
    }
    if (toVideo != null) {
        var fromWndDiv = $(fromVideoId + ' .video_container');
        toVideo.appendTo(fromWndDiv);
        $(fromVideoId + ' .video_title').text(this.videoParams[fromWnd].title);
        var frontVideoWnd = $(fromVideoId)
        frontVideoWnd.addClass('playing');    
        this.setVideoAlarmStatus(fromWnd, isFrontAlarming(this.videoParams[fromWnd].frontId))                
        if (vsclient.UI.isFrontOnline(this.videoParams[fromWnd].frontId)) {
            frontVideoWnd.removeClass('offline')
        } else {
            frontVideoWnd.addClass('offline')
        }
        if (this.players[fromWnd].isPlaying()) {
            frontVideoWnd.addClass('video_displaying')            
            toVideo[0].play();
        } else {
            frontVideoWnd.removeClass('video_displaying')
        }
        if (this.players[fromWnd].isRecording) {
            $('#' + this.getVideoCtrlId('record_btn', fromWnd)).addClass("btn_on");            
        } else {
            $('#' + this.getVideoCtrlId('record_btn', fromWnd)).removeClass("btn_on");            
        }
    } else {
        $(fromVideoId + ' .video_title').text('');
        $(fromVideoId).removeClass('playing').removeClass('video_displaying').removeClass('offline');        
        $('#' + this.getVideoCtrlId('record_btn', fromWnd)).removeClass("btn_on");            
    }

    tmp = this.isPlaying[fromWnd];
    this.isPlaying[fromWnd] = this.isPlaying[toWnd];
    this.isPlaying[toWnd] = tmp;

    $('.' + this.getCtrlClass() + ".quad_video").removeClass("listening").removeClass('talking');
    this.updateVideoListenIcon()
}
