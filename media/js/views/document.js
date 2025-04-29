//this is the main document view (the "viewport" or "canvas" where the actual content is created)
let readResult = '';
usesensors.views.Page = Backbone.View.extend({
    "el": "article", //this needs to be changed from article to something else because of conflicts with html5 article element

    sensor_count: 0,

    initialize: function () {
        this.model.sensors.on("add", this.add_sensor, this);
        this.model.sensors.on("reset", this.render_sensors, this);
        this.model.on("change:width change:height", this.resize_document, this);
        this.render_sensors();
    },

    add_sensor: function (sensor, options) {
        var sensor_view = new (usesensors.views.Sensor)({
            model: sensor
        });
        var sensorList_view = new (usesensors.views.SensorList)({
            model: sensor
        });
        var sensorListEl = sensorList_view.render(options).el;
        sensorList_view.$el.data('model', sensor);

        this.$el.append(sensor_view.render(options).el);
        $(".sensorList").append(sensorListEl);

        sensor_view.$el.attr("tabindex", this.sensor_count++);
        // this.model.save(); // Removed this, to make only one call after adding all elements
        return this;
    },


    render_sensors: function () {
        this.$el.empty();
        $(".sensorList").empty();

        _.forEach(this.model.sensors.models, function (model) {
            this.add_sensor(model, { focus: true, show_property_dialog: false });
        }, this);
        this.model.sensors.off("reset");
        this.model.save(); // save after adding all elements
        if (!$('.sensorList').data('sortable')) {
            $('.sensorList').sortable({
 // consider using update instead of stop
                update: function (event, ui) {
 ui.item.data('model').trigger('update-sort', ui.item.index());
                }
            }).data('sortable', true);
        }

    },


    resize_document: function () {
        var zoom = this.$el.attr('zoom')
        this.$el
            .width(this.model.get("width") * zoom)
            .height(this.model.get("height") * zoom);
    },

    render: function () {
        this.resize_document();
        var zoom = Number(this.$el.attr('zoom'));
        this.$el.droppable({
            accept: ".toolbox li",
            drop: function (event, ui) {
                var left = Math.round(ui.offset.left - this.$el.offset().left) / zoom,
                    top = Math.round(ui.offset.top - this.$el.offset().top) / zoom,
                    tool_name = ui.draggable.data("tool");

                var sensor = new usesensors.models.Sensor({
                    top: top,
                    left: left,
                    tool: tool_name
                });
                sensor.attributes.name = sensor.attributes.name + '.' + sensor.cid;
                sensor.attributes.hint = 'Sensor ' + sensor.attributes.name;
                if (this.model.get("prefix") != '') { sensor.attributes.name = this.model.get("prefix") + '.' + sensor.attributes.name }
                if ((sensor.attributes.tool == 'line') || (sensor.attributes.tool == 'label')) {
                    sensor.attributes.hint = this.model.get("title");
                }
                this.model.sensors.add(sensor);
                this.model.save_document();
                this.render();
            }.bind(this)
        });
    }
});

//this is the main view of the app (with toolbars, the document itself ("page") etc.)
usesensors.views.Document = Backbone.View.extend({
    el: "body",

    events: {
        "change article": "update_zoom", // This might need to be changed depending on the 'el' name change above
    },

    render: function () {
        (new usesensors.views.Toolbox({
            model: usesensors.toolbox
        })).render();

        this.article = (new usesensors.views.Page({
            model: this.model
        }));
        this.article.render();

        this.edit_form = new usesensors.views.DocumentEditForm({
 model: this.model
        });
        this.edit_form.render();

        this.import_form = new usesensors.views.DocumentImportForm({
            model: this.model
        });
        this.import_form.render();

        this.export_form = new usesensors.views.DocumentExportForm({
            model: this.model
        });
        this.export_form.render();
 },
    update_zoom: function () {
        this.article = (new usesensors.views.Page({
            model: this.model
 }));
        if ($('img#generalMap').attr('zoom') == undefined) $('img#generalMap').attr('original_width', $('img#generalMap').width());
        var zoom = Number(this.article.$el.attr('zoom'));
        $('img#generalMap').css('width', $('img#generalMap').attr('original_width') * zoom);
        this.article.render();
    },
});

 //this is the view of items of documents (select and destroy functions)
usesensors.views.NavigationItem = Backbone.View.extend({
    tagName: "li",
    template: $("#navigation-item-template").html(),
    events: {
        "click a.show": "navigate",
        "click a.destroy": "destroy"
    },
    render: function () {
        this.$el.html(_.template(this.template, this.model.toJSON()))
        return this;
    },
    navigate: function () {
        this.options.router.navigate_document(this.model);
    },
    destroy: function () {
        if (!window.confirm("Удаляем?"))
            return false;

        this.model.destroy();
        this.$el.remove();
        return false;
    }
});

//this is the view of a form to create a new document
usesensors.views.NewDocumentForm = Backbone.View.extend({
    el: "nav #documents form",
    events: {
        "submit": "submit_form"
    },
    submit_form: function () {
        var title = this.$el.find("#id_title");
        if (title) {
            (new usesensors.models.Document()).save({ title: title.val() }, {
                success: function (model) {
                    this.model.add(model);
                    title.val("");
                }.bind(this)
            });
        }
        return false;
    }
});

//view for setting document properties
usesensors.views.DocumentEditForm = Backbone.View.extend({
    el: "nav #document-properties",
    events: {
        "submit": "submit_form"
    },
    initialize: function () {
        this.model.on("importDone", this.render, this);
    },
    render: function () {
        this.$el.find("#id_doc_title").val(this.model.get("title"));
        this.$el.find("#id_doc_startupscript").val(this.model.get("startupscript"));
        $("#hasHeader").attr('checked', this.model.get("hasHeader"))
        $("#generalMap").attr("src", this.model.get("generalmap"));
        this.$el.find("#id_doc_generalmap_bit").val(this.model.get("generalmap_bit"));
        this.$el.find("#id_doc_prefix").val(this.model.get("prefix"));
        this.$el.find("#id_doc_width").val(this.model.get("width"));
        this.$el.find("#id_doc_height").val(this.model.get("height"));
    },
    submit_form: function (event) {
        event.preventDefault();
        var generalmap_name = '';
        var hasHeader = '';
        if (this.$el.find("#id_doc_generalmap_select")[0].files[0] != undefined)
            generalmap_name = this.$el.find("#id_doc_generalmap_select")[0].files[0].name;
        hasHeader = $("#hasHeader").is(":checked");
        this.model.set({
            "title": this.$el.find("#id_doc_title").val(),
            "startupscript": this.$el.find("#id_doc_startupscript").val(),
            "generalmap": this.$el.find("#id_doc_generalmap").val(),
            "generalmap_name": generalmap_name,
            "generalmap_bit": this.$el.find("#id_doc_generalmap_bit").val(),
            "prefix": this.$el.find("#id_doc_prefix").val(),
            "hasHeader": hasHeader,
            "width": this.$el.find("#id_doc_width").val(),
            "height": this.$el.find("#id_doc_height").val()
        });
        $("#generalMap").attr("src", this.model.get("generalmap"));
        this.model.save();
        $("#document-properties").hide();
        return false;
    }
});

// http://stackoverflow.com/questions/13294216/exporting-backbone-js-collection-to-plain-text-on-hard-disk-importing-back
usesensors.views.DocumentImportForm = Backbone.View.extend({
    el: "nav #document-import",
    events: {
        "click #import": "import_document",
        "change": "open_file",
        "click #clearProject": "clearProject",
    },

    initialize: function () {
        this.model.on("change", this.render, this);
    },

    render: function () {
        // makes sure previous content is voided
        this.$el.find("#id_models").val("");
        this.$el.find("#id_models_ori").val("");
    },

    import_document: function () {
        val = ConvertModel($("#id_models").val());
        var sensors = JSON.parse(this.$el.find("#id_models_ori").val());
        if (sensors.title) this.model.attributes.title = sensors.title;
        if (sensors.width) this.model.attributes.width = sensors.width;
        if (sensors.height) this.model.attributes.height = sensors.height;
        if (sensors.startupscript) this.model.attributes.startupscript = sensors.startupscript;
        this.model.sensors.add(sensors.sensors);
        this.model.save();
        this.model.trigger('importDone');
        console.log('-/- IMPORT DONE -/-');
        $("#document-import").hide();
        return false;
    },

    open_file: function () {
        var files = this.$el.find("#id_models_file");
        let file = files[0].files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'cp1251');

        reader.onload = function () {
            readResult = reader.result;
            $("#id_models").val(readResult);
        };
        reader.onerror = function () {
            console.log(reader.error);
        };

        return false;
    },
    clearProject: function () {
        while (model = this.model.sensors.first()) {
 model.destroy();
        }
    },

    hide: function () {
        this.$el.parent().hide();
    },

    destroyAll: function () {
        this.$el.parent().hide();
    }
});

var HandlebarsTemplate = Handlebars.compile($("#crc-template").html());
// http://stackoverflow.com/questions/13294216/exporting-backbone-js-collection-to-plain-text-on-hard-disk-importing-back
usesensors.views.DocumentExportForm = Backbone.View.extend({
    el: "nav #document-export",
    events: {},

    initialize: function () {
        this.model.on("change", this.render, this);
    },
    render: function () {
        // makes sure previous content is voided
        this.$el.find("#id_models_crc").val("");

        if (typeof this.model.sensors !== 'undefined' && this.model.sensors.length > 0) {
            $('#id_models_crc').html(HandlebarsTemplate(this.model.toJSON()));
        }
    },

    hide: function () {
        this.$el.parent().hide();
    },

    destroyAll: function () {
        this.$el.parent().hide();
    }
});

usesensors.views.Navigation = Backbone.View.extend({
    el: "nav",
    events: {
        "click a.documents": "toggle_documents",
        "click a.properties": "toggle_document_properties",
        "click a.import": "toggle_import",
        "click a.export": "toggle_export",
        "click a.help": "toggle_help",
        "click a.about": "toggle_about"
    },
    initialize: function () {
        this.model.on("reset", this.render, this);
        this.model.on("add", this.add_document_item, this);
        this.model.fetch({ ajaxSync: true });
 },
    add_document_item: function(model) {
        this.$el.find(".mnemolist").append((new usesensors.views.NavigationItem({
            model: model,
            router: this.options.router,
            parent: this
        })).render().el);
    },
    render: function () {

        _.forEach(this.model.models, this.add_document_item, this); // Assuming this is meant to add sensor items

        new usesensors.views.NewDocumentForm({
            model: this.model
        }).render();
    },
    toggle_documents: function () {
        this.$el.find("#document-properties").hide();
        this.$el.find("#document-export").hide();
        this.$el.find("#document-import").hide();
        this.$el.find("#crc-help").hide();
        this.$el.find("#about").hide();
        this.$el.find("#documents").toggle();
        return false;
    },
    toggle_document_properties: function () {
        this.$el.find("#documents").hide();
        this.$el.find("#document-import").hide();
        this.$el.find("#document-export").hide();
        this.$el.find("#crc-help").hide();
        this.$el.find("#about").hide();
        this.$el.find("#document-properties").toggle();

        return false;
    },
    toggle_import: function () {
        this.$el.find("#documents").hide();
        this.$el.find("#document-properties").hide();
        this.$el.find("#document-export").hide();
        this.$el.find("#crc-help").hide();
        this.$el.find("#about").hide();
        this.$el.find("#document-import").toggle();

        return false;
    },
    toggle_export: function () {
        this.$el.find("#documents").hide();
        this.$el.find("#document-properties").hide();
        this.$el.find("#document-import").hide();
        this.$el.find("#crc-help").hide();
        this.$el.find("#about").hide();
        this.$el.find("#document-export").toggle();

        $('#save').submit();
        return false;
    },
    toggle_help: function () {
        this.$el.find("#documents").hide();
        this.$el.find("#document-properties").hide();
        this.$el.find("#document-import").hide();
        this.$el.find("#document-export").hide();
        this.$el.find("#about").hide();
        this.$el.find("#crc-help").toggle();
        $('#save').submit();
        return false;
    },
    toggle_about: function () {
        this.$el.find("#documents").hide();
        this.$el.find("#document-properties").hide();
        this.$el.find("#document-import").hide();
        this.$el.find("#document-export").hide();
        this.$el.find("#crc-help").hide();
        this.$el.find("#about").toggle();
        return false;
    }
});