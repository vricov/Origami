//This is the view for the mockup elements (button, checkbox, etc.)
Handlebars.registerHelper('quoted', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    if (text.length > 0) {
        text = text.replace(/&quot;/g, '&quot;&quot;');
        text = '"' + text + '"';
    }
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('underlines', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace(/\s+/g, '_');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('unspace', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace(' ', '&nbsp');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('spacers', function (text, bmptype) {
    text = Handlebars.Utils.escapeExpression(text);
    bmptype = Handlebars.Utils.escapeExpression(bmptype);
    text = text.toString();
    text = '_' + text.replace(/\s+/g, '');
    if (bmptype == 'barbmp') { text = '' };
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('compare', function(value, operator, compareValue, options) {
    switch(operator) {
        case '==': // мягкое сравнение (числа со строками)
            return value == compareValue ? options.fn(this) : options.inverse(this);
        case '===': // строгое сравнение
            return value === compareValue ? options.fn(this) : options.inverse(this);
        case '>':
            return value > compareValue ? options.fn(this) : options.inverse(this);
        case '<':
            return value < compareValue ? options.fn(this) : options.inverse(this);
        case '>=':
            return value >= compareValue ? options.fn(this) : options.inverse(this);
        case '<=':
            return value <= compareValue ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('and', function() {
    for (let i = 0; i < arguments.length - 1; i++) {
        if (!arguments[i]) {
            return false;
        }
    }
    return true;
});

Handlebars.registerHelper('eq', function(a, b) {
    // Приведем к строкам для точного сравнения
    return String(a) === String(b);
});

Handlebars.registerHelper('neq', function(a, b) {
    // Приведем к строкам для точного сравнения
    return String(a) !== String(b);
});

Handlebars.registerHelper('not', function(value) {
    return !value;
});

Handlebars.registerHelper('or', function() {
    for (let i = 0; i < arguments.length - 1; i++) {
        if (arguments[i]) {
            return true;
        }
    }
    return false;
});

// Хелпер для проверки регистра первой буквы (возвращает true/false)
Handlebars.registerHelper('isFirstUpper', function(text) {
    if (!text || typeof text !== 'string') return false;
    return text.charAt(0) === text.charAt(0).toUpperCase();
});

Handlebars.registerHelper('zoom', function (text, value) {
    var zoom = Number($('article').attr('zoom'));
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text * zoom;
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('colorRGB', function (text, value) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString().toLowerCase();
    text = colors_palette_line[0][text];
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('replaceFuncColors', function (text, value) {
    text = Handlebars.Utils.escapeExpression(text);
    // text = text.toString().toLowerCase();
    text = text[0].toUpperCase() + text.slice(1);
    if (func_colors_palette[0][text] != undefined) text = func_colors_palette[0][text];
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('toUpperCase', function (text, value) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString().toUpperCase();
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('replaceFuncColorsLower', function (text, value) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString().toLowerCase();
    if (func_colors_palette[0][text] != undefined) text = func_colors_palette[0][text];
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('font-style', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    switch (text) {
        case '':
            break;
        case 'Bold':
            text = "font-weight: Bold;"
            break;
        case 'Italic':
            text = "font-style: Italic;"
            break;
        case 'Underline':
            text = "text-decoration: Underline;"
            break;
        case 'StrikeOut':
            text = "text-decoration: line-through;"
            break;
    }
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('pt', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace('pt', '');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('ch', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    text = text.replace('ch', '');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('inc', function (value, options) {
    return parseInt(value) + 1;
});

function zoomValueCh(value, zoom) {
    if (value.toString().match(/ch/)) {
    } else {
        value = value * zoom;
    }
    return value;
}

function zoomValuePt(value, zoom) {
    if (value == undefined) { value = 1; }
    if (value.toString().match(/pt/)) {
        value = value.replace('pt', '') * zoom + 'pt';
    } else {
        value = value * zoom;
    }
    return value;
}

var HandlebarMockup = Handlebars.compile($("#universal-template").html());
usemockups.views.Mockup = Backbone.View.extend({
    tagName: "div",
    className: "object",
    events: {
        "click": "show_property_dialog",
        "keydown": "keydown",
        "keyup": "keyup"
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("change:top", this.render, this);
        this.article = $("article");
        this.tool = usemockups.toolbox.get(this.model.get("tool")); //gets which kind of mockup element it is (called tool, since they are created via tools). Get model via text string like "text"(for text tool) ,since the toolbox-model�s ids are actually human readable text strings for the represented tools.
        this.model.on("destroy", this.detach, this);
        this.model.document = this.model.collection;
    },
    render: function (rendering_options) {
        var options = _.extend({
            focus: true,
            show_property_dialog: true
        }, rendering_options);
        var gridDivider = 1;
        var zoom = Number(this.article.attr('zoom'));
        this.$el.css({
            "top": this.model.get("top") * zoom + this.article.offset().top,
            "left": this.model.get("left") * zoom + this.article.offset().left,
            "font-size": zoomValuePt(this.model.get("tags[0].height"), zoom),
            "font-family": this.model.get("led_attributes[0].led_font"),
            "width": zoomValueCh(this.model.get("tags[0].width"), zoom) || "auto",
            "height": zoomValuePt(this.model.get("tags[0].height"), zoom) || "auto",
            "z-index": this.model.get("z-index") || "100"
        }).draggable({
            snap: ".object",
            snapTolerance: 3,
            "containment": "article",
            "drag": function (event, ui) {
                if ($("#id_grid").is(":checked")) {
                    gridDivider = Number($("#id_grid_divider").val()) * zoom;
                    ui.position.top = Math.round(ui.position.top / gridDivider) * gridDivider;
                    ui.position.left = Math.round(ui.position.left / gridDivider) * gridDivider;
                }

                $("#id_top").val(Math.round((ui.position.top - this.article.offset().top) / zoom));
                $("#id_left").val(Math.round((ui.position.left - this.article.offset().left) / zoom));
            }.bind(this),
            "stop": function (event, ui) {
                if ($("#id_grid").is(":checked")) {
                    gridDivider = Number($("#id_grid_divider").val()) * zoom;
                    ui.position.top = Math.round(ui.position.top / gridDivider) * gridDivider;
                    ui.position.left = Math.round(ui.position.left / gridDivider) * gridDivider;
                }
                this.model.set({
                    "top": Math.round((ui.position.top - this.article.offset().top) / zoom),
                    "left": Math.round((ui.position.left - this.article.offset().left) / zoom)
                });
                this.model.trigger('change');
            }.bind(this)
        }).html(HandlebarMockup(this.model.get_attributes()));

        this.$el.bind("click mousedown", function (event) {
            if (!$(event.target).is("input")) {
                this.focus();
            }
        }.bind(this));

        if (options.show_property_dialog)
            this.show_property_dialog();

        if (options.focus)
            this.focus();

        if (!this.model.is_resizable())
            return;

        if (this.$el.hasClass("ui-resizable"))
            this.$el.resizable("destroy");

        this.$el.resizable({
            handles: "se",
            resize: function (event, ui) {
                if (!this.model.has("tags[0].height"))
                    ui.size.height = ui.originalSize.height;
                if (!this.model.has("tags[0].width"))
                    ui.size.width = ui.originalSize.width;
                usemockups.active_tags_dialog.trigger("update_for_sizes", ui.size);
            }.bind(this),
            stop: function (event, ui) {
                var zoom = Number(this.article.attr('zoom'));
                if (this.model.get("tags[0].type") == "ledbmp") {
                    var ch_size = getCharWidth(this.model.get("led_attributes[0].led_style") + " " + this.model.get("led_attributes[0].led_size") + "pt " + this.model.get("led_attributes[0].led_font"));
                    ui.size.width = Math.round(ui.size.width / ch_size / 1.33 / zoom) + "ch";
                    ui.size.height = Math.round(1.33 * this.model.get("led_attributes[0].led_size")) + "pt";
                } else {
                    ui.size.width = Math.round(ui.size.width / zoom);
                    if (ui.size.width < 1) ui.size.width = 1;
                    ui.size.height = Math.round(ui.size.height / zoom);
                    if (ui.size.height < 1) ui.size.height = 1;
                }

                this.model.set({
                    "width": ui.size.width,
                    "height": ui.size.height,
                    "tags[0].width": ui.size.width,
                    "tags[0].height": ui.size.height,
                });

            }.bind(this),
                minWidth: this.tool && this.tool.get ? this.tool.get("min_width") || 1 : 1,
    minHeight: this.tool && this.tool.get ? this.tool.get("min_height") || 1 : 1,
        });

        return this;
    },

    measure: function () {
        this.model.set("measured_size", { height: this.$el.height(), width: this.$el.width() });
        this.model.save();
    },

    focus: function () {
        this.$el.focus();
        return this;
    },
    show_property_dialog: function () {
        if (usemockups.active_property_dialog &&
            usemockups.active_property_dialog.model === this.model) {
            return;
        }

        if (usemockups.active_property_dialog) {
            usemockups.active_property_dialog.undelegateEvents();
        }

        if (usemockups.active_tags_dialog) {
            usemockups.active_tags_dialog.undelegateEvents();
        }

        var measuredSizes = { height: this.$el.height(), width: this.$el.width() };

        usemockups.active_property_dialog = (new usemockups.views.PropertyDialog({
            "model": this.model
        })).set_measuredSizes(measuredSizes).render()

        usemockups.active_tags_dialog = (new usemockups.views.TagsDialog({
            "model": this.model
        })).set_measuredSizes(measuredSizes).render()

    },

    detach: function () {
        this.$el.remove();
    },

    /*
     * Moves the mockup if the key was an arrow key.
     */
    keydown_move: function (e) {
        var movements = {
            37: { "left": -5 },
            39: { "left": 5 },
            38: { "top": -5 },
            40: { "top": 5 }
        };
        if (movements[e.keyCode]) {
            var movement = movements[e.keyCode];
            for (var direction in movement) {
                this.model.set(direction, this.model.get(direction) + movement[direction]);
                $("#id_top").val(this.model.get("top"));
                $("#id_left").val(this.model.get("left"));
                // this.model.save();
            }

            return false;
        }
    },

    /*
     * Rotate the mockup if the key was an space key.
     */
    keydown_rotate: function (e) {
        if (e.keyCode == 32) {
            this.model.set({ "tags[0].width": this.model.get("tags[0].height"), "tags[0].height": this.model.get("tags[0].width") });
            return false;
        }
    },

    /*
     * Deletes the mockup if the key was the del key.
     */
    keydown_destroy: function (e) {
        if (e.keyCode == 46) {
            this.model.destroy();
            return false;
        }
    },

    keydown: function (e) {
        this.keydown_move(e);
        this.keydown_rotate(e);
        this.keydown_destroy(e);
    },

    keyup: function (e) {
        if (event.code == 'KeyC' && (event.ctrlKey || event.metaKey)) {
            var copy = this.model.clone();
            copy.attributes.top = copy.attributes.top + 5;
            copy.attributes.left = copy.attributes.left + 5;
            copy.attributes.name = copy.attributes.name.replace(/[.][c]\d{1,}/g, '') + '.' + copy.cid;
            this.model.collection.add(copy);
            return copy;
        }
    }
});