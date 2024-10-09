import dayjs from "dayjs";

export const getTopSellingProducts = (products, orders, period) => {
  const currentDate = dayjs();
  let filteredOrders = [];

  switch (period) {
    case "month":
      filteredOrders = orders.filter(order => dayjs(order.createdAt).isSame(currentDate, 'month'));
      break;
    case "week":
      filteredOrders = orders.filter(order => dayjs(order.createdAt).isSame(currentDate, 'week'));
      break;
    case "day":
      filteredOrders = orders.filter(order => dayjs(order.createdAt).isSame(currentDate, 'day'));
      break;
    default:
      break;
  }

  const productSales = {};

  filteredOrders.forEach(order => {
    order.products.forEach(orderProduct => {
      const productId = orderProduct.product;
      if (!productSales[productId]) {
        productSales[productId] = 0;
      }
      productSales[productId] += orderProduct.stock;
    });
  });

  const productList = products.map(product => ({
    ...product,
    quantitySold: productSales[product._id] || 0
  }));

  productList.sort((a, b) => b.quantitySold - a.quantitySold);

  return productList.slice(0, 5);
};
