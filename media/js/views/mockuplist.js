var HandlebarMockupList = Handlebars.compile($("#sensor-list").html());

usemockups.views.MockupList = Backbone.View.extend({
    tagName: "div",
    className: "sensor",
    events: {
        'click': 'handleListItemClick', // Изменяем на собственный обработчик
        'update-sort': 'updateSort',
        'drop': 'drop'
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("change:top", this.render, this);
        this.tool = usemockups.toolbox.get(this.model.get("tool")); //gets which kind of mockup element it is (called tool, since they are created via tools). Get model via text string like "text"(for text tool) ,since the toolbox-model�s ids are actually human readable text strings for the represented tools.
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
        
        this.$el.html(HandlebarMockupList(this.model.get_attributes()));
        
        if (options.show_property_dialog)
            this.show_property_dialog();
        if (options.focus)
            this.focus();
        return this;
    },
    handleListItemClick: function(event) {
        // Добавляем обработчик клика на элемент списка
        if (!$(event.target).is("input")) {
            this.focusElementInUniversalTemplate();
            this.show_property_dialog();
        }
    },
    focusElementInUniversalTemplate: function() {
        // Найдем соответствующий элемент в #universal-template
        var modelAttributes = this.model.get_attributes();
        var elementId = this.model.cid;
        
        // Найдем элемент в #universal-template по id или другим критериям
        var universalTemplateElement = $('.object[data-model-id="' + elementId + '"]');
        if (universalTemplateElement.length > 0) {
            // Установим фокус на найденный элемент
            universalTemplateElement.focus();
        } else {
            console.warn("Элемент в #universal-template не найден для модели", elementId);
        }
    },
    appendModelView: function (model) {
        var el = new usemockups.View.Item({ model: model }).render().el;
        console.log(el);
        this.$el.append(el)
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

        usemockups.active_property_dialog = (new usemockups.views.PropertyDialog({
            "model": this.model
        })).render()

        usemockups.active_tags_dialog = (new usemockups.views.TagsDialog({
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