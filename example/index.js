const express = require('express');
const { createCanvas } = require('canvas');
const base64 = require('urlsafe-base64');

const wt = require('../src/index');

const app = express();
const port = process.env.PORT || 9000;

app.get('/', async (req, res) => {
  const canvas = createCanvas(700, 200);
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 700, 200);

  context.fillStyle = '#000000';
  context.font = '30px Arial';
  await wt.fillTextWithTwemoji(context, 'test 😉 <:jumboable_emo:492687098701283328>', 10, 50);

  context.fillStyle = '#888888';
  context.font = '18px Arial';

  // use query "size"

  let size = !isNaN(parseFloat(req.query.size)) ? parseFloat(req.query.size) :  300;
  await wt.fillTextWithTwemoji(context, 'les patates 🥔 sont cuites 🍟 au four <:frites:387552674611986443>', 10, 100, { maxWidth: size });

  // For : http://localhost:port/?text=<YOUR_TEXT>
  if (req.query.text) {
    await wt.fillTextWithTwemoji(context, req.query.text, 10, 150);
  }

  const b64 = canvas.toDataURL().split(',');
  const image = base64.decode(b64[1]);

  res.set('Content-Type', 'image/png');
  return res.send(image);
});

app
  .listen(port, () => {
    console.log(`Staring web server express and listening port (${port})...`);
  });