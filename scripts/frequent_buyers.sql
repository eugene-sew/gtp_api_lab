-- Frequent Buyers (More Than One Order)
-- 1. Join customers, orders, and order_items to gather data for each customer's orders.
-- 2. Aggregate data by customer:
--    - Count total orders using COUNT(order_id).
--    - Calculate total spending using SUM(quantity * unit_price).
-- 3. Filter customers with more than one order using HAVING COUNT(order_id) > 1.
-- 4. Sort results by order_count in descending order.

SELECT 
    c.customer_id,
    c.name,
    c.email,
    c.country,
    COUNT(o.order_id) AS order_count,
    SUM(oi.quantity * oi.unit_price) AS total_spent
FROM 
    customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY 
    c.customer_id, c.name, c.email, c.country
HAVING 
    COUNT(o.order_id) > 1
ORDER BY 
    order_count DESC;
