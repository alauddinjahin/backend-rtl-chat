
module.exports = {
  API_VERSION: process.env.API_VERSION || 'v1',
  BASE_PATH: `/api/${process.env.API_VERSION || 'v1'}`,

  // General Info
  API_TITLE: 'Chat API',
  API_DESCRIPTION: 'Robust RESTful API for real-time messaging, user management, and media exchange.',
  API_TERMS_OF_SERVICE: 'https://yourdomain.com/terms',
  API_CONTACT_NAME: 'Developer Support',
  API_CONTACT_URL: 'https://yourdomain.com/support',
  API_CONTACT_EMAIL: 'dev.alauddinjahin@gmail.com',
  API_LICENSE_NAME: 'MIT',
  API_LICENSE_URL: 'https://opensource.org/licenses/MIT',

  // Host & Docs
  API_HOST: process.env.API_HOST || 'http://localhost:5000',
  API_DOCS_ROUTE: '/docs',

  // Authentication Info
  AUTH_SCHEME: 'bearerAuth', // Matches Swagger bearer scheme
  AUTH_TYPE: 'http',
  AUTH_SCHEME_NAME: 'Bearer',

  // Versioning
  API_FULL_VERSION: '1.0.0',

  // Tags (used in Swagger grouping)
  API_TAGS: [
    // { name: "Auth", description: "Authentication and session handling" },
    // { name: "Users", description: "User profile and settings management" },
    // { name: "Messages", description: "Send, receive, and manage chat messages" },
    // { name: "Rooms", description: "Chat room creation and participation" },
  ]
};
