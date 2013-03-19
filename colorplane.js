$(function(){

    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');

    var bkgndColor = $('.current-color').css("background-color");
    ctx.fillStyle = bkgndColor;
    ctx.fillRect(0,0,460,210);

    $('#picker').mousemove(function(e) {
        // get coordinates of current position
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var width = canvas.width;
        var height = canvas.height;

        var canvasZ1 = canvasX.toString().slice(0,2);
        var canvasZ2 = canvasY.toString().slice(0,2);
        var canvasZ = parseInt(canvasZ1) + parseInt(canvasZ2);

        var R = normalizeHex(Math.floor(canvasX/2));
        var G = normalizeHex(canvasY);
        var B = normalizeHex(canvasZ);

        var hexColor = "#" + R + G + B;

        ctx.fillStyle = hexColor;
        ctx.fillRect(0,0,460,210);

        $('.colorpicker').click(function() {
            $('#color-field').val(hexColor);
            $('.current-color').css("background", hexColor);
            $('.picker-instructions').html("Color selected!");
        });

    });

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
