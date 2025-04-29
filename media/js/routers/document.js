usemockups.routers.Document = Backbone.Router.extend({
    routes: {
        "document/:id": "get_document",
        "": "index"
    },
    initialize: function (options) {
        this.documents = options.documents; //passed (empty) documents object
    },
    get_document: function (document_id) {

        var document = new usemockups.models.Document({
            "id": document_id
        });

        document.fetch({ajaxSync: true});

        if (usemockups.active_document_view) {//if there is already an opened document…
            //undelegate the events of the still opened page (usemockups.views.Page) and the views for additional function
            usemockups.active_document_view.undelegateEvents();
            usemockups.active_document_view.article.undelegateEvents();
            usemockups.active_document_view.edit_form.undelegateEvents();
            usemockups.active_document_view.export_form.undelegateEvents();
            usemockups.active_document_view.import_form.undelegateEvents();
        }

        //create a new document view with the passed document as model
        usemockups.active_document_view = new usemockups.views.Document({
            model: document
        });

        usemockups.active_document_view.render();

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
        var demo_document = new usemockups.models.Document();
        demo_document.save(usemockups.fixtures.demo_document, {
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
