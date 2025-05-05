-- Top Customers by Spending
-- 1. Select customer information (customer_id, name, email, country).
-- 2. Join orders table to link customers with their orders.
-- 3. Join order_items table to fetch quantity and unit price for each order item.
-- 4. Calculate total orders (COUNT(order_id)) and total spending (SUM(quantity * unit_price)) for each customer.
-- 5. Group by customer details and sort by total_spent in descending order.

SELECT 
    c.customer_id,
    c.name,
    c.email,
    c.country,
    COUNT(o.order_id) AS order_count,
    SUM(oi.quantity * oi.unit_price) AS total_spent
FROM 
    customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY 
    c.customer_id, c.name, c.email, c.country
ORDER BY 
    total_spent DESC;
