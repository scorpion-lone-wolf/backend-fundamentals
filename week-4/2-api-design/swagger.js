import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "CRUD API for products",
    },
    servers: [
      {
        url: "http://localhost:3007",
      },
    ],
  },
  apis: ["./server.js"], // where your routes are
};

export const swaggerSpec = swaggerJsdoc(options);
