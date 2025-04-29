usesensors.models.Tool = Backbone.Model.extend({
    idAttribute: "name",
    defaults: {
        attributes: [],
        min_width: 20,
        min_height: 20,
        hint: 'def value'
    },
    initialize: function () {
    },
    get_attributes: function (sensor) {
        var attributes = {};
        _.forEach(this.get("attributes"), function (attribute) {
            var value, default_value;

            if (_.isArray(attribute.default)) {
                // deep copy for multi dimensional arrays.
                // http://stackoverflow.com/a/817050/498402
                default_value = $.extend(true, [], attribute.default);
            } else {
                default_value = attribute.default;
            }
            if (sensor)
                value = sensor.get(attribute.name);

            if (value === undefined)
                value = default_value;

            attributes[attribute.name] = value;

        }, this);
        return attributes;
    }
});

usesensors.collections.Toolbox = Backbone.Collection.extend({
    model: usesensors.models.Tool
});