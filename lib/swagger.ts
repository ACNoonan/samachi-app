import { createSwaggerSpec } from "next-swagger-doc";
import schemas from "../models/schema/schemas.json"

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Samachi API",
        version: "0.5",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: schemas.definitions,
        paths: {},
      },
      security: [],
    },
  });
  return spec;
};