// Property Dialog for single elements of the mockup
// Файл содержит локализацию параметров, а так же предопределенные выпадающие списки
usemockups.views.PropertyDialog = Backbone.View.extend({
  el: "aside form",
  template: $("#property-form-template").html(),
  events: {
    'submit': 'submit',
    'change': 'change'
  },
  initialize: function () {
    this.on("update_for_attribute", this.update_for_attribute);
  },
  render: function () {

    this.$el.html(_.template(this.template, {
      "attributes": this.get_attributes()
    }));

    // Общие
    $('#id_name_label').html('Наименование:');
    $('#id_top_label').html('Y:');
    $('#id_left_label').html('X:');
    $('#id_tageval_label').html('TagEval(v):');
    $('#id_hint_label').html('Подсказка (hint):');

    //## LED
    $('#id_led_attributes_label').replaceWith('<label for="id_led_attributes_label"><h3>Надпись</h3></label>');
    $('#id_led_attributes_led_wid_label').html('Ширина поля:');
    $('#id_led_attributes_led_dig_label').html('После запятой:');
    $('#id_led_attributes_led_val_label').html('По умолчанию:');
    $('#id_led_attributes_led_fmt_label').html('Формат:');
    $('#id_led_attributes_led_font_label').html('Шрифт:');
    $('#id_led_attributes_led_size_label').html('Размер:');
    $('#id_led_attributes_led_color_label').html('Цвет текста:');
    $('#id_led_attributes_led_style_label').html('Начертание:');
    $('#id_led_style').replaceWith('<select id="id_led_style" name="led_style" data-attribute="led_attributes">' +
      '<option value = "">Без эффекта</option>' +
      '<option value = "Bold">Жирный</option>' +
      '<option value = "Italic">Курсив</option>' +
      '<option value = "Underline">Подчеркнутый</option>' +
      '<option value = "StrikeOut">Зачеркнутый</option>' +
      '</select>');
    $('#id_led_style').val(this.model.get("led_attributes[0].led_style"));
    // подсказка
    $("#id_led_wid").attr('title', '<b>wid</b> - ширина числового поля (максимальное число символов отображения).<ul><li>При указании значения <b>wid=0</b> сенсор работает в режиме <b>логического индикатора</b>.</li><li>При указании значения <b>wid&gt;0</b> сенсор работает в режиме <b>цифрового поля</b>. В этом режиме значение <b>Tag</b> не меняется (поэтому в таблице тегов нужен только один элемент), но на изображение сенсора накладывается надпись - текущее числовое значение входных данных.</li></ul><p></p>');
    $("#id_led_dig").attr('title', '<b>dig</b> - число цифр после запятой при отображении чисел. Этот параметр игнорируется, если указан непустой формат <b>f</b>.');
    $("#id_led_val").attr('title', 'Начальное значение отображаемого поля');
    $("#id_led_fmt").attr('title', 'Формат отображаемого поля. Если формат не нужен, указывается *. В этом случае используется формат <strong>%wid.digG</strong>.<ul><li><strong>%w.dF</strong> - Фиксированный формат. Входное значение должно быть числом с плавающей запятой, значение будет преобразовано к виду "-ddd.ddd...";</li><li><strong>%w.dE</strong> - Научный формат. Входное значение должно быть числом с плавающей запятой, значение будет преобразованок к виду "-d.ddd...E+ddd";</li><li><strong>%w.dG</strong> - General формат. Значение должно быть числом с плавающей запятой, которое в дальшейшем автоматически преобразуется в число с фиксированной запятой или в научный формат;</li><li><strong>%w.dD</strong> - Цифровой формат. Значение должно быть в формате integer;</li><li><strong>%w.dS</strong> - Строковый формат. Выводит символ, строку или PChar;</li></ul>');

    //// GUILIB
    //## Простые кнопки
    $('#id_button_attributes_label').replaceWith('<label for="id_button_attributes_label"><h3>Кнопка</h3></label>');
    $('#id_button_attributes_glButtonBit_label').html('Бит состояния:');
    $('#id_button_attributes_glButtonBevel_label').html('Фаска:');
    $('#id_button_attributes_glButtonMoveX_label').html('Гор. смещение:');
    $('#id_button_attributes_glButtonMoveY_label').html('Вер. смещ.:');
    // подсказка
    $("#id_glButtonBit").attr('title', 'Номер бита состояния');
    $("#id_glButtonBevel").attr('title', 'Толщина фаски');
    $("#id_glButtonMoveX").attr('title', 'Горизонтальное смещение при нажатии');
    $("#id_glButtonMoveY").attr('title', 'Вертикальное смещение при нажатии');

    //## Радиокнопка
    $('#id_radio_attributes_label').replaceWith('<label for="id_radio_attributes_label"><h3>Радиокнопка</h3></label>');
    $('#id_radio_attributes_glRadioValue_label').html('Знач. отмеч.:');
    $('#id_radio_attributes_glRadioColor_label').html('Цвет фона:');
    // подсказка
    $("#id_glRadioValue").attr('title', 'Значение радиокнопки, при котором она выглядит отмеченной');

    //## Чекбокс
    $('#id_checkbox_attributes_label').replaceWith('<label for="id_checkbox_attributes_label"><h3>Чекбокс</h3></label>');
    $('#id_checkbox_attributes_glCheckBoxBit_label').html('Бит состояния:');
    $('#id_checkbox_attributes_glCheckBoxColor_label').html('Цвет фона:');

    //## Простая рамка
    $('#id_border_attributes_label').replaceWith('<label for="id_border_attributes_label"><h3>Рамка</h3></label>');
    $('#id_border_attributes_glBorderBevel_label').html('Толщина:');
    $('#id_border_attributes_glBorderColor_label').html('Цвет:');

    $("#id_glBorderBevel").attr('title', 'Толщина рамки');

    //## Индикатор выполнения
    $('#id_progressbar_attributes_label').replaceWith('<label for="id_progressbar_attributes_label"><h3>Прогрессбар</h3></label>');
    $('#id_progressbar_attributes_glProgBarMin_label').html('Мин. значение:');
    $('#id_progressbar_attributes_glProgBarMax_label').html('Макс. знач.:');
    $('#id_progressbar_attributes_glProgBarHor_label').html('Ориентация:');
    $('#id_progressbar_attributes_glProgBarColor_label').html('Цвет инд.:');
    $('#id_progressbar_attributes_glProgBarBevel_label').html('Отступ:');
    $('#id_glProgBarHor').replaceWith('<select id="id_glProgBarHor" name="glProgBarHor" data-attribute="progressbar_attributes">' +
      '<option value = "1">Горизонтальная</option>' +
      '<option value = "0">Вертикальная</option>' +
      '</select>');
    $('#id_glProgBarHor').val(this.model.get("progressbar_attributes[0].glProgBarHor"));
    //подсказка
    $("#id_glProgBarMin").attr('title', 'Минимальное значение индикатора выполнения');
    $("#id_glProgBarMax").attr('title', 'Максимальное значение индикатора выполнения');
    $("#id_glProgBarHor").attr('title', 'Ориентация индикатора выполнения');
    $("#id_glProgBarBevel").attr('title', 'Отступ индикатора от края сенсора');

    //## Простой заполненный прямоугольник (bar)
    $('#id_bar_attributes_label').replaceWith('<label for="id_bar_attributes_label"><h3>SimpleBar</h3></label>');
    $('#id_bar_attributes_glBarColor_label').html('Цвет фона:');

    //## Кнопка подтверждения
    $('#id_cmdOk_attributes_label').replaceWith('<label for="id_cmdOk_attributes_label"><h3>CMD "OK"</h3></label>');
    $('#id_cmdOk_attributes_glCmdOkLineWidth_label').html('Толщ. контура:');
    $('#id_cmdOk_attributes_glCmdOkLineColor_label').html('Цвет контура:');
    $('#id_cmdOk_attributes_glCmdOkFillColor_label').html('Цвет заливки:');

    //## Кнопка отмены
    $('#id_cmdCancel_attributes_label').replaceWith('<label for="id_cmdCancel_attributes_label"><h3>CMD "Отмена"</h3></label>');
    $('#id_cmdCancel_attributes_glCmdCancelLineWidth_label').html('Толщ. контура:');
    $('#id_cmdCancel_attributes_glCmdCancelLineColor_label').html('Цвет контура:');
    $('#id_cmdCancel_attributes_glCmdCancelFillColor_label').html('Цвет заливки:');

    //## Цветной круглый индикатор
    $('#id_indicatorcircle_attributes_label').replaceWith('<label for="id_indicatorcircle_attributes_label"><h3>Индикатор</h3></label>');
    $('#id_indicatorcircle_attributes_glCircleBevel_label').html('Отступ:');
    $('#id_indicatorcircle_attributes_glCircleWidth_label').html('Толщ. контура:');
    $('#id_indicatorcircle_attributes_glCircleFaceColor_label').html('Цвет контура:');
    $('#id_indicatorcircle_attributes_glCircleBackColor_label').html('Цвет заливки:');
    // подсказка
    $("#id_glCircleBevel").attr('title', 'Отступ окружности от края изображения');
    $("#id_glCircleBevel").attr('title', 'Отступ окружности от края изображения');
    $("#id_glCircleWidth").attr('title', 'Толщина контура окружности');
    $("#id_glCrossBevel").attr('title', 'Отступ крестика от края сенсора');
    $("#id_glCrossWidth").attr('title', 'Толщина крестика');

    //## Простой крестик
    $('#id_simplecross_attributes_label').replaceWith('<label for="id_simplecross_attributes_label"><h3>Крестик</h3></label>');
    $('#id_simplecross_attributes_glCrossBevel_label').html('Отступ:');
    $('#id_simplecross_attributes_glCrossWidth_label').html('Толщина:');
    $('#id_simplecross_attributes_glCrossColor_label').html('Цвет:');

    //## Кнопки выпадающего списка (стрелка)
    $('#id_listbutton_arrow_attributes_label').replaceWith('<label for="id_listbutton_arrow_attributes_label"><h3>Выпадающий список</h3></label>');
    $('#id_listbutton_arrow_attributes_glListBtnArrowLeft_label').html('Положение:');
    $('#id_listbutton_arrow_attributes_glListBtnArrowLineColor_label').html('Цвет стрелки:');
    $('#id_listbutton_arrow_attributes_glListBtnArrowLineWidth_label').html('Толщина стрелки:');
    $('#id_listbutton_arrow_attributes_glListBtnArrowBorderWidth_label').html('Толщина границы:');
    $('#id_listbutton_arrow_attributes_glListBtnArrowBorderColor_label').html('Цвет границы:');
    $('#id_glListBtnArrowLeft').replaceWith('<select id="id_glListBtnArrowLeft" name="glListBtnArrowLeft" data-attribute="listbutton_arrow_attributes">' +
      '<option value = "1">Слева</option>' +
      '<option value = "0">Справа</option>' +
      '</select>');
    $('#id_glListBtnArrowLeft').val(this.model.get("listbutton_arrow_attributes[0].glListBtnArrowLeft"));

    //## Кнопки выпадающего списка (треугольник)
    $('#id_listbutton_triangle_attributes_label').replaceWith('<label for="id_listbutton_triangle_attributes_label"><h3>Выпадающий список</h3></label>');
    $('#id_listbutton_triangle_attributes_glListBtnTriangleLeft_label').html('Положение:');
    $('#id_listbutton_triangle_attributes_glListBtnTriangleLineColor_label').html('Цвет треуг:');
    $('#id_listbutton_triangle_attributes_glListBtnTriangleFillColor_label').html('Цвет зал. треуг:');
    $('#id_listbutton_triangle_attributes_glListBtnTriangleBorderWidth_label').html('Толщ. границы:');
    $('#id_listbutton_triangle_attributes_glListBtnTriangleBorderColor_label').html('Цвет границы:');
    $('#id_glListBtnTriangleLeft').replaceWith('<select id="id_glListBtnTriangleLeft" name="glListBtnTriangleLeft" data-attribute="listbutton_triangle_attributes">' +
      '<option value = "1">Слева</option>' +
      '<option value = "0">Справа</option>' +
      '</select>');
    $('#id_glListBtnTriangleLeft').val(this.model.get("listbutton_triangle_attributes[0].glListBtnTriangleLeft"));

    //// GostLib
    //## Вентили
    $('#id_valve_attributes_label').replaceWith('<label for="id_valve_attributes_label"><h3>Вентиль</h3></label>');
    $('#id_valve_attributes_ValveType_label').html('Тип:');
    $('#id_valve_attributes_ValveDrive_label').html('Привод:');
    $('#id_valve_attributes_LimitSwitch_label').html('Концевик:');
    $('#id_valve_attributes_glValveOpenBit_label').html('Бит "Открыт":');
    $('#id_valve_attributes_glValveCloseBit_label').html('Бит "Закрыт":');
    $('#id_ValveType').replaceWith('<select id="id_ValveType" name="ValveType" data-attribute="valve_attributes">' +
      '<option value = "ThruWayHor">Проходной горизонтальный</option>' +
      '<option value = "ThruWayVer">Проходной вертикальный</option>' +
      '<option value = "AngUpLeft">Угловой, вверх-влево</option>' +
      '<option value = "AngUpRight">Угловой, вверх-вправо</option>' +
      '<option value = "AngDownLeft">Угловой, вниз-влево</option>' +
      '<option value = "AngDownRight">Угловой, вниз-вправо</option>' +
      '<option value = "3WayUp">Трехходовой, вверх</option>' +
      '<option value = "3WayDown">Трехходовой, вниз</option>' +
      '<option value = "3WayLeft">Трехходовой, влево</option>' +
      '<option value = "3WayRight">Трехходовой, вправо</option>' +
      '<option value = "VlvGateHor">Задвижка горизонтальная</option>' +
      '<option value = "VlvGateVer">Задвижка вертикальная</option>' +
      '<option value = "RotGateHor">Затвор поворотный горизонтальный</option>' +
      '<option value = "RotGateVer">Затвор поворотный вертикальный</option>' +
      '</select>');
    $('#id_ValveType').val(this.model.get("valve_attributes[0].ValveType"));
    $('#id_LimitSwitch').replaceWith('<select id="id_LimitSwitch" name="LimitSwitch" data-attribute="valve_attributes">' +
      '<option value = "LimSwNone">Отсутствует</option>' +
      '<option value = "LimSwOpen">"открыт"</option>' +
      '<option value = "LimSwClose">"закрыт"</option>' +
      '<option value = "LimSwBoth">Оба концевика</option>' +
      '</select>');
    $('#id_LimitSwitch').val(this.model.get("valve_attributes[0].LimitSwitch"));

    $('#id_ValveDrive').replaceWith('<select id="id_ValveDrive" name="ValveDrive" data-attribute="valve_attributes">' +
      '<option value = "NoneOp">Не указан</option>' +
      '<option value = "ManualOp">Ручной привод</option>' +
      '<option value = "SolenoidOp">Электромагнитный привод</option>' +
      '<option value = "MotorOp">Электропривод</option>' +
      '<option value = "PneumaticOp">Пневматический привод</option>' +
      '</select>');
    $('#id_ValveDrive').val(this.model.get("valve_attributes[0].ValveDrive"));

    //## Насосы
    $('#id_pump_attributes_label').replaceWith('<label for="id_pump_attributes_label"><h3>Насос</h3></label>');
    $('#id_pump_attributes_PumpType_label').html('Тип:');
    $('#id_pump_attributes_Orientation_label').html('Направление:');
    $('#id_pump_attributes_glPumpSpeedBit_label').html('Бит "Скорость":');
    $('#id_pump_attributes_glPumpErrorBit_label').html('Бит "Ошибка":');
    $('#id_PumpType').replaceWith('<select id="id_PumpType" name="PumpType" data-attribute="pump_attributes">' +
      '<option value = "RotSingle">Вращательный объемный одноступенчатый</option>' +
      '<option value = "RotDouble">Вращательный объемный двухступенчатый</option>' +
      '<option value = "Turbomol">Турбомолекулярный</option>' +
      '<option value = "Roots">Двухроторный</option>' +
      '<option value = "Diffusion">Диффузионный</option>' +
      '<option value = "SputIon">Магнитный электроразрядный</option>' +
      '<option value = "Sublimation">Сублимационный</option>' +
      '</select>');
    $('#id_PumpType').val(this.model.get("pump_attributes[0].PumpType"));
    $('#id_Orientation[data-attribute^=\"pump_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="pump_attributes">' +
      '<option value = "None">Отсутствует</option>' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"pump_attributes"]').val(this.model.get("pump_attributes[0].Orientation"));

    //## Вакууметр
    $('#id_vacuometer_attributes_label').replaceWith('<label for="id_vacuometer_attributes_label"><h3>Вакуумметр</h3></label>');
    $('#id_vacuometer_attributes_VacuometerType_label').html('Тип:');
    $('#id_vacuometer_attributes_Orientation_label').html('Направление:');
    $('#id_vacuometer_attributes_glVacuometerBevel_label').html('Отступ:');
    $('#id_vacuometer_attributes_glVacuometerFillColor_label').html('Цвет изобр.:');
    $('#id_vacuometer_attributes_glVacuometerLineColor_label').html('Цвет контура:');
    $('#id_VacuometerType[data-attribute^=\"vacuometer_attributes"]').replaceWith('<select id="id_VacuometerType" name="VacuometerType" data-attribute="vacuometer_attributes">' +
      '<option value = "Penning">Penning</option>' +
      '<option value = "Ionization">Ionization</option>' +
      '<option value = "Thermal">Thermal</option>' +
      '</select>');
    $('#id_VacuometerType[data-attribute^=\"vacuometer_attributes"]').val(this.model.get("vacuometer_attributes[0].VacuometerType"));
    $('#id_Orientation[data-attribute^=\"vacuometer_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="vacuometer_attributes">' +
      '<option value = "None">Отсутствует</option>' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"vacuometer_attributes"]').val(this.model.get("vacuometer_attributes[0].Orientation"));

    //## Течеискатели
    $('#id_leakdetector_attributes_label').replaceWith('<label for="id_leakdetector_attributes_label"><h3>Течеискатель</h3></label>');
    $('#id_leakdetector_attributes_glLeakDetBevel_label').html('Отступ:');
    $('#id_leakdetector_attributes_glLeakDetFillColor_label').html('Цвет изобр.:');
    $('#id_leakdetector_attributes_glLeakDetLineColor_label').html('Цвет контура:');

    //## Компрессор
    $('#id_compressor_attributes_label').replaceWith('<label for="id_compressor_attributes_label"><h3>Компрессор</h3></label>');
    $('#id_compressor_attributes_Orientation_label').html('Направление:');
    $('#id_compressor_attributes_glCompressorBevel_label').html('Отступ:');
    $('#id_compressor_attributes_glCompressorFillColor_label').html('Цвет изобр.:');
    $('#id_compressor_attributes_glCompressorLineColor_label').html('Цвет контура:');
    $('#id_Orientation[data-attribute^=\"compressor_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="compressor_attributes">' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"compressor_attributes"]').val(this.model.get("compressor_attributes[0].Orientation"));

    //// DaqLib
    //## Радиационная опасность
    $('#id_radiationhazard_attributes_label').replaceWith('<label for="id_radiationhazard_attributes_label"><h3>Рад. опасность</h3></label>');
    $('#id_radiationhazard_attributes_glRadiationHazardBevel_label').html('Отступ:');
    $('#id_radiationhazard_attributes_glRadiationHazardBackColor_label').html('Цвет фона:');
    $('#id_radiationhazard_attributes_glRadiationHazardFillColor_label').html('Цвет изобр.:');

    //## Воздуходувка
    $('#id_airblower_attributes_label').replaceWith('<label for="id_airblower_attributes_label"><h3>Воздуходувка</h3></label>');
    $('#id_airblower_attributes_Orientation_label').html('Направление:');
    $('#id_airblower_attributes_glAirBlowerBevel_label').html('Отступ:');
    $('#id_airblower_attributes_glAirBlowerLineWidth_label').html('Контур:');
    $('#id_airblower_attributes_glAirBlowerFillColor_label').html('Цвет фона:');
    $('#id_airblower_attributes_glAirBlowerLineColor_label').html('Цвет контура:');
    $('#id_Orientation[data-attribute^=\"airblower_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="airblower_attributes">' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"airblower_attributes"]').val(this.model.get("airblower_attributes[0].Orientation"));

    //## Вытяжной вентилятор
    $('#id_fanblower_attributes_label').replaceWith('<label for="id_fanblower_attributes_label"><h3>Выт. вентилятор</h3></label>');
    $('#id_fanblower_attributes_Orientation_label').html('Направление:');
    $('#id_fanblower_attributes_glFanBlowerBevel_label').html('Отступ:');
    $('#id_fanblower_attributes_glFanBlowerLineWidth_label').html('Контур:');
    $('#id_fanblower_attributes_glFanBlowerFillColor_label').html('Цвет фона:');
    $('#id_fanblower_attributes_glFanBlowerLineColor_label').html('Цвет контура:');
    $('#id_Orientation[data-attribute^=\"fanblower_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="fanblower_attributes">' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"fanblower_attributes"]').val(this.model.get("fanblower_attributes[0].Orientation"));

    //## Водяной насос
    $('#id_waterpump_attributes_label').replaceWith('<label for="id_waterpump_attributes_label"><h3>Водяной насос</h3></label>');
    $('#id_waterpump_attributes_Orientation_label').html('Направление:');
    $('#id_waterpump_attributes_glWaterPumpBevel_label').html('Отступ:');
    $('#id_waterpump_attributes_glWaterPumpLineWidth_label').html('Контур:');
    $('#id_waterpump_attributes_glWaterPumpFillColor_label').html('Цвет фона:');
    $('#id_waterpump_attributes_glWaterPumpLineColor_label').html('Цвет контура:');
    $('#id_Orientation[data-attribute^=\"waterpump_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="waterpump_attributes">' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"waterpump_attributes"]').val(this.model.get("waterpump_attributes[0].Orientation"));

    //## Уровень жидкости
    $('#id_tanklevel_attributes_label').replaceWith('<label for="id_tanklevel_attributes_label"><h3>Уровень жидкости</h3></label>');
    $('#id_tanklevel_attributes_glTankLevelBevel_label').html('Отступ:');
    $('#id_tanklevel_attributes_glTankLevelLineWidth_label').html('Контур:');
    $('#id_tanklevel_attributes_glTankLevelFillColor_label').html('Цвет изобр.:');
    $('#id_tanklevel_attributes_glTankLevelBackColor_label').html('Цвет фона:');
    $('#id_tanklevel_attributes_glTankLevelLineColor_label').html('Цвет контура:');
    $('#id_tanklevel_attributes_glTankLevelPercent_label').html('% заполнения:');

    //## Расходомер
    $('#id_flowmeter_attributes_label').replaceWith('<label for="id_flowmeter_attributes_label"><h3>Расходомер</h3></label>');
    $('#id_flowmeter_attributes_Orientation_label').html('Направление:');
    $('#id_flowmeter_attributes_glFlowMeterBevel_label').html('Отступ:');
    $('#id_flowmeter_attributes_glFlowMeterLineWidth_label').html('Контур:');
    $('#id_flowmeter_attributes_glFlowMeterFillColor_label').html('Цвет фона:');
    $('#id_flowmeter_attributes_glFlowMeterLineColor_label').html('Цвет контура:');
    $('#id_Orientation[data-attribute^=\"flowmeter_attributes"]').replaceWith('<select id="id_Orientation" name="Orientation" data-attribute="flowmeter_attributes">' +
      '<option value = "Up">Вверх</option>' +
      '<option value = "Down">Вниз</option>' +
      '<option value = "Left">Влево</option>' +
      '<option value = "Right">Вправо</option>' +
      '</select>');
    $('#id_Orientation[data-attribute^=\"flowmeter_attributes"]').val(this.model.get("flowmeter_attributes[0].Orientation"));

    //## Манометр
    $('#id_manometer_attributes_label').replaceWith('<label for="id_manometer_attributes_label"><h3>Манометр</h3></label>');
    $('#id_manometer_attributes_glManoMeterBevel_label').html('Отступ:');
    $('#id_manometer_attributes_glManoMeterLineWidth_label').html('Контур:');
    $('#id_manometer_attributes_glManoMeterFillColor_label').html('Цвет изобр.:');
    $('#id_manometer_attributes_glManoMeterLineColor_label').html('Цвет контура:');
    $('#id_manometer_attributes_glManoMeterAngle_label').html('Угол стрелки:');

    //## Универсальный нагреватель
    $('#id_uniheater_attributes_label').replaceWith('<label for="id_uniheater_attributes_label"><h3>UniHeater</h3></label>');
    $('#id_uniheater_attributes_glUniHeaterBevel_label').html('Отступ:');
    $('#id_uniheater_attributes_glUniHeaterColor_label').html('Цвет нагреват.:');

    this.$el.find("a.delete").click(function () {
      this.destroy();
      return false;
    }.bind(this));

    this.$el.find("a.copy").click(function () {
      var copy = this.model.clone();
      copy.attributes.top = copy.attributes.top + 5;
      copy.attributes.left = copy.attributes.left + 5;
      copy.attributes.name = copy.attributes.name.replace(/[.][c]\d{1,}/g, '') + '.' + copy.cid;
      this.model.collection.add(copy);
      return copy;
    }.bind(this));

    $(document).tooltip();
    $('[name*="Color"]').css('width', 'calc(50% - 20px)').paletteColorPicker({
      colors: colors_palette,
      clear_btn: null,
      insert: 'after',
    });
    $('[name*="color"]').css('width', 'calc(50% - 20px)').paletteColorPicker({
      colors: colors_palette,
      clear_btn: null,
      insert: 'after',
    });

    return this;
  },
  set_measuredSizes: function (measuredSizes) {
    this.measuredSizes = measuredSizes;
    return this;
  },
  update_for_attribute: function (field) {
    this.$el.find("#id_" + field.data("attribute")).val(field.val());
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
    }, this)
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
      if (input[0].id === "id_left" || input[0].id === "id_top") {
        value = Number(input.val())
      } else {
        value = input.val()
      }
    }
    if (!input.attr("data-attribute")) {
      this.model.set(input.attr("name"), value);
    } else {
      var data = JSON.parse(JSON.stringify(this.model.get(input.attr("data-attribute"))));
      data[0][input.attr("name")] = value;
      this.model.set({ [input.attr("data-attribute")]: data });
    }
    return false;
  },
  destroy: function () {
    this.model.destroy();
    return false;
  }
});
