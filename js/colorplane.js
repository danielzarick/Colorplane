// *********************************
//
//   Colorplane - by Daniel Zarick
//   for more: http://33cc77.com
//
// *********************************

(function($){
  var ColorPlane = function(element, options) {
    this.$el            = $(element || '<div />').addClass('colorplane');
    this.$instructions  = $('<div class="colorplane-selected-color"><div class="colorplane-instructions">Click to select a color</div></div>')
    this.$canvas        = $('<canvas />');
    this.$color = this.$canvas.css("background");
    this.context        = this.$canvas[0].getContext('2d');
    this.options        = options || {};

    this.render();
  };

  ColorPlane.fn = ColorPlane.prototype;

  ColorPlane.fn.render = function(){
    this.$el.html(this.$canvas);
    this.$el.prepend(this.$instructions);
    this.context.fillStyle = this.$color;
    this.addListeners();
  };

  ColorPlane.fn.addListeners = function() {
    this.$canvas.bind('touchmove', function(e) {
      e.preventDefault();
      var touch    = e.originalEvent.changedTouches[0];
      var hexColor = this.getHexColor(touch);
      this.showColor(hexColor);

      this.$canvas.one('touchend', function() {
        this.saveCurrentColor(hexColor);
      }.bind(this));
    }.bind(this));

    this.$canvas.bind('mousemove', function(e) {
      var hexColor = this.getHexColor(e);
      this.showColor(hexColor);

      this.$canvas.one('click', function() {
        this.saveCurrentColor(hexColor);
      }.bind(this));
    }.bind(this));
  };

  ColorPlane.fn.getHexColor = function(e) {
    var canvasOffset = this.$canvas.offset();
    var X = e.pageX - canvasOffset.left;
    var Y = e.pageY - canvasOffset.top;

    var canvasX = Math.floor(X/2);
    var canvasY = Math.floor(Y);

    var canvasZ = parseInt(canvasX.toString().slice(0,2)) +
                  parseInt(canvasY.toString().slice(0,2));

      function normalizeHex(value) {
        var hexLetters =  {
                            "10": "A",
                            "11": "B",
                            "12": "C",
                            "13": "D",
                            "14": "E",
                            "15": "F"
                          }

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

    return "#" + normalizeHex(canvasX) + normalizeHex(canvasY) + normalizeHex(canvasZ);
  };

  ColorPlane.fn.showColor = function(hexColor) {
    this.context.fillStyle = hexColor;
    this.context.fillRect(0,0, this.$canvas.width(), this.$canvas.height());

    $('#colorplane-current-hex').html(hexColor);
    $('#colorplane-current-hex').css("color", hexColor);
  };

  ColorPlane.fn.saveCurrentColor = function(hexColor) {
    this.$el.trigger('change', hexColor);

    $('#colorplane-selected-hex').html(hexColor);
    $('#colorplane-selected-hex').css("color", hexColor);
    $('.colorplane-selected-color').css("background", hexColor);
    $('.colorplane-instructions').html("Color selected!");
  };

  $.fn.colorplane = function(options){
    return $(this).each(function(){
      $(this).data('colorplane', new ColorPlane(this, options));
    });
  };
})(jQuery);

jQuery(function($){
  $('.colorplane').colorplane()
});
