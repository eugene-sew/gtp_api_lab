import { Prisma } from '@prisma/client';

import client from '@db/index';

/**
 * Fetches the top customers by their total spending.
 * Approach: Retrieves customers, calculates their total spending by summing the
 * quantity and unit price of their orders, and sorts them by the number of orders.
 * Default limit is 10 customers.
 */
const getTopCustomersBySpending = async (limit: number = 10) => {
    return await client.customers
        .findMany({
            take: limit,
            select: {
                customer_id: true,
                name: true,
                email: true,
                country: true,
                _count: {
                    select: { orders: true },
                },
                orders: {
                    select: {
                        order_items: {
                            select: {
                                quantity: true,
                                unit_price: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                orders: {
                    _count: 'desc',
                },
            },
        })
        .then((customers) =>
            customers.map((customer) => ({
                ...customer,
                totalSpent: customer.orders.reduce(
                    (total, order) =>
                        total +
                        order.order_items.reduce(
                            (orderTotal, item) =>
                                orderTotal +
                                (item.quantity || 0) *
                                    (Number(item.unit_price) || 0),
                            0,
                        ),
                    0,
                ),
            })),
        );
};

/**
 * Generates a sales report for a specific month or year.
 * Approach: Retrieves orders within the specified date range, calculates
 * total orders, revenue, and categorizes orders by status. If the entire
 * year is requested, adds a monthly breakdown.
 */
const getMonthlySalesReport = async (year: number, month?: number) => {
    let startDate: Date;
    let endDate: Date;

    if (month) {
        // If month is provided, get report for specific month
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
    } else {
        // If only year is provided, get report for entire year
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    /* just fetch all orders based on provided date range
        with the status being either shipped or delivered
    */
    const orders = await client.orders.findMany({
        where: {
            order_date: {
                gte: startDate,
                lte: endDate,
            },
            status: {
                in: ['shipped', 'delivered'],
            },
        },
        include: {
            order_items: {
                include: {
                    products: true,
                },
            },
            customers: true,
        },
    });

    /* This calculates the total number of orders,
        the total revenue by summing up all item prices (quantity * unit_price),
        and groups orders by their status, counting how many orders fall into each status.
    */
    const result = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce(
            (total, order) =>
                total +
                order.order_items.reduce(
                    (orderTotal, item) =>
                        orderTotal +
                        (item.quantity || 0) * (Number(item.unit_price) || 0),
                    0,
                ),
            0,
        ),
        ordersByStatus: orders.reduce(
            (acc, order) => ({
                ...acc,
                [order.status || 'unknown']:
                    (acc[order.status || 'unknown'] || 0) + 1,
            }),
            {} as Record<string, number>,
        ),
    };

    // If no month is provided, this groups orders by month, counting total orders, calculating total revenue,
    // and tracking 'delivered' and 'shipped' orders for each month, then adds this monthly breakdown to the result.
    if (!month) {
        const monthlyBreakdown = orders.reduce(
            (acc, order) => {
                const orderMonth = order.order_date?.getMonth() ?? 0;
                if (!acc[orderMonth]) {
                    acc[orderMonth] = {
                        month: orderMonth + 1,
                        totalOrders: 0,
                        totalRevenue: 0,
                        ordersByStatus: {
                            delivered: 0,
                            shipped: 0,
                        },
                    };
                }

                acc[orderMonth].totalOrders += 1;
                acc[orderMonth].totalRevenue += order.order_items.reduce(
                    (orderTotal, item) =>
                        orderTotal +
                        (item.quantity || 0) * (Number(item.unit_price) || 0),
                    0,
                );

                const status = (order.status || 'unknown').toLowerCase();
                if (status === 'delivered' || status === 'shipped') {
                    acc[orderMonth].ordersByStatus[status] += 1;
                }

                return acc;
            },
            {} as Record<
                number,
                {
                    month: number;
                    totalOrders: number;
                    totalRevenue: number;
                    ordersByStatus: {
                        delivered: number;
                        shipped: number;
                    };
                }
            >,
        );

        return {
            ...result,
            monthlyBreakdown: Object.values(monthlyBreakdown),
        };
    }

    return result;
};

/**
 * Finds products that have never been ordered.
 * Approach: Filters products where no associated order_items exist
 * and selects relevant product fields.
 */
const getProductsNeverOrdered = async () => {
    return await client.products.findMany({
        where: {
            order_items: {
                none: {},
            },
        },
        select: {
            product_id: true,
            name: true,
            category: true,
            price: true,
        },
    });
};

/**
 * Calculates the average order value by country.
 * Approach: Groups orders by customer country, calculates total revenue
 * and order count, and computes the average order value per country.
 */
const getAverageOrderValueByCountry = async () => {
    const orders = await client.orders.findMany({
        include: {
            customers: true,
            order_items: true,
        },
    });

    const countryStats = orders.reduce(
        (acc, order) => {
            const country = order.customers?.country || 'Unknown';
            const orderTotal = order.order_items.reduce(
                (total, item) =>
                    total +
                    (item.quantity || 0) * (Number(item.unit_price) || 0),
                0,
            );

            if (!acc[country]) {
                acc[country] = { totalValue: 0, orderCount: 0 };
            }
            acc[country].totalValue += orderTotal;
            acc[country].orderCount += 1;
            return acc;
        },
        {} as Record<string, { totalValue: number; orderCount: number }>,
    );

    return Object.entries(countryStats).map(([country, stats]) => ({
        country,
        averageOrderValue: stats.totalValue / stats.orderCount,
        totalOrders: stats.orderCount,
    }));
};

/**
 * Identifies frequent buyers based on a minimum number of orders.
 * Approach: Filters customers whose order count exceeds the specified
 * minimum and calculates their total spending.
 */
const getFrequentBuyers = async (minOrders: number = 1) => {
    type CustomerWithOrders = Prisma.customersGetPayload<{
        include: {
            orders: {
                include: {
                    order_items: true;
                };
            };
            _count: {
                select: { orders: true };
            };
        };
    }>;

    const customers = await client.customers.findMany({
        include: {
            orders: {
                include: {
                    order_items: true,
                },
            },
            _count: {
                select: { orders: true },
            },
        },
    });

    return customers
        .filter(
            (customer: CustomerWithOrders) =>
                customer._count.orders > minOrders,
        )
        .map((customer: CustomerWithOrders) => ({
            customer_id: customer.customer_id,
            name: customer.name,
            email: customer.email,
            country: customer.country,
            orderCount: customer._count.orders,
            totalSpent: customer.orders.reduce(
                (total: number, order) =>
                    total +
                    order.order_items.reduce(
                        (orderTotal: number, item) =>
                            orderTotal +
                            (item.quantity || 0) *
                                (Number(item.unit_price) || 0),
                        0,
                    ),
                0,
            ),
        }));
};

export {
    getTopCustomersBySpending,
    getMonthlySalesReport,
    getProductsNeverOrdered,
    getAverageOrderValueByCountry,
    getFrequentBuyers,
};
