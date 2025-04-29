usesensors.fixtures.toolbox = [
    {
        "name": "line",
        "category": "Tools",
        "template": "#universal-template",
        "min_height": 1,
        "min_width": 1,
        "attributes": [
            {
                "name": "name",
                "default": "line"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 100,
                "hidden": true
            },
            {
                "name": "height",
                "default": 1,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 100, height: 1, bit: 24, color: 'Black', label: '' },
                ]
            },
            // {
            // "name":"hint",
            // "default":"line sensor"
            // } // keep using sensor here
        ]
    },
    {
        "name": "label",
        "category": "Tools",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "label"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 100,
                "hidden": true
            },
            {
                "name": "height",
                "default": 50,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 10, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 100, height: 50, bit: 24, color: 'Silver', label: 'Label' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "label sensor" // keep using sensor here
            }
        ]
    },
    {
        "name": "SimpleButton",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "Button"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 100,
                "hidden": true
            },
            {
                "name": "height",
                "default": 40,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 100, height: 40, bit: 24, color: 'Silver', label: 'Button' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 1, glButtonMoveX: 1, glButtonMoveY: 1 }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Button"
            }
        ]
    },
    {
        "name": "RadioButton",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 19,
        "attributes": [
            {
                "name": "name",
                "default": "Radio"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 100,
                "hidden": true
            },
            {
                "name": "height",
                "default": 50,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 13, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'ledbmp', width: "14ch", height: "13pt", bit: 24, color: 'Silver', label: 'RadioButton' },
                ]
            },
            {
                "name": "radio",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "radio_attributes",
                "default": [
                    { glRadioValue: 0, glRadioColor: 'White' }
                ]
            },
            {
                "name": "hint",
                "default": "Demo RadioButton"
            }
        ]
    },
    {
        "name": "CheckBox",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 19,
        "attributes": [
            {
                "name": "name",
                "default": "Check"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 11,
                "hidden": true
            },
            {
                "name": "height",
                "default": 12,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 12, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": false,
                "default": [
                    { id: 0, type: 'ledbmp', width: "11ch", height: "12pt", bit: 24, color: 'Silver', label: 'CheckBox' },
                ]
            },
            {
                "name": "checkbox",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "checkbox_attributes",
                "default": [
                    { glCheckBoxBit: 0, glCheckBoxColor: 'White' }
                ]
            },
            {
                "name": "hint",
                "default": "Demo CheckBox"
            }
        ]
    },
    {
        "name": "ProgressBar",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "Progress"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 100,
                "hidden": true
            },
            {
                "name": "height",
                "default": 30,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 20, led_dig: 3, led_val: 0, led_fmt: "%20.3f", led_font: "PT Mono", led_size: 10, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: "100", height: "30", bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "progressbar",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "progressbar_attributes",
                "default": [
                    { glProgBarMin: 0, glProgBarMax: 100, glProgBarHor: 1, glProgBarColor: 'Lime', glProgBarBevel: 0 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo ProgressBar"
            }
        ]
    },
    {
        "name": "SimpleBorder",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Border"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 90,
                "hidden": true
            },
            {
                "name": "height",
                "default": 30,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 10, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 90, height: 30, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 1, glBorderColor: "Gray" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Border"
            }
        ]
    },
    {
        "name": "SimpleBar",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "SimpleBar"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 90,
                "hidden": true
            },
            {
                "name": "height",
                "default": 30,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 12, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 90, height: 30, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "bar",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "bar_attributes",
                "default": [
                    { glBarColor: "Silver" }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Bar"
            }
        ]
    },
    {
        "name": "CmdOk",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "CmdOk"
            },
            {
                "name": "left",
                "default": 50
            },
            {
                "name": "top",
                "default": 50
            },
            {
                "name": "width",
                "default": 90,
                "hidden": true
            },
            {
                "name": "height",
                "default": 30,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 12, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'ledbmp', width: '8ch', height: '20pt', bit: 24, color: 'Silver', label: 'Применить' },
                ]
            },
            {
                "name": "cmdOk",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "cmdOk_attributes",
                "default": [
                    { glCmdOkLineWidth: 1, glCmdOkLineColor: "Green", glCmdOkFillColor: "Lime" }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 1, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Apply button"
            }
        ]
    }, {
        "name": "CmdCancel",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "CmdCancel"
            },
            {
                "name": "left",
                "default": 50
            },
            {
                "name": "top",
                "default": 50
            },
            {
                "name": "width",
                "default": 90,
                "hidden": true
            },
            {
                "name": "height",
                "default": 30,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 10, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'ledbmp', width: '8ch', height: '20pt', bit: 24, color: 'Silver', label: 'Применить' },
                ]
            },
            {
                "name": "cmdCancel",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "cmdCancel_attributes",
                "default": [
                    { glCmdCancelLineWidth: 1, glCmdCancelLineColor: "Green", glCmdCancelFillColor: "Lime" }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 1, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Apply button"
            }
        ]
    },
    {
        "name": "IndicatorCircle",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Circle"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 32, height: 32, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "indicatorcircle",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "indicatorcircle_attributes",
                "default": [
                    { glCircleBevel: 0, glCircleWidth: 1, glCircleFaceColor: 'Black', glCircleBackColor: 'Silver' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 1, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 1, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Indicator"
            }
        ]
    },
    {
        "name": "SimpleCross",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Cross"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 18, height: 18, bit: 24, color: 'White', label: '' }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Black" }
                ]
            },
            {
                "name": "simplecross",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "simplecross_attributes",
                "default": [
                    { glCrossBevel: 2, glCrossWidth: 1, glCrossColor: 'Black', }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Cross"
            }
        ]
    },
    {
        "name": "ListButton_Arrow",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "ListButton.Arrow"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 12, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'ledbmp', width: '9ch', height: '16pt', bit: 24, color: 'White', label: 'List 1 ' }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Black" }
                ]
            },
            {
                "name": "listbutton_arrow",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "listbutton_arrow_attributes",
                "default": [
                    { glListBtnArrowLeft: 0, glListBtnArrowLineColor: 'Black', glListBtnArrowLineWidth: 2, glListBtnArrowBorderWidth: 1, glListBtnArrowBorderColor: 'Gray' }
                ]
            },
            {
                "name": "hint",
                "default": "Demo ListButton.Arrow"
            }
        ]
    },
    {
        "name": "ListButton_Triangle",
        "category": "GuiLib",
        "template": "#universal-template",
        "min_height": 15,
        "attributes": [
            {
                "name": "name",
                "default": "ListButton.Triangle"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": true
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 12, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'ledbmp', width: '9ch', height: '16pt', bit: 24, color: 'White', label: 'List 1 ' }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Black" }
                ]
            },
            {
                "name": "listbutton_triangle",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "listbutton_triangle_attributes",
                "default": [
                    { glListBtnTriangleLeft: 0, glListBtnTriangleLineColor: 'Black', glListBtnTriangleFillColor: 'Gray', glListBtnTriangleBorderWidth: 1, glListBtnTriangleBorderColor: 'Gray' }
                ]
            },
            {
                "name": "hint",
                "default": "Demo ListButton.Triangle"
            }
        ]
    },
    {
        "name": "Valve",
        "category": "GostLib",
        "template": "#universal-template",
        "min_height": 15,
        "min_width": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Valve"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 32, height: 32, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "valve",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "valve_attributes",
                "default": [
                    { ValveType: 'ThruWayHor', LimitSwitch: 'LimSwNone', ValveDrive: 'NoneOp', glButtonBit: 0, glValveOpenBit: '1', glValveCloseBit: '2', }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 2, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Valve"
            }
        ]
    },
    {
        "name": "Pump",
        "category": "GostLib",
        "template": "#universal-template",
        "min_height": 15,
        "min_width": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Pump"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 32, height: 32, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "pump",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "pump_attributes",
                "default": [
                    { PumpType: 'RotSingle', Orientation: 'Up', glButtonBit: 0, glPumpSpeedBit: '0', glPumpErrorBit: '1', glPumpEdgeBevel: 3 }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 2, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Pump"
            }
        ]
    },
    {
        "name": "Vacuometer",
        "category": "GostLib",
        "template": "#universal-template",
        "min_height": 15,
        "min_width": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Vacuometer"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 32, height: 32, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "vacuometer",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "vacuometer_attributes",
                "default": [
                    { VacuometerType: 'Penning', Orientation: 'Up', glVacuometerBevel: 4, glVacuometerFillColor: 'Gray', glVacuometerLineColor: 'Black' }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 2, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Penning vacuometer"
            }
        ]
    },
    {
        "name": "LeakDetector",
        "category": "GostLib",
        "template": "#universal-template",
        "min_height": 15,
        "min_width": 15,
        "attributes": [
            {
                "name": "name",
                "default": "LeakDetector"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 30, height: 30, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "leakdetector",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "leakdetector_attributes",
                "default": [
                    { glLeakDetBevel: 4, glLeakDetFillColor: 'Gray', glLeakDetLineColor: 'Black' }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 2, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Leak detector"
            }
        ]
    },
    {
        "name": "Compressor",
        "category": "GostLib",
        "template": "#universal-template",
        "min_height": 15,
        "min_width": 15,
        "attributes": [
            {
                "name": "name",
                "default": "Compressor"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 32,
                "hidden": true
            },
            {
                "name": "height",
                "default": 32,
                "hidden": true
            },
            {
                "name": "tageval"
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 32, height: 32, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "compressor",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "compressor_attributes",
                "default": [
                    { Orientation: 'Up', glCompressorBevel: 4, glCompressorFillColor: 'Gray', glCompressorLineColor: 'Black' }
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 2, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo Compressor"
            }
        ]
    },
    {
        "name": "RadiationHazard",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "RadiationHazard"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "radiationhazard",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "radiationhazard_attributes",
                "default": [
                    { glRadiationHazardBevel: 2, glRadiationHazardBackColor: 'Yellow', glRadiationHazardFillColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo RadiationHazard"
            }
        ]
    },
    {
        "name": "AirBlower",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "AirBlower"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "airblower",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "airblower_attributes",
                "default": [
                    { Orientation: 'Up', glAirBlowerBevel: 2, glAirBlowerLineWidth: 2, glAirBlowerFillColor: 'Silver', glAirBlowerLineColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo AirBlower"
            }
        ]
    },
    {
        "name": "FanBlower",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "FanBlower"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "fanblower",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "fanblower_attributes",
                "default": [
                    { Orientation: 'Up', glFanBlowerBevel: 2, glFanBlowerLineWidth: 2, glFanBlowerFillColor: 'Silver', glFanBlowerLineColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo FanBlower"
            }
        ]
    },
    {
        "name": "WaterPump",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "WaterPump"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "waterpump",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "waterpump_attributes",
                "default": [
                    { Orientation: 'Up', glWaterPumpBevel: 2, glWaterPumpLineWidth: 2, glWaterPumpFillColor: 'Silver', glWaterPumpLineColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo WaterPump"
            }
        ]
    },
    {
        "name": "TankLevel",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "TankLevel"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval",
                "default": "(glTankLevelPercent=v)"
            },
            {
                "name": "tanklevel",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "tanklevel_attributes",
                "default": [
                    { glTankLevelBevel: 2, glTankLevelLineWidth: 2, glTankLevelFillColor: 'Teal', glTankLevelBackColor: 'Silver', glTankLevelLineColor: 'Black', glTankLevelPercent: '15' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo TankLevel"
            }
        ]
    },
    {
        "name": "FlowMeter",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "FlowMeter"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "flowmeter",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "flowmeter_attributes",
                "default": [
                    { Orientation: 'Up', glFlowMeterBevel: 2, glFlowMeterLineWidth: 2, glFlowMeterFillColor: 'Silver', glFlowMeterLineColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo FlowMeter"
            }
        ]
    },
    {
        "name": "ManoMeter",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "ManoMeter"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "manometer",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "manometer_attributes",
                "default": [
                    { glManoMeterBevel: 2, glManoMeterLineWidth: 2, glManoMeterFillColor: 'Silver', glManoMeterLineColor: 'Black', glManoMeterAngle: 45 },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": false
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo ManoMeter"
            }
        ]
    },
    {
        "name": "UniHeater",
        "category": "DaqLib",
        "template": "#universal-template",
        "min_height": 20,
        "attributes": [
            {
                "name": "name",
                "default": "UniHeater"
            },
            {
                "name": "left",
                "default": 100
            },
            {
                "name": "top",
                "default": 100
            },
            {
                "name": "width",
                "default": 48,
                "hidden": true
            },
            {
                "name": "height",
                "default": 48,
                "hidden": true
            },
            {
                "name": "led",
                "type": "boolean",
                "default": false
            },
            {
                "name": "led_attributes",
                "default": [
                    { led_wid: 0, led_dig: 0, led_val: 0, led_fmt: "*", led_font: "PT Mono", led_size: 14, led_color: "Black", led_style: "Bold" }
                ]
            },
            {
                "name": "tageval"
            },
            {
                "name": "uniheater",
                "type": "boolean",
                "hidden": true,
                "default": true
            },
            {
                "name": "uniheater_attributes",
                "default": [
                    { glUniHeaterBevel: 2, glUniHeaterColor: 'Black' },
                ]
            },
            {
                "name": "tags",
                "hidden": true,
                "default": [
                    { id: 0, type: 'barbmp', width: 48, height: 48, bit: 24, color: 'Silver', label: '' },
                ]
            },
            {
                "name": "button",
                "type": "boolean",
                "default": true
            },
            {
                "name": "button_attributes",
                "default": [
                    { glButtonBit: 0, glButtonBevel: 3, glButtonMoveX: 2, glButtonMoveY: 2 }
                ]
            },
            {
                "name": "border",
                "type": "boolean",
                "default": false
            },
            {
                "name": "border_attributes",
                "default": [
                    { glBorderBevel: 3, glBorderColor: "Silver" }
                ]
            },
            {
                "name": "hint",
                "default": "Demo UniHeater"
            }
        ]
    },
];
