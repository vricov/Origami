var HandlebarTag = Handlebars.compile($("#taglist-form-template").html());
//taglist Dialog for single elements of the mockup
usemockups.views.TagListDialog = Backbone.View.extend({
    el: "aside form",
    events: {
        'submit': 'submit',
    },
    initialize: function () {
        this.on("update_for_attribute", this.update_for_attribute);
        this.on("update_for_sizes", this.update_for_sizes);
    },
    render: function () {
        
        this.$el.html(HandlebarTag({
            "attributes": this.get_attributes()
        })).find("input").change(function (ui) {
            var input = $(ui.target);
            var value;
            if (input.is(":checkbox")) {
                value = input.is(":checked");
            } else {
                value = input.val();
            }
            if (!input.attr("data-attribute")) {
                this.model.set(input.attr("name"), value);
            } else {
                var data = this.model.get(input.attr("data-attribute"));
                data[0][input.attr("name")] = value;
                this.model.set({[input.attr("data-attribute")]: data});
            }
        }.bind(this));

        this.$el.find("a.delete").click(function () {
            this.destroy();
            return false;
        }.bind(this));

        return this;
    },
    set_measuredSizes: function (measuredSizes){
      this.measuredSizes = measuredSizes;
      return this;
    },
    update_for_attribute: function (field) {
        this.$el.find("#id_"  + field.data("attribute")).val(field.val());
    },
    update_for_sizes: function (size) {
        if (this.model.has("tags[0].height"))
            this.$el.find("#id_height").val(size.height);
        if (this.model.has("tags[0].height"))
            this.$el.find("#id_width").val(size.width);
    },
    get_attributes: function () {
        return _.map(this.model.tool.get("attributes"), function (attribute) {
            var value = this.model.get(attribute.name);
            // makes sure the input is escaped if it's a string
            if (typeof value === 'string' || value instanceof String) {
                value = value.replace(/"/g, '&quot;');
            }
            return _.extend({
                "value": value
            }, attribute);
        },this)
    },
    submit: function () {
        return false;
    },
    destroy: function () {
        this.model.destroy();
        return false;
    }
});
