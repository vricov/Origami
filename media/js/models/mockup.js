usemockups.models.Mockup = Backbone.NestedModel.extend({
    idAttribute: "_id",
    defaults: {
        top: 0,
        left: 0,
        "z-index": 100,
        tageval: "",
        membership: "",
        tool: "label" // по умолчанию используем "label"
    },
    initialize: function () {
        // Проверяем, существует ли инструмент
        this.tool = usemockups.toolbox.get(this.get("tool"));
        
        // Если tool не найден, используем "label" как fallback
        if (!this.tool) {
            console.warn('Tool not found:', this.get("tool"), 'using default "label" tool');
            this.tool = usemockups.toolbox.get("label");
        }
        
        this.get_attributes = this.tool.get_attributes.bind(this.tool, this);

        // Получаем атрибуты из инструмента
        var toolAttributes = this.get_attributes();

        // Применяем defaults и потом значения из tool
        _.forEach(toolAttributes, function (value, key) {
            if (!this.has(key)) {  // Если ключа нет в текущей модели
                this.set(key, value);
            }
        }, this);

        this.on("change persist", this.persist, this);
        this.document = this.collection;
    },
    is_resizable: function () {
        return this.has("width") || this.has("height")
    },
    persist: function () {
        this.document && this.document.trigger("persist");
    }
});

usemockups.collections.Mockups = Backbone.Collection.extend({
    model: usemockups.models.Mockup,
    initialize: function () {
    },
    comparator: function (model) {
        return model.get('ordinal');
    },
});
