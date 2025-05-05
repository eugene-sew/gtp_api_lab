-- Monthly Sales Report (Only Shipped/Delivered)
-- 1. Filter orders with status 'shipped' or 'delivered' and within a specified date range.
-- 2. Join the order_items table to access quantity and unit price for revenue calculations.
-- 3. Group data by month using MONTH(order_date).
-- 4. Aggregate data:
--    - Count total orders using COUNT(order_id).
--    - Calculate revenue using SUM(quantity * unit_price).
--    - Count shipped and delivered orders using conditional aggregation (CASE statements).
-- 5. Sort results by month.

SELECT 
    MONTH(o.order_date) AS month,
    COUNT(o.order_id) AS total_orders,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    SUM(CASE WHEN o.status = 'shipped' THEN 1 ELSE 0 END) AS shipped_orders,
    SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders
FROM 
    orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE 
    o.status IN ('shipped', 'delivered')
    AND o.order_date BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY 
    MONTH(o.order_date)
ORDER BY 
    MONTH(o.order_date);