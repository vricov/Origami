//the tools/kinds-of-elements
usesensors.views.Tool = Backbone.View.extend({
    tagName: "li",
    initialize: function () {
        this.className = this.model.get("name")
    },
    get_label: function() {
        return this.model.get("label") || this.model.get("name")
    },
    render: function () {

        $("<span>").html(this.get_label())
            .appendTo(this.$el);

        this.$el.addClass(this.model.get("name"));

        this.$el.draggable({
            cursor: "move",
            stack: "article",
            cursorAt: { left: 10 },
            helper: function() {
                return new usesensors.views.ToolPreview({
                    tool: usesensors.toolbox.get($(this).data("tool"))
                }).render().el
            }
        }).data("tool", this.model.get("name"));

        return this;
    }
});

usesensors.views.Toolbox = Backbone.View.extend({
    el: "div.header",
    render: function () {

        this.$el.empty();

        _.forEach(_.uniq(this.model.pluck("category")), function (category) {

            $("<div class='category-head'>").html(category).after(
                $("<ul>").addClass("toolbox").addClass(category)).appendTo(this.$el);
        }, this);

        _.forEach(this.model.models, function (tool) {
            (new usesensors.views.Tool({
 model: tool
            }).render().$el.appendTo(".toolbox." + tool.get("category")));
        }, this);
        return this;

    }
});

var HandlebarToolPreview = Handlebars.compile($("#universal-template").html());
usesensors.views.ToolPreview = Backbone.View.extend({

    tagName: "div",
    className: "object preview",

    initialize: function () {
        this.tool = this.options.tool;
    },

    render: function () {
        this.$el.addClass(this.tool.get("name"));
        var attributes = this.tool.get_attributes();

        this.$el.html(HandlebarToolPreview(attributes));
        if (attributes.width)
            this.$el.width(attributes.width);
        if (attributes.height)
            this.$el.height(attributes.height);
        return this;
    }
});
