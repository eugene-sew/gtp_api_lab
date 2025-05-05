import { Router } from 'express';

import {
    getTopSpenders,
    getMonthlySales,
    getNonSellingProducts,
    getCountryOrderStats,
    getFrequentCustomers,
} from '@controllers/lab.controllers';

const labRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MonthlyBreakdown:
 *       type: object
 *       properties:
 *         month:
 *           type: integer
 *           description: The month number (1-12)
 *         totalOrders:
 *           type: integer
 *           description: Total number of orders in this month
 *         totalRevenue:
 *           type: number
 *           format: float
 *           description: Total revenue for this month
 *         ordersByStatus:
 *           type: object
 *           properties:
 *             delivered:
 *               type: integer
 *               description: Number of delivered orders
 *             shipped:
 *               type: integer
 *               description: Number of shipped orders
 *     SalesReport:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *           description: Total number of orders in the period
 *         totalRevenue:
 *           type: number
 *           format: float
 *           description: Total revenue for the period
 *         ordersByStatus:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           description: Count of orders by their status
 *         monthlyBreakdown:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MonthlyBreakdown'
 *           description: Monthly breakdown of sales data
 */

/**
 * @swagger
 * /lab/top-spenders:
 *   get:
 *     summary: Get top customers by spending
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of customers to return
 *     responses:
 *       200:
 *         description: List of top spending customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 */
labRouter.get('/top-spenders', getTopSpenders);

/**
 * @swagger
 * /lab/monthly-sales:
 *   get:
 *     summary: Get monthly sales report
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year for the report
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month for the report (1-12)
 *     responses:
 *       200:
 *         description: Monthly sales report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SalesReport'
 *                 message:
 *                   type: string
 *                   example: "Monthly sales report retrieved successfully"
 */
labRouter.get('/monthly-sales', getMonthlySales);

/**
 * @swagger
 * /lab/non-selling-products:
 *   get:
 *     summary: Get products that have never been ordered
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: List of products never ordered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
labRouter.get('/non-selling-products', getNonSellingProducts);

/**
 * @swagger
 * /lab/country-stats:
 *   get:
 *     summary: Get average order value by country
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Country-wise order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CountryStats'
 */
labRouter.get('/country-stats', getCountryOrderStats);

/**
 * @swagger
 * /lab/frequent-customers:
 *   get:
 *     summary: Get customers who frequently make purchases
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: minOrders
 *         schema:
 *           type: integer
 *           default: 2
 *         description: Minimum number of orders to be considered frequent
 *     responses:
 *       200:
 *         description: List of frequent customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 */
labRouter.get('/frequent-customers', getFrequentCustomers);

export { labRouter };
