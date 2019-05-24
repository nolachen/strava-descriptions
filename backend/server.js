const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');

const authorizeStrava = require('./authorizeStrava');
const handleWebhookEvent = require('./handleWebhookEvent');

const { PORT } = require('./config');


const app = express();

app.use(bodyParser.json());

app.get('/login', authorizeStrava);

app.get('/subscription', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
});

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const {
    object_type: objectType,
    aspect_type: aspectType,
    object_id: objectId,
    owner_id: ownerId,
  } = req.body;

  if (objectType === 'activity' && aspectType === 'create') {
    handleWebhookEvent(objectId, ownerId)
      .then(console.log(`Successfully updated description for activity ${objectId}`))
      .catch(error => console.log(error));
  }
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

const port = PORT || 8000;

app.listen(port, () => {
  console.log(`${emoji.get('satellite_antenna')}  Listening on port ${port}`);
});