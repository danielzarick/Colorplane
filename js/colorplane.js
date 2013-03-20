// *********************************
//
//   COLORPLANE - BY DANIEL ZARICK
//   for more: http://33cc77.com
//
// *********************************

$(function(){
    var canvas = document.getElementById('colorplane-canvas');
    var ctx = canvas.getContext('2d');

    // Set the default color for #colorplane-selected-color in your CSS or
    // with a variable in your view template. Use this to match your brand
    // or to fill it in with the already stored color.
    var bkgndColor = $('#colorplane-selected-color').css("background-color");
    ctx.fillStyle = bkgndColor;
    ctx.fillRect(0,0,480,220);

    // Simplistic implementation to make 'touchmove' work on smartphones/tablets
    $('#colorplane-canvas').bind('touchmove', function(e) {
        e.preventDefault();
        var touch = e.originalEvent.changedTouches[0];
        currentColor(touch);

        $('#colorplane-canvas').bind('touchend', function() {
            selectColor(hexColor);
        });
    });

    $('#colorplane-canvas').mousemove(function(e) {
        currentColor(e);

        $('#colorplane-canvas').click(function(hexColor) {
            selectColor(hexColor);
        });
    });

    // This accepts the mouse or touch location and shows the current color based on X,Y coordinates
    function currentColor(e) {
        var canvasOffset = $(canvas).offset();
        var X = e.pageX - canvasOffset.left;
        var Y = e.pageY - canvasOffset.top;

        var canvasX = Math.floor(X);
        var canvasY = Math.floor(Y);
        var canvasZ = parseInt(canvasX.toString().slice(0,2)) + parseInt(canvasY.toString().slice(0,2));

        var redHex = normalizeHex(Math.floor(canvasX/2));
        var greenHex = normalizeHex(canvasY);
        var blueHex = normalizeHex(canvasZ);

        var hexColor = "#" + redHex + greenHex + blueHex;

        ctx.fillStyle = hexColor;
        ctx.fillRect(0,0,480,220);
        $('#colorplane-current-hex').html(hexColor);
        $('#colorplane-current-hex').css("color", hexColor);

        return hexColor;
    }

    // This is triggered on a mouse click or touchend. Change the IDs below
    // to match the form field where you want the user to input a HEX color
    // For best results, hide the form field from the user so all they see
    // is the color that they have selected.
    function selectColor(hexColor) {
        $('#colorplane-selected-hex').html(hexColor);
        $('#colorplane-selected-hex').css("color", hexColor);
        $('#colorplane-selected-color').css("background", hexColor);
        $('.picker-instructions').html("Color selected!");
    }

    // This insures that all values are acceptable for a HEX code
    function normalizeHex(value) {
        var hexLetters = { "10": "A",
                        "11": "B",
                        "12": "C",
                        "13": "D",
                        "14": "E",
                        "15": "F" }

        var value = value.toString();

        if (value.length === 1) {

            value = "0" + value;
            return value;

        } else if (value.length === 3) {

            value1 = value.slice(0,2);
            if (hexLetters[value1]) {
                value1 = hexLetters[value1];
            } else {
                value1 = "F";
            }
            value2 = value.slice(2,3);
            return value1 + value2;

        } else {
            return value;
        }
    }
});
