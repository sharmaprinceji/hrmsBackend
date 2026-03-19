import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRMS API",
      version: "1.0.0",
      description: "HRMS Backend API Documentation"
    },
    servers: [
      {
        url: "http://localhost:5001/api"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
   apis: ["./src/modules/**/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;