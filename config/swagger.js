const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat API',
      version: '1.0.0',
      description: 'A completely free API documentation using open source tools',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
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
module.exports = swaggerSpec