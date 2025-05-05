-- Products Never Ordered
-- 1. Select product details (product_id, name, category, price).
-- 2. Perform a LEFT JOIN with the order_items table to link products with order items.
-- 3. Filter out products linked to orders using the condition oi.order_id IS NULL.
-- 4. Return the list of products with no associated orders.

SELECT 
    p.product_id,
    p.name,
    p.category,
    p.price
FROM 
    products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE 
    oi.order_id IS NULL;
