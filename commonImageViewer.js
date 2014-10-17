/**
 * 公共图片浏览插件
 * author：fanll
 * version:1.0
 * 使用：
 * 页面中添加commonImageViewer.css
 * seajs.use(commonImageViewer.js)
 * 功能：
 * 1.对于页面上包含class="viewer-image"的图片提供功能浏览
 * 2.主动调用CommonImageViewer.show(src)，主要用于地图中事件冒泡被阻止;
 */
define(function(require, exports, module) {
	/*Jquery mousewheel插件*/
	(function(a) {
		function b(b) {
			var g = b || window.event,
				h = i.call(arguments, 1),
				j = 0,
				l = 0,
				m = 0,
				n = 0,
				o = 0,
				p = 0;
			if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
				if (1 === g.deltaMode) {
					var q = a.data(this, "mousewheel-line-height");
					j *= q, m *= q, l *= q
				} else if (2 === g.deltaMode) {
					var r = a.data(this, "mousewheel-page-height");
					j *= r, m *= r, l *= r
				}
				if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
					var s = this.getBoundingClientRect();
					o = b.clientX - s.left, p = b.clientY - s.top
				}
				return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
			}
		}

		function c() {
			f = null
		}

		function d(a, b) {
			return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
		}
		var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
			h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
			i = Array.prototype.slice;
		if (a.event.fixHooks)
			for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
		var k = a.event.special.mousewheel = {
			version: "3.1.12",
			setup: function() {
				if (this.addEventListener)
					for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
				else this.onmousewheel = b;
				a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
			},
			teardown: function() {
				if (this.removeEventListener)
					for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
				else this.onmousewheel = null;
				a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
			},
			getLineHeight: function(b) {
				var c = a(b),
					d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
				return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
			},
			getPageHeight: function(b) {
				return a(b).height()
			},
			settings: {
				adjustOldDeltas: !0,
				normalizeOffset: !0
			}
		};
		a.fn.extend({
			mousewheel: function(a) {
				return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
			},
			unmousewheel: function(a) {
				return this.unbind("mousewheel", a)
			}
		})
	})(jQuery);

	//公共图片浏览插件
	var CommonImageViewer;
	(function($) {
		CommonImageViewer = window.CommonImageViewer || (window.CommonImageViewer = {
			$viewer: null,
			$img: null,
			$thumbnail: null,
			state: {
				posX: 0,
				posY: 0,
				scale: 1,
				horizontal: 1,
				vertical: 1,
				rotate: 0
			},
			trace: {},
			init: function() {
				this.createDom();
				return this;
			},
			createDom: function() {
				var $viewer;
				if ($(".common-image-viewer").length) {
					return true;
				} else if (this.$viewer) {
					$("body").append(this.$viewer);
				} else {
					this._createDom();
				}
			},
			_createDom: function() {
				var html = [];
				html.push('<div class="common-image-viewer">');
				html.push('<div title="关闭" class="image-viewer-close">X</div>');
				html.push('<img class="image-viewer-img" />');
				html.push('<div class="image-viewer-browse">');
				html.push('<img class="image-viewer-browse-thumbnail" />');
				html.push('<div class="image-viewer-browse-aperture"></div>');
				html.push('</div>');
				html.push('<div class="image-viewer-tools">');
				html.push('<div title="原始大小" data-tool="realsize" class="viewer-tool"><span class="image-viewer-tool-realsize"></span></div>');
				html.push('<div title="全屏" data-tool="fullscreen" class="fullscreen-btn viewer-tool"><span class="image-viewer-tool-fullscreen"></span></div>');
				html.push('<div title="旋转" data-tool="rotate" class="viewer-tool"><span class="image-viewer-tool-rotate"></span></div>');
				html.push('<div title="水平翻转" data-tool="horizontalturn" class="viewer-tool"><span class="image-viewer-tool-horizontalturn"></span></div>');
				html.push('<div title="垂直翻转" data-tool="verticalturn" class="viewer-tool"><span class="image-viewer-tool-verticalturn"></span></div>');
				html.push('</div>');
				html.push('</div>');
				var $viewer = this.$viewer = $(html.join(''));
				this.$img = $(".image-viewer-img", $viewer);
				this.$thumbnail = $(".image-viewer-browse-thumbnail", $viewer);
				this.bindEvent($viewer);
				$("body").append($viewer);
			},
			bindEvent: function($viewer) {
				var self = this,
					$document = $(document);
				//浏览事件
				$document.on("click", ".viewer-image", function() {
					self.show(this.src);
				});
				//关闭
				$(".image-viewer-close", $viewer).bind("click", function(ev) {
					$viewer.hide();
					return false;
				});
				//平移事件
				function mousemoveListener(ev) {
					self.translation("mousemove", ev);
					return false;
				}
				$viewer.bind("mousedown", function(ev) {
					self.translation("mousedown", ev);
					$viewer.bind("mousemove", mousemoveListener);
					return false;
				});
				$document.bind("mouseup", function(ev) {
					$viewer.unbind("mousemove", mousemoveListener);
					self.translation("mouseup", ev);
					return false;
				});
				//缩放
				$viewer.mousewheel(function(event, delta) {
					self.zoom(delta * 0.15);
					return false;
				});
				//工具事件
				$(".image-viewer-tools", $viewer).on("click", ".viewer-tool", function() {
					switch ($(this).data("tool")) {
						case "realsize":
							self.realSize();
							break;
						case "fullscreen":
							self.$viewer.toggleClass("fullscreen");
							break;
						case "rotate":
							self.rotateRight();
							break;
						case "horizontalturn":
							self.horizontalTurn();
							break;
						case "verticalturn":
							self.verticalTurn();
							break;
					}
					return false;
				});
			},
			/**
			 * 显示图片
			 * @return {[type]} [description]
			 */
			show: function(src) {
				this.createDom();
				this.$viewer.removeClass("fullscreen")
				this.bindImage(src);
				this.$viewer.show();
			},
			/**
			 * 绑定图片
			 */
			bindImage: function(src) {
				var self = this,
					img = this.$img[0];
				if (src == img.src) {
					this._resetState();
				} else {
					img.onload = function() {
						self._resetState();
						img.onload = null;
					};
					img.src = src;
					this.$thumbnail[0].src = src;
				}
			},
			/**
			 * 1.还原
			 */
			restore: function() {
				this._resetState();
			},
			/**
			 * 2.平移
			 */
			translation: function(eventType, ev) {
				var state = this.state,
					trace = this.trace,
					mx = ev.pageX,
					my = ev.pageY;
				if (eventType == "mousemove") {
					var offsetX = mx - trace._startX;
					var offsetY = my - trace._startY;
					state.posX = offsetX + trace._startPosX;
					state.posY = offsetY + trace._startPosY;
					this._refreshTransform();
				} else if (eventType == "mousedown") {
					trace._startX = mx;
					trace._startY = my;
					trace._startPosX = state.posX;
					trace._startPosY = state.posY;
				}
			},
			/**
			 * 3.缩放
			 */
			zoom: function(scale) {
				var next = this.state.scale + scale;
				next > 0 && (this.state.scale = next);
				this._refreshTransform();
			},
			/**
			 * 4.原始大小
			 */
			realSize: function() {
				this.state.scale = 1;
				this._refreshTransform();
			},
			/**
			 * 5.左旋转
			 */
			rotateLeft: function(eventType) {
				var state = this.state;
				state.rotate -= state.horizontal * state.vertical * 90;
				this._refreshTransform();
			},
			/**
			 * 6右旋转
			 */
			rotateRight: function(deg) {
				var state = this.state;
				state.rotate += state.horizontal * state.vertical * 90;
				this._refreshTransform();
			},
			/**
			 * 7水平翻转
			 */
			horizontalTurn: function(deg) {
				this.state.horizontal *= -1;
				this._refreshTransform();
			},
			/**
			 * 8垂直翻转
			 */
			verticalTurn: function(deg) {
				this.state.vertical *= -1;
				this._refreshTransform();
			},
			/**
			 * 刷新位置缩放样式
			 */
			_refreshTransform: function() {
				var state = this.state,
					stl = this.$img[0].style,
					buff = [];
				buff.push("translate(");
				buff.push(state.posX);
				buff.push("px,");
				buff.push(state.posY);
				buff.push("px) ");
				buff.push("scale(");
				buff.push(state.scale * state.horizontal);
				buff.push(",");
				buff.push(state.scale * state.vertical);
				buff.push(") rotate(");
				buff.push(state.rotate);
				buff.push("deg)");
				buff = buff.join("");
				// 兼容各浏览器
				stl.transform = buff;
				stl.oTransform = buff;
				stl.msTransform = buff;
				stl.mozTransform = buff;
				stl.webkitTransform = buff;
				//this.changeThumbnail();
			},
			/**
			 * 重置状态信息
			 *
			 * @private
			 */
			_resetState: function(ii) {
				var img = this.$img[0],
					$viewer = this.$viewer,
					$thumbnail = this.$thumbnail,
					imgWidth = img.width,
					imgHeight = img.height;
				var state = this.state,
					sandBoxWidth = $viewer.width(),
					sandBoxHeight = $viewer.height();
				// 中央显示
				state.posX = (sandBoxWidth - imgWidth) / 2;
				state.posY = (sandBoxHeight - imgHeight) / 2;
				if ((imgWidth / sandBoxWidth) > (imgHeight / sandBoxHeight)) {
					state.scale = sandBoxWidth * 0.7 / imgWidth;
					$thumbnail.css({
						width: "100%",
						height: "auto"
					});
				} else {
					state.scale = sandBoxHeight * 0.7 / imgHeight;
					$thumbnail.css({
						width: "auto",
						height: "100%"
					});
				}
				state.horizontal = 1;
				state.vertical = 1;
				state.rotate = 0;
				this._refreshTransform();
			},
			changeThumbnail: function() {
				var state = this.state,
					$thumbnail = this.$thumbnail,
					width = this.$img[0].width;
				var left = state.scale * width + state.posX;
			}
		}).init();
	})($);

	exports.show = function(src) {
		CommonImageViewer.show(src);
	};
});