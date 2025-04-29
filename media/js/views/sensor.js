//This is the view for the sensor elements (button, checkbox, etc.)
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

Handlebars.registerHelper('ifempty', function (text, value) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.toString();
    if (value === text)
        return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
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

var Handlebarsensor = Handlebars.compile($("#universal-template").html());
usesensors.views.sensor = Backbone.View.extend({
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
        this.tool = usesensors.toolbox.get(this.model.get("tool")); //gets which kind of sensor element it is (called tool, since they are created via tools). Get model via text string like "text"(for text tool) ,since the toolbox-model�s ids are actually human readable text strings for the represented tools.
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
            "height": zoomValuePt(this.model.get("tags[0].height"), zoom) || "auto"
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
        }).html(HandlebarSensor(this.model.get_attributes()));

        // this.$el.find("[data-attribute]").dblclick(function (event) {
        // var attribute = $(event.target).data("attribute");
        // var input = $("<input>")
        // .attr("name", attribute)
        // .data("attribute", attribute)
        // .val(this.model.get(attribute));
        // $(event.target).html(input);
        // input.select();

        // input.bind("change blur", function (event) {
        // var input = $(event.target);
        // this.model.set(input.data("attribute"), input.val());
        // }.bind(this)).keyup(function (event) {
        // usesensors.active_property_dialog.trigger("update_for_attribute", $(event.target));
        // usesensors.active_tags_dialog.trigger("update_for_attribute", $(event.target));
        // }.bind(this));
        // }.bind(this))

        // this.$el.find("input").change(function (event) {
        // var input = $(event.target);
        // var tags = JSON.parse(JSON.stringify(this.model.get("tags")));
        // var id = input.data("column");
        // tags[input.attr("id-attribute")][input.attr("data-attribute")] = input.val() || "";
        // this.model.set("tags", tags);
        // this.model.trigger("persist");
        // }.bind(this));

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

        // Return string width in pt
        // getCharWidth("bold 14pt PTMono")
        function getCharWidth(font) {
            var canvas = getCharWidth.canvas || (getCharWidth.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = font;
            var metrics = context.measureText("c");
            return metrics.width;
        }

        this.$el.resizable({
            handles: "se",
            resize: function (event, ui) {
                if (!this.model.has("tags[0].height"))
                    ui.size.height = ui.originalSize.height;
                if (!this.model.has("tags[0].width"))
                    ui.size.width = ui.originalSize.width;
                usesensors.active_tags_dialog.trigger("update_for_sizes", ui.size);
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
            minWidth: this.tool.get("min_width"),
            minHeight: this.tool.get("min_height"),
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
        if (usesensors.active_property_dialog &&
            usesensors.active_property_dialog.model === this.model) {
            return;
        }

        if (usesensors.active_property_dialog) {
            usesensors.active_property_dialog.undelegateEvents();
        }

        if (usesensors.active_tags_dialog) {
            usesensors.active_tags_dialog.undelegateEvents();
        }

        var measuredSizes = { height: this.$el.height(), width: this.$el.width() };

        usesensors.active_property_dialog = (new usesensors.views.PropertyDialog({
            "model": this.model
        })).set_measuredSizes(measuredSizes).render()

        usesensors.active_tags_dialog = (new usesensors.views.TagsDialog({
            "model": this.model
        })).set_measuredSizes(measuredSizes).render()

    },

    detach: function () {
        this.$el.remove();
    },

    /*
     * Moves the sensor if the key was an arrow key.
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
     * Rotate the sensor if the key was an space key.
     */
    keydown_rotate: function (e) {
        if (e.keyCode == 32) {
            this.model.set({ "tags[0].width": this.model.get("tags[0].height"), "tags[0].height": this.model.get("tags[0].width") });
            return false;
        }
    },

    /* 
     * Deletes the sensor if the key was the del key.
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