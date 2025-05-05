import { Request, Response } from 'express';

import {
    getTopCustomersBySpending,
    getMonthlySalesReport,
    getProductsNeverOrdered,
    getAverageOrderValueByCountry,
    getFrequentBuyers,
} from '@services/lab.service';

import { ApiError } from '@utils/apiError';
import { apiResponse } from '@utils/apiResponse';
import { asyncHandler } from '@utils/asyncHandler';
import { RESPONSE_STATUS } from '@utils/responseStatus';

/* fetch the top customers by their total spending.
    It connects to the `getTopCustomersBySpending` service and returns
    a list of customers with the highest spending amounts.
*/
const getTopSpenders = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;
    const limitNumber = limit ? parseInt(limit as string, 10) : 10;

    const topCustomers = await getTopCustomersBySpending(limitNumber);

    // Send the response back with the customer data.
    return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
        data: topCustomers,
        message: 'Top spending customers retrieved successfully',
    });
});

// This function retrieves sales data for a specific month and year.
// It connects to the `getMonthlySalesReport` service and returns
// a breakdown of sales for the specified time period.
const getMonthlySales = asyncHandler(async (req: Request, res: Response) => {
    const { year, month } = req.query;

    if (!year) {
        throw new ApiError(RESPONSE_STATUS.BAD_REQUEST, {
            message: 'Year is a required parameter',
        });
    }

    const yearNumber = parseInt(year as string, 10);
    const monthNumber = parseInt(month as string, 10);

    if (monthNumber < 1 || monthNumber > 12) {
        throw new ApiError(RESPONSE_STATUS.BAD_REQUEST, {
            message: 'Month must be between 1 and 12',
        });
    }

    const salesReport = await getMonthlySalesReport(yearNumber, monthNumber);

    return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
        data: salesReport,
        message: 'Monthly sales report retrieved successfully',
    });
});

// This function finds all products that have never been ordered by any customer.
// It connects to the `getProductsNeverOrdered` service and returns a list
// of these unsold products.
const getNonSellingProducts = asyncHandler(
    async (_req: Request, res: Response) => {
        const products = await getProductsNeverOrdered();

        return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
            data: products,
            message: 'Non-selling products retrieved successfully',
        });
    },
);

/* calculate and retrieve the average order value grouped by country.
    It connects to the `getAverageOrderValueByCountry` service and returns
    a country-wise breakdown of average spending.
*/
const getCountryOrderStats = asyncHandler(
    async (_req: Request, res: Response) => {
        const orderStats = await getAverageOrderValueByCountry(); // Get stats by country.

        // Send the country-wise stats back to the client.
        return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
            data: orderStats,
            message: 'Country-wise order statistics retrieved successfully',
        });
    },
);

/* identify customers who frequently place orders.
    It connects to the `getFrequentBuyers` service and returns a list of
    customers who meet the minimum number of orders specified in the query.
*/
const getFrequentCustomers = asyncHandler(
    async (req: Request, res: Response) => {
        const { minOrders } = req.query;
        const minOrdersNumber = minOrders
            ? parseInt(minOrders as string, 10)
            : 2;

        const frequentCustomers = await getFrequentBuyers(minOrdersNumber);
        return apiResponse(res, RESPONSE_STATUS.SUCCESS, {
            data: frequentCustomers,
            message: 'Frequent customers retrieved successfully',
        });
    },
);

export {
    getTopSpenders,
    getMonthlySales,
    getNonSellingProducts,
    getCountryOrderStats,
    getFrequentCustomers,
};
