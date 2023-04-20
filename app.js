const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware for handling raw request body
function rawBodyBuffer(req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(express.json({ verify: rawBodyBuffer }));
app.use(express.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(express.raw({ verify: rawBodyBuffer, type: '*/*' }));

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
      break;
    // Add more cases for other event types
    default:
      // Unexpected event type
      return res.status(400).end();
  }

  res.status(200).send();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
