// Return string width in pt
// getCharWidth("bold 14pt PTMono")
function getCharWidth(font) {
    var canvas = getCharWidth.canvas || (getCharWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText("c");
    return metrics.width;
}

//Property Dialog for single elements of the mockup
usemockups.views.TagsDialog = Backbone.View.extend({
    el: "footer",
    template: $("#taglist-form-template").html(),
    events: {
        'submit': 'submit',
        'change': 'change',
        'click .add-tag': 'add_tag',
        'click .chain-link': 'toggleChain'
    },
    initialize: function () {
        this.on("update_for_attribute", this.update_for_attribute);
        this.on("update_for_sizes", this.update_for_sizes);
        // Инициализация состояния цепочек
        this.chainStates = {
            'width': true,
            'height': true
        };
    },
    render: function () {
        this.$el.html(_.template(this.template, {
            "tags": this.get_tags()
        }));

        // Восстанавливаем состояние цепочек после рендера
        for (var fieldType in this.chainStates) {
            var $link = this.$el.find('.chain-link[data-field="' + fieldType + '"]');
            if ($link.length > 0) {
                var $icon = $link.find('.chain-icon');
                if (this.chainStates[fieldType]) {
                    // Замкнутая цепь
                    $icon.removeClass('chain-broken').addClass('chain-connected');
                    $icon.text('🔗');
                } else {
                    // Разомкнутая цепь
                    $icon.removeClass('chain-connected').addClass('chain-broken');
                    $icon.text('⛓️');
                }
            }
        }

        count = this.model.get("tags");
        for (tag in count) {
            $("#id_type[id-attribute='" + count[tag].id + "']").val(count[tag].type);
            $("#tags_" + count[tag].id + "_bit[id-attribute='" + count[tag].id + "']").val(count[tag].bit);
            // console.log(tag);
            $('#tags_' + tag + '_color[id-attribute*="' + tag + '"]').paletteColorPicker({
                colors: colors_palette,
                clear_btn: null,
                insert: 'after',
            }).css('width', '75%');
        }

        $('body').css('padding-bottom', $('footer').height() + 20);

        this.$el.find("a.delete").click(function (ui) {
            if (this.model.get('tags').length != 1)
                this.model.remove('tags[' + [$(ui.target).attr("id-attribute")] + ']');
            this.render();
            return false;
        }.bind(this));

        // Изменение значения колесиком мыши. Размещено тут, так как окно свойств сенсора генерируется каждый раз заного
        this.$el.find('input[type="number"]').on('wheel', function(e) {
          e.preventDefault();
          let $input = $(this);
          let value = parseInt($input.val());
          if (e.originalEvent.deltaY < 0) {
              value++; // Прокрутка вверх
          } else {
              value--; // Прокрутка вниз
          }
          // Ограничиваем значение (не меньше 0)
          if (value < 0) value = 0;
          $input.val(value).trigger('change');
        });

        return this;
    },
    set_measuredSizes: function (measuredSizes) {
        this.measuredSizes = measuredSizes;
        return this;
    },
    update_for_attribute: function (field) {
        this.$el.find("#" + field.data("attribute").replace(".", "_").replace(".", "_")).val(field.val());
    },
    
    update_for_sizes: function (size) {
        var zoom = Number($('article').attr('zoom'));
        if (this.model.get("tags[0].type") == "ledbmp") {
            var ch_size = getCharWidth(this.model.get("led_attributes[0].led_style") + " " + this.model.get("led_attributes[0].led_size") + "pt " + this.model.get("led_attributes[0].led_font"));
            if (this.model.has("tags[0].height"))
                $("footer form").find("#tags_0_height").val(Math.round(1.33 * this.model.get("led_attributes[0].led_size")) + "pt");
            if (this.model.has("tags[0].height"))
                $("footer form").find("#tags_0_width").val(Math.round(size.width / ch_size / 1.33 / zoom) + "ch");
        } else {
            if (this.model.has("tags[0].height"))
                $("footer form").find("#tags_0_height").val(Math.round(size.height / zoom));
            if (this.model.has("tags[0].width"))
                $("footer form").find("#tags_0_width").val(Math.round(size.width / zoom));
        }
    },
    get_tags: function () {
        return _.map(this.model.get("tags"), function (tag) {
            var value = this.model.get(tag);
            // makes sure the input is escaped if it's a string
            return _.extend({
                "value": value
            }, tag);
        }, this);
    },
    submit: function () {
        return false;
    },
    change: function (ui) {
        var input = $(ui.target);
        var value;
        if (input.is(":checkbox")) {
            value = input.is(":checked");
        } else {
            value = input.val();
        }
        if (input.attr("name").match(/color\_+/)) { 
            input.attr("name", "color"); 
        }

        // Проверяем, если это поле ширины или высоты
        var fieldName = input.attr("name");
        var fieldId = input.attr("id-attribute");
        
        if (fieldName === "width" || fieldName === "height") {
        // Если цепочка включена для этого поля, обновляем все аналогичные поля
            if (this.chainStates[fieldName] === true) {
                this.updateRelatedFields(fieldName, value, fieldId);
            }
        }

        var data = JSON.parse(JSON.stringify(this.model.get("tags")));
        data[input.attr("id-attribute")][input.attr("name")] = value;
        this.model.set({ tags: data });
        
        this.render();
        return false;
    },
    add_tag: function () {
        var tags = this.model.get('tags');
        newTag = JSON.parse(JSON.stringify(tags));
        newTag[0].id = tags.length;
        this.model.add('tags', newTag[0]);
        this.render();
        return false;
    },
    // Метод для переключения состояния цепочки
    toggleChain: function(event) {
        event.preventDefault();
        var $link = $(event.target).closest('.chain-link');
        var fieldType = $link.data('field');

        // Переключаем состояние
        this.chainStates[fieldType] = !this.chainStates[fieldType];

        // Меняем отображение иконки
        var $icon = $link.find('.chain-icon');
        if (this.chainStates[fieldType]) {
            // Замкнутая цепь
            $icon.removeClass('chain-broken').addClass('chain-connected');
            $icon.text('🔗');
        } else {
            // Разомкнутая цепь
            $icon.removeClass('chain-connected').addClass('chain-broken');
            $icon.text('⛓️');
        }

        return false;
    },
    // Метод для обновления связанных полей при включенной цепочке
    updateRelatedFields: function(fieldName, value, currentFieldId) {
        var $relatedInputs = $('input[name="' + fieldName + '"]').filter('[id-attribute]');;
        var currentTagIndex = parseInt(currentFieldId);

        // Сохраняем this для использования внутри .each()
        var self = this;
        
        // Если цепь замкнута (true), обновляем все связанные поля
        if (this.chainStates && this.chainStates[fieldName] === true) {
            $relatedInputs.each(function() {
                // Не обновляем текущее поле, чтобы избежать зацикливания
                var fieldId = $(this).attr('id-attribute');
                if (fieldId !== currentFieldId) {
                    $(this).val(value);

                    // Если нужно обновить модель для других полей
                    var tagIndex = parseInt(fieldId);
                    if (tagIndex !== undefined && !isNaN(tagIndex)) {
                        var data = JSON.parse(JSON.stringify(self.model.get("tags")));
                        data[tagIndex][fieldName] = value;
                        self.model.set({ tags: data });
                    }
                }
            });
        }
    }
});