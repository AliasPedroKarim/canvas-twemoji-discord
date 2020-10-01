const splitEntitiesFromText = require('./utils/splitEntitiesFromText');
const loadTwemojiImageByUrl = require('./utils/loadTwemojiImageByUrl');
const getFontSizeByCssFont = require('./utils/getFontSizeByCssFont');

module.exports = async function drawTextWithEmoji (
  context,
  fillType,
  text,
  x,
  y,
  {
    maxWidth = Infinity, // TODO
    emojiSideMarginPercent = 0.1,
    emojiTopMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text);
  const fontSize = getFontSizeByCssFont(context.font);
  const baseLine = context.measureText('').alphabeticBaseline;

  const emojiSideMargin = fontSize * emojiSideMarginPercent;
  const emojiTopMargin = fontSize * emojiTopMarginPercent;

  let currentWidth = 0;

  for (let entity of textEntities) {
    if (typeof entity === 'string') {
      // Common text case
      if (fillType === 'fill') {
        context.fillText(entity, x + currentWidth, y);
      } else {
        context.strokeText(entity, x + currentWidth, y);
      }

      currentWidth += context.measureText(entity).width;
    } else {
      // Emoji case
      const emoji = await loadTwemojiImageByUrl(entity.url);
      
      if(emoji) {
        context.drawImage(
          emoji,
          x + currentWidth + emojiSideMargin,
          y + emojiTopMargin - fontSize - baseLine,
          fontSize,
          fontSize
        );
      }

      currentWidth += fontSize + (emojiSideMargin * 2);
    }
  }
};