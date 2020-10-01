const { parse } = require('twemoji-parser');

/*
 * Split Text
 * ex) 
 *  'les patates 🥔 sont cuites 🍟 au four <:frites:387552674611986443>'
 *  > ['les patates', TwemojiObj(🥔), 'sont cuites', TwemojiObj(🍟), 'au four', DiscordEmoteObj(<:frites:387552674611986443>)]
 */

const DISCORD_EMOJI_PATTERN = "<a?:\\w+:(\\d{17}|\\d{18})>";

function parseDiscordEmojis(textEntities) {
	const newArray = [];
	for (var entity of textEntities) {
		if (typeof entity === "string") {
      let pattern = new RegExp(DISCORD_EMOJI_PATTERN);

      for(let word of entity.replace(new RegExp(DISCORD_EMOJI_PATTERN, "gm"), "\u200b$&\u200b").split("\u200b")) {
        if(word.match(pattern)) {
          newArray.push({ url: `https://cdn.discordapp.com/emojis/${word.match(pattern)[1]}.png`, text: word, type: 'emoji_discord', indices: null });
        }else{
          newArray.push(word);
        }
      }
		} else newArray.push(entity);
	}
	return newArray;
}

module.exports = function splitEntitiesFromText (text) {
  const twemojiEntities = parse(text, { assetType: 'svg' });
  
  let lastTwemojiIndice = 0;
  const textEntities = [];

  for(let twemoji of twemojiEntities) {
    textEntities.push(text.slice(0, twemoji.indices[0] - lastTwemojiIndice));
    textEntities.push(twemoji);

    text = text.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  }

  textEntities.push(text);

  return parseDiscordEmojis(textEntities);
};