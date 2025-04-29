usesensors.models.Document = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('documents'),
    defaults: {
        "sensors": [],
        "title": "untitled",
        "startupscript": "",
        "generalmap": "",
        "generalmap_name": "",
        "generalmap_bit": 4,
        "prefix": "",
        "hasHeader": true,
        "width": 700,
        "height": 600
    },
    initialize: function() {
        this.sensors = new usesensors.collections.Sensors;
        this.sensors.on("add remove persist", this.persist, this);
    },
    persist: function() {
        this.set("sensors", this.sensors.toJSON());
        this.save();
    },
    parse: function(result) {
        if (this.sensors && !this.sensors.length)
            this.sensors.reset(result.sensors);
        return result;
    }

});

usesensors.collections.Documents = Backbone.Collection.extend({
    model: usesensors.models.Document,
    localStorage: new Backbone.LocalStorage('documents')

});