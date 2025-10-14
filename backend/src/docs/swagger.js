const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Primetrade Assignment API',
    version: '1.0.0',
    description: 'API docs for Primetrade assignment (v1)'
  },
  servers: [{ url: 'http://localhost:5000/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register user',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: {type:'string'}, email:{type:'string'}, password:{type:'string'}, role:{type:'string'} } } } } },
        responses: { '201': { description: 'Created' } }
      }
    },
    '/auth/login': {
      post: { summary: 'Login', responses: { '200': { description: 'OK' } } }
    },
    '/tasks': {
      get: { summary: 'Get tasks' },
      post: { summary: 'Create task' }
    },
    '/tasks/{id}': {
      get: { summary: 'Get task by id' },
      put: { summary: 'Update task' },
      delete: { summary: 'Delete task (admin)' }
    }
  }
};

module.exports = (app) => {
  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
