module.exports.swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Delilah Resto API',
        version: '1.0.0',
        description: 'Esta es la documentacion escrita para el proyecto Delilah Resto, contiene todos los endpoints de la API',
        license: {
            name: 'MIT',
            url: ''
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'develop'
        },
        {
            url: 'https://delilahresto.com/',
            description: 'production'
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
}