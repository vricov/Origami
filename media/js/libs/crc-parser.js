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
    format['mockups'] = [];
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
        format['mockups'][i]  = {};
        format['mockups'][i]['name'] = sensor;
        console.log('Импортируем '+sensor+'..');
        format['mockups'][i]['left'] = Number(value[sensor]['Pos'].split(", ",1)[0]);
        format['mockups'][i]['top'] = Number(value[sensor]['Pos'].split(", ",2)[1]);
        if (!format['mockups'][i]['left']) {        
            format['mockups'][i]['left'] = Number(value[sensor]['Pos'].split(/\s/,1)[0].replace(",",""));
            format['mockups'][i]['top'] = Number(value[sensor]['Pos'].split(/\s/,2)[1]);
        }
        format['mockups'][i]['tool'] = 'label';
        if (value[sensor]['LED']) {
            // console.log('-- LED SECTION --');
            format['mockups'][i]['led'] = true;
            format['mockups'][i]['led_attributes']  = [];
            format['mockups'][i]['led_attributes'][0]  = {};
            if(value[sensor]['LED'].split(", ",1)){format['mockups'][i]['led_attributes'][0]['led_wid'] = Number(value[sensor]['LED'].split(", ",1)[0]);}else{format['mockups'][i]['led_attributes'][0]['led_wid'] = 0}
            if(value[sensor]['LED'].split(", ",2)[1]){format['mockups'][i]['led_attributes'][0]['led_dig'] = Number(value[sensor]['LED'].split(", ",2)[1]);}else{format['mockups'][i]['led_attributes'][0]['led_dig'] = 0}
            if(value[sensor]['LED'].split(", ",3)[2]){format['mockups'][i]['led_attributes'][0]['led_val'] = Number(value[sensor]['LED'].split(", ",3)[2]);}else{format['mockups'][i]['led_attributes'][0]['led_val'] = 0}
            if(value[sensor]['LED'].split(", ",4)[3]){format['mockups'][i]['led_attributes'][0]['led_fmt'] = value[sensor]['LED'].split(", ",4)[3];} else {format['mockups'][i]['led_attributes'][0]['led_fmt'] = "*"}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Name\:[a-zA-Z0-9_]+/)){format['mockups'][i]['led_attributes'][0]['led_font'] = value[sensor]['LED'].split(", ",5)[4].match(/Name\:[a-zA-Z0-9_]+/)[0].replace("Name:", "").replace(/_/g, " ");} else {format['mockups'][i]['led_attributes'][0]['led_font'] = 0}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Size\:[0-9]+/)){format['mockups'][i]['led_attributes'][0]['led_size'] = Number(value[sensor]['LED'].split(", ",5)[4].match(/Size\:[0-9]+/)[0].replace("Size:",''));}else{format['mockups'][i]['led_attributes'][0]['led_size'] = 13}
            if(value[sensor]['LED'].split(", ",5)[4].match(/Color\:[a-zA-Z0-9_]+/)){format['mockups'][i]['led_attributes'][0]['led_color'] = value[sensor]['LED'].split(", ",5)[4].match(/Color\:[a-zA-Z0-9_]+/)[0].replace("Color:", "");}else{format['mockups'][i]['led_attributes'][0]['led_color'] = 'black'}
			if(value[sensor]['LED'].split(", ",5)[4].match(/Style[\:[a-zA-Z0-9_]+/)){format['mockups'][i]['led_attributes'][0]['led_style'] = value[sensor]['LED'].split(", ",5)[4].match(/Style[\:[a-zA-Z0-9_]+/)[0].replace("Style:[",'');} else {format['mockups'][i]['led_attributes'][0]['led_style'] = 0}
        }
        var tag = 1;
        var TagType = '';
        format['mockups'][i]['tags']  = [];
        while(value[sensor]['Tag#'+tag]) {
            // console.log('-- TAG SECTION --');
            // console.log(value[sensor]);
            format['mockups'][i]['tags'][tag-1]  = {};
            format['mockups'][i]['tags'][tag-1]['id'] = Number(value[sensor]['Tag#'+tag].split(", ",1)[0]);
            TagType = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",1)[0];
            if (TagType == 'ledbmp') {
                format['mockups'][i]['tags'][tag-1]['type'] = 'ledbmp';
                format['mockups'][i]['tags'][tag-1]['width'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1]+'ch';
                format['mockups'][i]['tags'][tag-1]['height'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2]+'pt';
                format['mockups'][i]['tags'][tag-1]['label'] = value[sensor]['Tag#'+tag].replace(/^.*\.bmp/, "").trim();
                format['mockups'][i]['tags'][tag-1]['bit'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3];
                format['mockups'][i]['tags'][tag-1]['color'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",5)[4].match(/[a-zA-Z0-9_$]+/)[0];
            } else if (TagType == 'barbmp') {
                format['mockups'][i]['tags'][tag-1]['type'] = 'barbmp';
                format['mockups'][i]['tags'][tag-1]['width'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",2)[1];
                format['mockups'][i]['tags'][tag-1]['height'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",3)[2];
                format['mockups'][i]['tags'][tag-1]['label'] = value[sensor]['Tag#'+tag].replace(/^.*\.bmp/, "").trim();
                format['mockups'][i]['tags'][tag-1]['bit'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",4)[3];
                format['mockups'][i]['tags'][tag-1]['color'] = value[sensor]['Tag#'+tag].split(", ",2)[1].replace("~~\\Resource\\DaqSite\\StdLib\\Bitmaps\\", "").split("_",5)[4].match(/[a-zA-Z0-9_$]+/)[0];
            } else {
                // Custom File
                format['mockups'][i]['tags'][tag-1]['type'] = 'custom';
                format['mockups'][i]['tags'][tag-1]['custom'] = value[sensor]['Tag#'+tag].split(", ",2)[1];
                format['mockups'][i]['tags'][tag-1]['width'] = 30;
                format['mockups'][i]['tags'][tag-1]['height'] = 30;
                format['mockups'][i]['tags'][tag-1]['color'] = 'Silver';
            }
            
            if (format['mockups'][i]['tags'][tag-1]['label'] != undefined) 
                if (format['mockups'][i]['tags'][tag-1]['label'][0] == '"') {
                    // format['mockups'][i]['tags'][tag-1]['label'] = format['mockups'][i]['tags'][tag-1]['label'].replace(/"/g, '');
                    format['mockups'][i]['tags'][tag-1]['label'] = format['mockups'][i]['tags'][tag-1]['label'].slice(1,-1).replace(/""/g, '"');;
                } else {
                    format['mockups'][i]['tags'][tag-1]['label'] = format['mockups'][i]['tags'][tag-1]['label'].replace(/\+/g, " ").replace(/\%2C/g, ",").replace(/\%2B/g, "+").replace(/\%%/g, "%").replace(/\%&nbsp;/g, " ");
                }
            
            tag++;
        }
        if (value[sensor]['TagEval(v)']) {
            console.log('-- TAGEVAL SECTION --');
            format['mockups'][i]['tageval'] = value[sensor]['TagEval(v)'];}
        if (value[sensor]['Painter(v)']) {
            if (value[sensor]['Painter(v)'].match('SimpleButton')) {
                console.log('-- PAINTER SECTION SIMPLEBUTTON --');
                format['mockups'][i]['button'] = true;
                format['mockups'][i]['button_attributes']  = [];
                format['mockups'][i]['button_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)){format['mockups'][i]['button_attributes'][0]['glButtonBit'] = Number(value[sensor]['Painter(v)'].match(/glButtonBit\=\d{1,}/)[0].replace("glButtonBit=",""));} else {format['mockups'][i]['button_attributes'][0]['glButtonBit'] = 0}
                if(value[sensor]['Painter(v)'].match(/glButtonBevel\=\d{1,}/)){format['mockups'][i]['button_attributes'][0]['glButtonBevel'] = Number(value[sensor]['Painter(v)'].match(/glButtonBevel\=\d{1,}/)[0].replace("glButtonBevel=",""));} else {format['mockups'][i]['button_attributes'][0]['glButtonBevel'] = 1}
                if(value[sensor]['Painter(v)'].match(/glButtonMoveX\=\d{1,}/)){format['mockups'][i]['button_attributes'][0]['glButtonMoveX'] = Number(value[sensor]['Painter(v)'].match(/glButtonMoveX\=\d{1,}/)[0].replace("glButtonMoveX=",""));} else {format['mockups'][i]['button_attributes'][0]['glButtonMoveX'] = 1}
                if(value[sensor]['Painter(v)'].match(/glButtonMoveY\=\d{1,}/)){format['mockups'][i]['button_attributes'][0]['glButtonMoveY'] = Number(value[sensor]['Painter(v)'].match(/glButtonMoveY\=\d{1,}/)[0].replace("glButtonMoveY=",""));} else {format['mockups'][i]['button_attributes'][0]['glButtonMoveY'] = 1}
            }
            if (value[sensor]['Painter(v)'].match('RadioButton')) {
                console.log('-- PAINTER SECTION RADIOBUTTON --');
                format['mockups'][i]['tool'] = 'RadioButton';
                format['mockups'][i]['radio'] = true;
                format['mockups'][i]['radio_attributes']  = [];
                format['mockups'][i]['radio_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glRadioValue\=\d{1,}/)){format['mockups'][i]['radio_attributes'][0]['glRadioValue'] = Number(value[sensor]['Painter(v)'].match(/glRadioValue\=\d{1,}/)[0].replace("glRadioValue=",""));}else{format['mockups'][i]['radio_attributes'][0]['glRadioValue'] = 0}
                if(value[sensor]['Painter(v)'].match(/glRadioColor\=\w{1,}/)){format['mockups'][i]['radio_attributes'][0]['glRadioColor'] = value[sensor]['Painter(v)'].match(/glRadioColor\=\w{1,}/)[0].replace("glRadioColor=cl","");}else{format['mockups'][i]['radio_attributes'][0]['glRadioColor'] = "white"}
            }
            if (value[sensor]['Painter(v)'].match('CheckBox')) {
                console.log('-- PAINTER SECTION CheckBox --');
                format['mockups'][i]['tool'] = 'CheckBox';
                format['mockups'][i]['checkbox'] = true;
                format['mockups'][i]['checkbox_attributes']  = [];
                format['mockups'][i]['checkbox_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCheckBoxBit\=\d{1,}/)){format['mockups'][i]['checkbox_attributes'][0]['glCheckBoxBit'] = Number(value[sensor]['Painter(v)'].match(/glCheckBoxBit\=\d{1,}/)[0].replace("glCheckBoxBit=",""));}else{format['mockups'][i]['checkbox_attributes'][0]['glCheckBoxBit'] = 0}
                if(value[sensor]['Painter(v)'].match(/glCheckBoxColor\=\w{1,}/)){format['mockups'][i]['checkbox_attributes'][0]['glCheckBoxColor'] = value[sensor]['Painter(v)'].match(/glCheckBoxColor\=\w{1,}/)[0].replace("glCheckBoxColor=cl","");}else{format['mockups'][i]['checkbox_attributes'][0]['glCheckBoxColor'] = 'white'}
            }
            if (value[sensor]['Painter(v)'].match('ProgressBar')) {
                console.log('-- PAINTER SECTION PROGRESSBAR --');
                format['mockups'][i]['tool'] = 'ProgressBar';
                format['mockups'][i]['progressbar'] = true;
                format['mockups'][i]['progressbar_attributes']  = [];
                format['mockups'][i]['progressbar_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glProgBarMin\=\d{1,}/)){format['mockups'][i]['progressbar_attributes'][0]['glProgBarMin'] = Number(value[sensor]['Painter(v)'].match(/glProgBarMin\=\d{1,}/)[0].replace("glProgBarMin=",""));}else{format['mockups'][i]['progressbar_attributes'][0]['glProgBarMin'] = 0}
                if(value[sensor]['Painter(v)'].match(/glProgBarMax\=\d{1,}/)){format['mockups'][i]['progressbar_attributes'][0]['glProgBarMax'] = Number(value[sensor]['Painter(v)'].match(/glProgBarMax\=\d{1,}/)[0].replace("glProgBarMax=",""));}else{format['mockups'][i]['progressbar_attributes'][0]['glProgBarMax'] = 100}
                if(value[sensor]['Painter(v)'].match(/glProgBarHor\=\d{1,}/)){format['mockups'][i]['progressbar_attributes'][0]['glProgBarHor'] = Number(value[sensor]['Painter(v)'].match(/glProgBarHor\=\d{1,}/)[0].replace("glProgBarHor=",""));}else{format['mockups'][i]['progressbar_attributes'][0]['glProgBarHor'] = 1}
                if(value[sensor]['Painter(v)'].match(/glProgBarColor\=\w{1,}/)){format['mockups'][i]['progressbar_attributes'][0]['glProgBarColor'] = value[sensor]['Painter(v)'].match(/glProgBarColor\=\w{1,}/)[0].replace("glProgBarColor=cl","");}else{format['mockups'][i]['progressbar_attributes'][0]['glProgBarColor'] = 'lime'}
                if(value[sensor]['Painter(v)'].match(/glProgBarBevel\=\d{1,}/)){format['mockups'][i]['progressbar_attributes'][0]['glProgBarBevel'] = Number(value[sensor]['Painter(v)'].match(/glProgBarBevel\=\d{1,}/)[0].replace("glProgBarBevel=",""));}else{format['mockups'][i]['progressbar_attributes'][0]['glProgBarBevel'] = 0}
            }
            if (value[sensor]['Painter(v)'].match('SimpleBorder')) {
                console.log('-- PAINTER SECTION SIMPLEBORDER --');
                format['mockups'][i]['border'] = true;
                format['mockups'][i]['border_attributes']  = [];
                format['mockups'][i]['border_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glBorderBevel\=\d{1,}/)){format['mockups'][i]['border_attributes'][0]['glBorderBevel'] = Number(value[sensor]['Painter(v)'].match(/glBorderBevel\=\d{1,}/)[0].replace("glBorderBevel=",""));} else {format['mockups'][i]['border_attributes'][0]['glBorderBevel'] = 1}
                if(value[sensor]['Painter(v)'].match(/glBorderColor\=\w{1,}/)){format['mockups'][i]['border_attributes'][0]['glBorderColor'] = value[sensor]['Painter(v)'].match(/glBorderColor\=\w{1,}/)[0].replace("glBorderColor=cl","");} else {format['mockups'][i]['border_attributes'][0]['glBorderColor'] = "gray"}
            }
            if (value[sensor]['Painter(v)'].match('SimpleBar')) {
                console.log('-- PAINTER SECTION SIMPLEBAR --');
                format['mockups'][i]['tool'] = 'SimpleBar';
                format['mockups'][i]['bar'] = true;
                format['mockups'][i]['bar_attributes']  = [];
                format['mockups'][i]['bar_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glBarColor\=\w{1,}/)){format['mockups'][i]['bar_attributes'][0]['glBarColor'] = value[sensor]['Painter(v)'].match(/glBarColor\=\w{1,}/)[0].replace("glBarColor=cl","");} else {format['mockups'][i]['bar_attributes'][0]['glBarColor'] = "gray"}
            }           
            if (value[sensor]['Painter(v)'].match('Cmd.Ok')) {
                console.log('-- PAINTER SECTION CMD.OK --');
                format['mockups'][i]['tool'] = 'CmdOk';
                format['mockups'][i]['cmdOk'] = true;
                format['mockups'][i]['cmdOk_attributes']  = [];
                format['mockups'][i]['cmdOk_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)){format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)[0].replace("glCmdOkLineWidth=",""));}else{format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)){format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkLineColor'] = value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)[0].replace("glCmdOkLineColor=cl","");} else {format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkLineColor'] = "gray"}
                if(value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)){format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkFillColor'] = value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)[0].replace("glCmdOkFillColor=cl","");} else {format['mockups'][i]['cmdOk_attributes'][0]['glCmdOkFillColor'] = "lime"}
            }            
            if (value[sensor]['Painter(v)'].match('Cmd.Cancel')) {
                console.log('-- PAINTER SECTION CMD.CANCEL --');
                format['mockups'][i]['tool'] = 'CmdCancel';
                format['mockups'][i]['cmdCancel'] = true;
                format['mockups'][i]['cmdCancel_attributes']  = [];
                format['mockups'][i]['cmdCancel_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)){format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glCmdOkLineWidth\=\d{1,}/)[0].replace("glCmdOkLineWidth=",""));}else{format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)){format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkLineColor'] = value[sensor]['Painter(v)'].match(/glCmdOkLineColor\=\w{1,}/)[0].replace("glCmdOkLineColor=cl","");} else {format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkLineColor'] = "gray"}
                if(value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)){format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkFillColor'] = value[sensor]['Painter(v)'].match(/glCmdOkFillColor\=\w{1,}/)[0].replace("glCmdOkFillColor=cl","");} else {format['mockups'][i]['cmdCancel_attributes'][0]['glCmdOkFillColor'] = "lime"}
            }
            if (value[sensor]['Painter(v)'].match('Indicator.Circle')) {
                console.log('-- PAINTER SECTION CIRCLE --');
                format['mockups'][i]['tool'] = 'IndicatorCircle';
                format['mockups'][i]['indicatorcircle'] = true;
                format['mockups'][i]['indicatorcircle_attributes']  = [];
                format['mockups'][i]['indicatorcircle_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCircleBevel\=\d{1,}/)){format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleBevel'] = Number(value[sensor]['Painter(v)'].match(/glCircleBevel\=\d{1,}/)[0].replace("glCircleBevel=",""));} else {format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleBevel'] = 0}
                if(value[sensor]['Painter(v)'].match(/glCircleWidth\=\d{1,}/)){format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleWidth'] = Number(value[sensor]['Painter(v)'].match(/glCircleWidth\=\d{1,}/)[0].replace("glCircleWidth=",""));} else {format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCircleFaceColor\=\w{1,}/)){format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleFaceColor'] = value[sensor]['Painter(v)'].match(/glCircleFaceColor\=\w{1,}/)[0].replace("glCircleFaceColor=cl","");}else{format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleFaceColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glCircleBackColor\=glCircleBackColor\+eq\(glCircleBackColor\,0\)\*\w{1,}/)){format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleBackColor'] = value[sensor]['Painter(v)'].match(/glCircleBackColor\=glCircleBackColor\+eq\(glCircleBackColor\,0\)\*\w{1,}/)[0].replace("glCircleBackColor=glCircleBackColor+eq(glCircleBackColor,0)*cl","");}else{format['mockups'][i]['indicatorcircle_attributes'][0]['glCircleBackColor'] = 'silver'}
            }
            if (value[sensor]['Painter(v)'].match('SimpleCross')) {
                console.log('-- PAINTER SECTION SIMPLECROSS --');
                format['mockups'][i]['tool'] = 'SimpleCross';
                format['mockups'][i]['simplecross'] = true;
                format['mockups'][i]['simplecross_attributes']  = [];
                format['mockups'][i]['simplecross_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glCrossBevel\=\d{1,}/)){format['mockups'][i]['simplecross_attributes'][0]['glCrossBevel'] = Number(value[sensor]['Painter(v)'].match(/glCrossBevel\=\d{1,}/)[0].replace("glCrossBevel=",""));}else{format['mockups'][i]['simplecross_attributes'][0]['glCrossBevel'] = 2}
                if(value[sensor]['Painter(v)'].match(/glCrossWidth\=\d{1,}/)){format['mockups'][i]['simplecross_attributes'][0]['glCrossWidth'] = Number(value[sensor]['Painter(v)'].match(/glCrossWidth\=\d{1,}/)[0].replace("glCrossWidth=",""));}else{format['mockups'][i]['simplecross_attributes'][0]['glCrossWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glCrossColor\=\w{1,}/)){format['mockups'][i]['simplecross_attributes'][0]['glCrossColor'] = value[sensor]['Painter(v)'].match(/glCrossColor\=\w{1,}/)[0].replace("glCrossColor=cl","");}else{format['mockups'][i]['simplecross_attributes'][0]['glCrossColor'] = 'black'}
            }            
            if (value[sensor]['Painter(v)'].match('ListButton.Arrow')) {
                console.log('-- PAINTER SECTION LISTBUTTON_ARROW --');
                format['mockups'][i]['tool'] = 'ListButton_Arrow';
                format['mockups'][i]['listbutton_arrow'] = true;
                format['mockups'][i]['listbutton_arrow_attributes']  = [];
                format['mockups'][i]['listbutton_arrow_attributes'][0]  = {};
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLeft\=\d{1,}/)){format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLeft'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowLeft\=\d{1,}/)[0].replace("glListBtnArrowLeft=",""));}else{format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLeft'] = 0}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLineColor\=\w{1,}/)){format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineColor'] = value[sensor]['Painter(v)'].match(/glListBtnArrowLineColor\=\w{1,}/)[0].replace("glListBtnArrowLineColor=cl","");}else{format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineColor'] = 'black'}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowLineWidth\=\d{1,}/)){format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowLineWidth\=\d{1,}/)[0].replace("glListBtnArrowLineWidth=",""));}else{format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowLineWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderWidth\=\d{1,}/)){format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderWidth'] = Number(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderWidth\=\d{1,}/)[0].replace("glListBtnArrowBorderWidth=",""));}else{format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderWidth'] = 1}
                if(value[sensor]['Painter(v)'].match(/glListBtnArrowBorderColor\=\w{1,}/)){format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderColor'] = value[sensor]['Painter(v)'].match(/glListBtnArrowBorderColor\=\w{1,}/)[0].replace("glListBtnArrowBorderColor=cl","");}else{format['mockups'][i]['listbutton_arrow_attributes'][0]['glListBtnArrowBorderColor'] = 'black'}
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

        if(value[sensor]['Hint'] != undefined) {format['mockups'][i]['hint'] = value[sensor]['Hint'];} else {format['mockups'][i]['hint'] = value[sensor];}
        i++;
        
        
    }
	// console.log(format);
    console.log('-/- PARSING DONE -/-');
    $("#id_models_ori").val(JSON.stringify(format, null, 2));

    return value;
}