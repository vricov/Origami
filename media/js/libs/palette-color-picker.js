/*!
 * JQuery Palette Color Picker v1.13 by Carlos Cabo ( @putuko )
 * https://github.com/carloscabo/jquery-palette-color-picker
 */
(function(t) {
    "use strict";
    t.paletteColorPicker = function(e, a) {
        var s = "palette-color-picker"
          , i = t(e)
          , n = this
          , o = null
          , l = i.val()
          , r = i.attr("name")
          , c = t("<div>").addClass(s + "-button").attr("data-target", r)
          , u = t("<div>").addClass(s + "-bubble")
          , f = {}
          , d = {
            custom_class: null,
            colors: null,
            position: "upside",
            insert: "before",
            clear_btn: "first",
            timeout: 2e3,
            set_background: false,
            close_all_but_this: false
        }
          , g = "ontouchstart"in document.documentElement ? "touchstart click" : "click";
        n.init = function() {
            n.settings = t.extend({}, d, a);
            var e = i.attr("value");
            if (typeof e === typeof undefined || e === false) {
                e = "";
                i.attr("value", e)
            }
            i.attr("data-initialvalue", i.attr("value"));
            if (n.settings.colors === null) {
                n.settings.colors = i.data("palette")
            }
            if (typeof n.settings.colors[0] === "string") {
                n.settings.colors = t.map(n.settings.colors, function(t, e) {
                    var a = {};
                    a[t] = t;
                    return a
                })
            }
            n.settings.insert = n.settings.insert.charAt(0).toUpperCase() + n.settings.insert.slice(1);
            if (n.settings.custom_class) {
                u.addClass(n.settings.custom_class)
            }
            if (n.settings.clear_btn !== null) {
                var o = t("<span>").addClass("swatch clear").attr("title", "Clear selection");
                if (n.settings.clear_btn === "last") {
                    o.addClass("last").appendTo(u)
                } else {
                    o.prependTo(u)
                }
            }
            n.destroy = function() {
                c.remove();
                t.removeData(i[0])
            }
            ;
            n.clear = function() {
                u.find(".active").removeClass("active");
                c.removeAttr("style");
                i.val("")
            }
            ;
            n.reset = function() {
                if (i.attr("data-initialvalue") === "") {
                    n.clear()
                } else {
                    var t = i.attr("data-initialvalue");
                    u.find('[data-name="' + t + '"]').trigger("click")
                }
            }
            ;
            n.reload = function() {
                var t = i.val();
                if (t === "" || typeof t === typeof undefined || t === false) {
                    n.reset()
                } else {
                    if (u.find('[data-name="' + t + '"]').length) {
                        u.find('[data-name="' + t + '"]').trigger("click")
                    } else {
                        n.reset()
                    }
                }
            }
            ;
            c.append(u).on(g, function(e) {
                e.preventDefault();
                e.stopPropagation();
				
				t.each(n.settings.colors, function(e, a) {
					var s = Object.keys(a)[0]
					, i = a[s]
					, n = t("<span>").addClass("swatch").attr({
	
						"data-color": i,
						"data-name": s
					}).css("background-color", i).html(s);
					if (s === l) {
						n.addClass("active");
						c.css("background", i)
					}
					n.appendTo(u)
				});
				
				
				
				
                var a = t(this);
                if (!t(e.target).hasClass(s + "-bubble")) {
                    if (typeof n.settings.onbeforeshow_callback === "function") {
                        n.settings.onbeforeshow_callback(this)
                    }
                    a.toggleClass("active");
                    var i = a.find("." + s + "-bubble");
                    if (n.settings.close_all_but_this) {
                        t("." + s + "-bubble").not(i).fadeOut()
                    }
                    i.fadeToggle();
                    if (a.hasClass("active")) {
                        clearTimeout(n.timer);
                        n.timer = setTimeout(function() {
                            a.trigger("pcp.fadeout")
                        }, n.settings.timeout)
                    }
                }
            }).on("pcp.fadeout", function() {
                t(this).removeClass("active").find("." + s + "-bubble").fadeOut()
            }).on("mouseenter", "." + s + "-bubble", function() {
                clearTimeout(n.timer)
            }).on("mouseleave", "." + s + "-bubble", function() {
                n.timer = setTimeout(function() {
                    c.trigger("pcp.fadeout")
                }, n.settings.timeout)
            }).on(g, "." + s + "-bubble span.swatch", function(e) {
                e.preventDefault();
                e.stopPropagation();
                var a = t(this).attr("data-color")
                  , i = t(this).attr("data-name")
                  , o = t("." + s + '-button[data-target="' + t(this).closest("." + s + "-button").attr("data-target") + '"]')
                  , l = t(this).closest("." + s + "-bubble");
                l.find(".active").removeClass("active");
                if (t(e.target).is(".clear")) {
                    o.removeAttr("style");
                    a = ""
                } else {
                    t(this).addClass("active");
                    o.css("background", a)
                }
                if (typeof n.settings.onchange_callback === "function") {
                    n.settings.onchange_callback(a)
                }
                if (n.settings.set_background === false) {
                    t('[name="' + o.attr("data-target") + '"]').val(i);
                    t('[name="' + o.attr("data-target") + '"]').trigger('change');
                } else {
                    t('[name="' + o.attr("data-target") + '"]').css({
                        "background-color": a
                    })
                }
            })["insert" + n.settings.insert](i);
            if (n.settings.position === "downside" || i.offset().top + 20 < u.outerHeight()) {
                u.addClass("downside")
            }
        }
        ;
        t("body").on(g, function(e) {
            if (!t(e.target).hasClass(s + "-button")) {
                t(c).removeClass("active").find("." + s + "-bubble").fadeOut()
            }
        });
        n.init()
    }
    ;
    t.fn.paletteColorPicker = function(e) {
        return this.each(function() {
            if (typeof t(this).data("paletteColorPickerPlugin") === "undefined") {
                t(this).data("paletteColorPickerPlugin", new t.paletteColorPicker(this,e))
            }
        })
    }
}
)(jQuery);
