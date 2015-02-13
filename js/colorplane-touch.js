// *********************************
//
//   Colorplane - by Daniel Zarick
//   for more: http://33cc77.com
//
// *********************************

(function($){
  var ColorPlane = function(element, options) {
    this.$el            = $(element || '<div />').addClass('colorplane');
    this.$canvas        = $('<canvas height="280" width="380" />');
    this.$color         = this.$canvas.css("background");
    this.context        = this.$canvas[0].getContext('2d');
    this.options        = options || {};

    this.render();
  };

  ColorPlane.fn = ColorPlane.prototype;

  ColorPlane.fn.render = function(){
    this.$el.html(this.$canvas);
    this.context.fillStyle = this.$color;
    this.addListeners();
  };

  ColorPlane.fn.addListeners = function() {
    this.$canvas.bind('touchmove', function(e) {
      e.preventDefault();
      var e         = e.originalEvent;
      var touch1    = e.targetTouches[0];
      var touch2    = e.targetTouches[1];
      var hexColor  = this.getHexColor(touch1, touch2);
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

  ColorPlane.fn.getHexColor = function(touch1, touch2) {
    var canvasOffset = this.$canvas.offset();
    var canvasX = touch1.pageX - canvasOffset.left;
    var canvasY = touch1.pageY - canvasOffset.top;
    var xPosition = (this.$canvas.width() - canvasX) / this.$canvas.width() * 100;
    var yPosition = (this.$canvas.height() - canvasY) / this.$canvas.height()  * 100;

    var hue = Math.round(xPosition);
    // var lightness = Math.round(yPosition);
    // var saturation = 50;
    var lightness = 80;
    var saturation = Math.round(100 - yPosition);

    if (touch2) {
      var touch1X = canvasX;
      var touch1Y = canvasY;
      var touch2X = touch2.pageX - canvasOffset.left;
      var touch2Y = touch2.pageY - canvasOffset.top;

      output = Math.round(Math.sqrt( (touch2X-=touch1X)*touch2X + (touch2Y-=touch1Y)*touch2Y ));

      lightness = Math.min(100 - Math.max(output - 100, 1), 100);
    }

    var HSL = tinycolor("hsv("+hue+"%,"+saturation+"%,"+lightness+"%)");
    var HEX = HSL.toHexString();

    this.context.fillStyle = HEX;
    this.context.fillRect(0,0, this.$canvas.width(), this.$canvas.height());

    this.context.beginPath();
    this.context.arc(canvasX, canvasY, 6, 0, 2 * Math.PI, false);
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#fff';
    this.context.stroke();

    if (touch2) {
      this.context.beginPath();
      this.context.arc(touch2X, touch2Y, 2, 0, 2 * Math.PI, false);
      this.context.fillStyle = '#222';
      this.context.fill();
    }

    $('#colorplane-current-hue').html(hue + "%");
    $('#colorplane-current-satur').html(saturation + "%");
    $('#colorplane-current-light').html(lightness + "%");

    return HEX;
  };

  ColorPlane.fn.showColor = function(hexColor) {
    // this.context.fillStyle = hexColor;
    // this.context.fillRect(0,0, this.$canvas.width(), this.$canvas.height());

    $('#colorplane-current-hex').html(hexColor);
    $('#colorplane-current-hex').css("color", hexColor);
    $('[id*="colorplane-current"]').css("color", hexColor);
  };

  ColorPlane.fn.saveCurrentColor = function(hexColor) {
    this.$el.trigger('change', hexColor);

    $('#colorplane-selected-hex').html(hexColor);
    $('#colorplane-selected-hex').css("color", hexColor);
    $('.colorplane-selected-color').css("background", hexColor);
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
