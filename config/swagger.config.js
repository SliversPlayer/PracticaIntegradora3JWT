// src/config/swagger.config.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación de la API para PracticaIntegradora3JWT',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // Archivos donde se documentarán las rutas y modelos
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };