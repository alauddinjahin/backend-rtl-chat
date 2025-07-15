const express = require('express');
const swaggerUi = require('swagger-ui-express');
const auth = require('../middleware/auth');
const swaggerSpec = require('../config/swagger');

const router = express.Router();

// router.post('/register', AuthController.register);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'My Chat API Docs',
  customCss: '.swagger-ui .topbar { display: none }' // Hide topbar
}));

router.get('/api-docs.json', auth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


module.exports = router;