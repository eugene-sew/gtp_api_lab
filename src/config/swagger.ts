import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lab API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Lab Analytics API',
        },
        servers: [
            {
                url: `http://${process.env.HOST || 'localhost'}:8080/api/`,
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                        statusCode: {
                            type: 'number',
                            description: 'HTTP status code',
                        },
                    },
                },
                Customer: {
                    type: 'object',
                    properties: {
                        customer_id: {
                            type: 'number',
                            description: 'Customer ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Customer name',
                        },
                        email: {
                            type: 'string',
                            description: 'Customer email',
                        },
                        country: {
                            type: 'string',
                            description: 'Customer country',
                        },
                        totalSpent: {
                            type: 'number',
                            description: 'Total amount spent by customer',
                        },
                        orderCount: {
                            type: 'number',
                            description: 'Number of orders placed by customer',
                        },
                    },
                },
                SalesReport: {
                    type: 'object',
                    properties: {
                        totalOrders: {
                            type: 'number',
                            description: 'Total number of orders',
                        },
                        totalRevenue: {
                            type: 'number',
                            description: 'Total revenue',
                        },
                        ordersByStatus: {
                            type: 'object',
                            description: 'Orders grouped by status',
                            additionalProperties: {
                                type: 'number',
                            },
                        },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        product_id: {
                            type: 'number',
                            description: 'Product ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Product name',
                        },
                        category: {
                            type: 'string',
                            description: 'Product category',
                        },
                        price: {
                            type: 'number',
                            description: 'Product price',
                        },
                    },
                },
                CountryStats: {
                    type: 'object',
                    properties: {
                        country: {
                            type: 'string',
                            description: 'Country name',
                        },
                        averageOrderValue: {
                            type: 'number',
                            description: 'Average order value',
                        },
                        totalOrders: {
                            type: 'number',
                            description: 'Total number of orders',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs };
