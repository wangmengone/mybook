function startWith(str, content){
    var reg=new RegExp("^"+content);
    return reg.test(str);
}

function endWith(str, content){
    var reg=new RegExp(content+"$");
    return reg.test(str);
}
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/'),
        generate: function(){
        	var newUrl = this.protocol + "://" + this.host + (this.port?(":"+this.port):"");
            for(var x=0;x<this.segments.length;x++){
            	newUrl += "/" + this.segments[x];
            }
            var paramLength = 0;
            for (key in this.params)
            {
                paramLength++;
            }
            if(paramLength > 0){
                newUrl += "?";
                var newParams = [];
                for (key in this.params)
                {
                    newParams.push(key + "=" + this.params[key]);
                }
                newUrl += newParams.join("&");  
            }
            if(this.hash) {
            	newUrl += "#" + this.hash;
            }
            return newUrl;
        }
    };
}

var topWin = (function (p, c) {
    while (p != c) {
        try {
	　		var currentInfo = parseURL(c.location.href);
	　		var parentInfo = parseURL(p.location.href);
	　		if((currentInfo.protocol + currentInfo.host + currentInfo.port) != (parentInfo.protocol + parentInfo.host + parentInfo.port)){
	　			return c;
	　		}
	　　	} catch(error) {
	　　		return c;
	　　	}
        c = p
        p = p.parent
    }
    return c
})(window.parent, window);

/****
 * 操作iframe
 * 调用方法：JFrame.getFrame("mainFrame|listFrame|MainFrame").document.getElementById("id");
 * @type {{getFrame: JFrame.getFrame, getId: JFrame.getId}}
 */
var JFrame = {
	//父页面操作弹窗
    getFrame: function (iframeNames) {
        var objIframe = iframeNames.split("|");
        var currObj = topWin;
        for (var i = 0; i < objIframe.length; i++) {
        	if(currObj.JFrame.getId(objIframe[i])){
            	currObj = $(currObj.JFrame.getId(objIframe[i])).find("iframe")[0].contentWindow;
        	}
        }
        return currObj;
    },
    getMainFrame: function (iframeNames) {
        //主框架
        var currObj = topWin;
        if (iframeNames) {
            var objIframe = iframeNames.split("|");
            for (var i = 0; i < objIframe.length; i++) {
            	if(currObj.JFrame.getId(objIframe[i])){
                	currObj = currObj.JFrame.getId(objIframe[i]).contentWindow;
                }
            }
        } else {
            currObj = currObj.JFrame.getId("MainFrame").contentWindow;
        }
        return currObj;
    },
    getId: function (id) {
        return document.getElementById(id);
    }
}

/***弹出层****/
var JLayer = {
    config: {
        id: (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        title: 'title',
        width: 700,
        height: 530,
        url: "about:blank",
        success: function () {
        },
        close: function () {
        }
    },
    openFrame: function (options) {
        var opts = $.extend(this.config, options);
	    var index=layer.open({
            id: opts.id,
            type: 2,
            full:opts.full,
            title: opts.title,
            area: [opts.width + 'px', opts.height + 'px'],
            fixed: opts.fixed,
            maxmin: opts.maxmin,
            closeBtn:opts.closeBtn,
            shadeClose:opts.shadeClose,
            content: opts.url,
            success: opts.success,
            end: opts.close,
            btn:opts.btn,
            shade: opts.shade,
            shadeClose: opts.shadeClose 
	    });
	    if(opts.full){
	        	ayer.full(index);
	    }
        
    },
    loading: function () {
        layer.load(1, {shade: [0.2, '#000'], id: "msg-loading"})
    },
    closeFrame: function (id) {
        var _index = parseInt($("#" + id).parent().attr("times"));
        layer.close(_index);
    },
    closeLoading: function () {
        this.closeFrame("msg-loading");
    },
    closeAll: function () {
        layer.closeAll();
    },
    alert: function (msg, callback, closecallback) {
        layer.alert(msg, {
            title: "提示",
            icon: 1,
            skin: 'layer-ext-moon',
            yes: function (index) {
                if (typeof callback === "function") {
                    callback();
                }
                layer.close(index);
            }, end: function () {
                if (typeof closecallback === "function") {
                    closecallback();
                }else{
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            }
        })
    },
    confirm: function (msg, yescallback, nocallback,btns) {
        layer.confirm(msg, {
            title: "提示",
            btn: btns || ['确定', '取消'] //按钮
        }, function (index) {
            if (typeof yescallback === "function") {
                yescallback();
            }
            layer.close(index);
        }, function () {
            if (typeof nocallback === "function") {
                nocallback();
            }
        });

    },
    success: function (msg, callback) {
        layer.alert(msg, {
            title: "提示",
            icon: 1,
            skin: 'layer-ext-moon',
            yes: function (index) {
                /*if (typeof callback === "function") {
                    callback();
                }*/
                layer.close(index);
            }, end: function () {
                if (typeof callback === "function") {
                    callback();
                }
            }
        })
    },
    openContent: function (options, callback, cancelcallback) {
    	var opts = $.extend({}, options);
        var index=layer.open({
           	id: opts.id,
            type: 1,
            title: opts.title,
            area: [opts.width + 'px', opts.height + 'px'],
            fixed: opts.fixed,
            maxmin: opts.maxmin,
            closeBtn:opts.closeBtn,
            shadeClose:opts.shadeClose,
            content: opts.content,
            success: opts.success,
            end: opts.close,
            btn:opts.btn,
            shade: opts.shade ? opts.shade : 0.3
            , yes: function () {
                if (typeof callback === "function") {
                    callback();
                }
            }
            , btn2: function () {
                if (typeof cancelcallback === "function") {
                    cancelcallback();
                }
            }
        });
        if(opts.full){
        	layer.full(index);
        }
    },
    full:function(index){
    	layer.full(index);
    },
    fail: function (msg) {
        layer.alert(msg, {
            title: "提示",
            icon: 2,
            skin: 'layer-ext-moon'
        })
    }
}

///***屏蔽页面拖拽、右键操作操作***/
//if (document.body) {
//    document.body.oncopy = function () {
//        return false;
//    }
//}
////屏蔽 选中
//document.onselectstart = function () {
//    return false;
//}
////屏蔽拖拽
//document.ondragstart = function () {
//    return true;
//};
////屏蔽右键操作
document.oncontextmenu = function () {
    return false;
}

var CMS = {
    ajax: function (options) {
        $.ajax({
            url: options.url,
            type: options.type,
            dataType: options.dataType,
            beforeSend: function (xhr) {
                topWin.JLayer.loading();
            },
            data: options.data,
            cache: false,
            success: function (data) {
                //此处处理业务
                if (typeof(options.success) === "function") {
                    options.success(data);
                }
            },
            error: function (xhr) {
                topWin.JLayer.fail("请求失败");
            },
            complete: function (xhr, ts) {
                topWin.JLayer.closeLoading();
            }

        })
    }
}


/***展示验证的错误信息***/
var ValidMsg = {
    showMsg: function (msg, o, cssctl) {
        if (!o.obj.is("form")) {//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
            // o.obj.parent().css("position", "relative");
            var $tip;
            if (o.obj.parent().find(".validform-info").length == 0) {
                $tip = $("<div class='validform-info'><div class='form-msg' style='display:block;'></div><span class='validform-tip'></span></div>");
                $tip.css({
//                    position: "absolute",
//                    left: "auto",
                    //top: "-30px",
                    //right:'-50px',
                    display: "none"
                })
                o.obj.after($tip);
            } else {
                $tip = o.obj.parent().find(".validform-info");
            }

            var objtip = $tip.find(".validform-tip");
            cssctl(objtip, o.type);
            objtip.text(msg);

            if (o.type == 2) {
                $tip.fadeOut(200);
            } else {
                if ($tip.is(":visible")) {
                    return;
                }
                var left = o.obj.offset().left,
                    top = o.obj.offset().top;

                if (o.obj.width() < 100) {
                    left =left+100;
                } else {
                    left = left + o.obj.width() - 50;
                }
                $tip.css({
                    left: left
                }).show().animate({
                    top: top - 28
                }, 200);
            }
        }
    }
}

/***
 * 表单填充
 * @type {{setFrom: FormFill.setFrom}}
 * 实例：FormFill.setForm($("#form"),data)
 */
var FormFill = {
    setForm: function (form, data) {
        $.each(data, function (i) {
            var $objArr = $(form).find("[name='" + i + "']");
            if ($objArr.attr("type") === "radio" || $objArr.attr("type") === "checkbox") {
                $.each($objArr, function (k, item) {
                    if (data[i] === $(item).val()) {
                        $(item).attr("checked", "true");
                    }
                })
            } else {
                $objArr.val(data[i]);
            }
        });
    }
}

/**
 公用类
 *调用方法：util.toMillon()
 */
var util = {
    toMillon: function (str) {
        if (parseFloat(str) > 10000) {
            return parseFloat(str) / 10000 + "万";
        }
    }

}
