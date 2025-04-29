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
    format['sensors'] = [];
    if(value['Circuit']){
        if(!isNaN(Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1])))format['width'] = Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1]);
        if(!isNaN(Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2])))format['height'] = Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2]);
        if(!isNaN(Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3])))format['generalmap_bit'] = Number(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3]);
        
        if(value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", ""))format['generalmap_name'] = value['Circuit']['GeneralMap'].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "");
        format['title'] = value['Circuit']['Hint'];
        
        if(value['Circuit.StartupScript']) 
            format['startupscript'] = '';
            for(line in value['Circuit.StartupScript']){
                format['startupscript'] = format['startupscript']+line+' = '+value['Circuit.StartupScript'][line]+'\n';
            }
        }
        
    if(value.Circuit != undefined)if(value.Circuit.Hint != undefined) {format['title'] = value['Circuit']['Hint'];} else {format['title'] = 'noname';}
    delete value.ConfigFile;
    delete value.SensorList;
    delete value["SensorList-"];

    delete value["Circuit.StartupScript"];
    delete value[""];
    delete value.Circuit;
    
    var i = 0;
    for (sensor in value) {
        format['sensors'][i]  = {};
        format['sensors'][i]['name'] = sensor;
        console.log('Импортируем '+sensor+'..');
        format['sensors'][i]['left'] = Number(value[sensor]['Pos'].split(", ",1)[0]);
        format['sensors'][i]['top'] = Number(value[sensor]['Pos'].split(", ",2)[1]);
        if (!format['sensors'][i]['left']) {        
            format['sensors'][i]['left'] = Number(value[sensor]['Pos'].split(/\s/,1)[0].replace(",",""));
            format['sensors'][i]['top'] = Number(value[sensor]['Pos'].split(/\s/,2)[1]);
        }
        format['sensors'][i]['tool'] = 'label';
        if (value[sensor]['LED']) {
            // console.log('-- LED SECTION --');
            format['sensors'][i]['led'] = true;
            format['sensors'][i]['led_attributes']  = [];
            format['sensors'][i]['led_attributes'][0]  = {};
            if(value[sensor]['LED'].split(", ",1)){format['sensors'][i]['led_attributes'][0]['led_wid'] = Number(value[sensor]['LED'].split(", ",1)[0]);}else{format['sensors'][i]['led_attributes'][0]['led_wid'] = 0}
            if(value[sensor]['LED'].split(", ",2)[1]){format['sensors'][i]['led_attributes'][0]['led_dig'] = Number(value[sensor]['LED'].split(", ",2)[1]);}else{format['sensors'][i]['led_attributes'][0]['led_dig'] = 0}
            if(value[sensor]['LED'].split(", ",3)[2]){format['sensors'][i]['led_attributes'][0]['led_val'] = Number(value[sensor]['LED'].split(", ",3)[2]);}else{format['sensors'][i]['led_attributes'][0]['led_val'] = 0}
            if(value[sensor]['LED'].split(", ",4)[3]){format['sensors'][i]['led_attributes'][0]['led_fmt'] = value[sensor]['LED'].split(", ",4)[3];} else {format['sensors'][i]['led_attributes'][0]['led_fmt'] = "*"}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Name\:[a-zA-Z0-9_]+/)){format['sensors'][i]['led_attributes'][0]['led_font'] = value[sensor]['LED'].split(", ",5)[4].match(/Name\:[a-zA-Z0-9_]+/)[0].replace("Name:", "").replace(/_/g, " ");} else {format['sensors'][i]['led_attributes'][0]['led_font'] = 0}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Size\:[0-9]+/)){format['sensors'][i]['led_attributes'][0]['led_size'] = Number(value[sensor]['LED'].split(", ",5)[4].match(/Size\:[0-9]+/)[0].replace("Size:",''));}else{format['sensors'][i]['led_attributes'][0]['led_size'] = 13}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Color\:[a-zA-Z0-9_]+/)){format['sensors'][i]['led_attributes'][0]['led_color'] = value[sensor]['LED'].split(", ",5)[4].match(/Color\:[a-zA-Z0-9_]+/)[0].replace("Color:", "");}else{format['sensors'][i]['led_attributes'][0]['led_color'] = 'black'}
			if(value[sensor]['LED'].split(", ",5)[4].match(/Style[\:[a-zA-Z0-9_]+/)){format['sensors'][i]['led_attributes'][0]['led_style'] = value[sensor]['LED'].split(", ",5)[4].match(/Style[\:[a-zA-Z0-9_]+/)[0].replace("Style:[",'');} else {format['sensors'][i]['led_attributes'][0]['led_style'] = 0}
        }
        var tag = 1;
        var TagType = '';
        format['sensors'][i]['tags']  = [];
        while(value[sensor]['Tag#'+tag]) {
            // console.log('-- TAG SECTION --');
            // console.log(value[sensor]);
            format['sensors'][i]['tags'][tag-1]  = {};
            format['sensors'][i]['tags'][tag-1]['id'] = Number(value[sensor]['Tag#'+tag].split(", ",1)[0]);
            TagType = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",1)[0];
            if (TagType == 'ledbmp') {
                format['sensors'][i]['tags'][tag-1]['type'] = 'ledbmp';
                format['sensors'][i]['tags'][tag-1]['width'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1]+'ch';
                format['sensors'][i]['tags'][tag-1]['height'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2]+'pt';
                format['sensors'][i]['tags'][tag-1]['label'] = value[sensor]['Tag#'+tag].replace(/^.*\.bmp/, "").trim();
                format['sensors'][i]['tags'][tag-1]['bit'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3];
                format['sensors'][i]['tags'][tag-1]['color'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",5)[4].match(/[a-zA-Z0-9_$]+/)[0];
            } else if (TagType == 'barbmp') {
                format['sensors'][i]['tags'][tag-1]['type'] = 'barbmp';
                format['sensors'][i]['tags'][tag-1]['width'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1];
                format['sensors'][i]['tags'][tag-1]['height'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2];
                format['sensors'][i]['tags'][tag-1]['label'] = value[sensor]['Tag#'+tag].replace(/^.*\.bmp/, "").trim();
                format['sensors'][i]['tags'][tag-1]['bit'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3];
                format['sensors'][i]['tags'][tag-1]['color'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",5)[4].match(/[a-zA-Z0-9_$]+/)[0];
            } else {
                // Custom File
                format['sensors'][i]['tags'][tag-1]['type'] = 'custom';
                format['sensors'][i]['tags'][tag-1]['custom'] = value[sensor]['Tag#'+tag].split(", ",2)[1];
                format['sensors'][i]['tags'][tag-1]['width'] = 30;
                format['sensors'][i]['tags'][tag-1]['height'] = 30;
                format['sensors'][i]['tags'][tag-1]['color'] = 'Silver';
            }
            
            if (format['sensors'][i]['tags'][tag-1]['label'] != undefined) 
                if (format['sensors'][i]['tags'][tag-1]['label'][0] == '"') {
                    // format['sensors'][i]['tags'][tag-1]['label'] = format['sensors'][i]['tags'][tag-1]['label'].replace(/"/g, '');
                    format['sensors'][i]['tags'][tag-1]['label'] = format['sensors'][i]['tags'][tag-1]['label'].slice(1,-1).replace(/""/g, '"');;
                } else {
                    format['sensors'][i]['tags'][tag-1]['label'] = format['sensors'][i]['tags'][tag-1]['label'].replace(/\+/g, " ").replace(/\%2C/g, ",").replace(/\%2B/g, "+").replace(/\%%/g, "%").replace(/\%&nbsp;/g, " ");
                }
            
            tag++;
        }
        if (value[sensor]['TagEval(v)']) {
            console.log('-- TAGEVAL SECTION --');
            format['sensors'][i]['tageval'] = value[sensor]['TagEval(v)'];}
        if (value[sensor]['Painter(v)']) {
            if (value[sensor]['Painter(v)'].match('SimpleButton')) {
                console.log('-- PAINTER SECTION SIMPLEBUTTON --');
                format['sensors'][i]['button'] = true;
                format['sensors'][i]['button_attributes']  = [];
                format['sensors'][i]['button_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['sensors'][i]['button_attributes'][0]['glButtonBit'] = Number(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=",""));} else {format['sensors'][i]['button_attributes'][0]['glButtonBit'] = 0}
                if(value[sensor]['Painter(v)'].match(/glButtonBevel\=\d{1,}/)){format['sensors'][i]['button_attributes'][0]['glButtonBevel'] = Number(value[sensor]['Painter(v)'].match(/glButtonBevel\=\d{1,}/)[0].replace("glButtonBevel=",""));} else {format['sensors'][i]['button_attributes'][0]['glButtonBevel'] = 1}
                if(value[sensor]['Painter(v)'].match(/glButtonMoveX\=\d{1,}/)){format['sensors'][i]['button_attributes'][0]['glButtonMoveX'] = Number(value[sensor]['Painter(v)'].match(/glButtonMoveX\=\d{1,}/)[0].replace("glButtonMoveX=",""));} else {format['sensors'][i]['button_attributes'][0]['glButtonMoveX'] = 1}
                if(value[sensor]['Painter(v)'].match(/glButtonMoveY\=\d{1,}/)){format['sensors'][i]['button_attributes'][0]['glButtonMoveY'] = Number(value[sensor]['Painter(v)'].match(/glButtonMoveY\=\d{1,}/)[0].replace("glButtonMoveY=",""));} else {format['sensors'][i]['button_attributes'][0]['glButtonMoveY'] = 1}
            }
            if (value[sensor]['Painter(v)'].match('RadioButton')) {
                console.log('-- PAINTER SECTION RADIOBUTTON --');
                format['sensors'][i]['tool'] = 'RadioButton';
                format['sensors'][i]['radio'] = true;
                format['sensors'][i]['radio_attributes']  = [];
                format['sensors'][i]['radio_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glRadioValue\=\d{1,}/)){format['sensors'][i]['radio_attributes'][0]['glRadioValue'] = Number(value[sensor]['Painter(v)'].match(/glRadioValue\=\d{1,}/)[0].replace("glRadioValue=",""));}else{format['sensors'][i]['radio_attributes'][0]['glRadioValue'] = 0}
                if(value[sensor]['Painter(v)'].match(/glRadioColor\=\w{1,}/)){format['sensors'][i]['radio_attributes'][0]['glRadioColor'] = value[sensor]['Painter(v)'].match(/glRadioColor\=\w{1,}/)[0].replace("glRadioColor=cl","");}else{format['sensors'][i]['radio_attributes'][0]['glRadioColor'] = "white"}
            }
            if (value[sensor]['Painter(v)'].match('CheckBox')) {
                console.log('-- PAINTER SECTION CheckBox --');
                format['sensors'][i]['tool'] = 'CheckBox';
                format['sensors'][i]['checkbox'] = true;
                format['sensors'][i]['checkbox_attributes']  = [];
                format['sensors'][i]['checkbox_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCheckBoxBit\=\d{1,}/)){format['sensors'][i]['checkbox_attributes'][0]['glCheckBoxBit'] = Number(value[sensor]['Painter(v)'].match(/glCheckBoxBit\=\d{1,}/)[0].replace("glCheckBoxBit=",""));}else{format['sensors'][i]['checkbox_attributes'][0]['glCheckBoxBit'] = 0}
                if(value[sensor]['Painter(v)'].match(/glCheckBoxColor\=\w{1,}/)){format['sensors'][i]['checkbox_attributes'][0]['glCheckBoxColor'] = value[sensor]['Painter(v)'].match(/glCheckBoxColor\=\w{1,}/)[0].replace("glCheckBoxColor=cl","");}else{format['sensors'][i]['checkbox_attributes'][0]['glCheckBoxColor'] = 'white'}
            }
            if (value[sensor]['Painter(v)'].match('ProgressBar')) {
                console.log('-- PAINTER SECTION PROGRESSBAR --');
                format['sensors'][i]['tool'] = 'ProgressBar';
                format['sensors'][i]['progressbar'] = true;
                format['sensors'][i]['progressbar_attributes']  = [];
                format['sensors'][i]['progressbar_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glProgBarMin\=\d{1,}/)){format['sensors'][i]['progressbar_attributes'][0]['glProgBarMin'] = Number(value[sensor]['Painter(v)'].match(/glProgBarMin\=\d{1,}/)[0].replace("glProgBarMin=",""));}else{format['sensors'][i]['progressbar_attributes'][0]['glProgBarMin'] = 0}
                if(value[sensor]['Painter(v)'].match(/glProgBarMax\=\d{1,}/)){format['sensors'][i]['progressbar_attributes'][0]['glProgBarMax'] = Number(value[sensor]['Painter(v)'].match(/glProgBarMax\=\d{1,}/)[0].replace("glProgBarMax=",""));}else{format['sensors'][i]['progressbar_attributes'][0]['glProgBarMax'] = 100}
                if(value[sensor]['Painter(v)'].match(/glProgBarHor\=\d{1,}/)){format['sensors'][i]['progressbar_attributes'][0]['glProgBarHor'] = Number(value[sensor]['Painter(v)'].match(/glProgBarHor\=\d{1,}/)[0].replace("glProgBarHor=",""));}else{format['sensors'][i]['progressbar_attributes'][0]['glProgBarHor'] = 1}
                if(value[sensor]['Painter(v)'].match(/glProgBarColor\=\w{1,}/)){format['sensors'][i]['progressbar_attributes'][0]['glProgBarColor'] = value[sensor]['Painter(v)'].match(/glProgBarColor\=\w{1,}/)[0].replace("glProgBarColor=cl","");}else{format['sensors'][i]['progressbar_attributes'][0]['glProgBarColor'] = 'lime'}
                if(value[sensor]['Painter(v)'].match(/glProgBarBevel\=\d{1,}/)){format['sensors'][i]['progressbar_attributes'][0]['glProgBarBevel'] = Number(value[sensor]['Painter(v)'].match(/glProgBarBevel\=\d{1,}/)[0].replace("glProgBarBevel=",""));}else{format['sensors'][i]['progressbar_attributes'][0]['glProgBarBevel'] = 0}
            }
            if (value[sensor]['Painter(v)'].match('SimpleBorder')) {
                console.log('-- PAINTER SECTION SIMPLEBORDER --');
                format['sensors'][i]['border'] = true;
                format['sensors'][i]['border_attributes']  = [];
                format['sensors'][i]['border_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glBorderBevel\=\d{1,}/)){format['sensors'][i]['border_attributes'][0]['glBorderBevel'] = Number(value[sensor]['Painter(v)'].match(/glBorderBevel\=\d{1,}/)[0].replace("glBorderBevel=",""));} else {format['sensors'][i]['border_attributes'][0]['glBorderBevel'] = 1}
                if(value[sensor]['Painter(v)'].match(/glBorderColor\=\w{1,}/)){format['sensors'][i]['border_attributes'][0]['glBorderColor'] = value[sensor]['Painter(v)'].match(/glBorderColor\=\w{1,}/)[0].replace("glBorderColor=cl","");} else {format['sensors'][i]['border_attributes'][0]['glBorderColor'] = "gray"}
            }
            if (value[sensor]['Painter(v)'].match('SimpleBar')) {
                console.log('-- PAINTER SECTION SIMPLEBAR --');
                format['sensors'][i]['tool'] = 'SimpleBar';
                format['sensors'][i]['bar'] = true;
                format['sensors'][i]['bar_attributes']  = [];
                format['sensors'][i]['bar_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glBarColor\=\w{1,}/)){format['sensors'][i]['bar_attributes'][0]['glBarColor'] = value[sensor]['Painter(v)'].match(/glBarColor\=\w{1,}/)[0].replace("glBarColor=cl","");} else {format['sensors'][i]['bar_attributes'][0]['glBarColor'] = "gray"}
            }           
            if (value[sensor]['Painter(v)'].match('Cmd.Ok')) {
                console.log('-- PAINTER SECTION CMD.OK --');
                format['sensors'][i]['tool'] = 'CmdOk';
                format['sensors'][i]['cmdOk'] = true;
                format['sensors'][i]['cmdOk_attributes']  = [];
                format['sensors'][i]['cmdOk_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)){format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)[0].replace("glCmdOkLineWidth=",""));}else{format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)){format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkLineColor'] = value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)[0].replace("glCmdOkLineColor=cl","");} else {format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkLineColor'] = "gray"}
                if(value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)){format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkFillColor'] = value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)[0].replace("glCmdOkFillColor=cl","");} else {format['sensors'][i]['cmdOk_attributes'][0]['glCmdOkFillColor'] = "lime"}
            }            
            if (value[sensor]['Painter(v)'].match('Cmd.Cancel')) {
                console.log('-- PAINTER SECTION CMD.CANCEL --');
                format['sensors'][i]['tool'] = 'CmdCancel';
                format['sensors'][i]['cmdCancel'] = true;
                format['sensors'][i]['cmdCancel_attributes']  = [];
                format['sensors'][i]['cmdCancel_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)){format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)[0].replace("glCmdOkLineWidth=",""));}else{format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)){format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkLineColor'] = value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)[0].replace("glCmdOkLineColor=cl","");} else {format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkLineColor'] = "gray"}
                if(value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)){format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkFillColor'] = value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)[0].replace("glCmdOkFillColor=cl","");} else {format['sensors'][i]['cmdCancel_attributes'][0]['glCmdOkFillColor'] = "lime"}
            }
            if (value[sensor]['Painter(v)'].match('Indicator.Circle')) {
                console.log('-- PAINTER SECTION CIRCLE --');
                format['sensors'][i]['tool'] = 'IndicatorCircle';
                format['sensors'][i]['indicatorcircle'] = true;
                format['sensors'][i]['indicatorcircle_attributes']  = [];
                format['sensors'][i]['indicatorcircle_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCircleBevel\=\d{1,}/)){format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleBevel'] = Number(value[sensor]['Painter(v)'].match(/glCircleBevel\=\d{1,}/)[0].replace("glCircleBevel=",""));} else {format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleBevel'] = 0}
                if(value[sensor]['Painter(v)'].match(/glCircleWidth\=\d{1,}/)){format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleWidth'] = Number(value[sensor]['Painter(v)'].match(/glCircleWidth\=\d{1,}/)[0].replace("glCircleWidth=",""));} else {format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCircleFaceColor\=\w{1,}/)){format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleFaceColor'] = value[sensor]['Painter(v)'].match(/glCircleFaceColor\=\w{1,}/)[0].replace("glCircleFaceColor=cl","");}else{format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleFaceColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glCircleBackColor\=glCircleBackColor\+eq\(glCircleBackColor\,0\)\*\w{1,}/)){format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleBackColor'] = value[sensor]['Painter(v)'].match(/glCircleBackColor\=glCircleBackColor\+eq\(glCircleBackColor\,0\)\*\w{1,}/)[0].replace("glCircleBackColor=glCircleBackColor+eq(glCircleBackColor,0)*cl","");}else{format['sensors'][i]['indicatorcircle_attributes'][0]['glCircleBackColor'] = 'silver'}
            }
            if (value[sensor]['Painter(v)'].match('SimpleCross')) {
                console.log('-- PAINTER SECTION SIMPLECROSS --');
                format['sensors'][i]['tool'] = 'SimpleCross';
                format['sensors'][i]['simplecross'] = true;
                format['sensors'][i]['simplecross_attributes']  = [];
                format['sensors'][i]['simplecross_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCrossBevel\=\d{1,}/)){format['sensors'][i]['simplecross_attributes'][0]['glCrossBevel'] = Number(value[sensor]['Painter(v)'].match(/glCrossBevel\=\d{1,}/)[0].replace("glCrossBevel=",""));}else{format['sensors'][i]['simplecross_attributes'][0]['glCrossBevel'] = 2}
                if(value[sensor]['Painter(v)'].match(/glCrossWidth\=\d{1,}/)){format['sensors'][i]['simplecross_attributes'][0]['glCrossWidth'] = Number(value[sensor]['Painter(v)'].match(/glCrossWidth\=\d{1,}/)[0].replace("glCrossWidth=",""));}else{format['sensors'][i]['simplecross_attributes'][0]['glCrossWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCrossColor\=\w{1,}/)){format['sensors'][i]['simplecross_attributes'][0]['glCrossColor'] = value[sensor]['Painter(v)'].match(/glCrossColor\=\w{1,}/)[0].replace("glCrossColor=cl","");}else{format['sensors'][i]['simplecross_attributes'][0]['glCrossColor'] = 'black'}
            }            
            if (value[sensor]['Painter(v)'].match('ListButton.Arrow')) {
                console.log('-- PAINTER SECTION LISTBUTTON_ARROW --');
                format['sensors'][i]['tool'] = 'ListButton_Arrow';
                format['sensors'][i]['listbutton_arrow'] = true;
                format['sensors'][i]['listbutton_arrow_attributes']  = [];
                format['sensors'][i]['listbutton_arrow_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLeft\=\d{1,}/)){format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLeft'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowLeft\=\d{1,}/)[0].replace("glListBtnArrowLeft=",""));}else{format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLeft'] = 0}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLineColor\=\w{1,}/)){format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineColor'] = value[sensor]['Painter(v)'].match(/glListBtnArrowLineColor\=\w{1,}/)[0].replace("glListBtnArrowLineColor=cl","");}else{format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLineWidth\=\d{1,}/)){format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowLineWidth\=\d{1,}/)[0].replace("glListBtnArrowLineWidth=",""));}else{format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderWidth\=\d{1,}/)){format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderWidth\=\d{1,}/)[0].replace("glListBtnArrowBorderWidth=",""));}else{format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderColor\=\w{1,}/)){format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderColor'] = value[sensor]['Painter(v)'].match(/glListBtnArrowBorderColor\=\w{1,}/)[0].replace("glListBtnArrowBorderColor=cl","");}else{format['sensors'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderColor'] = 'black'}
            }            
            if (value[sensor]['Painter(v)'].match('ListButton.Triangle')) {
                console.log('-- PAINTER SECTION LISTBUTTON_TRIANGLE --');
                format['sensors'][i]['tool'] = 'ListButton_Triangle';
                format['sensors'][i]['listbutton_triangle'] = true;
                format['sensors'][i]['listbutton_triangle_attributes']  = [];
                format['sensors'][i]['listbutton_triangle_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleLeft\=\d{1,}/)){format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLeft'] = Number(value[sensor]['Painter(v)'].match(/glListBtnTriangleLeft\=\d{1,}/)[0].replace("glListBtnTriangleLeft=",""));}else{format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLeft'] = 0}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleLineColor\=\w{1,}/)){format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLineColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleLineColor\=\w{1,}/)[0].replace("glListBtnTriangleLineColor=cl","");}else{format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleLineColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleFillColor\=\w{1,}/)){format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleFillColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleFillColor\=\w{1,}/)[0].replace("glListBtnTriangleFillColor=cl","");}else{format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleFillColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderWidth\=\d{1,}/)){format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderWidth\=\d{1,}/)[0].replace("glListBtnTriangleBorderWidth=",""));}else{format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderColor\=\w{1,}/)){format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderColor'] = value[sensor]['Painter(v)'].match(/glListBtnTriangleBorderColor\=\w{1,}/)[0].replace("glListBtnTriangleBorderColor=cl","");}else{format['sensors'][i]['listbutton_triangle_attributes'][0]['glListBtnTriangleBorderColor'] = 'black'}
            }
            if (value[sensor]['Painter(v)'].match('Valve')) {
                console.log('-- PAINTER SECTION VALVE --');
                format['sensors'][i]['tool'] = 'Valve';
                format['sensors'][i]['valve'] = true;
                format['sensors'][i]['valve_attributes']  = [];
                format['sensors'][i]['valve_attributes'][0]  = {};
                //Painter(v).GostLib.Valve.ThruWayVer.LimSwNone.SolenoidOp
                format['sensors'][i]['valve_attributes'][0]['ValveType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",4)[3];
                format['sensors'][i]['valve_attributes'][0]['LimitSwitch'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",5)[4];
                format['sensors'][i]['valve_attributes'][0]['ValveDrive'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Valve.{1,}\]/g)[0].split(".",6)[5].match(/\w{1,}/)[0];
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['sensors'][i]['valve_attributes'][0]['glButtonBit'] = value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=","");}else{format['sensors'][i]['valve_attributes'][0]['glButtonBit'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glValveOpenBit\=\d{1,}/)){format['sensors'][i]['valve_attributes'][0]['glValveOpenBit'] = value[sensor]['Painter(v)'].match(/glValveOpenBit\=\d{1,}/)[0].replace("glValveOpenBit=","");}else{format['sensors'][i]['valve_attributes'][0]['glValveOpenBit'] = 1;}
                if(value[sensor]['Painter(v)'].match(/glValveCloseBit\=\d{1,}/)){format['sensors'][i]['valve_attributes'][0]['glValveCloseBit'] = value[sensor]['Painter(v)'].match(/glValveCloseBit\=\d{1,}/)[0].replace("glValveCloseBit=","");}else{format['sensors'][i]['valve_attributes'][0]['glValveCloseBit'] = 2;}
            }
            if (value[sensor]['Painter(v)'].match(/\.Pump/)) {
                console.log('-- PAINTER SECTION PUMP --');
                format['sensors'][i]['tool'] = 'Pump';
                format['sensors'][i]['pump'] = true;
                format['sensors'][i]['pump_attributes']  = [];
                format['sensors'][i]['pump_attributes'][0]  = {};
                //[Painter(v).GostLib.Pump.RotSingle.Down]
                format['sensors'][i]['pump_attributes'][0]['PumpType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Pump.{1,}\]/g)[0].split(".",4)[3];
                format['sensors'][i]['pump_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Pump.{1,}\]/g)[0].split(".",5)[4].match(/.{1,}\]/)[0].replace("]","");
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['sensors'][i]['pump_attributes'][0]['glButtonBit'] = value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=","");}else{format['sensors'][i]['pump_attributes'][0]['glButtonBit'] = 0;}                
                if(value[sensor]['Painter(v)'].match(/glPumpSpeedBit\=\d{1,}/)){format['sensors'][i]['pump_attributes'][0]['glPumpSpeedBit'] = value[sensor]['Painter(v)'].match(/glPumpSpeedBit\=\d{1,}/)[0].replace("glPumpSpeedBit=","");}else{format['sensors'][i]['pump_attributes'][0]['glPumpSpeedBit'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glPumpErrorBit\=\d{1,}/)){format['sensors'][i]['pump_attributes'][0]['glPumpErrorBit'] = value[sensor]['Painter(v)'].match(/glPumpErrorBit\=\d{1,}/)[0].replace("glPumpErrorBit=","");}else{format['sensors'][i]['pump_attributes'][0]['glPumpErrorBit'] = 0;}if(value[sensor]['Painter(v)'].match(/glPumpEdgeBevel\=\d{1,}/)){format['sensors'][i]['pump_attributes'][0]['glPumpEdgeBevel'] = value[sensor]['Painter(v)'].match(/glPumpEdgeBevel\=\d{1,}/)[0].replace("glPumpEdgeBevel=","");}else{format['sensors'][i]['pump_attributes'][0]['glPumpEdgeBevel'] = 0;}
            }            
            if (value[sensor]['Painter(v)'].match(/Vacuometer/)) {
                console.log('-- PAINTER SECTION VACUOMETER --');
                format['sensors'][i]['tool'] = 'Vacuometer';
                format['sensors'][i]['vacuometer'] = true;
                format['sensors'][i]['vacuometer_attributes']  = [];
                format['sensors'][i]['vacuometer_attributes'][0]  = {};
                //[Painter(v).GostLib.Vacuometer.Penning.Right]
                format['sensors'][i]['vacuometer_attributes'][0]['VacuometerType'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Vacuometer.{1,}\]/g)[0].split(".",4)[3];
                format['sensors'][i]['vacuometer_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Vacuometer.{1,}\]/g)[0].split(".",5)[4].match(/.{1,}\]/)[0].replace("]","");
                if(value[sensor]['Painter(v)'].match(/glVacuometerBevel\=\d{1,}/)){format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerBevel'] = value[sensor]['Painter(v)'].match(/glVacuometerBevel\=\d{1,}/)[0].replace("glVacuometerBevel=","");}else{format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerBevel'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glVacuometerFillColor\=\w{1,}/)){format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerFillColor'] = value[sensor]['Painter(v)'].match(/glVacuometerFillColor\=\w{1,}/)[0].replace("glVacuometerFillColor=cl","");}else{format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glVacuometerLineColor\=\w{1,}/)){format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerLineColor'] = value[sensor]['Painter(v)'].match(/glVacuometerLineColor\=\w{1,}/)[0].replace("glVacuometerLineColor=cl","");}else{format['sensors'][i]['vacuometer_attributes'][0]['glVacuometerLineColor'] = 'Black'}
            }            
            if (value[sensor]['Painter(v)'].match('LeakDetector')) {
                console.log('-- PAINTER SECTION LEAKDETECTOR --');
                format['sensors'][i]['tool'] = 'LeakDetector';
                format['sensors'][i]['leakdetector'] = true;
                format['sensors'][i]['leakdetector_attributes']  = [];
                format['sensors'][i]['leakdetector_attributes'][0]  = {};
                //[Painter(v).GostLib.LeakDetector]
                if(value[sensor]['Painter(v)'].match(/glLeakDetBevel\=\d{1,}/)){format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetBevel'] = value[sensor]['Painter(v)'].match(/glLeakDetBevel\=\d{1,}/)[0].replace("glLeakDetBevel=","");}else{format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetBevel'] = 3;}
                if(value[sensor]['Painter(v)'].match(/glLeakDetFillColor\=\w{1,}/)){format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetFillColor'] = value[sensor]['Painter(v)'].match(/glLeakDetFillColor\=\w{1,}/)[0].replace("glLeakDetFillColor=cl","");}else{format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glLeakDetLineColor\=\w{1,}/)){format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetLineColor'] = value[sensor]['Painter(v)'].match(/glLeakDetLineColor\=\w{1,}/)[0].replace("glLeakDetLineColor=cl","");}else{format['sensors'][i]['leakdetector_attributes'][0]['glLeakDetLineColor'] = 'Black'}
            }
            if (value[sensor]['Painter(v)'].match(/\.Compressor/)) {
                console.log('-- PAINTER SECTION COMPRESSOR --');
                format['sensors'][i]['tool'] = 'Compressor';
                format['sensors'][i]['compressor'] = true;
                format['sensors'][i]['compressor_attributes']  = [];
                format['sensors'][i]['compressor_attributes'][0]  = {};
                //[Painter(v).GostLib.Compressor.Orientation]
                format['sensors'][i]['compressor_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.GostLib\.Compressor.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
                if(value[sensor]['Painter(v)'].match(/glCompressorBevel\=\d{1,}/)){format['sensors'][i]['compressor_attributes'][0]['glCompressorBevel'] = value[sensor]['Painter(v)'].match(/glCompressorBevel\=\d{1,}/)[0].replace("glCompressorBevel=","");}else{format['sensors'][i]['compressor_attributes'][0]['glCompressorBevel'] = 0;}
                if(value[sensor]['Painter(v)'].match(/glCompressorFillColor\=\w{1,}/)){format['sensors'][i]['compressor_attributes'][0]['glCompressorFillColor'] = value[sensor]['Painter(v)'].match(/glCompressorFillColor\=\w{1,}/)[0].replace("glCompressorFillColor=cl","");}else{format['sensors'][i]['compressor_attributes'][0]['glCompressorFillColor'] = 'Gray'}
                if(value[sensor]['Painter(v)'].match(/glCompressorLineColor\=\w{1,}/)){format['sensors'][i]['compressor_attributes'][0]['glCompressorLineColor'] = value[sensor]['Painter(v)'].match(/glCompressorLineColor\=\w{1,}/)[0].replace("glCompressorLineColor=cl","");}else{format['sensors'][i]['compressor_attributes'][0]['glCompressorLineColor'] = 'Black'}
            }   
			if (value[sensor]['Painter(v)'].match('RadiationHazard')) {
                console.log('-- PAINTER SECTION RADIATIONHAZARD --');
                format['sensors'][i]['tool'] = 'RadiationHazard';
                format['sensors'][i]['radiationhazard'] = true;
                format['sensors'][i]['radiationhazard_attributes']  = [];
                format['sensors'][i]['radiationhazard_attributes'][0]  = {};
                //[Painter(v).DaqLib.RadiationHazard]
				if(value[sensor]['Painter(v)'].match(/glRadiationHazardBevel\=\d{1,}/)){format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardBevel'] = Number(value[sensor]['Painter(v)'].match(/glRadiationHazardBevel\=\d{1,}/)[0].replace("glRadiationHazardBevel=",""));}else{format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardBevel'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glRadiationHazardBackColor\=\w{1,}/)){format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardBackColor'] = value[sensor]['Painter(v)'].match(/glRadiationHazardBackColor\=\w{1,}/)[0].replace("glRadiationHazardBackColor=cl","");}else{format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardBackColor'] = 'Yellow';}
				if(value[sensor]['Painter(v)'].match(/glRadiationHazardFillColor\=\w{1,}/)){format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardFillColor'] = value[sensor]['Painter(v)'].match(/glRadiationHazardFillColor\=\w{1,}/)[0].replace("glRadiationHazardFillColor=cl","");}else{format['sensors'][i]['radiationhazard_attributes'][0]['glRadiationHazardFillColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('AirBlower')) {
                console.log('-- PAINTER SECTION AIRBLOWER --');
                format['sensors'][i]['tool'] = 'AirBlower';
                format['sensors'][i]['airblower'] = true;
                format['sensors'][i]['airblower_attributes']  = [];
                format['sensors'][i]['airblower_attributes'][0]  = {};
                //[Painter(v).DaqLib.AirBlower.Right]
				format['sensors'][i]['airblower_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.AirBlower.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glAirBlowerBevel\=\d{1,}/)){format['sensors'][i]['airblower_attributes'][0]['glAirBlowerBevel'] = Number(value[sensor]['Painter(v)'].match(/glAirBlowerBevel\=\d{1,}/)[0].replace("glAirBlowerBevel=",""));}else{format['sensors'][i]['airblower_attributes'][0]['glAirBlowerBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glAirBlowerLineWidth\=\d{1,}/)){format['sensors'][i]['airblower_attributes'][0]['glAirBlowerLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glAirBlowerLineWidth\=\d{1,}/)[0].replace("glAirBlowerLineWidth=",""));}else{format['sensors'][i]['airblower_attributes'][0]['glAirBlowerLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glAirBlowerFillColor\=\w{1,}/)){format['sensors'][i]['airblower_attributes'][0]['glAirBlowerFillColor'] = value[sensor]['Painter(v)'].match(/glAirBlowerFillColor\=\w{1,}/)[0].replace("glAirBlowerFillColor=cl","");}else{format['sensors'][i]['airblower_attributes'][0]['glAirBlowerFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glAirBlowerLineColor\=\w{1,}/)){format['sensors'][i]['airblower_attributes'][0]['glAirBlowerLineColor'] = value[sensor]['Painter(v)'].match(/glAirBlowerLineColor\=\w{1,}/)[0].replace("glAirBlowerLineColor=cl","");}else{format['sensors'][i]['airblower_attributes'][0]['glAirBlowerLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('FanBlower')) {
                console.log('-- PAINTER SECTION FANBLOWER --');
                format['sensors'][i]['tool'] = 'FanBlower';
                format['sensors'][i]['fanblower'] = true;
                format['sensors'][i]['fanblower_attributes']  = [];
                format['sensors'][i]['fanblower_attributes'][0]  = {};
                //[Painter(v).DaqLib.FanBlower.Right]
				format['sensors'][i]['fanblower_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.FanBlower.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glFanBlowerBevel\=\d{1,}/)){format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerBevel'] = Number(value[sensor]['Painter(v)'].match(/glFanBlowerBevel\=\d{1,}/)[0].replace("glFanBlowerBevel=",""));}else{format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glFanBlowerLineWidth\=\d{1,}/)){format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glFanBlowerLineWidth\=\d{1,}/)[0].replace("glFanBlowerLineWidth=",""));}else{format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glFanBlowerFillColor\=\w{1,}/)){format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerFillColor'] = value[sensor]['Painter(v)'].match(/glFanBlowerFillColor\=\w{1,}/)[0].replace("glFanBlowerFillColor=cl","");}else{format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glFanBlowerLineColor\=\w{1,}/)){format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerLineColor'] = value[sensor]['Painter(v)'].match(/glFanBlowerLineColor\=\w{1,}/)[0].replace("glFanBlowerLineColor=cl","");}else{format['sensors'][i]['fanblower_attributes'][0]['glFanBlowerLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('WaterPump')) {
                console.log('-- PAINTER SECTION WATERPUMP --');
                format['sensors'][i]['tool'] = 'WaterPump';
                format['sensors'][i]['waterpump'] = true;
                format['sensors'][i]['waterpump_attributes']  = [];
                format['sensors'][i]['waterpump_attributes'][0]  = {};
                //[Painter(v).DaqLib.WaterPump.Right]
				format['sensors'][i]['waterpump_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.WaterPump.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glWaterPumpBevel\=\d{1,}/)){format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpBevel'] = Number(value[sensor]['Painter(v)'].match(/glWaterPumpBevel\=\d{1,}/)[0].replace("glWaterPumpBevel=",""));}else{format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glWaterPumpLineWidth\=\d{1,}/)){format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glWaterPumpLineWidth\=\d{1,}/)[0].replace("glWaterPumpLineWidth=",""));}else{format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glWaterPumpFillColor\=\w{1,}/)){format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpFillColor'] = value[sensor]['Painter(v)'].match(/glWaterPumpFillColor\=\w{1,}/)[0].replace("glWaterPumpFillColor=cl","");}else{format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glWaterPumpLineColor\=\w{1,}/)){format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpLineColor'] = value[sensor]['Painter(v)'].match(/glWaterPumpLineColor\=\w{1,}/)[0].replace("glWaterPumpLineColor=cl","");}else{format['sensors'][i]['waterpump_attributes'][0]['glWaterPumpLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('TankLevel')) {
                console.log('-- PAINTER SECTION MANOMETER --');
                format['sensors'][i]['tool'] = 'TankLevel';
                format['sensors'][i]['tanklevel'] = true;
                format['sensors'][i]['tanklevel_attributes']  = [];
                format['sensors'][i]['tanklevel_attributes'][0]  = {};
                //[Painter(v).DaqLib.TankLevel]
				if(value[sensor]['Painter(v)'].match(/glTankLevelBevel\=\d{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelBevel'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelBevel\=\d{1,}/)[0].replace("glTankLevelBevel=",""));}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glTankLevelLineWidth\=\d{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelLineWidth\=\d{1,}/)[0].replace("glTankLevelLineWidth=",""));}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glTankLevelFillColor\=\w{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelFillColor'] = value[sensor]['Painter(v)'].match(/glTankLevelFillColor\=\w{1,}/)[0].replace("glTankLevelFillColor=cl","");}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelFillColor'] = 'Teal';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelBackColor\=\w{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelBackColor'] = value[sensor]['Painter(v)'].match(/glTankLevelBackColor\=\w{1,}/)[0].replace("glTankLevelBackColor=cl","");}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelBackColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelLineColor\=\w{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelLineColor'] = value[sensor]['Painter(v)'].match(/glTankLevelLineColor\=\w{1,}/)[0].replace("glTankLevelLineColor=cl","");}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelLineColor'] = 'Black';}
				if(value[sensor]['Painter(v)'].match(/glTankLevelPercent\=\d{1,}/)){format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelPercent'] = Number(value[sensor]['Painter(v)'].match(/glTankLevelPercent\=\d{1,}/)[0].replace("glTankLevelPercent=",""));}else{format['sensors'][i]['tanklevel_attributes'][0]['glTankLevelPercent'] = 0;}
            }
			if (value[sensor]['Painter(v)'].match('FlowMeter')) {
                console.log('-- PAINTER SECTION FLOWMETER --');
                format['sensors'][i]['tool'] = 'FlowMeter';
                format['sensors'][i]['flowmeter'] = true;
                format['sensors'][i]['flowmeter_attributes']  = [];
                format['sensors'][i]['flowmeter_attributes'][0]  = {};
                //[Painter(v).DaqLib.FlowMeter.Right]
				format['sensors'][i]['flowmeter_attributes'][0]['Orientation'] = value[sensor]['Painter(v)'].match(/\[Painter\(v\)\.DaqLib\.FlowMeter.{1,}\]/g)[0].split(".",4)[3].match(/.{1,}\]/)[0].replace(']','');
				if(value[sensor]['Painter(v)'].match(/glFlowMeterBevel\=\d{1,}/)){format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterBevel'] = Number(value[sensor]['Painter(v)'].match(/glFlowMeterBevel\=\d{1,}/)[0].replace("glFlowMeterBevel=",""));}else{format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glFlowMeterLineWidth\=\d{1,}/)){format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glFlowMeterLineWidth\=\d{1,}/)[0].replace("glFlowMeterLineWidth=",""));}else{format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glFlowMeterFillColor\=\w{1,}/)){format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterFillColor'] = value[sensor]['Painter(v)'].match(/glFlowMeterFillColor\=\w{1,}/)[0].replace("glFlowMeterFillColor=cl","");}else{format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glFlowMeterLineColor\=\w{1,}/)){format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterLineColor'] = value[sensor]['Painter(v)'].match(/glFlowMeterLineColor\=\w{1,}/)[0].replace("glFlowMeterLineColor=cl","");}else{format['sensors'][i]['flowmeter_attributes'][0]['glFlowMeterLineColor'] = 'Black';}
            }
			if (value[sensor]['Painter(v)'].match('ManoMeter')) {
                console.log('-- PAINTER SECTION MANOMETER --');
                format['sensors'][i]['tool'] = 'ManoMeter';
                format['sensors'][i]['manometer'] = true;
                format['sensors'][i]['manometer_attributes']  = [];
                format['sensors'][i]['manometer_attributes'][0]  = {};
                //[Painter(v).DaqLib.ManoMeter]
				if(value[sensor]['Painter(v)'].match(/glManoMeterBevel\=\d{1,}/)){format['sensors'][i]['manometer_attributes'][0]['glManoMeterBevel'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterBevel\=\d{1,}/)[0].replace("glManoMeterBevel=",""));}else{format['sensors'][i]['manometer_attributes'][0]['glManoMeterBevel'] = 2;}
				if(value[sensor]['Painter(v)'].match(/glManoMeterLineWidth\=\d{1,}/)){format['sensors'][i]['manometer_attributes'][0]['glManoMeterLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterLineWidth\=\d{1,}/)[0].replace("glManoMeterLineWidth=",""));}else{format['sensors'][i]['manometer_attributes'][0]['glManoMeterLineWidth'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glManoMeterFillColor\=\w{1,}/)){format['sensors'][i]['manometer_attributes'][0]['glManoMeterFillColor'] = value[sensor]['Painter(v)'].match(/glManoMeterFillColor\=\w{1,}/)[0].replace("glManoMeterFillColor=cl","");}else{format['sensors'][i]['manometer_attributes'][0]['glManoMeterFillColor'] = 'Silver';}
				if(value[sensor]['Painter(v)'].match(/glManoMeterLineColor\=\w{1,}/)){format['sensors'][i]['manometer_attributes'][0]['glManoMeterLineColor'] = value[sensor]['Painter(v)'].match(/glManoMeterLineColor\=\w{1,}/)[0].replace("glManoMeterLineColor=cl","");}else{format['sensors'][i]['manometer_attributes'][0]['glManoMeterLineColor'] = 'Black';}
				if(value[sensor]['Painter(v)'].match(/glManoMeterAngle\=\d{1,}/)){format['sensors'][i]['manometer_attributes'][0]['glManoMeterAngle'] = Number(value[sensor]['Painter(v)'].match(/glManoMeterAngle\=\d{1,}/)[0].replace("glManoMeterAngle=",""));}else{format['sensors'][i]['manometer_attributes'][0]['glManoMeterAngle'] = 45;}
            }
			if (value[sensor]['Painter(v)'].match('UniHeater')) {
                console.log('-- PAINTER SECTION UNUHEATER --');
                format['sensors'][i]['tool'] = 'UniHeater';
                format['sensors'][i]['uniheater'] = true;
                format['sensors'][i]['uniheater_attributes']  = [];
                format['sensors'][i]['uniheater_attributes'][0]  = {};
                //[Painter(v).DaqLib.UniHeater]
				if(value[sensor]['Painter(v)'].match(/glUniHeaterBevel\=\d{1,}/)){format['sensors'][i]['uniheater_attributes'][0]['glUniHeaterBevel'] = Number(value[sensor]['Painter(v)'].match(/glUniHeaterBevel\=\d{1,}/)[0].replace("glUniHeaterBevel=",""));}else{format['sensors'][i]['uniheater_attributes'][0]['glUniHeaterBevel'] = 2;}
                if(value[sensor]['Painter(v)'].match(/glUniHeaterColor\=\w{1,}/)){format['sensors'][i]['uniheater_attributes'][0]['glUniHeaterColor'] = value[sensor]['Painter(v)'].match(/glUniHeaterColor\=\w{1,}/)[0].replace("glUniHeaterColor=cl","");}else{format['sensors'][i]['uniheater_attributes'][0]['glUniHeaterColor'] = 'Silver';}
            }
        }

        if(value[sensor]['Hint'] != undefined) {format['sensors'][i]['hint'] = value[sensor]['Hint'];} else {format['sensors'][i]['hint'] = value[sensor];}
        i++;
        
        
    }
	// console.log(format);
    console.log('-/- PARSING DONE -/-');
    $("#id_models_ori").val(JSON.stringify(format, null, 2));

    return value;
}