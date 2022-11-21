var strNaN = "NaN";
var strInf = "Infinity";
var oscError; "ERROR";
var strMathError = "Math Error";
var strEmpty = 0;
// input string length limit
var maxLength = 8;
var opCodeArray = [];
var stackArray = [];
var trigDisplay = "";
var openArray = [];
var stackVal1 = 1;
var stackVal2 = 0;
// ****** GLOBAL VAR *********************************************************
// operation code
var opCode = 0;
// stack memory register
var stackVal = 0;
// user memory register
var memVal = 0;
// flag to clear input box on data pre-entry
var boolClear = true;

var newOpCode = 0;
var modeSelected = "deg";

var displayString = "";
var memory = 0;
var trig = 0;
var display = "";
var afterdec = "";

function RoundNum(num, length) {
    var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
    return number;
}
function occurrences(string, subString, allowOverlapping) {

    string += ""; subString += "";
    if (subString.length <= 0) return string.length + 1;

    var n = 0, pos = 0;
    var step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) { ++n; pos += step; } else break;
    }
    return n;
}

// ***********************************************************************************

// ******* MAIN **************************************************************
$(document).ready(function() {
    $('.keyPad_TextBox1').focus(function() {
        this.blur();
    });

    var inBox = $('#keyPad_UserInput');
    var inBox1 = $('#keyPad_UserInput1');
    var modeSelected = $('input[name=degree_or_radian]:radio:checked').val();
    $("#keyPad_UserInput").val(strEmpty);




    // ON LOAD ********************************************

    //************************************************************************
    // DATA ENTRY: NUMERIC KEYS

    $("div#keyPad a.keyPad_btnNumeric").click(function() {
        var btnVal = $(this).html();
        var inBox = $('#keyPad_UserInput');
        var inBox1 = $('#keyPad_UserInput1');
        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
        // clear input box if flag set
        if (boolClear) { inBox.val(strEmpty); boolClear = false; }
        var str = inBox.val();

        // limit the input length
        if (str.length > maxLength) return;

        // prevent duplicate dot entry
        if (this.id == "keyPad_btnDot" && str.indexOf('.') >= 0) return;
        displayCheck();
        if (str != strEmpty || str.length > 1 || this.id == "keyPad_btnDot") {
            inBox.val(str + btnVal);
            stackVal1 = 1;
        } else {
            inBox.val(btnVal);
            stackVal1 = 1;
        }
        inBox.focus();
        //if(stackVal2) {  stackVal2 = 4;}
        //inBox1.val(displayString + inBox.val());
    });

    // CONST DATA ENTRY *******************************************************
    $("a.keyPad_btnConst").click(function() {
        var retVal = strEmpty;
        var inputBox = $('#keyPad_UserInput');
        var inBox1 = $('#keyPad_UserInput1');
        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
        switch (this.id) {
            // PI                                     
            case 'keyPad_btnPi': retVal = Math.PI; break;
            // PI/2                                     
            case 'keyPad_btnPiDiv2': retVal = Math.PI / 2; break;
            // PI/3                                     
            case 'keyPad_btnPiDiv3': retVal = Math.PI / 3; break;
            // PI/4                                     
            case 'keyPad_btnPiDiv4': retVal = Math.PI / 4; break;
            // PI/6                                     
            case 'keyPad_btnPiDiv6': retVal = Math.PI / 6; break;
            // e                                     
            case 'keyPad_btnE': retVal = Math.E; break;
            // 1/e                                     
            case 'keyPad_btnInvE': retVal = 1 / Math.E; break;
            // SQRT(2)                                     
            case 'keyPad_btnSqrt2': retVal = Math.SQRT2; break;
            // SQRT(3)                                     
            case 'keyPad_btnSqrt3': retVal = Math.sqrt(3); break;
            // CUBE ROOT OF(3)                                     
            case 'keyPad_btnCubeRoot2': retVal = Math.pow(2, 1 / 3); break;
            // Ln(10)                                     
            case 'keyPad_btnLn10': retVal = Math.LN10; break;
            // base10: Log(e)                                     
            case 'keyPad_btnLgE': retVal = Math.LOG10E; break;
            // Sigmas: defects probability: on scale 0...1                                      
            // 1 Sigma                                     
            case 'keyPad_btnSigma': retVal = 0.69; break;
            // 3 Sigma                                      
            case 'keyPad_btnSigma3': retVal = 0.007; break;
            // 6 Sigma                                      
            case 'keyPad_btnSigma6': retVal = 3.4 * Math.pow(10, -6); break;
            default: break;
        }

        displayCheck();
        stackVal1 = 1;
        boolClear = true;

        if (retVal != strEmpty) {
            /*  retVal=retVal.toPrecision(7); */
            $(keyPad_UserInput).val(retVal);
            //inBox1.val(inBox1Read + " " + retVal);
        } else {
            $(keyPad_UserInput).val(retVal);
            //inBox1.val(inBox1Read + " " + retVal);
        }
        inputBox.focus();
    });
    // BINARY OPERATION KEY ***************************************************
    $("div#keyPad a.keyPad_btnBinaryOp").click(function() {

        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
        switch (this.id) {
            case 'keyPad_btnPlus': stackCheck($("#" + this.id).text());
                newOpCode = 1;
                operation();
                stackVal1 = 0;
                break;
            case 'keyPad_btnMinus': stackCheck($("#" + this.id).text());
                newOpCode = 2;
                operation();
                stackVal1 = 0;
                break;
            case 'keyPad_btnMult': stackCheck($("#" + this.id).text());
                newOpCode = 3; if (opCode == 1 || opCode == 2) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 3) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break;
            case 'keyPad_btnDiv': stackCheck($("#" + this.id).text());
                newOpCode = 4;
                if (opCode < 4 && opCode) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 4) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break;
            case 'keyPad_%': stackCheck("%");
                newOpCode = 11; if (opCode < 6 && opCode) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 6) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break;

            case 'keyPad_EXP': stackCheck("e+0"); inBox.val(0);
                newOpCode = 9; if (opCode < 6 && opCode) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 6) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break;
            case 'keyPad_btnYpowX': stackCheck("^");
                newOpCode = 6; if (opCode < 6 && opCode) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 6) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break;
            case 'keyPad_btnMod': stackCheck($("#" + this.id).text());
                newOpCode = 5;
                if (opCode == 1 || opCode == 2) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] == 1 || 2) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break; //Harsh
            case 'keyPad_btnYrootX':
                stackCheck("yroot");
                newOpCode = 7;
                if (opCode < 6 && opCode) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 6) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break; //Harsh
            case 'keyPad_btnYlogX': stackCheck("logxBasey");
                newOpCode = 8;
                if (opCode == 1 || opCode == 2) {
                    opcodeChange();
                }
                if (opCode == 10) {
                    if (opCodeArray[opCodeArray.length - 1] < 3) {
                        opcodeChange();
                    }
                    else {
                        operation();
                    }
                }
                stackVal1 = 0;
                break; //Harsh
            case 'keyPad_btnOpen': displayString = inBox1.val() + $("#" + this.id).text();
                newOpCode = 0;
                inBox.val(0);
                if (opCode != 0) {
                    opcodeChange();
                }
                openArray.push("{");
                stackArray.push("{");
                stackVal1 = 1;
                break;
            case 'keyPad_btnClose': if (stackVal2 == 6) { stackVal = parseFloat(inBox.val()); displayString = inBox1.val() + inBox.val() + $("#" + this.id).text(); }
                else if (newOpCode != 10) { if (stackVal1 != 3) displayString = inBox1.val() + inBox.val() + $("#" + this.id).text(); else displayString = inBox1.val() + $("#" + this.id).text(); }
                else { displayString = inBox1.val() + $("#" + this.id).text(); }
                if (openArray[0]) {
                    openArray.pop();
                    newOpCode = 10;
                    while (opCodeArray[0] || openArray[0]) {
                        if (stackArray[stackArray.length - 1] == "{") {
                            stackArray.pop();
                            break;
                        }
                        else {
                            oscBinaryOperation();
                            stackVal = stackArray[stackArray.length - 1];
                            if (stackVal == "{") {
                                stackArray.pop();
                                opCode = 0;
                                break;
                            }
                            stackArray.pop();
                            opCode = opCodeArray[opCodeArray.length - 1];
                            opCodeArray.pop();
                            if (!opCodeArray[0] && stackArray.length > 0 && stackArray[stackArray.length - 1] != "{")  //if length is 0 then below statement gives error...
                            {
                                stackVal = stackArray[stackArray.length - 1];
                            }
                        }
                    }
                }
                else {
                    return;
                }
                stackVal2 = 1;
                stackVal1 = 5;
                break;
            case 'keyPad_btnPercent':
                if (opCode == 1 || opCode == 2)
                { inBox.val((stackVal * parseFloat(inBox.val()) / 100)); }
                else if (opCode == 3 || opCode == 4)
                { inBox.val((parseFloat(inBox.val()) / 100)); }
                else return;
                break;
            default: break;
        }
        if (opCode) {
            oscBinaryOperation();
            if (opCode == 9 || occurrences(displayString, "e") > 1) {
                var string = displayString.substring(0, inBox1.val().lastIndexOf("e"));
                var a = "";
                if (!((displayString.charAt(displayString.length - 3) == "-") || (displayString.charAt(displayString.length - 4) == "-"))) {
                    if (!(displayString.charAt(displayString.length - 3) == 0)) {
                        a = string + "e+" + displayString.charAt(displayString.length - 3) + displayString.charAt(displayString.length - 2) + displayString.charAt(displayString.length - 1);
                    }
                    else {
                        a = string + "e+" + displayString.charAt(displayString.length - 2) + displayString.charAt(displayString.length - 1);
                    }
                }
                else {
                    if (!(displayString.charAt(displayString.length - 3) == "-")) {
                        a = string + "e" + displayString.charAt(displayString.length - 4) + displayString.charAt(displayString.length - 3) + displayString.charAt(displayString.length - 2) + displayString.charAt(displayString.length - 1);
                    }
                    else {
                        a = string + "e" + displayString.charAt(displayString.length - 3) + displayString.charAt(displayString.length - 2) + displayString.charAt(displayString.length - 1);
                    }
                }
                displayString = a;
            }


        }
        else { stackVal = parseFloat(inBox.val()); boolClear = true; }
        opCode = newOpCode;
        inBox.focus();
        inBox1.val(displayString);
    });

    // MEMORY OPERATIONS *******************************************************
    $("a.keyPad_btnMemoryOp").click(function() {
        var inputBox = $('#keyPad_UserInput');
        var x = parseFloat(inputBox.val());
        if ((inputBox.val()) == "") {
            x = 0;
        }
        var retVal = 0;
        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
        switch (this.id) {
            case 'keyPad_MS': memory = x; $("#memory").addClass("memoryshow"); retVal = inBox.val(); break;
            case 'keyPad_M+': memory = x + parseFloat(memory); $("#memory").addClass("memoryshow"); retVal = inBox.val(); break;
            case 'keyPad_MR': retVal = parseFloat(memory); break;
            case 'keyPad_MC': memory = 0; $("#memory").removeClass("memoryshow");
                retVal = inBox.val();
                break;
            case 'keyPad_M-': $("#memory").addClass("memoryshow");
                memory = parseFloat(memory) - x;
                retVal = inBox.val();
                break;
            default: break;
        }
        stackVal1 = 2;
        if (retVal != strEmpty) {
            $(keyPad_UserInput).val(retVal);
            //inBox1.val(inBox1Read + " " + retVal);
        } else {
            $(keyPad_UserInput).val(retVal);
            //inBox1.val(inBox1Read + " " + retVal);
        }
        /* $(keyPad_UserInput).val(retVal);  */
        //inBox1.val(inBox1Read + " " + retVal);
        boolClear = true;
        inBox.focus();
    });


    function stackCheck(text) {

        if (stackVal1 == 2) {
            inBox1.val("");
        }
        if (stackVal1 == 0) {
            opCode = 0;
            var x = 1;
            switch (newOpCode) {
                case 5: x = 3; break;
                case 7: x = 5; break;
                case 8: x = 9; break;
                default: break;
            }
            inBox1.val(inBox1.val().substring(0, inBox1.val().length - x));
            stackVal2 = 2;
        }
        if (stackVal1 == 5 || stackVal2 == 2) {
            stackVal2 = 0;
            displayString = inBox1.val() + text;
        }
        else { displayString = inBox1.val() + inBox.val() + text; }
    }

    function operation() {
        while (opCodeArray[0] && opCode) {
            if (opCode == 10) {
                opCode = opCodeArray[opCodeArray.length - 1];
                stackVal = stackArray[stackArray.length - 1];
                if (newOpCode == 1 || newOpCode == 2 || newOpCode <= opCode) {
                    opCodeArray.pop();
                    stackArray.pop();
                }
                else {
                    opCode = 0;
                    break;
                }
            }
            else if (stackArray[stackArray.length - 1] == "{") {
                break;
            }
            else {
                oscBinaryOperation();
                stackVal = stackArray[stackArray.length - 1];
                if (stackVal == "{") {
                    opCode = 0;
                    break;
                }
                opCode = opCodeArray[opCodeArray.length - 1];
                if (newOpCode == 1 || newOpCode == 2 || newOpCode <= opCode) {
                    opCodeArray.pop();
                    stackArray.pop();
                }
                else {
                    opCode = 0;
                    break;
                }
                if (!opCodeArray[0] && stackArray.length > 0 && stackArray[stackArray.length - 1] != "{")  //if length is 0 then below statement gives error...
                {
                    stackVal = stackArray[stackArray.length - 1];
                }
            }
        }
    }
    function opcodeChange() {
        if (opCode != 10 && opCode != 0) {
            opCodeArray.push(opCode);
            stackArray.push(stackVal);
        }
        if (opCode == 0) {
            stackArray.push(stackVal);
            //	alert(stackVal);
        }
        opCode = 0;
    }
    function displayCheck() {
        switch (stackVal1) {
            case 2: inBox1.val(""); break;
            case 3: inBox1.val(inBox1.val().substring(0, inBox1.val().length - trigDisplay.length)); stackVal2 = 4; break;
            case 5: var string = "";
                for (var i = openArray.length; i >= 0; i--) {
                    string = string + displayString.substring(0, displayString.indexOf("(") + 1);
                    displayString = displayString.replace(string, "");
                }
                displayString = string.substring(0, string.lastIndexOf("("));
                inBox1.val(displayString);
                stackVal2 = 6;
                break;
            default: break;
        }
    }

    // BINARY COMPUTATION *****************************************************

    function oscBinaryOperation() {
        var inBox = $('#keyPad_UserInput');
        var x2 = parseFloat(inBox.val());
        var retVal = 0;
        switch (opCode) {
            case 9: var string = inBox1.val().substring(0, inBox1.val().lastIndexOf("e"));
                var plusstring = "";
                var str = string + "";
                if (!((string.indexOf("/") > -1) || (string.indexOf("*") > -1) || (string.indexOf("+") > -1) || (string.indexOf("-") > -1))) {
                    if (x2 >= 0) {
                        var a = string + "e+";
                    }
                    else {
                        var a = string + "e";
                    }
                }
                else {
                    if (string.indexOf("/") > -1)
                        string = string.substring(string.indexOf("/") + 1, string.length);
                    else if (string.indexOf("*") > -1)
                        string = string.substring(string.indexOf("*") + 1, string.length);
                    else if (string.indexOf("+") > -1) {
                        if (occurrences(inBox1.val(), "+") > 1 && occurrences(inBox1.val(), "e") > 1 && !(inBox1.val().indexOf("*") > -1) && !(inBox1.val().indexOf("/") > -1)) {
                            plusstring = inBox1.val().substring(inBox1.val().lastIndexOf("e") - 1, inBox1.val().lastIndexOf("e"));
                        }

                        else {
                            string = string.substring(string.indexOf("+") + 1, string.length);
                        }
                    }
                    else (string.indexOf("-") > -1)
                    {
                        if (occurrences(inBox1.val(), "-") > 1 && occurrences(inBox1.val(), "e") > 1 && !(inBox1.val().indexOf("*") > -1) && !(inBox1.val().indexOf("/") > -1)) {
                            plusstring = inBox1.val().substring(inBox1.val().lastIndexOf("e") - 1, inBox1.val().lastIndexOf("e"));
                        }
                        else {
                            string = string.substring(string.indexOf("-") + 1, string.length);
                        }
                    }

                    if (x2 >= 0) {
                        var a = str + "e+" + x2;
                    }
                    else {
                        var a = str + "e" + x2;
                    }
                }
                if (((occurrences(inBox1.val(), "+") > 1 && occurrences(inBox1.val(), "e") > 1) || (occurrences(inBox1.val(), "-") > 1 && occurrences(inBox1.val(), "e") > 1)) && !(inBox1.val().indexOf("*") > -1) && !(inBox1.val().indexOf("/") > -1)) {
                    stackVal = parseFloat(plusstring) * Math.pow(10, x2);
                }
                else {
                    stackVal = parseFloat(string) * Math.pow(10, x2);
                }
                inBox1.val(a);
                break;
            case 1: stackVal += x2; break;
            case 2: stackVal -= x2;
                break;
            case 3: stackVal *= x2;
                break;
            case 4: stackVal /= x2;
                break;
            // stack power inputBox               
            case 6: stackVal = Math.pow(stackVal, x2);
                break;
            case 5: stackVal = stackVal % x2; break; //Harsh
            case 7: stackVal = nthroot(stackVal, x2); break; //Harsh
            case 8: stackVal = Math.log(stackVal) / Math.log(x2); break; //Harsh
            case 11: stackVal = stackVal / 100 * x2; break;
            case 0: stackVal = x2;
            default: break;
        }

        if (stackVal != strEmpty && stackVal != x2) {
            retVal = stackVal;
            if (RoundNum(retVal, 99) % 1 != 0) {
                var i = 1;
                while (i < 10) {
                    if ((RoundNum(retVal, i) != 0) && (RoundNum(retVal, i) / RoundNum(retVal, i + 99) == 1)) { retVal = RoundNum(retVal, i); break; }
                    else {
                        i++;
                    }
                }
            }
            else { retVal = RoundNum(retVal, 0); }
            retVal = retVal.toPrecision(7);
            display = retVal + "";
            afterdec = display.substring(display.indexOf("."), display.length);
            if (!(afterdec.indexOf("1") > -1 || afterdec.indexOf("2") > -1 || afterdec.indexOf("3") > -1 || afterdec.indexOf("4") > -1 || afterdec.indexOf("5") > -1 || afterdec.indexOf("6") > -1 || afterdec.indexOf("7") > -1 || afterdec.indexOf("8") > -1 || afterdec.indexOf("9") > -1) && !(display.indexOf("NaN") > -1) && !(display.indexOf("Infinity") > -1)) {
                display = display.slice(0, display.lastIndexOf("."));
            }
            inBox.val(display);
        } else {
            retVal = stackVal;
            if (RoundNum(retVal, 99) % 1 != 0) {
                var i = 1;
                while (i < 10) {
                    if ((RoundNum(retVal, i) != 0) && (RoundNum(retVal, i) / RoundNum(retVal, i + 99) == 0)) { retVal = RoundNum(retVal, i); break; }
                    else {
                        i++;
                    }
                }
            }
            else { retVal = RoundNum(retVal, 0); }
            inBox.val(retVal);
        }
        boolClear = true;
        inBox.focus();
    }
    // UNARY OPERATIONS *******************************************************
    $("a.keyPad_btnUnaryOp").click(function() {
        var inputBox = $('#keyPad_UserInput');
        var x = parseFloat(inputBox.val());
        var retVal = oscError;
        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
        switch (this.id) {
            // +/-                                  
            case 'keyPad_btnInverseSign': retVal = -x; trig = 1; stackVal2 = 3; break;
            // 1/X                                  
            case 'keyPad_btnInverse': retVal = 1 / x; displayTrignometric("reciproc", x); break;
            // X^2                                  
            case 'keyPad_btnSquare': retVal = x * x; displayTrignometric("sqr", x); break;
            // SQRT(X)                                  
            case 'keyPad_btnSquareRoot': retVal = Math.sqrt(x); displayTrignometric("sqrt", x); break;
            // X^3                                  
            case 'keyPad_btnCube': retVal = x * x * x; displayTrignometric("cube", x); break;
            // POW (X, 1/3)                                  
            case 'keyPad_btnCubeRoot': retVal = nthroot(x, 3); displayTrignometric("cuberoot", x); break;
            // NATURAL LOG                                  
            case 'keyPad_btnLn': retVal = Math.log(x); displayTrignometric($("#" + this.id).text(), x); break;
            // LOG BASE 10                                  
            case 'keyPad_btnLg': retVal = Math.log(x) / Math.LN10; displayTrignometric($("#" + this.id).text(), x); break;
            // E^(X)                                  
            case 'keyPad_btnExp': retVal = Math.exp(x); displayTrignometric("powe", x); break;
            // SIN                                  
            case 'keyPad_btnSin': retVal = sinCalc(modeSelected, x); modeText($("#" + this.id).text(), x); trig = 1; break;
            // COS                                  
            case 'keyPad_btnCosin': retVal = cosCalc(modeSelected, x); modeText($("#" + this.id).text(), x); trig = 1; break;
            // TAN                                  
            case 'keyPad_btnTg': retVal = tanCalc(modeSelected, x); modeText($("#" + this.id).text(), x); trig = 1; break;
            // CTG                                  
            case 'keyPad_btnCtg': retVal = cotCalc(modeSelected, x); modeText($("#" + this.id).text(), x); break;

            //###### Added By Harsh : Starts  #####//     

            //Factorial 
            case 'keyPad_btnFact': retVal = factorial(x); displayTrignometric("fact", x); break;

            //10^x 
            case 'keyPad_btn10X': retVal = Math.pow(10, x); displayTrignometric("powten", x); break;

            //AsinH 
            case 'keyPad_btnAsinH': retVal = inverseSineH(x); modeText($("#" + this.id).text(), x); break;

            //AcosH 
            case 'keyPad_btnAcosH': retVal = Math.log(x + Math.sqrt(x + 1) * Math.sqrt(x - 1)); modeText($("#" + this.id).text(), x); break;

            //AtanH 
            case 'keyPad_btnAtanH': retVal = 0.5 * (Math.log(1 + x) - Math.log(1 - x)); modeText($("#" + this.id).text(), x); break;

            //Absolute |x| 
            case 'keyPad_btnAbs': retVal = Math.abs(x); displayTrignometric("abs", x); break;

            //Log Base 2 
            case 'keyPad_btnLogBase2': retVal = Math.log(x) / Math.log(2);
                displayTrignometric("logXbase2", x);
                break;

            //###### Added By Harsh : Ends  #####//                               


            // Arcsin                                 
            case 'keyPad_btnAsin': retVal = sinInvCalc(modeSelected, x); modeText("asin", x); trig = 1; break;
            // Arccos                                 
            case 'keyPad_btnAcos': retVal = cosInvCalc(modeSelected, x); modeText("acos", x); trig = 1; break;
            // Arctag                                 
            case 'keyPad_btnAtan': retVal = tanInvCalc(modeSelected, x); modeText("atan", x); trig = 1; break;

            // Secant                                 
            case 'keyPad_btnSec': retVal = secCalc(modeSelected, x); break;
            // Cosecant                                 
            case 'keyPad_btnCosec': retVal = cosecCalc(modeSelected, x); break;

            // sinh                                   
            case 'keyPad_btnSinH':
                retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2; modeText($("#" + this.id).text(), x); break;
            // cosh                                   
            case 'keyPad_btnCosinH':
                retVal = (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2; modeText($("#" + this.id).text(), x); break;
            // coth                                   
            case 'keyPad_btnTgH':
                retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x));
                retVal /= (Math.pow(Math.E, x) + Math.pow(Math.E, -x));
                modeText($("#" + this.id).text(), x);
                break;
            // Secant hyperbolic                                  
            case 'keyPad_btnSecH':
                retVal = 2 / (Math.pow(Math.E, x) + Math.pow(Math.E, -x)); break;
            // Cosecant hyperbolic                                  
            case 'keyPad_btnCosecH':
                retVal = 2 / (Math.pow(Math.E, x) - Math.pow(Math.E, -x)); ; break;
            // 1+x                                 
            case 'keyPad_btnOnePlusX': retVal = 1 + x; break;
            // 1-x                                 
            case 'keyPad_btnOneMinusX': retVal = 1 - x; break;
            default: break;
        }

        if (stackVal2 == 1) {
            stackVal = retVal;
        }
        if (stackVal2 != 3) { stackVal2 = 2; }
        stackVal1 = 3;
        boolClear = true;
        if (retVal == 0 || retVal == strMathError || retVal == strInf) {
            inputBox.val(retVal);
        } else {
            if (RoundNum(retVal, 99) % 1 != 0) {
                var i = 1;
                while (i < 10) {
                    if ((RoundNum(retVal, i) != 0) && (RoundNum(retVal, i) / RoundNum(retVal, i + 99) == 0)) { retVal = RoundNum(retVal, i); break; }
                    else {
                        i++;
                    }
                }
            }
            else { retVal = RoundNum(retVal, 0); }
            if (trig == 0) {
                retVal = retVal.toPrecision(7);
                display = retVal + "";
                afterdec = display.substring(display.indexOf("."), display.length);
                if (!(afterdec.indexOf("1") > -1 || afterdec.indexOf("2") > -1 || afterdec.indexOf("3") > -1 || afterdec.indexOf("4") > -1 || afterdec.indexOf("5") > -1 || afterdec.indexOf("6") > -1 || afterdec.indexOf("7") > -1 || afterdec.indexOf("8") > -1 || afterdec.indexOf("9") > -1) && !(display.indexOf("NaN") > -1) && !(display.indexOf("Infinity") > -1)) {
                    display = display.slice(0, display.lastIndexOf("."));
                }
            }
            else {
                if (retVal.toFixed(8) % 1 != 0) {
                    var i = 1;
                    while (i < 10) {
                        if ((retVal.toFixed(i) != 0) && (retVal.toFixed(i) % retVal.toFixed(i + 8) == 0)) { retVal = retVal.toFixed(i); break; }
                        else {
                            i++;
                        }
                    }
                }
                else { retVal = retVal.toFixed(0); }
            }
            if (trig == 0) {
                inputBox.val(display);
            }
            else {
                if (retVal == -0)
                    retVal = 0;
                inputBox.val(retVal);
            }
        }
        trig = 0;
        inBox1.val(displayString);
        inputBox.focus();
    });

    $("div.degree_radian").click(function() {
        modeSelected = $('input[name=degree_or_radian]:radio:checked').val();
    });

    function inverseSineH(inputVal) {
        return Math.log(inputVal + Math.sqrt(inputVal * inputVal + 1));
    }
    function modeText(text, x) {
        var mode = "d";
        if (modeSelected != "deg") { mode = "r"; }
        displayTrignometric(text + mode, x);
    }
    function displayTrignometric(text, x) {
        if (stackVal2 == 1) {
            var string = "";
            for (var i = openArray.length; i >= 0; i--) {
                string = string + displayString.substring(0, displayString.indexOf("(") + 1);
                displayString = displayString.replace(string, "");
            }
            displayString = string.substring(0, string.lastIndexOf("("));
            trigDisplay = text + "(" + x + ")";
        }
        if (stackVal2 == 2 || stackVal1 == 3) {
            if (stackVal2 == 3) { trigDisplay = text + "(" + x + ")"; stackVal2 = 2; }
            else {
                displayString = displayString.replace(trigDisplay, "");
                trigDisplay = text + "(" + trigDisplay + ")";
            } 
        }
        else { if (stackVal2 == 4) { displayString = ""; } trigDisplay = text + "(" + x + ")"; }
        displayString = displayString + trigDisplay;
    }
    function nthroot(x, n) {
        try {
            var negate = n % 2 == 1 && x < 0;
            if (negate)
                x = -x;
            var possible = Math.pow(x, 1 / n);
            n = Math.pow(possible, n);
            if (Math.abs(x - n) < 1 && (x > 0 == n > 0))
                return (negate ? -possible : possible);
            else return (negate ? -possible : possible);
        } catch (e) { }
    }

    function changeXBasedOnMode(mode, inputValue) {
        if (mode == "deg") {
            return (inputValue * (Math.PI / 180));
        } else if (mode == "rad") {
            return inputValue;
        }
    }

    function tanCalc(mode, inputVal) {
        var ipVal = changeXBasedOnMode(mode, inputVal);
        if (ipVal % (Math.PI / 2) == "0") {
            if ((ipVal / (Math.PI / 2)) % 2 == "0") {
                return "0";
            } else {
                return strMathError;
            }
        } else {
            return Math.tan(ipVal);
        }
    }

    function cosCalc(mode, inputVal) {
        var ipVal = changeXBasedOnMode(mode, inputVal);
        if (ipVal.toFixed(8) % (Math.PI / 2).toFixed(8) == "0") {
            if ((ipVal.toFixed(8) / (Math.PI / 2)).toFixed(8) % 2 == "0") {
                return Math.cos(ipVal);
            } else {
                return "0";
            }
        } else {
            return Math.cos(ipVal);
        }
    }

    function sinCalc(mode, inputVal) {
        var ipVal = changeXBasedOnMode(mode, inputVal);
        if ((ipVal.toFixed(8) % Math.PI).toFixed(8) == 0) {
            return "0";
        } else {
            return Math.sin(ipVal);
        }

    }

    function cotCalc(mode, inputVal) {
        var tanVal = tanCalc(mode, inputVal);
        if (tanVal == 0) {
            return strMathError;
        } else if (tanVal == strMathError) {
            return '0';
        } else {
            return 1 / tanVal;
        }
    }

    function secCalc(mode, inputVal) {
        var cosVal = cosCalc(mode, inputVal);
        if (cosVal.toFixed(8) == 0) {
            return strMathError;
        } else {
            return 1 / cosVal;
        }
    }

    function cosecCalc(mode, inputVal) {
        var sinVal = sinCalc(mode, inputVal);
        if (sinVal.toFixed(8) == 0) {
            return strMathError;
        } else {
            return 1 / sinVal;
        }

    }

    function changeValOfInvBasedOnMode(mode, ipVal) {
        if (mode == 'deg') {
            return (180 / Math.PI) * ipVal;
        } else {
            return ipVal;
        }
    }

    function sinInvCalc(mode, inputVal) {
        var opVal;
        var ipVal = Math.asin(inputVal);
        if (strNaN.indexOf(ipVal.toFixed(8)) > -1) {
            opVal = strMathError;
        } else {
            opVal = changeValOfInvBasedOnMode(mode, ipVal);
        }
        return opVal;
    }

    function cosInvCalc(mode, inputVal) {
        var opVal;
        var ipVal = Math.acos(inputVal);
        if (strNaN.indexOf(ipVal.toFixed(8)) > -1) {
            opVal = strMathError;
        } else {
            opVal = changeValOfInvBasedOnMode(mode, ipVal);
        }
        return opVal;
    }

    function tanInvCalc(mode, inputVal) {
        var opVal;
        var ipVal = Math.atan(inputVal);
        if (strNaN.indexOf(ipVal.toFixed(8)) > -1) {
            opVal = strMathError;
        } else {
            opVal = changeValOfInvBasedOnMode(mode, ipVal);
        }
        return opVal;
    }

    // ************************************************************************
    // COMMAND aS: BACKSPACE, CLEAR AND ALL CLEAR
    $("div#keyPad a.keyPad_btnCommand").click(function() {
        var inBox = $('#keyPad_UserInput');
        var inBox1 = $('#keyPad_UserInput1');
        var i = 0;
        var j = 0;
        var strInput = inBox.val();
        var count = occurrences(inBox1.val(), "e");
        if ((count > 1) || (((inBox1.val().indexOf("+") > -1) && (inBox1.val().indexOf("e") > -1)) && (inBox1.val().indexOf("e") > inBox1.val().indexOf("+"))) || (((inBox1.val().indexOf("-") > -1) && (inBox1.val().indexOf("e") > -1)) && (inBox1.val().indexOf("e") > inBox1.val().indexOf("-"))) || (((inBox1.val().indexOf("/") > -1) && (inBox1.val().indexOf("e") > -1)) && (inBox1.val().indexOf("e") > inBox1.val().indexOf("/"))) || (((inBox1.val().indexOf("*") > -1) && (inBox1.val().indexOf("e") > -1)) && (inBox1.val().indexOf("e") > inBox1.val().indexOf("*")))) {
            strInput = "";
        }
        switch (this.id) {
            // on enter calculate the result, clear opCode                  
            case 'keyPad_btnEnter': if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
                while (opCode || opCodeArray[0]) {
                    if (stackArray[stackArray.length - 1] == "{") {
                        stackArray.pop();
                    }
                    oscBinaryOperation();
                    stackVal = stackArray[stackArray.length - 1];
                    opCode = opCodeArray[opCodeArray.length - 1];
                    stackArray.pop();
                    opCodeArray.pop();
                }; opCode = 0; inBox.focus(); displayString = ""; trigDisplay = ""; stackVal = strEmpty; openArray = [];
                if (stackVal1 != 2) {
                    if (stackVal1 == 3 || stackVal2 == 1) {
                        if (stackVal2 != 3) strInput = "";
                    }
                    inBox1.val(inBox1.val() + strInput);
                }
                stackVal1 = 2;
                newOpCode = 0;
                stackVal2 = 0; stackArray = []; opCodeArray = [];
                return;
                // clear input box (if not empty) or opCode          
            case 'keyPad_btnClr': if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
                if (strInput == strEmpty) { opCode = 0; boolClear = false; }
                else { inBox.val(strEmpty); }
                break;
            // clear the last char if input box is not empty                          
            case 'keyPad_btnBack': if (stackVal1 == 1 || stackVal2 == 3) {
                    if (strInput.length > 1) {
                        if (inBox.val().indexOf("Infinity") > -1 || inBox.val().indexOf(strMathError) > -1) return;
                        inBox.val(strInput.substring(0, strInput.length - 1)); if (inBox.val() == "-") inBox.val("0"); break;
                    } else {
                        inBox.val("0");
                        break;
                    } 
                }
                else break;
                // clear all          
            case 'keyPad_btnAllClr':
                inBox.val(strEmpty);
                displayString = "";
                trigDisplay = "";
                stackArray = []; opCodeArray = []; openArray = [];
                inBox1.val("");
                stackVal = strEmpty;
                stackVal1 = 1;
                stackVal2 = 0;
                newOpCode = 0;
                opCode = 0;
                break;
            default: break;
        }
    });
})
// ***********************************************************************************

//Factorial Function //Harsh
function factorial(n) {
    if (n > 170) return strInf;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
} 