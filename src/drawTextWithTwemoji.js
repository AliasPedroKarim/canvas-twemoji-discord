const splitEntitiesFromText = require("./utils/splitEntitiesFromText");
const loadTwemojiImageByUrl = require("./utils/loadTwemojiImageByUrl");
const getFontSizeByCssFont = require("./utils/getFontSizeByCssFont");
const measureText = require("./measureText");

/**
 * This function will draw the text with the emojis (discord and tweeter). 
 * @param {CanvasRenderingContext2D} context 
 * @param {fill | stroke} fillType 
 * @param {String} text 
 * @param {Number} x 
 * @param {Number} y 
 * @param {{maxWidth?: Number, emojiSideMarginPercent?: Number, emojiTopMarginPercent?: Number, ellipsisChactere?: String}} options 
 */
module.exports = async function drawTextWithEmoji(context, fillType, text, x, y, {
    maxWidth = Infinity,
    emojiSideMarginPercent = 0.1,
    emojiTopMarginPercent = 0.1,
    ellipsisCharactere = "..."
  } = {}
) {
  if(isNaN(Math.abs(maxWidth))) throw new Error("Careful, maxWidth should be a positive number if possible.");

  maxWidth = Math.abs(maxWidth);

  const textEntities = splitEntitiesFromText(text);
  const fontSize = getFontSizeByCssFont(context.font);
  const baseLine = context.measureText("").alphabeticBaseline;
  const ellipsisMeasure = context.measureText(ellipsisCharactere).alphabeticBaseline;

  const emojiSideMargin = fontSize * emojiSideMarginPercent;
  const emojiTopMargin = fontSize * emojiTopMarginPercent;

  const textAlign = context.textAlign;
  const textWidth = measureText(context, text, { emojiSideMarginPercent }).width;

  // for Text align
  let textLeftMargin = 0;

  if (!['', 'left', 'start'].includes(textAlign)) {
    context.textAlign = 'left';

    switch (textAlign) {
      case 'center':
        textLeftMargin = -textWidth / 2;
        break;

      case 'right':
      case 'end':
        textLeftMargin = -textWidth;
        break;
    }
  }


  let currentWidth = 0;

  function drawString(text) {
    if (fillType === "fill") {
      context.fillText(text, textLeftMargin + x + currentWidth, y);
    } else {
      context.strokeText(text, textLeftMargin + x + currentWidth, y);
    }
  }

  for (let entity of textEntities) {
    if (typeof entity === "string") {
      let preCalcul = (currentWidth + context.measureText(entity).width) + ellipsisMeasure;

      if(preCalcul >= maxWidth){
        while(context.measureText(entity).width > maxWidth) {
            entity = entity.substring(0, entity.length - 1);
        }

        drawString((entity.length > ellipsisMeasure ? entity.substring(0, entity.length - ellipsisMeasure) : "") + ellipsisCharactere);
        break;
      }

      // Common text case
      drawString(entity);

      currentWidth += context.measureText(entity).width;
    } else {
      let preCalcul = (currentWidth + (fontSize + (emojiSideMargin * 2))) + ellipsisMeasure;
      if(preCalcul >= maxWidth){
        drawString(ellipsisCharactere);
        break;
      }

      // Emoji case
      const emoji = await loadTwemojiImageByUrl(entity.url);

      if (emoji) {
        context.drawImage(
          emoji,
          textLeftMargin + x + currentWidth + emojiSideMargin,
          y + emojiTopMargin - fontSize - baseLine,
          fontSize,
          fontSize
        );
      }

      currentWidth += fontSize + (emojiSideMargin * 2);
    }
  }

  // Restore
  if (textAlign) {
    context.textAlign = textAlign;
  }
};
