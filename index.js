// Code to randomly generate colours.
const express = require('express');
const app = express();
const colourCount = 20;
const incremementObj = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
};
incremementObj.prototype = {
  incrementRed: function (incrementStep) {
    const newVal = this.incrementCheck(incrementStep, this.red);
    if (newVal <= 255) {
      this.red = newVal;
      return this.red;
    } else {
      return false;
    }
  },
  incrementBlue: function (incrementStep) {
    const newVal = this.incrementCheck(incrementStep, this.blue);
    if (newVal <= 255) {
      this.blue = newVal;
      return this.blue;
    } else {
      return false;
    }
  },
  incrementGreen: function (incrementStep) {
    const newVal = this.incrementCheck(incrementStep, this.green);
    if (newVal <= 255) {
      this.green = newVal;
      return this.green;
    } else {
      return false;
    }
  },
  incrementCheck: function (incrementStep, valueToCheck) {
    if (valueToCheck === 255) {
      return 256; // value is already at max, so return 255 so that we don't increment further (as it's an invalid RGB value)
    } else if (valueToCheck + incrementStep >= 255) {
      return 255; // new value is/will be 255, so return that so we don't increment further
    } else if (valueToCheck + incrementStep < 255) {
      return valueToCheck + incrementStep;
    }
  },
  getBlue: function () {
    return Math.round(this.blue);
  },
  getRed: function () {
    return Math.round(this.red);
  },
  getGreen: function () {
    return Math.round(this.green);
  }
}
const currentColourState = () => {
  const obj = new incremementObj(0, 0, 0);
  return obj;
}
const generateRGBColour = (orderIndex) => {
  const colourController = currentColourState();
  const totalRgb = 255 * 3; // Total of numbers for RGB (255,255,255) *NOT* total combinations, that would be 255*255*255
  const eachRgbIncremenet = (totalRgb / colourCount); // Don't round here otherwise numbers won't add up to 255 and we'll have less or more loops than we need.
  console.log(JSON.stringify(colourController));
  const colours = {
    'red': () => {
      return colourController.incrementRed(eachRgbIncremenet);
    },
    'green': () => {
      return colourController.incrementGreen(eachRgbIncremenet);
    },
    'blue': () => {
      return colourController.incrementBlue(eachRgbIncremenet);
    }
  };
  const finalColours = [];
  for (let i = 0, length = colourCount; i < length; i++) {
    let colour;
    const colour1 = colours[orderIndex[0]]();
    if (colour1 === false) {
      const colour2 = colours[orderIndex[1]]();
      if (colour2 === false) {
        colours[orderIndex[2]]();
      }
    }
    colour = [colourController.getRed(), colourController.getGreen(), colourController.getBlue()];
    finalColours.push(colour);
  }
  return finalColours;
}
const generateOrder = (r_order, g_order, b_order) => {
  const orderIndex = new Array(3);
  orderIndex[r_order - 1] = 'red';
  orderIndex[g_order - 1] = 'green';
  orderIndex[b_order - 1] = 'blue';
  return orderIndex;
}
const cycleThroughPallette = () => {
  orders = [
    [1, 2, 3],
    [2, 1, 3],
    [3, 2, 1],
    [3, 1, 2],
    [2, 3, 1]
  ];
  let generatedColours = new Array();
  for (let i = 0; i < orders.length; i++) {
    const order = generateOrder.apply(this, orders[i]);
    const rgb = generateRGBColour(order);
    generatedColours.push(...rgb);
  }
  return generatedColours;
}
const findDuplicateColours = (colours) => {
  for (let i = 0, length = colours.length; i < length; i++) {
    const colourToFind = colours[i];
    for (let j = 0, subLength = colours.length; i < subLength; i++) {
      const colourToCheck = colours[subLength];
      if (length !== subLength) {
        if (colourToFind === colourToCheck) {
          colours.splice(colourToFind, 1);
        }
      }
    }
  }
  return colours;
}
const generateHTML = (colours) => {
  let colourHtml = '';
  colours.forEach((colourVals) => {
    colourHtml += `<div style="background-color: rgb(${colourVals[0]},${colourVals[1]},${colourVals[2]}); height: 5rem; width: 5rem; display:inline-block;"></div>`;
  })
  return colourHtml;
}
let colours = cycleThroughPallette();
colours = findDuplicateColours(colours);
const html = generateHTML(colours);
app.get('/', (req, res) => res.send(html));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
