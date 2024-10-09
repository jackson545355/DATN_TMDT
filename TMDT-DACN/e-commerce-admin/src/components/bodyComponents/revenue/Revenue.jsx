// export default Revenue;
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Dialog,
} from "@mui/material";
import dayjs from "dayjs";
import AddVisualizationDialog from "./AddVisualizationDialog";
import AddFilterDialog from "./AddFilterDialog"; // Nếu có file này thì bạn cần thêm nó vào
import Visualization from "./Visualization";

const fieldMapping = {
  "Mã đơn hàng": ["_id"],
  "Ngày đặt hàng": ["createdAt"],
  "Ngày gửi hàng": ["updateTime", "shipping"],
  "Thời gian đơn hàng được hoàn thành": ["updateTime", "completed"],
  "Tên sản phẩm": [["products", "product"], ["name_product"]],
  "Số lượng": ["products", "stock"],
  "Giá gốc": [["products", "product"], ["price_product"]],
  "Tổng giá bán (sản phẩm)": ["total"],
  "Tên phân loại hàng": [["products", "product"], ["id_category"]],
};
const categories = [
  { id: 0, label: "Điện tử" },
  { id: 1, label: "Gia dụng" },
  { id: 2, label: "Mỹ phẩm" },
];

const Revenue = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false); // Trạng thái để mở/đóng filter dialog
  const [visualizations, setVisualizations] = useState([]);

  useEffect(() => {
    // Fetch dữ liệu orders và products
    const fetchData = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch("http://localhost:3003/orders/all"),
          fetch("http://localhost:3002/products/getAll"),
        ]);
        const ordersData = await ordersResponse.json();
        const productsData = await productsResponse.json();

        setOrders(ordersData.orders);
        setProducts(productsData.products);
        setFilteredData(ordersData.orders); // Ban đầu hiển thị toàn bộ đơn hàng
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // console.log(orders);
    filterData(); // Gọi hàm lọc khi startDate, endDate hoặc orders thay đổi
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate, orders]);

  const filterData = () => {
    let filteredOrders = orders;
    // console.log(startDate);
    if (startDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = dayjs(order.createdAt);

        return (
          orderDate.isAfter(dayjs(startDate)) ||
          orderDate.isSame(dayjs(startDate), "day")
        );
      });
    }

    if (endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = dayjs(order.createdAt);
        return (
          orderDate.isBefore(dayjs(endDate)) ||
          orderDate.isSame(dayjs(endDate), "day")
        );
      });
    }

    setFilteredData(filteredOrders);
  };

  const handleRemove = (indexToremove) => {
    setVisualizations((prevVisualizations) =>
      prevVisualizations.filter((_, index) => index !== indexToremove)
    );
  };
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleOpenFilterDialog = () => setOpenFilterDialog(true);
  const handleCloseFilterDialog = () => setOpenFilterDialog(false);

  // Hàm thêm visualization mới
  const handleSaveVisualization = (newVisualization) => {
    // Kiểm tra nếu type là "Dashboard", đặt width là 4
    if (newVisualization.type === "Dashboard") {
      // console.log("Dashboard nè");
      // Thêm các visual cho dashboard
      const dashboardVisualizations = [
        {
          title: "Tổng doanh thu theo sản phẩm",
          type: "Bar Chart",
          category: "Tên sản phẩm",
          valueField: "Tổng giá bán (sản phẩm)",
          functionType: "Sum",
          width: 2,
        },
        {
          title: "Doanh thu theo ngày",
          type: "Column Chart",
          category: "Ngày đặt hàng",
          valueField: "Tổng giá bán (sản phẩm)",
          functionType: "Sum",
          width: 2,
        },
        {
          title: "Số lượng đơn hàng theo ngày",
          type: "Line Chart",
          category: "Ngày gửi hàng",
          valueField: "Số lượng",
          functionType: "Count",
          width: 4,
        },
        {
          title: "Tổng giá bán (Card)",
          type: "Card",
          category: "Tên sản phẩm",
          valueField: "Tổng giá bán (sản phẩm)",
          functionType: "Sum",
          width: 1,
        },
        {
          title: "Tổng số sản phẩm theo loại hàng",
          type: "Pie Chart",
          category: "Tên phân loại hàng",
          valueField: "Số lượng",
          functionType: "Count",
          width: 3,
        },
        {
          title: "Số lượng sản phẩm bán ra theo ngày",
          type: "Line Chart",
          category: "Ngày đặt hàng",
          valueField: "Số lượng",
          functionType: "Sum",
          width: 2,
        },
        {
          title: "Doanh thu sản phẩm theo phân loại",
          type: "Bar Chart",
          category: "Tên phân loại hàng",
          valueField: "Tổng giá bán (sản phẩm)",
          functionType: "Sum",
          width: 2,
        },
      ];

      // Thêm danh sách visualizations vào cùng với dashboard
      setVisualizations([...visualizations, ...dashboardVisualizations]);
    } else {
      setVisualizations([...visualizations, newVisualization]);
    }
    handleCloseDialog(); // Đóng dialog sau khi lưu
  };
  const getNestedValue = (obj, field) => {
    if (Array.isArray(field)) {
      return field.reduce((acc, key) => {
        if (Array.isArray(acc)) {
          // Nếu acc là một mảng, lặp qua từng phần tử và lấy giá trị key từ mỗi phần tử
          return acc.map((item) => item && item[key]);
        }
        return acc && acc[key];
      }, obj);
    }
    return obj[field];
  };
  const groupByCategory = (mappedOrders, isDate = false) => {
    let groupped = mappedOrders.reduce((acc, order) => {
      const categories = Array.isArray(order.categoryValue)
        ? order.categoryValue
        : [order.categoryValue];
      const values = Array.isArray(order.valueFieldValue)
        ? order.valueFieldValue
        : [order.valueFieldValue];
      // console.log(grouppe);
      // Lặp qua từng phần tử trong category và value để nhóm lại
      categories.forEach((category, index) => {
        let processedCategory = category;

        // Nếu là ngày tháng, chỉ lấy ngày/tháng/năm
        if (isDate && processedCategory) {
          processedCategory = new Date(category)
            // .toLocaleDateString("en-CA"); // YYYY-MM-DD

            //   // .toLocaleDateString("en-CA", { //   YYYY/MM/DD
            //   //   year: "numeric",
            //   //   month: "2-digit",
            //   //   day: "2-digit",
            //   // });

            .toLocaleDateString("en-GB", {
              // DD/MM/YYYY
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

          //   // .toLocaleDateString("en-GB", { //DD/MM/YY
          //   //     day: "2-digit",
          //   //     month: "2-digit",
          //   //     year: "2-digit",
          //   //   });
        }
        // Bỏ qua các giá trị category là null hoặc undefined
        if (processedCategory == null) return;
        // console.log(category);
        const value = values[index] !== undefined ? values[index] : null; // Lấy giá trị tương ứng nếu tồn tại
        // console.log(category, value);
        if (!acc[processedCategory]) {
          acc[processedCategory] = [];
        }
        acc[processedCategory].push(value);
      });

      return acc;
    }, {});
    // console.log(groupped);
    // Tạo dữ liệu đã nhóm lại
    const groupedData = Object.keys(groupped).map((category, index) => ({
      id: index + 1, // ID cho mỗi hàng (có thể tùy chỉnh)
      categoryValue: [category], // Đảm bảo categoryValue là một mảng chỉ chứa một tên
      valueFieldValue: groupped[category], // Đây là mảng các giá trị đã nhóm
    }));
    // Nếu isDate là true, sắp xếp các key theo thứ tự ngày tháng
    if (isDate) {
      // Lấy ngày đầu tiên và ngày cuối cùng
      // const dates = Object.keys(groupped).map(
      //   (dateStr) => new Date(dateStr.split("/").reverse().join("-"))
      // );
      // const minDate = new Date(Math.min(...dates));
      // const maxDate = new Date(Math.max(...dates));

      // // Hàm tạo danh sách các ngày liên tục
      // const getDateRange = (startDate, endDate) => {
      //   const dateArray = [];
      //   let currentDate = new Date(startDate);

      //   while (currentDate <= endDate) {
      //     dateArray.push(new Date(currentDate));
      //     currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày lên 1
      //   }

      //   return dateArray;
      // };

      // // Tạo danh sách các ngày liên tục
      // const allDates = getDateRange(minDate, maxDate).map((date) =>
      //   date.toLocaleDateString("en-GB", {
      //     day: "2-digit",
      //     month: "2-digit",
      //     year: "numeric",
      //   })
      // );

      // // Đảm bảo tính liên tục, thêm ngày nào không có với giá trị 0
      // allDates.forEach((dateStr) => {
      //   if (!groupped[dateStr]) {
      //     groupedData.push({
      //       id: groupedData.length + 1,
      //       categoryValue: [dateStr], // Ngày liên tục
      //       valueFieldValue: [], // Nếu không có thì giá trị bằng 0
      //     });
      //   }
      // });

      groupedData.sort((a, b) => {
        const dateA = a.categoryValue[0].split("/").reverse().join("-"); // Chuyển DD/MM/YYYY thành YYYY-MM-DD
        const dateB = b.categoryValue[0].split("/").reverse().join("-");
        return new Date(dateA) - new Date(dateB);
      });
    }
    // console.log(groupped);

    return groupedData;
  };

  const generateChartOptions = ({ chartType, titleData, data }) => {
    const { title, category, valueField } = titleData;
    const { categoryValue, valueFieldValue } = data;
    // console.log(chartType);
    // console.log(title, category, valueField);
    // console.log(
    //   categoryValue,
    //   valueFieldValue.map((val) => parseFloat(val) || 0)
    // );

    const formatValue = (value) => {
      if (value >= 1e9) {
        return (value / 1e9).toFixed(3) + "B";
      } else if (value >= 1e6) {
        return (value / 1e6).toFixed(3) + "M";
      } else if (value >= 1e3) {
        return (value / 1e3).toFixed(3) + "K";
      } else {
        return value.toFixed(0); // Hiển thị 2 chữ số thập phân cho các giá trị nhỏ
      }
    };
    // console.log(data);
    switch (chartType) {
      case "Line Chart":
        return {
          options: {
            chart: {
              id: "basic-line",
              type: "line",
              height: 350,
            },
            xaxis: {
              categories: categoryValue,
              title: { text: category, offsetY: 0 },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
            stroke: {
              curve: "smooth",
            },
            title: {
              text: title,
              align: "left",
            },
            yaxis: {
              title: { text: category },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
          },
          series: [
            {
              name: valueField,
              data: valueFieldValue.map((val) => parseFloat(val) || 0),
            },
          ],
        };

      case "Bar Chart":
        return {
          options: {
            chart: {
              type: "bar", // Sử dụng 'bar' cho biểu đồ thanh ngang
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: true, // Hiển thị thanh theo chiều ngang
              },
            },
            dataLabels: {
              enabled: false, // Tắt hiển thị giá trị trên mỗi thanh
            },
            xaxis: {
              categories: categoryValue.slice(0, 10), // Dữ liệu cho trục X
              title: { text: category, offsetY: -5 },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
            yaxis: {
              title: { text: valueField },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
            title: {
              text: title, // Tiêu đề biểu đồ
              align: "left",
            },
            tooltip: {
              y: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                }, // Format giá trị trong tooltip
              },
            },
          },
          series: [
            {
              name: title,
              data: valueFieldValue
                .slice(0, 10)
                .map((val) => parseFloat(val) || 0),
            },
          ],
        };

      case "Pie Chart":
        return {
          options: {
            chart: {
              type: "pie",
              height: 350,
            },
            labels: categoryValue,
            title: {
              text: title,
              align: "left",
            },
          },
          series: valueFieldValue.map((val) => parseFloat(val) || 0),
        };

      case "Column Chart":
        return {
          options: {
            chart: {
              type: "bar", // Sử dụng 'bar' cho biểu đồ thanh ngang
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: false, // Hiển thị thanh theo chiều ngang
              },
            },
            dataLabels: {
              enabled: false, // Tắt hiển thị giá trị trên mỗi thanh
            },
            xaxis: {
              categories: categoryValue.slice(0, 10), // Dữ liệu cho trục X
              title: { text: category, offsetY: -5 },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
            yaxis: {
              title: { text: valueField },
              labels: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                },
              },
            },
            title: {
              text: title, // Tiêu đề biểu đồ
              align: "center",
            },
            tooltip: {
              y: {
                formatter: (val) => {
                  // Kiểm tra nếu là số thì format
                  return !isNaN(val) ? formatValue(val) : val;
                }, // Format giá trị trong tooltip
              },
            },
          },
          series: [
            {
              name: valueField,
              data: valueFieldValue
                .slice(0, 10)
                .map((val) => parseFloat(val) || 0),
            },
          ],
        };
      default:
        return null;
    }
  };
  const calculateVisualizationData = (orders, visualization, productsData) => {
    const { category, valueField, functionType, type, title } = visualization;
    let data = [];
    const categoryField = fieldMapping[category];
    const valueFieldKey = fieldMapping[valueField];
    // console.log(Array.isArray(categoryField[0]), categoryField, valueFieldKey);
    // Ánh xạ và sử dụng getNestedValue trước khi xử lý
    const mappedOrders = orders.map((order) => {
      let categoryValue;
      let valueFieldValue;

      // Xử lý categoryField
      if (Array.isArray(categoryField[0])) {
        // Trường hợp nhiều mảng (ví dụ: "Tên sản phẩm")
        const productId = getNestedValue(order, categoryField[0]); // Truy cập orders["products"]["product"]
        categoryValue = productId.map((id) => {
          const productData = productsData.find((p) => p._id === id);
          return productData
            ? getNestedValue(productData, categoryField[1])
            : "Unknown";
        });
        // console.log(categoryValue);
      } else {
        // Nếu chỉ có một mảng thì lấy trực tiếp từ order
        categoryValue = getNestedValue(order, categoryField);
      }
      if (category === "Tên phân loại hàng") {
        categoryValue = categoryValue.map((value) => {
          const category = categories.find((cat) => cat.id === parseInt(value));
          return category ? category.label : "Unknown"; // Trả về nhãn, nếu không tìm thấy thì là "Unknown"
        });
      }
      // Xử lý valueFieldKey
      if (Array.isArray(valueFieldKey[0])) {
        // Trường hợp nhiều mảng (ví dụ: "Giá gốc")
        const productId = getNestedValue(order, valueFieldKey[0]); // Truy cập orders["products"]["product"]
        valueFieldValue = productId.map((id) => {
          const productData = productsData.find((p) => p._id === id);
          return productData
            ? getNestedValue(productData, valueFieldKey[1])
            : null;
        });
      } else {
        // Nếu chỉ có một mảng thì lấy trực tiếp từ order
        valueFieldValue = getNestedValue(order, valueFieldKey);
      }

      return {
        ...order,
        categoryValue,
        valueFieldValue,
      };
    });

    // console.log("map", mappedOrders);
    // In ra các giá trị ánh xạ để kiểm tra
    // console.log("Mapped Orders: ", mappedOrders);
    // Kiểm tra nếu category là kiểu ngày tháng
    const isDate = [
      "Ngày đặt hàng",
      "Ngày gửi hàng",
      "Thời gian đơn hàng được hoàn thành",
    ].includes(category);
    const groupped = groupByCategory(mappedOrders, isDate);
    // console.log(groupped);
    // Xử lý dựa trên loại visualization
    if (type.toLowerCase().includes("chart")) {
      let chartData;
      if (functionType === "Sum") {
        // Tính tổng các valueFieldValue cho từng categoryValue
        chartData = groupped.map((category) => {
          const sumValue = category.valueFieldValue
            .map((val) => parseFloat(val) || 0) // Chuyển đổi chuỗi thành số, nếu không phải số thì trả về 0
            .reduce((acc, val) => acc + val, 0);
          // .toLocaleString("en-US", {
          //   minimumFractionDigits: 2,
          //   maximumFractionDigits: 2,
          // })
          return {
            categoryValue: category.categoryValue,
            valueFieldValue: sumValue, // Tổng các giá trị trong valueFieldValue
          };
        });
      } else if (functionType === "Average") {
        // Tính trung bình các valueFieldValue cho từng categoryValue
        chartData = groupped.map((category) => {
          const numericValues = category.valueFieldValue.map(
            (val) => parseFloat(val) || 0
          ); // Chuyển đổi chuỗi thành số, nếu không phải số thì trả về 0
          const avgValue =
            numericValues.reduce((acc, val) => acc + val, 0) /
            numericValues.length;
          // .toLocaleString("en-US", {
          //   minimumFractionDigits: 2,
          //   maximumFractionDigits: 2,
          // })
          return {
            categoryValue: category.categoryValue,
            valueFieldValue: avgValue, // Trung bình các giá trị trong valueFieldValue
          };
        });
      } else if (functionType === "Count") {
        // Đếm số lượng các phần tử trong valueFieldValue cho từng categoryValue
        chartData = groupped.map((category) => {
          const countValue = category.valueFieldValue.length;
          // .toLocaleString(
          //   "en-US",
          //   {
          //     minimumFractionDigits: 0,
          //     maximumFractionDigits: 0,
          //   }
          // )
          return {
            categoryValue: category.categoryValue,
            valueFieldValue: countValue, // Số lượng phần tử trong valueFieldValue
          };
        });
      }
      return generateChartOptions({
        chartType: type,
        titleData: {
          title: title,
          category: category,
          valueField: valueField,
        },
        data: {
          categoryValue: chartData.map((val) => val.categoryValue),
          valueFieldValue: chartData.map((val) => val.valueFieldValue),
        },
      });
      // return 1;
    } else if (type.toLowerCase().includes("table")) {
      // Chuẩn bị dữ liệu theo định dạng phù hợp cho Table MUI
      // Chuẩn bị cột (columns) và hàng (rows)
      const columns = [
        { field: "categoryValue", headerName: category, flex: 2, width: 200 },
        {
          field: "valueFieldValue",
          headerName: valueField,
          flex: 1,
          width: 150,
        },
      ];
      let rows;
      // console.log(groupped);
      if (functionType === "Sum") {
        // Tính tổng các valueFieldValue cho từng categoryValue
        rows = groupped.map((category) => {
          const sumValue = category.valueFieldValue
            .map((val) => parseFloat(val) || 0) // Chuyển đổi chuỗi thành số, nếu không phải số thì trả về 0
            .reduce((acc, val) => acc + val, 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          return {
            id: category.id,
            categoryValue: category.categoryValue,
            valueFieldValue: sumValue, // Tổng các giá trị trong valueFieldValue
          };
        });
      } else if (functionType === "Average") {
        // Tính trung bình các valueFieldValue cho từng categoryValue
        rows = groupped.map((category) => {
          const numericValues = category.valueFieldValue.map(
            (val) => parseFloat(val) || 0
          ); // Chuyển đổi chuỗi thành số, nếu không phải số thì trả về 0
          const avgValue = (
            numericValues.reduce((acc, val) => acc + val, 0) /
            numericValues.length
          ).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return {
            id: category.id,
            categoryValue: category.categoryValue,
            valueFieldValue: avgValue, // Trung bình các giá trị trong valueFieldValue
          };
        });
      } else if (functionType === "Count") {
        // Đếm số lượng các phần tử trong valueFieldValue cho từng categoryValue
        rows = groupped.map((category) => {
          const countValue = category.valueFieldValue.length.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          );
          return {
            id: category.id,
            categoryValue: category.categoryValue,
            valueFieldValue: countValue, // Số lượng phần tử trong valueFieldValue
          };
        });
      }

      // console.log(rows);
      // rows = groupByCategory(rows);
      // Trả về dữ liệu phù hợp để hiển thị trong bảng
      return { columns, rows };
      // Các xử lý khác nếu không phải là "table"
    } else {
      let values = [];
      // console.log(groupped);
      // console.log(mappedOrders);
      switch (functionType) {
        case "Sum":
          data = groupped
            .flatMap((val) => val.valueFieldValue) // Trải phẳng các mảng valueFieldValue
            .filter((val) => val !== null) // Lọc các giá trị null
            .reduce((acc, val) => acc + val, 0) // Tính tổng
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          // console.log(data);

          break;
        case "Count":
          data = mappedOrders.length;
          break;
        default:
          data = values;
      }
    }

    return data;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Revenue</Typography>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Visualization
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenFilterDialog} // Thêm logic mở filter dialog
          >
            Add Filter
          </Button>
        </Grid> */}
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* AddVisualizationDialog */}
      {openDialog && (
        <AddVisualizationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onAddVisualization={handleSaveVisualization}
        />
      )}

      {/* AddFilterDialog */}
      {openFilterDialog && (
        <AddFilterDialog
          open={openFilterDialog}
          onClose={handleCloseFilterDialog}
        />
      )}
      <Grid container sx={{ m: 0 }}>
        {/* {visualizations.map((viz) =>
          console.log(calculateVisualizationData(orders, viz, products))
        )} */}

        {visualizations.map((viz, index) => (
          <Visualization
            key={index}
            viz={viz}
            index={index}
            data={calculateVisualizationData(filteredData, viz, products)}
            handleRemove={() => handleRemove(index)} // Hàm để xoá visualization
          />
        ))}
      </Grid>
    </div>
  );
};

export default Revenue;
