const swaggerJSDoc = require('swagger-jsdoc');
const {
  API_TITLE,
  API_FULL_VERSION,
  API_DESCRIPTION,
  API_TERMS_OF_SERVICE,
  API_CONTACT_NAME,
  API_CONTACT_URL,
  API_CONTACT_EMAIL,
  API_LICENSE_NAME,
  API_LICENSE_URL,
  API_HOST,
  API_TAGS,
  AUTH_TYPE,
  AUTH_SCHEME_NAME,
  AUTH_SCHEME } = require('./api');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: API_TITLE,
      version: API_FULL_VERSION,
      description: API_DESCRIPTION,
      termsOfService: API_TERMS_OF_SERVICE,
      contact: {
        name: API_CONTACT_NAME,
        url: API_CONTACT_URL,
        email: API_CONTACT_EMAIL
      },
      license: {
        name: API_LICENSE_NAME,
        url: API_LICENSE_URL
      }
    },
    servers: [
      {
        url: API_HOST,
        description: 'Development server'
      }
    ],
    tags: API_TAGS,
    components: {
      securitySchemes: { //securitySchemes
        [AUTH_SCHEME]: {
          type: AUTH_TYPE,
          scheme: AUTH_SCHEME_NAME,
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        [AUTH_SCHEME]: []
      }
    ]
  },
  apis: [
    './utils/swagger/schemas/*.js',
    './utils/swagger/paths/*.js',
    './routes/*.js',
    './models/*.js',
    './controllers/*.js',
    './dto/*.js'
  ]
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;