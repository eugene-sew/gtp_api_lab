-- Average Order Value by Country
-- 1. Join customers with orders to group orders by country.
-- 2. Join the order_items table to access quantity and unit price for revenue calculations.
-- 3. Aggregate data by country:
--    - Count total orders using COUNT(order_id).
--    - Calculate total revenue using SUM(quantity * unit_price).
--    - Compute the average order value as total revenue divided by total orders.
-- 4. Group results by country and sort by avg_order_value in descending order.

SELECT 
    c.country,
    COUNT(o.order_id) AS total_orders,
    SUM(oi.quantity * oi.unit_price) / COUNT(o.order_id) AS avg_order_value
FROM 
    customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY 
    c.country
ORDER BY 
    avg_order_value DESC;
