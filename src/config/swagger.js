import swaggerJsdoc from "swagger-jsdoc";

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
    ]
  },
  apis: ["./modules/**/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;