usesensors.models.Sensor = Backbone.NestedModel.extend({
    idAttribute: "_id",
    defaults: {
        top: 0,
        left: 0
    },
    initialize: function () {
        this.tool = usesensors.toolbox.get(this.get("tool")); //get the model of the tool/kind of sensor element
        this.get_attributes = this.tool.get_attributes.bind(this.tool, this);
        _.forEach(this.get_attributes(), function (value, key) { 
            this.set(key, value);
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

usesensors.collections.Sensors = Backbone.Collection.extend({
    model: usesensors.models.Sensor,    
    initialize: function () {
    },
    comparator: function (model) {
        return model.get('ordinal');
    },
});
