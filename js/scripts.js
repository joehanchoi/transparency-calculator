class TransCalculator {
  constructor() {
    this._warning = false;
  }

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  rgbToHex(r, g, b) {
    return (
      '#' +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    );
  }

  clamp(foreVal, newVal, min, max) {
    // Clamp value between 0 and 256 inclusive
    if (newVal > max) {
      newVal = max;
      // Check if the foreground value was 0 to begin with
      // Else set the color warning as RGB is out of possible range
      if (foreVal !== 0) {
        this._warning = true;
      }
    } else if (newVal < min) {
      newVal = min;
      // Check if the foreground value was 0 to begin with
      // Else set the color warning as RGB is out of possible range
      if (foreVal !== 0) {
        this._warning = true;
      }
    }
    return parseInt(newVal);
  }

  calculateTrans(fore, back, alpha) {
    // given a target foreground RGB value and alpha level, find the desired inital RGB
    let newR = (fore.r - back.r + back.r * alpha) / alpha;
    let newG = (fore.g - back.g + back.g * alpha) / alpha;
    let newB = (fore.b - back.b + back.b * alpha) / alpha;

    // rgb values need to be in realistic range
    newR = this.clamp(fore.r, newR, 0, 256);
    newG = this.clamp(fore.g, newG, 0, 256);
    newB = this.clamp(fore.b, newB, 0, 256);

    return {r: newR, g: newG, b: newB};
  }

  resetWarning(id) {
    this._warning = false;
    document.getElementById(id).classList.add('d-none');
  }

  showWarning(id) {
    if (this._warning) {
      document.getElementById(id).classList.remove('d-none');
    }
  }

  calculate(fore, back, trans) {
    // Translate hex to rgb
    const inputs = {
      fore: this.hexToRgb(fore),
      back: this.hexToRgb(back),
      trans: trans
    }
    // Do calcs and translate rgb back to hex
    const initialRgb = this.calculateTrans(
      inputs.fore,
      inputs.back,
      inputs.trans
    );
    return this.rgbToHex(initialRgb.r, initialRgb.g, initialRgb.b);
  }
}

window.onload = function() {
  let calculator = new TransCalculator();

  document.getElementById('calculate').onclick = function() {
    calculator.resetWarning('color-warning');

    // Translate hex to rgb
    const inputs = {
      fore: document.getElementById('inputFore').value,
      back: document.getElementById('inputBack').value,
      trans: parseFloat(document.getElementById('inputTrans').value)
    };

    const initialHex = calculator.calculate(
      inputs.fore,
      inputs.back,
      inputs.trans
    );

    document.getElementById('outputArea').value = initialHex;

    calculator.showWarning('color-warning');
  };
};
