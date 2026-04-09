usemockups.models.Document = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('documents'),
    defaults: {
        "mockups": [],
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
    initialize: function () {
        this.mockups = new usemockups.collections.Mockups;
        this.mockups.on("add remove persist", this.persist, this);
        // Дебаунс: сериализуем и сохраняем не чаще одного раза в 300мс
        this._debouncedSave = _.debounce(function () {
            this.set("mockups", this.mockups.toJSON());
            this.save();
        }.bind(this), 300);
    },
    persist: function () {
        this._debouncedSave();
    },
    parse: function (result) {
        if (this.mockups && !this.mockups.length)
            this.mockups.reset(result.mockups);
        return result;
    }

});

usemockups.collections.Documents = Backbone.Collection.extend({
    model: usemockups.models.Document,
    localStorage: new Backbone.LocalStorage('documents')

});