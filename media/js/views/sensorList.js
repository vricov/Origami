var HandlebarsensorList = Handlebars.compile($("#sensor-list").html());

usesensors.views.sensorList = Backbone.View.extend({
    tagName: "ul",
    className: "sensor",
    events: {
        'click': 'show_property_dialog',
        'update-sort': 'updateSort',

        'drop': 'drop'
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("change:position", this.render, this);
        this.tool = usesensors.toolbox.get(this.model.get("tool")); //gets which kind of sensor element it is (called tool, since they are created via tools). Get model via text string like "text"(for text tool) ,since the toolbox-model�s ids are actually human readable text strings for the represented tools.
        this.model.on("destroy", this.detach, this);
        this.model.document = this.model.collection;
    },
    drop: function (event, index) {
        this.$el.trigger('update-sort', [this.model, index]);
    },
    render: function (rendering_options) {
        var options = _.extend({
            focus: true,
            show_property_dialog: true
        }, rendering_options);
        this.$el.children().remove();
        // usesensors.collections.sensors
        // this.model.collection.each(this.appendModelView,this);
        this.$el.html(HandlebarsensorList(this.model.get_attributes()));

        this.$el.bind("click mousedown", function (event) {
            this.$el.focus();
        }.bind(this));

        if (options.show_property_dialog)
            this.show_property_dialog();

        if (options.focus)
            this.focus();

        return this;
    },
    appendModelView: function (model) {
        var el = new usesensors.View.Item({ model: model }).render().el;
        console.log(el);
        this.$el.append(el)
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

        usesensors.active_property_dialog = (new usesensors.views.PropertyDialog({
            "model": this.model
        })).render()

        usesensors.active_tags_dialog = (new usesensors.views.TagsDialog({
            "model": this.model
        })).render()
    },

    updateSort: function (event, position) {
        var models = this.model.document.models;
        var model = this.model;
        var oldIndex = model.get('ordinal');

        this.model.document.remove(model);

        if (oldIndex < position) {
            for (var i = oldIndex; i < position; i++) {
                models[i].set('ordinal', i);
            }
        } else {
            for (var i = position; i < oldIndex; i++) {
                models[i].set('ordinal', i + 1);
            }
        }

        model.set('ordinal', position);
        this.model.document.add(model, { at: position });
        // this.render(); //removed, because it will re-render the entire view
    },


    detach: function () {
        this.$el.remove();
    },
});