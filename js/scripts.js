var COLOR_WARNING = false;

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function parseRequirements(inputId, outputId) {
  let rawData = document.getElementById(inputId).value;
  let cleanedArray = cleanData(rawData);
  let splittedArray = splitArray(cleanedArray, STEP_STRINGS.length);

  formattedText = arrayToText(splittedArray, STEP_STRINGS);
  document.getElementById(outputId).innerHTML = formattedText;
}

function clamp(foreVal, newVal, min, max) {
  // Clamp value between 0 and 256 inclusive
  if (newVal > max) {
    newVal = max;
    // Check if the foreground value was 0 to begin with
    // Else set the color warning as RGB is out of possible range
    if (foreVal !== 0) {
      COLOR_WARNING = true;
    }
  } else if (newVal < min) {
    newVal = min;
    // Check if the foreground value was 0 to begin with
    // Else set the color warning as RGB is out of possible range
    if (foreVal !== 0) {
      COLOR_WARNING = true;
    }
  }
  return parseInt(newVal);
}

function calculateTrans(fore, back, alpha) {
  // given a target foreground RGB value and alpha level, find the desired inital RGB
  let newR = (fore.r - back.r + back.r * alpha) / alpha;
  let newG = (fore.g - back.g + back.g * alpha) / alpha;
  let newB = (fore.b - back.b + back.b * alpha) / alpha;

  // rgb values need to be in realistic range
  newR = clamp(fore.r, newR, 0, 256);
  newG = clamp(fore.g, newG, 0, 256);
  newB = clamp(fore.b, newB, 0, 256);

  return {r: newR, g: newG, b: newB};
}

window.onload = function() {
  document.getElementById('calculate').onclick = function() {
    COLOR_WARNING = false; // reset color warning
    document.getElementById('color-warning').classList.add('d-none');

    // Translate hex to rgb
    let targetForeRgb = hexToRgb(document.getElementById('inputFore').value);
    let targetBackRgb = hexToRgb(document.getElementById('inputBack').value);
    let trans = parseFloat(document.getElementById('inputTrans').value);

    // Do calcs and translate rgb back to hex
    let initialRgb = calculateTrans(targetForeRgb, targetBackRgb, trans);
    console.log(initialRgb);
    let initialHex = rgbToHex(initialRgb.r, initialRgb.g, initialRgb.b);
    document.getElementById('outputArea').value = initialHex;

    if (COLOR_WARNING) {
      document.getElementById('color-warning').classList.remove('d-none');
    }
  };
};
