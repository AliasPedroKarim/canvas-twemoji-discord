# canvas-twemoji-discord

A fork of node-canvas-with-twemoji with Discord emoji support.

## Installation
```shell
$ npm install https://github.com/AliasPedroKarim/canvas-twemoji-discord.git#master
```
~~[npm](https://www.npmjs.com/package/node-canvas-with-twemoji-and-discord-emoji)~~ _In fact, it's just the Flazepe package, so do it your way._

## Quick Example
```javascript
const { createCanvas } = require('canvas');
const { fillTextWithTwemoji } = require('canvas-twemoji-discord');

async function main () {
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext('2d');

    context.fillStyle = '#000000';
    context.font = '30px Arial';
    await fillTextWithTwemoji(context, '😉 ou frite <:frites:387552674611986449> au four', 100, 100);
}

main();
```

## Dependencies

- node-canvas [GitHub](https://github.com/Automattic/node-canvas)
- twemoji-parser [GitHub](https://github.com/twitter/twemoji-parser)

## Licence

### node-canvas-with-twemoji

Copyright (c) 2020 cagpie <cagpie@gmail.com>

Code licensed under the MIT License: http://opensource.org/licenses/MIT
