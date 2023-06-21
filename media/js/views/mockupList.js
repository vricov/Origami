var HandlebarMockupList = Handlebars.compile($("#sensor-list").html());

usemockups.views.MockupList = Backbone.View.extend({
    tagName: "div",
    className: "sensor",
    events: {
        'click': 'show_property_dialog',
        'update-sort': 'updateSort',
        
        'drop':'drop'
    },
    initialize: function () {
		this.model.on("change", this.render, this);
		this.model.on("change:top", this.render, this);
        this.tool = usemockups.toolbox.get(this.model.get("tool")); //gets which kind of mockup element it is (called tool, since they are created via tools). Get model via text string like "text"(for text tool) ,since the toolbox-model’s ids are actually human readable text strings for the represented tools.
        this.model.on("destroy", this.detach, this);
        this.model.document = this.model.collection;
    },
    drop: function(event, index) {
        this.$el.trigger('update-sort', [this.model, index]);
    },
    render: function (rendering_options) {
        var options = _.extend({
             focus: true,
            show_property_dialog: true
        }, rendering_options);
        this.$el.children().remove();
        // usemockups.collections.Mockups
        // this.model.collection.each(this.appendModelView,this);
        this.$el.html(HandlebarMockupList(this.model.get_attributes()));
        
        this.$el.bind("click mousedown", function (event) {
            this.$el.focus();
        }.bind(this));
        
        if (options.show_property_dialog)
            this.show_property_dialog();
        
        if (options.focus)
            this.focus();

        return this;
    },
    appendModelView: function(model) {
        var el = new usemockups.View.Item({model:model}).render().el;
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
    
    updateSort: function(event, model, position) { 
        this.model.document.remove(model);  
        // this.model.destroy();
        // console.log(this.model.document);  
        this.model.document.each(function(model,index) { 
            var ordinal = index;
            if (index >= position) {
                ordinal += 1;
            }
            model.set('ordinal', ordinal);  
        }); 
        
        model.set('ordinal', position);  
        this.model.document.add(model, {at : position});   
          
        this.render();
    },

    detach: function () {
        this.$el.remove();
    },
});