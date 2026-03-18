function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                if (value[section][match[1]] === undefined) value[section][match[1]] = '';
                value[section][match[1]] = value[section][match[1]]+match[2].replace(/\\/g, "\\");
            }else{
                value[match[1]]=value[match[1]]+match[2];
               
                // Handle global parameters outside of sections.  This is a design choice and might need adjustment based on desired behavior.
                if (value[match[1]] === undefined) {
                    value[match[1]] = match[2];
                } else {
                    value[match[1]] += match[2];
                }
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}
function ConvertModel(data){
    value = parseINIString(data);
    format = {};
    format['mockups'] = [];
    if (value?.Circuit) {
        const circuit = value.Circuit;
        const generalMap = circuit.GeneralMap;
        // Обработка GeneralMap только один раз
        if (generalMap) {
            const cleanPath = generalMap.replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "");
            const parts = cleanPath.split("_");
            // Ширина
            if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
                format['width'] = Number(parts[1]);
            }
            // Высота
            if (parts.length >= 3 && !isNaN(Number(parts[2]))) {
                format['height'] = Number(parts[2]);
            }
            // Bit
            if (parts.length >= 4 && !isNaN(Number(parts[3]))) {
                format['generalmap_bit'] = Number(parts[3]);
            }
            // Имя файла
            format['generalmap_name'] = cleanPath;
        }
        // Заголовок
        if (circuit.Hint) {
            format['title'] = circuit.Hint;
        }
        // ToolBarHeight
        if (circuit.ToolBarHeight !== undefined) {
            format['toolbar_height'] = Number(circuit.ToolBarHeight);
        }
        // ToolBarHeader
        if (circuit.ToolBarHeader !== undefined) {
            format['toolbar_header'] = circuit.ToolBarHeader;
        }
        // ToolBarLegend
        if (circuit.ToolBarLegend !== undefined) {
            format['toolbar_legend'] = circuit.ToolBarLegend;
        }
        // StartupScript
        if (value['Circuit.StartupScript']) {
            const startupScript = value['Circuit.StartupScript'];
            
            // Конвертируем объект в строку формата key = value
            let scriptContent = '';
            for (const key in startupScript) {
                if (startupScript.hasOwnProperty(key)) {
                    scriptContent += `${key} = ${startupScript[key]}\n`;
                }
            }
            
            format['startupscript'] = scriptContent.trim();
        }
    }
        
    if(value.Circuit != undefined)if(value.Circuit.Hint != undefined) {format['title'] = value['Circuit']['Hint'];} else {format['title'] = 'noname';}
    delete value.ConfigFile;
    delete value.ConfigFileList;
    delete value.SensorList;
    delete value["SensorList-"];

    delete value["Circuit.StartupScript"];
    delete value[""];
    delete value.Circuit;
    
    var i = 0;
    for (sensor in value) {
        format['mockups'][i]  = {};
        format['mockups'][i]['name'] = sensor;
        console.log('Импортируем '+sensor+'..');

        const pos = value[sensor]['Pos'];
        const posParts = pos.split(', ');
        const posArray = pos.match(/\d+/g); // Извлекаем числа
        
        if (posParts.length >= 2) {
            format['mockups'][i]['left'] = Number(posParts[0]);
            format['mockups'][i]['top'] = Number(posParts[1]);
        } else if (posArray && posArray.length >= 2) {
            format['mockups'][i]['left'] = Number(posArray[0]);
            format['mockups'][i]['top'] = Number(posArray[1]);
        }

        format['mockups'][i]['tool'] = 'label';
        if (value[sensor]['LED']) {
            format['mockups'][i]['led'] = true;
            format['mockups'][i]['led_attributes'] = [{}];

            const ledData = value[sensor]['LED'];
            const ledParts = ledData.split(', ');

            // Обработка основных значений
            const attributes = format['mockups'][i]['led_attributes'][0];
            attributes.led_wid = Number(ledParts[0]) || 0;
            attributes.led_dig = Number(ledParts[1]) || 0;
            attributes.led_val = Number(ledParts[2]) || 0;

            // Обработка формата
            attributes.led_fmt = ledParts[3].replace(/"/g, '') || "*";

            // Если есть пятый элемент, обрабатываем дополнительные параметры
            if (ledParts[4]) {
                const fifthPart = ledParts[4];

                // Шрифт
                const fontMatch = fifthPart.match(/Name:([a-zA-Z0-9_]+)/);
                attributes.led_font = fontMatch ? fontMatch[1].replace(/_/g, ' ') : 0;

                // Размер
                const sizeMatch = fifthPart.match(/Size:(\d+)/);
                attributes.led_size = sizeMatch ? Number(sizeMatch[1]) : 13;

                // Цвет
                const colorMatch = fifthPart.match(/Color:([a-zA-Z0-9_]+)/);
                attributes.led_color = colorMatch ? colorMatch[1] : 'Black';

                // Стиль
                const styleMatch = fifthPart.match(/Style:\[([^\]]+)\]/);
                attributes.led_style = styleMatch ? styleMatch[1] : '';
            } else {
                // Дефолтные значения
                attributes.led_font = 0;
                attributes.led_size = 13;
                attributes.led_color = 'black';
                attributes.led_style = 0;
            }

            // Если есть шестой элемент, обрабатываем дополнительные параметры
            if (ledParts[5]) {
                const sixthPart = ledParts[5];

                // Выравнивание
                const alignMatch = sixthPart.match(/Align:([a-zA-Z]+)/);
                attributes.led_align = alignMatch ? alignMatch[1] : 'CenterMiddle';

                // Отступ по X
                const gapXMatch = sixthPart.match(/GapX:(\d+)/);
                if (gapXMatch) {attributes.led_gap_x = gapXMatch ? Number(gapXMatch[1]) : ''}

                // Отступ по Y
                const gapYMatch = sixthPart.match(/GapY:(\d+)/);
                if (gapYMatch) {attributes.led_gap_y = gapYMatch ? Number(gapYMatch[1]) : ''}

                // Exp
                const expMatch = sixthPart.match(/Exp:(\d+)/);
                attributes.led_exp = expMatch ? Number(expMatch[1]) : 3;
            } else {
                // Дефолтные значения
                attributes.led_align = 'CenterMiddle';
                attributes.led_gap_x = 5;
                attributes.led_gap_y = 4;
                attributes.led_exp = 3;
            }
        }
        var tag = 1;
        var TagType = '';
        format['mockups'][i]['tags']  = [];
        while(value[sensor]['Tag#'+tag]) {
            const tagData = value[sensor]['Tag#' + tag];
            const tagParts = tagData.split(', ');

            // Определяем тип тега
            const bitmapPath = tagParts[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").replace("~~\\resource\\daqsite\\stdlib\\bitmaps\\", "");
            const bitmapParts = bitmapPath.split('_');
            const TagType = bitmapParts[0];

            // Создаем объект тега
            const tagObj = {};
            tagObj.id = Number(tagParts[0]);

            if (TagType === 'ledbmp' || TagType === 'barbmp') {
                const isLedBmp = TagType === 'ledbmp';

                tagObj.type = TagType;
                tagObj.width = isLedBmp ? bitmapParts[1] + 'ch' : bitmapParts[1];
                tagObj.height = isLedBmp ? bitmapParts[2] + 'pt' : bitmapParts[2];
                tagObj.label = tagData.replace(/^.*\.bmp/, "").trim();
                tagObj.bit = bitmapParts[3];
                tagObj.color = bitmapParts[4].match(/[a-zA-Z0-9_$]+/)[0];

            } else {
                // Custom File
                tagObj.type = 'custom';
                tagObj.custom = tagParts[1];
                tagObj.width = 30;
                tagObj.height = 30;
                tagObj.color = 'Silver';
            }

            // Обработка label с учетом кавычек
            if (tagObj.label !== undefined && tagObj.label[0] === '"') {
                tagObj.label = tagObj.label.slice(1, -1).replace(/""/g, '"');
            } else if (tagObj.label) {
                tagObj.label = tagObj.label.replace(/\+/g, " ")
                    .replace(/\%2C/g, ",")
                    .replace(/\%2B/g, "+")
                    .replace(/\%%/g, "%")
                    .replace(/\%&nbsp;/g, " ");
            }

            format['mockups'][i]['tags'][tag - 1] = tagObj;
            tag++;
        }
        if (value[sensor]['TagEval(v)']) {
            console.log('-- TAGEVAL SECTION --');
            format['mockups'][i]['tageval'] = value[sensor]['TagEval(v)'];}
        if (value[sensor]['Painter(v)']) {
            if (value[sensor]['Painter(v)'].match('SimpleButton')) {
                console.log('-- PAINTER SECTION SIMPLEBUTTON --');
                format['mockups'][i]['button'] = true;
                format['mockups'][i]['button_attributes'] = [{}];    
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['button_attributes'][0];
                // Определяем паттерны для поиска значений
                const patterns = {
                    glButtonBit: /glButtonBit=(\d+)/,
                    glButtonBevel: /glButtonBevel=(\d+)/,
                    glButtonMoveX: /glButtonMoveX=(\d+)/,
                    glButtonMoveY: /glButtonMoveY=(\d+)/
                };
                // Определение значений по умолчанию
                const defaults = {
                    glButtonBit: 0,
                    glButtonBevel: 1,
                    glButtonMoveX: 1,
                    glButtonMoveY: 1
                };
                // Обработка каждого параметра
                for (const [key, pattern] of Object.entries(patterns)) {
                    const match = painterValue.match(pattern);
                    if (match) {
                        attributes[key] = Number(match[1]);
                    } else {
                        attributes[key] = defaults[key];
                    }
                }
            }
            if (value[sensor]['Painter(v)'].match('RadioButton')) {
                console.log('-- PAINTER SECTION RADIOBUTTON --');
                format['mockups'][i]['tool'] = 'RadioButton';
                format['mockups'][i]['radio'] = true;
                format['mockups'][i]['radio_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['radio_attributes'][0];
                // Определение параметров
                const radioParams = [
                    {
                        key: 'glRadioValue',
                        pattern: /glRadioValue=(\d+)/,
                        default: 0,
                        transform: Number
                    },
                    {
                        key: 'glRadioColor',
                        pattern: /glRadioColor=(\w+)/,
                        default: "white",
                        transform: (value) => value.replace('cl', '')
                    }
                ];
                // Обработка параметров
                radioParams.forEach(({ key, pattern, default: defaultValue, transform }) => {
                    const match = painterValue.match(pattern);
                    attributes[key] = match ? transform(match[1]) : defaultValue;
                });
            }
            if (value[sensor]['Painter(v)'].match('CheckBox')) {
                console.log('-- PAINTER SECTION CheckBox --');
                format['mockups'][i]['tool'] = 'CheckBox';
                format['mockups'][i]['checkbox'] = true;
                format['mockups'][i]['checkbox_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['checkbox_attributes'][0];
                // Определение параметров
                const checkboxParams = [
                    {
                        key: 'glCheckBoxBit',
                        pattern: /glCheckBoxBit=(\d+)/,
                        default: 0,
                        transform: Number
                    },
                    {
                        key: 'glCheckBoxColor',
                        pattern: /glCheckBoxColor=(\w+)/,
                        default: "white",
                        transform: (value) => value.replace('cl', '')
                    }
                ];
                // Обработка параметров
                checkboxParams.forEach(({ key, pattern, default: defaultValue, transform }) => {
                    const match = painterValue.match(pattern);
                    attributes[key] = match ? transform(match[1]) : defaultValue;
                });
            }
            if (value[sensor]['Painter(v)'].match('ProgressBar')) {
                console.log('-- PAINTER SECTION PROGRESSBAR --');
                format['mockups'][i]['tool'] = 'ProgressBar';
                format['mockups'][i]['progressbar'] = true;
                format['mockups'][i]['progressbar_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['progressbar_attributes'][0];
                // Определение параметров
                const progressParams = [
                    {
                        key: 'glProgBarMin',
                        pattern: /glProgBarMin=(\d+)/,
                        default: 0,
                        transform: Number
                    },
                    {
                        key: 'glProgBarMax',
                        pattern: /glProgBarMax=(\d+)/,
                        default: 100,
                        transform: Number
                    },
                    {
                        key: 'glProgBarHor',
                        pattern: /glProgBarHor=(\d+)/,
                        default: 1,
                        transform: Number
                    },
                    {
                        key: 'glProgBarColor',
                        pattern: /glProgBarColor=(\w+)/,
                        default: "lime",
                        transform: (value) => value.replace('cl', '')
                    },
                    {
                        key: 'glProgBarBevel',
                        pattern: /glProgBarBevel=(\d+)/,
                        default: 0,
                        transform: Number
                    }
                ];
                // Обработка параметров
                progressParams.forEach(({ key, pattern, default: defaultValue, transform }) => {
                    const match = painterValue.match(pattern);
                    attributes[key] = match ? transform(match[1]) : defaultValue;
                });
            }
            if (value[sensor]['Painter(v)'].match('SimpleBorder')) {
                console.log('-- PAINTER SECTION SIMPLEBORDER --');
                format['mockups'][i]['border'] = true;
                format['mockups'][i]['border_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['border_attributes'][0];
                // glBorderBevel
                const bevelMatch = /glBorderBevel=(\d+)/.exec(painterValue);
                attributes.glBorderBevel = bevelMatch ? Number(bevelMatch[1]) : 1;
                // glBorderColor
                const colorMatch = /glBorderColor=cl(\w+)/.exec(painterValue);
                attributes.glBorderColor = colorMatch ? colorMatch[1] : "gray";
            }
            if (value[sensor]['Painter(v)'].match('SimpleBar')) {
                console.log('-- PAINTER SECTION SIMPLEBAR --');
                format['mockups'][i]['tool'] = 'SimpleBar';
                format['mockups'][i]['bar'] = true;
                format['mockups'][i]['bar_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['bar_attributes'][0];
                // Находим позицию glBarColor=
                const startIndex = painterValue.indexOf('glBarColor=');
                if (startIndex !== -1) {
                    const valueStart = startIndex + 'glBarColor='.length;
                    // Ищем следующую закрывающую скобку после =
                    let parenCount = 0;
                    let endIndex = valueStart;
                    for (let i = valueStart; i < painterValue.length; i++) {
                        if (painterValue[i] === '(') parenCount++;
                        if (painterValue[i] === ')') parenCount--;
                        if (parenCount === -1) { // Закрывающая скобка после открытия
                            endIndex = i;
                            break;
                        }
                    }
                    attributes.glBarColor = painterValue.substring(valueStart, endIndex).trim();
                } else {
                    attributes.glBarColor = "gray";
                }
            }

            const actionTypes = [
                { type: 'Menu', name: 'menu' },
                { type: 'Options', name: 'options' },
                { type: 'ArrowCircCW', name: 'arrowcirc_cw' },
                { type: 'ArrowCircCCW', name: 'arrowcirc_ccw' },
                { type: 'ArrowCW', name: 'arrowcw' },
                { type: 'ArrowCCW', name: 'arrowccw' },
                { type: 'ArrowUp', name: 'arrowup' },
                { type: 'ArrowLeft', name: 'arrowleft' },
                { type: 'ArrowRight', name: 'arrowright' },
                { type: 'PowerOn', name: 'poweron' }
            ];

            actionTypes.forEach(action => {
                if (value[sensor]['Painter(v)'].match(`GuiLib.Cmd.${action.type}`)) {
                    console.log(`-- PAINTER SECTION CMD_${action.type} --`);
                    format['mockups'][i]['tool'] = `Cmd_${action.type}`;
                    format['mockups'][i]['cmd_' + action.name] = true;
                    format['mockups'][i]['cmd_' +action.name+ '_attributes'] = [{}];

                    const painterValue = value[sensor]['Painter(v)'];
                    const attributes = format['mockups'][i]['cmd_' +action.name+ '_attributes'][0];

                    // Проверяем каждый параметр по отдельности
                    const params = [
                        { key: 'glCmd' + action.type + 'Color0', name: 'color0' },
                        { key: 'glCmd' + action.type + 'Color1', name: 'color1' },
                        { key: 'glCmd' + action.type + 'Alignment', name: 'alignment' },
                        { key: 'glCmd' + action.type + 'LineWidth', name: 'lineWidth' }
                    ];

                    params.forEach(param => {
                        const match = new RegExp(`${param.key}=(\\d+)`).exec(painterValue);
                        if (match) {
                            attributes['glCmd' + action.type + param.name.charAt(0).toUpperCase() + param.name.slice(1)] = Number(match[1]);
                        }
                    });
                }
            });

            const toolBarTypes = [
                { type: 'Calculator', name: 'calculator' },
                { type: 'Close', name: 'close' },
                { type: 'Console', name: 'console' },
                { type: 'Erase', name: 'erase' },
                { type: 'Favorite', name: 'favorite' },
                { type: 'Flash', name: 'flash' },
                { type: 'FlashAlt', name: 'flashalt' },
                { type: 'Help', name: 'help' },
                { type: 'Home', name: 'home' },
                { type: 'Key', name: 'key' },
                { type: 'Lightning', name: 'lightning' },
                { type: 'LightningAlt', name: 'lightningalt' },
                { type: 'Loadini', name: 'loadini' },
                { type: 'Lock', name: 'lock' },
                { type: 'Loupe', name: 'loupe' },
                { type: 'Navigator', name: 'navigator' },
                { type: 'Open', name: 'open' },
                { type: 'Save', name: 'save' },
                { type: 'Saveini', name: 'saveini' },
                { type: 'Setting', name: 'setting' },
                { type: 'Smile', name: 'smile' },
                { type: 'Snowflake', name: 'snowflake' },
                { type: 'Sound', name: 'sound' },
                { type: 'Tools', name: 'tools' }
            ];

            toolBarTypes.forEach(tool => {
                if (value[sensor]['Painter(v)'].match(`GuiLib.Cmd.${tool.type}`)) {
                    console.log(`-- PAINTER SECTION CMD_${tool.type} --`);
                    format['mockups'][i]['tool'] = `Cmd_${tool.type}`;
                    format['mockups'][i]['cmd_' + tool.name] = true;
                    format['mockups'][i]['cmd_' + tool.name + '_attributes'] = [{}];

                    const painterValue = value[sensor]['Painter(v)'];
                    const attributes = format['mockups'][i]['cmd_' + tool.name + '_attributes'][0];

                    // Проверяем каждый параметр по отдельности
                    const params = [
                        { key: 'glCmd' + tool.type + 'Color0', name: 'color0' },
                        { key: 'glCmd' + tool.type + 'Color1', name: 'color1' }
                    ];

                    params.forEach(param => {
                        const match = new RegExp(`${param.key}=cl(\\w+)`).exec(painterValue);
                        if (match) {
                            attributes[param.key] = match[1];
                        }
                    });
                }
            });

            if (value[sensor]['Painter(v)'].match('Cmd.Ok')) {
                console.log('-- PAINTER SECTION CMD.OK --');
                format['mockups'][i]['tool'] = 'Cmd_Ok';
                format['mockups'][i]['cmd_ok'] = true;
                format['mockups'][i]['cmd_ok_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['cmd_ok_attributes'][0];
                // glCmdOkLineWidth
                const lineWidthMatch = /glCmdOkLineWidth=(\d+)/.exec(painterValue);
                attributes.glCmdOkLineWidth = lineWidthMatch ? Number(lineWidthMatch[1]) : 1;
                // glCmdOkLineColor
                const lineColorMatch = /glCmdOkLineColor=cl(\w+)/.exec(painterValue);
                attributes.glCmdOkLineColor = lineColorMatch ? lineColorMatch[1] : "gray";
                // glCmdOkFillColor
                const fillColorMatch = /glCmdOkFillColor=cl(\w+)/.exec(painterValue);
                attributes.glCmdOkFillColor = fillColorMatch ? fillColorMatch[1] : "lime";
            }  
            if (value[sensor]['Painter(v)'].match('Cmd.Cancel')) {
                console.log('-- PAINTER SECTION CMD.CANCEL --');
                format['mockups'][i]['tool'] = 'Cmd_Cancel';
                format['mockups'][i]['cmd_cancel'] = true;
                format['mockups'][i]['cmd_cancel_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['cmd_cancel_attributes'][0];
                // glCmdCancelLineWidth (в оригинале используется одинаковое имя, но должно быть для Cancel)
                const lineWidthMatch = /glCmdCancelLineWidth=(\d+)/.exec(painterValue);
                attributes.glCmdCancelLineWidth = lineWidthMatch ? Number(lineWidthMatch[1]) : 1;
                // glCmdCancelLineColor
                const lineColorMatch = /glCmdCancelLineColor=cl(\w+)/.exec(painterValue);
                attributes.glCmdCancelLineColor = lineColorMatch ? lineColorMatch[1] : "gray";
                // glCmdCancelFillColor
                const fillColorMatch = /glCmdCancelFillColor=cl(\w+)/.exec(painterValue);
                attributes.glCmdCancelFillColor = fillColorMatch ? fillColorMatch[1] : "lime";
            }
            if (value[sensor]['Painter(v)'].match('Indicator.Circle')) {
               console.log('-- PAINTER SECTION CIRCLE --');
               format['mockups'][i]['tool'] = 'IndicatorCircle';
               format['mockups'][i]['indicatorcircle'] = true;
               format['mockups'][i]['indicatorcircle_attributes'] = [{}];
               const painterValue = value[sensor]['Painter(v)'];
               const attributes = format['mockups'][i]['indicatorcircle_attributes'][0];
               // glCircleBevel
               const bevelMatch = /glCircleBevel=(\d+)/.exec(painterValue);
               attributes.glCircleBevel = bevelMatch ? Number(bevelMatch[1]) : 0;
               // glCircleWidth
               const widthMatch = /glCircleWidth=(\d+)/.exec(painterValue);
               attributes.glCircleWidth = widthMatch ? Number(widthMatch[1]) : 1;
               // glCircleFaceColor
               const faceColorMatch = /glCircleFaceColor=cl(\w+)/.exec(painterValue);
               attributes.glCircleFaceColor = faceColorMatch ? faceColorMatch[1] : 'black';
               // glCircleBackColor
               const backColorMatch = /glCircleBackColor=glCircleBackColor\+eq\(glCircleBackColor,0\)\*cl(\w+)/.exec(painterValue);
               attributes.glCircleBackColor = backColorMatch ? backColorMatch[1] : 'silver';
            }
            if (value[sensor]['Painter(v)'].match('SimpleCross')) {
                console.log('-- PAINTER SECTION SIMPLECROSS --');
                format['mockups'][i]['tool'] = 'SimpleCross';
                format['mockups'][i]['simplecross'] = true;
                format['mockups'][i]['simplecross_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['simplecross_attributes'][0];
                // glCrossBevel
                const bevelMatch = /glCrossBevel=(\d+)/.exec(painterValue);
                attributes.glCrossBevel = bevelMatch ? Number(bevelMatch[1]) : 2;
                // glCrossWidth
                const widthMatch = /glCrossWidth=(\d+)/.exec(painterValue);
                attributes.glCrossWidth = widthMatch ? Number(widthMatch[1]) : 1;
                // glCrossColor
                const colorMatch = /glCrossColor=cl(\w+)/.exec(painterValue);
                attributes.glCrossColor = colorMatch ? colorMatch[1] : 'black';
            }     
            if (value[sensor]['Painter(v)'].match('ListButton.Arrow')) {
                console.log('-- PAINTER SECTION LISTBUTTON_ARROW --');
                format['mockups'][i]['tool'] = 'ListButton_Arrow';
                format['mockups'][i]['listbutton_arrow'] = true;
                format['mockups'][i]['listbutton_arrow_attributes'] = [{}];
                const painterValue = value[sensor]['Painter(v)'];
                const attributes = format['mockups'][i]['listbutton_arrow_attributes'][0];
                // glListBtnArrowLeft
                const leftMatch = /glListBtnArrowLeft=(\d+)/.exec(painterValue);
                attributes.glListBtnArrowLeft = leftMatch ? Number(leftMatch[1]) : 0;
                // glListBtnArrowLineColor
                const lineColorMatch = /glListBtnArrowLineColor=cl(\w+)/.exec(painterValue);
                attributes.glListBtnArrowLineColor = lineColorMatch ? lineColorMatch[1] : 'black';
                // glListBtnArrowLineWidth
                const lineWidthMatch = /glListBtnArrowLineWidth=(\d+)/.exec(painterValue);
                attributes.glListBtnArrowLineWidth = lineWidthMatch ? Number(lineWidthMatch[1]) : 1;
                // glListBtnArrowBorderWidth
                const borderWidthMatch = /glListBtnArrowBorderWidth=(\d+)/.exec(painterValue);
                attributes.glListBtnArrowBorderWidth = borderWidthMatch ? Number(borderWidthMatch[1]) : 1;
                // glListBtnArrowBorderColor
                const borderColorMatch = /glListBtnArrowBorderColor=cl(\w+)/.exec(painterValue);
                attributes.glListBtnArrowBorderColor = borderColorMatch ? borderColorMatch[1] : 'black';
            }
            if (value[sensor]['Painter(v)'].match('ListButton.Triangle')) {
                console.log('-- PAINTER SECTION LISTBUTTON_TRIANGLE --');
                format['mockups'][i]['tool'] = 'ListButton_Triangle';
                format['mockups'][i]['listbutton_triangle'] = true;
                format['mockups'][i]['listbutton_triangle_attributes']  = [];
                format['mockups'][i]['listbutton_triangle_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleLeft\=\d{1,}/)){format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLeft'] = Number(value[sensor]['Painter(v)'].match(/glListBtnTriangleLeft\=\d{1,}/)[0].replace("glListBtnTriangleLeft=",""));}else{format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLeft'] = 0}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleLineColor\=\w{1,}/)){format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLineColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleLineColor\=\w{1,}/)[0].replace("glListBtnTriangleLineColor=cl","");}else{format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLineColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleFillColor\=\w{1,}/)){format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleFillColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleFillColor\=\w{1,}/)[0].replace("glListBtnTriangleFillColor=cl","");}else{format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleFillColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderWidth\=\d{1,}/)){format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderWidth\=\d{1,}/)[0].replace("glListBtnTriangleBorderWidth=",""));}else{format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderColor\=\w{1,}/)){format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderColor\=\w{1,}/)[0].replace("glListBtnTriangleBorderColor=cl","");}else{format['mockups'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderColor'] = 'black'}
            }
            if (value[sensor]['Painter(v)'].match('Valve')) {
                console.log('-- PAINTER SECTION VALVE --');
                format['mockups'][i]['tool'] = 'Valve';
                format['mockups'][i]['valve'] = true;
                format['mockups'][i]['valve_attributes']  = [];
                format['mockups'][i]['valve_attributes'][0]  = {};
                //Painter(v).GostLib.Valve.ThruWayVer.LimSwNone.SolenoidOp
                format['mockups'][i]['valve_attributes'][0]['ValveType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",4)[3];
                format['mockups'][i]['valve_attributes'][0]['LimitSwitch'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",5)[4];
                format['mockups'][i]['valve_attributes'][0]['ValveDrive'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",6)[5].match(/\w{1,}/)[0];
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['mockups'][i]['valve_attributes'][0]['glButtonBit'] = value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=","");}else{format['mockups'][i]['valve_attributes'][0]['glButtonBit'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glValveOpenBit\=\d{1,}/)){format['mockups'][i]['valve_attributes'][0]['glValveOpenBit'] = value[sensor]['Painter(v)'].match(/glValveOpenBit\=\d{1,}/)[0].replace("glValveOpenBit=","");}else{format['mockups'][i]['valve_attributes'][0]['glValveOpenBit'] = 1;}
                if(value[sensor]['Painter(v)'].match(/glValveCloseBit\=\d{1,}/)){format['mockups'][i]['valve_attributes'][0]['glValveCloseBit'] = value[sensor]['Painter(v)'].match(/glValveCloseBit\=\d{1,}/)[0].replace("glValveCloseBit=","");}else{format['mockups'][i]['valve_attributes'][0]['glValveCloseBit'] = 2;}
            }
            if (value[sensor]['Painter(v)'].match(/\.Pump/)) {
                console.log('-- PAINTER SECTION PUMP --');
                format['mockups'][i]['tool'] = 'Pump';
                format['mockups'][i]['pump'] = true;
                format['mockups'][i]['pump_attributes']  = [];
                format['mockups'][i]['pump_attributes'][0]  = {};
                //[Painter(v).GostLib.Pump.RotSingle.Down]
                format['mockups'][i]['pump_attributes'][0]['PumpType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Pump.{1,}\]/g)[0].split(".",4)[3];
                format['mockups'][i]['pump_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Pump.{1,}\]/g)[0].split(".",5)[4].match(/.{1,}\]/)[0].replace("]","");
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['mockups'][i]['pump_attributes'][0]['glButtonBit'] = value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=","");}else{format['mockups'][i]['pump_attributes'][0]['glButtonBit'] = 0;}                
                if(value[sensor]['Painter(v)'].match(/glPumpSpeedBit\=\d{1,}/)){format['mockups'][i]['pump_attributes'][0]['glPumpSpeedBit'] = value[sensor]['Painter(v)'].match(/glPumpSpeedBit\=\d{1,}/)[0].replace("glPumpSpeedBit=","");}else{format['mockups'][i]['pump_attributes'][0]['glPumpSpeedBit'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glPumpErrorBit\=\d{1,}/)){format['mockups'][i]['pump_attributes'][0]['glPumpErrorBit'] = value[sensor]['Painter(v)'].match(/glPumpErrorBit\=\d{1,}/)[0].replace("glPumpErrorBit=","");}else{format['mockups'][i]['pump_attributes'][0]['glPumpErrorBit'] = 0;}if(value[sensor]['Painter(v)'].match(/glPumpEdgeBevel\=\d{1,}/)){format['mockups'][i]['pump_attributes'][0]['glPumpEdgeBevel'] = value[sensor]['Painter(v)'].match(/glPumpEdgeBevel\=\d{1,}/)[0].replace("glPumpEdgeBevel=","");}else{format['mockups'][i]['pump_attributes'][0]['glPumpEdgeBevel'] = 0;}
            }            
            if (value[sensor]['Painter(v)'].match(/Vacuometer/)) {
                console.log('-- PAINTER SECTION VACUOMETER --');
                format['mockups'][i]['tool'] = 'Vacuometer';
                format['mockups'][i]['vacuometer'] = true;
                format['mockups'][i]['vacuometer_attributes']  = [];
                format['mockups'][i]['vacuometer_attributes'][0]  = {};
                //[Painter(v).GostLib.Vacuometer.Penning.Right]
                format['mockups'][i]['vacuometer_attributes'][0]['VacuometerType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Vacuometer.{1,}\]/g)[0].split(".",4)[3];
                format['mockups'][i]['vacuometer_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Vacuometer.{1,}\]/g)[0].split(".",5)[4].match(/.{1,}\]/)[0].replace("]","");
                if(value[sensor]['Painter(v)'].match(/glVacuometerBevel\=\d{1,}/)){format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerBevel'] = value[sensor]['Painter(v)'].match(/glVacuometerBevel\=\d{1,}/)[0].replace("glVacuometerBevel=","");}else{format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerBevel'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glVacuometerFillColor\=\w{1,}/)){format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerFillColor'] = value[sensor]['Painter(v)'].match(/glVacuometerFillColor\=\w{1,}/)[0].replace("glVacuometerFillColor=cl","");}else{format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glVacuometerLineColor\=\w{1,}/)){format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerLineColor'] = value[sensor]['Painter(v)'].match(/glVacuometerLineColor\=\w{1,}/)[0].replace("glVacuometerLineColor=cl","");}else{format['mockups'][i]['vacuometer_attributes'][0]['glVacuometerLineColor'] = 'Black'}
            }            
            if (value[sensor]['Painter(v)'].match('LeakDetector')) {
                console.log('-- PAINTER SECTION LEAKDETECTOR --');
                format['mockups'][i]['tool'] = 'LeakDetector';
                format['mockups'][i]['leakdetector'] = true;
                format['mockups'][i]['leakdetector_attributes']  = [];
                format['mockups'][i]['leakdetector_attributes'][0]  = {};
                //[Painter(v).GostLib.LeakDetector]
                if(value[sensor]['Painter(v)'].match(/glLeakDetBevel\=\d{1,}/)){format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetBevel'] = value[sensor]['Painter(v)'].match(/glLeakDetBevel\=\d{1,}/)[0].replace("glLeakDetBevel=","");}else{format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetBevel'] = 3;}
                if(value[sensor]['Painter(v)'].match(/glLeakDetFillColor\=\w{1,}/)){format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetFillColor'] = value[sensor]['Painter(v)'].match(/glLeakDetFillColor\=\w{1,}/)[0].replace("glLeakDetFillColor=cl","");}else{format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glLeakDetLineColor\=\w{1,}/)){format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetLineColor'] = value[sensor]['Painter(v)'].match(/glLeakDetLineColor\=\w{1,}/)[0].replace("glLeakDetLineColor=cl","");}else{format['mockups'][i]['leakdetector_attributes'][0]['glLeakDetLineColor'] = 'Black'}
            }
            if (value[sensor]['Painter(v)'].match(/\.Compressor/)) {
                console.log('-- PAINTER SECTION COMPRESSOR --');
                format['mockups'][i]['tool'] = 'Compressor';
                format['mockups'][i]['compressor'] = true;
                format['mockups'][i]['compressor_attributes']  = [];
                format['mockups'][i]['compressor_attributes'][0]  = {};
                //[Painter(v).GostLib.Compressor.Orientation]
                format['mockups'][i]['compressor_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Compressor.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
                if(value[sensor]['Painter(v)'].match(/glCompressorBevel\=\d{1,}/)){format['mockups'][i]['compressor_attributes'][0]['glCompressorBevel'] = value[sensor]['Painter(v)'].match(/glCompressorBevel\=\d{1,}/)[0].replace("glCompressorBevel=","");}else{format['mockups'][i]['compressor_attributes'][0]['glCompressorBevel'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glCompressorFillColor\=\w{1,}/)){format['mockups'][i]['compressor_attributes'][0]['glCompressorFillColor'] = value[sensor]['Painter(v)'].match(/glCompressorFillColor\=\w{1,}/)[0].replace("glCompressorFillColor=cl","");}else{format['mockups'][i]['compressor_attributes'][0]['glCompressorFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glCompressorLineColor\=\w{1,}/)){format['mockups'][i]['compressor_attributes'][0]['glCompressorLineColor'] = value[sensor]['Painter(v)'].match(/glCompressorLineColor\=\w{1,}/)[0].replace("glCompressorLineColor=cl","");}else{format['mockups'][i]['compressor_attributes'][0]['glCompressorLineColor'] = 'Black'}
            }   
			if (value[sensor]['Painter(v)'].match('RadiationHazard')) {
                console.log('-- PAINTER SECTION RADIATIONHAZARD --');
                format['mockups'][i]['tool'] = 'RadiationHazard';
                format['mockups'][i]['radiationhazard'] = true;
                format['mockups'][i]['radiationhazard_attributes']  = [];
                format['mockups'][i]['radiationhazard_attributes'][0]  = {};
                //[Painter(v).DaqLib.RadiationHazard]
				if(value[sensor]['Painter(v)'].match(/glRadiationHazardBevel\=\d{1,}/)){format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardBevel'] = Number(value[sensor]['Painter(v)'].match(/glRadiationHazardBevel\=\d{1,}/)[0].replace("glRadiationHazardBevel=",""));}else{format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardBevel'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glRadiationHazardBackColor\=\w{1,}/)){format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardBackColor'] = value[sensor]['Painter(v)'].match(/glRadiationHazardBackColor\=\w{1,}/)[0].replace("glRadiationHazardBackColor=cl","");}else{format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardBackColor'] = 'Yellow';}
				if(value[sensor]['Painter(v)'].match(/glRadiationHazardFillColor\=\w{1,}/)){format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardFillColor'] = value[sensor]['Painter(v)'].match(/glRadiationHazardFillColor\=\w{1,}/)[0].replace("glRadiationHazardFillColor=cl","");}else{format['mockups'][i]['radiationhazard_attributes'][0]['glRadiationHazardFillColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('AirBlower')) {
                console.log('-- PAINTER SECTION AIRBLOWER --');
                format['mockups'][i]['tool'] = 'AirBlower';
                format['mockups'][i]['airblower'] = true;
                format['mockups'][i]['airblower_attributes']  = [];
                format['mockups'][i]['airblower_attributes'][0]  = {};
                //[Painter(v).DaqLib.AirBlower.Right]
				format['mockups'][i]['airblower_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.AirBlower.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glAirBlowerBevel\=\d{1,}/)){format['mockups'][i]['airblower_attributes'][0]['glAirBlowerBevel'] = Number(value[sensor]['Painter(v)'].match(/glAirBlowerBevel\=\d{1,}/)[0].replace("glAirBlowerBevel=",""));}else{format['mockups'][i]['airblower_attributes'][0]['glAirBlowerBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glAirBlowerLineWidth\=\d{1,}/)){format['mockups'][i]['airblower_attributes'][0]['glAirBlowerLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glAirBlowerLineWidth\=\d{1,}/)[0].replace("glAirBlowerLineWidth=",""));}else{format['mockups'][i]['airblower_attributes'][0]['glAirBlowerLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glAirBlowerFillColor\=\w{1,}/)){format['mockups'][i]['airblower_attributes'][0]['glAirBlowerFillColor'] = value[sensor]['Painter(v)'].match(/glAirBlowerFillColor\=\w{1,}/)[0].replace("glAirBlowerFillColor=cl","");}else{format['mockups'][i]['airblower_attributes'][0]['glAirBlowerFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glAirBlowerLineColor\=\w{1,}/)){format['mockups'][i]['airblower_attributes'][0]['glAirBlowerLineColor'] = value[sensor]['Painter(v)'].match(/glAirBlowerLineColor\=\w{1,}/)[0].replace("glAirBlowerLineColor=cl","");}else{format['mockups'][i]['airblower_attributes'][0]['glAirBlowerLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('FanBlower')) {
                console.log('-- PAINTER SECTION FANBLOWER --');
                format['mockups'][i]['tool'] = 'FanBlower';
                format['mockups'][i]['fanblower'] = true;
                format['mockups'][i]['fanblower_attributes']  = [];
                format['mockups'][i]['fanblower_attributes'][0]  = {};
                //[Painter(v).DaqLib.FanBlower.Right]
				format['mockups'][i]['fanblower_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.FanBlower.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glFanBlowerBevel\=\d{1,}/)){format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerBevel'] = Number(value[sensor]['Painter(v)'].match(/glFanBlowerBevel\=\d{1,}/)[0].replace("glFanBlowerBevel=",""));}else{format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glFanBlowerLineWidth\=\d{1,}/)){format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glFanBlowerLineWidth\=\d{1,}/)[0].replace("glFanBlowerLineWidth=",""));}else{format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glFanBlowerFillColor\=\w{1,}/)){format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerFillColor'] = value[sensor]['Painter(v)'].match(/glFanBlowerFillColor\=\w{1,}/)[0].replace("glFanBlowerFillColor=cl","");}else{format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glFanBlowerLineColor\=\w{1,}/)){format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerLineColor'] = value[sensor]['Painter(v)'].match(/glFanBlowerLineColor\=\w{1,}/)[0].replace("glFanBlowerLineColor=cl","");}else{format['mockups'][i]['fanblower_attributes'][0]['glFanBlowerLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('WaterPump')) {
                console.log('-- PAINTER SECTION WATERPUMP --');
                format['mockups'][i]['tool'] = 'WaterPump';
                format['mockups'][i]['waterpump'] = true;
                format['mockups'][i]['waterpump_attributes']  = [];
                format['mockups'][i]['waterpump_attributes'][0]  = {};
                //[Painter(v).DaqLib.WaterPump.Right]
				format['mockups'][i]['waterpump_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.WaterPump.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glWaterPumpBevel\=\d{1,}/)){format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpBevel'] = Number(value[sensor]['Painter(v)'].match(/glWaterPumpBevel\=\d{1,}/)[0].replace("glWaterPumpBevel=",""));}else{format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glWaterPumpLineWidth\=\d{1,}/)){format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glWaterPumpLineWidth\=\d{1,}/)[0].replace("glWaterPumpLineWidth=",""));}else{format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glWaterPumpFillColor\=\w{1,}/)){format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpFillColor'] = value[sensor]['Painter(v)'].match(/glWaterPumpFillColor\=\w{1,}/)[0].replace("glWaterPumpFillColor=cl","");}else{format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glWaterPumpLineColor\=\w{1,}/)){format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpLineColor'] = value[sensor]['Painter(v)'].match(/glWaterPumpLineColor\=\w{1,}/)[0].replace("glWaterPumpLineColor=cl","");}else{format['mockups'][i]['waterpump_attributes'][0]['glWaterPumpLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('TankLevel')) {
                console.log('-- PAINTER SECTION MANOMETER --');
                format['mockups'][i]['tool'] = 'TankLevel';
                format['mockups'][i]['tanklevel'] = true;
                format['mockups'][i]['tanklevel_attributes']  = [];
                format['mockups'][i]['tanklevel_attributes'][0]  = {};
                //[Painter(v).DaqLib.TankLevel]
				if(value[sensor]['Painter(v)'].match(/glTankLevelBevel\=\d{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelBevel'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelBevel\=\d{1,}/)[0].replace("glTankLevelBevel=",""));}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glTankLevelLineWidth\=\d{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelLineWidth\=\d{1,}/)[0].replace("glTankLevelLineWidth=",""));}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glTankLevelFillColor\=\w{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelFillColor'] = value[sensor]['Painter(v)'].match(/glTankLevelFillColor\=\w{1,}/)[0].replace("glTankLevelFillColor=cl","");}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelFillColor'] = 'Teal';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelBackColor\=\w{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelBackColor'] = value[sensor]['Painter(v)'].match(/glTankLevelBackColor\=\w{1,}/)[0].replace("glTankLevelBackColor=cl","");}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelBackColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelLineColor\=\w{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelLineColor'] = value[sensor]['Painter(v)'].match(/glTankLevelLineColor\=\w{1,}/)[0].replace("glTankLevelLineColor=cl","");}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelLineColor'] = 'Black';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelPercent\=\d{1,}/)){format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelPercent'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelPercent\=\d{1,}/)[0].replace("glTankLevelPercent=",""));}else{format['mockups'][i]['tanklevel_attributes'][0]['glTankLevelPercent'] = 0;}
            }
			if (value[sensor]['Painter(v)'].match('FlowMeter')) {
                console.log('-- PAINTER SECTION FLOWMETER --');
                format['mockups'][i]['tool'] = 'FlowMeter';
                format['mockups'][i]['flowmeter'] = true;
                format['mockups'][i]['flowmeter_attributes']  = [];
                format['mockups'][i]['flowmeter_attributes'][0]  = {};
                //[Painter(v).DaqLib.FlowMeter.Right]
				format['mockups'][i]['flowmeter_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.FlowMeter.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glFlowMeterBevel\=\d{1,}/)){format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterBevel'] = Number(value[sensor]['Painter(v)'].match(/glFlowMeterBevel\=\d{1,}/)[0].replace("glFlowMeterBevel=",""));}else{format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glFlowMeterLineWidth\=\d{1,}/)){format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glFlowMeterLineWidth\=\d{1,}/)[0].replace("glFlowMeterLineWidth=",""));}else{format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glFlowMeterFillColor\=\w{1,}/)){format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterFillColor'] = value[sensor]['Painter(v)'].match(/glFlowMeterFillColor\=\w{1,}/)[0].replace("glFlowMeterFillColor=cl","");}else{format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glFlowMeterLineColor\=\w{1,}/)){format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterLineColor'] = value[sensor]['Painter(v)'].match(/glFlowMeterLineColor\=\w{1,}/)[0].replace("glFlowMeterLineColor=cl","");}else{format['mockups'][i]['flowmeter_attributes'][0]['glFlowMeterLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('ManoMeter')) {
                console.log('-- PAINTER SECTION MANOMETER --');
                format['mockups'][i]['tool'] = 'ManoMeter';
                format['mockups'][i]['manometer'] = true;
                format['mockups'][i]['manometer_attributes']  = [];
                format['mockups'][i]['manometer_attributes'][0]  = {};
                //[Painter(v).DaqLib.ManoMeter]
				if(value[sensor]['Painter(v)'].match(/glManoMeterBevel\=\d{1,}/)){format['mockups'][i]['manometer_attributes'][0]['glManoMeterBevel'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterBevel\=\d{1,}/)[0].replace("glManoMeterBevel=",""));}else{format['mockups'][i]['manometer_attributes'][0]['glManoMeterBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glManoMeterLineWidth\=\d{1,}/)){format['mockups'][i]['manometer_attributes'][0]['glManoMeterLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterLineWidth\=\d{1,}/)[0].replace("glManoMeterLineWidth=",""));}else{format['mockups'][i]['manometer_attributes'][0]['glManoMeterLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glManoMeterFillColor\=\w{1,}/)){format['mockups'][i]['manometer_attributes'][0]['glManoMeterFillColor'] = value[sensor]['Painter(v)'].match(/glManoMeterFillColor\=\w{1,}/)[0].replace("glManoMeterFillColor=cl","");}else{format['mockups'][i]['manometer_attributes'][0]['glManoMeterFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glManoMeterLineColor\=\w{1,}/)){format['mockups'][i]['manometer_attributes'][0]['glManoMeterLineColor'] = value[sensor]['Painter(v)'].match(/glManoMeterLineColor\=\w{1,}/)[0].replace("glManoMeterLineColor=cl","");}else{format['mockups'][i]['manometer_attributes'][0]['glManoMeterLineColor'] = 'Black';}
				if(value[sensor]['Painter(v)'].match(/glManoMeterAngle\=\d{1,}/)){format['mockups'][i]['manometer_attributes'][0]['glManoMeterAngle'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterAngle\=\d{1,}/)[0].replace("glManoMeterAngle=",""));}else{format['mockups'][i]['manometer_attributes'][0]['glManoMeterAngle'] = 45;}
            }
			if (value[sensor]['Painter(v)'].match('UniHeater')) {
                console.log('-- PAINTER SECTION UNUHEATER --');
                format['mockups'][i]['tool'] = 'UniHeater';
                format['mockups'][i]['uniheater'] = true;
                format['mockups'][i]['uniheater_attributes']  = [];
                format['mockups'][i]['uniheater_attributes'][0]  = {};
                //[Painter(v).DaqLib.UniHeater]
				if(value[sensor]['Painter(v)'].match(/glUniHeaterBevel\=\d{1,}/)){format['mockups'][i]['uniheater_attributes'][0]['glUniHeaterBevel'] = Number(value[sensor]['Painter(v)'].match(/glUniHeaterBevel\=\d{1,}/)[0].replace("glUniHeaterBevel=",""));}else{format['mockups'][i]['uniheater_attributes'][0]['glUniHeaterBevel'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glUniHeaterColor\=\w{1,}/)){format['mockups'][i]['uniheater_attributes'][0]['glUniHeaterColor'] = value[sensor]['Painter(v)'].match(/glUniHeaterColor\=\w{1,}/)[0].replace("glUniHeaterColor=cl","");}else{format['mockups'][i]['uniheater_attributes'][0]['glUniHeaterColor'] = 'Silver';}
            }
        }

        format['mockups'][i]['hint'] = value[sensor]['Hint'] !== undefined ? value[sensor]['Hint'] : value[sensor];
        format['mockups'][i]['toolbarkey'] = value[sensor]['ToolBarKey'];
        i++;
        
        
    }
	// console.log(format);
    console.log('-/- PARSING DONE -/-');
    $("#id_models_ori").val(JSON.stringify(format, null, 2));

    return value;
}
