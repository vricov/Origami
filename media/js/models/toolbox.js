usemockups.models.Tool = Backbone.Model.extend({
    idAttribute: "name",
    defaults: {
        attributes: [],
        min_width: 20,
        min_height: 20,
        hint: 'def value',
        "z-index": 100,
        tageval: "",
        membership: ""
    },
    initialize: function () {
    },
    get_attributes: function (mockup) {
        var attributes = {};
        // Получаем атрибуты из модели, если они есть
        var modelAttributes = this.get("attributes") || [];

        _.forEach(this.get("attributes"), function (attribute) {
            var value, default_value;

            if (_.isArray(attribute.default)) {
                // deep copy для многомерных массивов
                default_value = $.extend(true, [], attribute.default);
            } else {
                default_value = attribute.default;
            }
            if (mockup)
                value = mockup.get(attribute.name);

            if (value === undefined || value === null) {
                value = default_value;
            }

            attributes[attribute.name] = value;

        }, this);
        return attributes;
    }
});

usemockups.collections.Toolbox = Backbone.Collection.extend({
    model: usemockups.models.Tool
});