usesensors.routers.Document = Backbone.Router.extend({
    routes: {
        "document/:id": "get_document",
        "": "index"
    },
    initialize: function (options) {
        this.documents = options.documents; //passed (empty) documents usesensors
    },
    get_document: function (document_id) {

        var document = new usesensors.models.Document({
            "id": document_id
        });

        document.fetch({ ajaxSync: true });

        if (usesensors.active_document_view) {//if there is already an opened document…
            //undelegate the events of the still opened page (usesensors.views.Page) and the views for additional function
            usesensors.active_document_view.undelegateEvents();
            usesensors.active_document_view.article.undelegateEvents();
            usesensors.active_document_view.edit_form.undelegateEvents();
            usesensors.active_document_view.export_form.undelegateEvents();
            usesensors.active_document_view.import_form.undelegateEvents();
        }

        //create a new document view with the passed document as model
        usesensors.active_document_view = new usesensors.views.Document({
            model: document
        });

        usesensors.active_document_view.render();

    },
    index: function () {
        this.documents.on("reset", function () {
            if (this.documents.models.length)
                this.navigate_document(this.documents.last());
            else
                this.create_demo_document();
        }, this);
    },
    create_demo_document: function () {
        var demo_document = new usesensors.models.Document();
        demo_document.save(usesensors.fixtures.demo_document, {
            success: function (model) {
                this.documents.add(model, { silent: true });
                this.navigate_document(model);
            }.bind(this)
        });
    },
    navigate_document: function (document) {
        var uri = "document/" + document.get("id");
        this.navigate(uri, true);
    }
});
