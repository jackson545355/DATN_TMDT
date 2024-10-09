// import React, { useEffect, useState } from "react";
// import ApexCharts from "react-apexcharts";
// import { Box } from "@mui/material";

// export default function Channels({ orders }) {
//   const [channelData, setChannelData] = useState([]);

//   useEffect(() => {
//     // Process the orders to get data for channels
//     const channels = [
//       { name: "Online Store", data: [] },
//       { name: "Amazon Marketplace", data: [] },
//       { name: "eBay Marketplace", data: [] },
//       { name: "Physical Store", data: [] },
//       { name: "Distributors", data: [] },
//     ];

//     // Process orders to channel data
//     // orders.forEach(order => {
//     //   const channelIndex = channels.findIndex(channel => channel.name === order.channel);
//     //   if (channelIndex !== -1) {
//     //     channels[channelIndex].data.push(order.total);
//     //   }
//     // });

//     setChannelData(channels);
//   }, [orders]);

//   const options3 = {
//     chart: {
//       id: "basic-bar",
//       type: "bar",
//       stacked: true,
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     legend: {
//       position: "right",
//       horizontalAlign: "center",
//       offsetY: 0,
//     },
//     title: {
//       text: "Channels",
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "10%",
//         horizontal: false,
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//     xaxis: {
//       categories: ["Mon", "Thu", "Wed", "The", "Fri", "Sat", "Sun"],
//     },
//   };

//   return (
//     <Box
//       sx={{
//         margin: 3,
//         bgcolor: "white",
//         borderRadius: 2,
//         padding: 3,
//         height: "95%",
//       }}
//     >
//       <ApexCharts
//         options={options3}
//         series={channelData}
//         type="bar"
//         width="100%"
//         height="320"
//       />
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box } from "@mui/material";

const chartRules = {
  "Line Chart": {
    categories: [
      "Ngày đặt hàng",
      "Ngày gửi hàng",
      "Thời gian đơn hàng được thanh toán",
    ],
    values: ["Số lượng", "Giá gốc", "Giá ưu đãi", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Average"],
  },
  "Bar Chart": {
    categories: ["Tên sản phẩm", "Tên phân loại hàng", "Người mua"],
    values: ["Số lượng", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Count"],
  },
  "Pie Chart": {
    categories: ["Tên phân loại hàng", "Đơn vị vận chuyển"],
    values: ["Số lượng"],
    functions: ["Count", "Count (Distinct)"],
  },
  "Column Chart": {
    categories: ["Tên sản phẩm", "Ngày đặt hàng"],
    values: ["Tổng giá bán (sản phẩm)", "Số lượng"],
    functions: ["Sum", "Average"],
  },
  Table: {
    categories: ["Tên sản phẩm", "Người mua", "Đơn vị vận chuyển"],
    values: ["Số lượng", "Giá gốc", "Giá ưu đãi", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Count", "Average"],
  },
  Card: {
    categories: ["Người mua", "Đơn vị vận chuyển"],
    values: ["Tổng giá bán (sản phẩm)", "Số lượng"],
    functions: ["Sum", "Count"],
  },
};

const fieldMapping = {
  "Mã đơn hàng": "_id",
  "Ngày đặt hàng": "createdAt",
  "Ngày gửi hàng": "shippingDate",
  "Thời gian đơn hàng được thanh toán": "paymentDate",
  "Tên sản phẩm": "productName",
  "Số lượng": "stock",
  "Giá gốc": "originalPrice",
  "Giá ưu đãi": "discountedPrice",
  "Tổng giá bán (sản phẩm)": "total",
  "Người mua": "user",
  "Tên phân loại hàng": "categoryName",
  "Đơn vị vận chuyển": "shippingUnit",
};

// Hàm để ánh xạ các giá trị nhập vào thành tên field trong DB
const mapFieldsToDB = (inputCategory, inputValueField) => {
  const mappedCategory = fieldMapping[inputCategory] || inputCategory;
  const mappedValueField = fieldMapping[inputValueField] || inputValueField;

  return {
    category: mappedCategory,
    valueField: mappedValueField,
  };
};

// Hàm chính để tạo options và series tùy thuộc vào type của chart
const generateChartOptions = ({ chartType, category, valueField, functionType }) => {
  const { category: mappedCategory, valueField: mappedValueField } = mapFieldsToDB(category, valueField);
  console.log(category, mappedCategory);
  const dummyData = {
    "Line Chart": {
      categories: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5'],
      seriesData: [
        {
          name: 'Số lượng sản phẩm',
          data: [100, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300, 200, 150, 250, 300] // Dữ liệu cho dòng 1
        },
        {
          name: 'Giá gốc',
          data: [1000, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500, 1200, 1100, 1300, 1500] // Dữ liệu cho dòng 2
        },
        {
          name: 'Tổng giá bán (sản phẩm)',
          data: [900, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400, 1100, 1050, 1250, 1400] // Dữ liệu cho dòng 3
        }
      ]
    },
    "Bar Chart": {
      categories: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm B', 'Sản phẩm C'],
      seriesData: [{
        name: 'Net Profit',
        data: [44,13,20,54,94,84,20,10,40,10,20,100,120,95,9,25,28,29,27,10]
      }],
    },
    "Pie Chart": {
      labels: ['Phân loại A', 'Phân loại B', 'Phân loại C'],
      seriesData: [35, 45, 20]
    },
    "Column Chart": {
      categories: ['Ngày 1', 'Ngày 2', 'Ngày 3'],
      seriesData: [{
        name: 'Net Profit',
        data: [44, 55, 57]
      }, 
      // {
      //   name: 'Revenue',
      //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      // }, {
      //   name: 'Free Cash Flow',
      //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      // }
      ],
    },
  };

  switch (chartType) {
    case "Line Chart":
      return {
        options: {
          chart: {
            id: 'basic-line',
            type: 'line',
            height: 350
          },
          xaxis: {
            categories: dummyData[chartType].categories, // Trục X là các ngày
            title: { text: category }
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Xu hướng theo ngày',
            align: 'left'
          },
          yaxis: {
            title: { text: mappedValueField }
          },
          // dataLabels: {
          //   enabled: true // Hiển thị nhãn dữ liệu trên mỗi điểm
          // },
          tooltip: {
            y: {
              formatter: (val) => `${val} sản phẩm`, // Định dạng hiển thị trong tooltip
            }
          }
        },
        series: dummyData[chartType].seriesData // Nhiều dòng dữ liệu
      };

      case "Bar Chart":
        return {
          options: {
            chart: {
              type: 'bar',  // Sử dụng 'bar' cho biểu đồ thanh ngang
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: true,  // Hiển thị thanh theo chiều ngang
              }
            },
            dataLabels: {
              enabled: false  // Tắt hiển thị giá trị trên mỗi thanh
            },
            xaxis: {
              categories: dummyData[chartType].categories || ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'],  // Dữ liệu cho trục X
              title: { text: category }
            },
            yaxis: {
              title: { text: mappedValueField }
            },
            title: {
              text: 'Số lượng bán theo sản phẩm',  // Tiêu đề biểu đồ
              align: 'left'
            },
            tooltip: {
              y: {
                formatter: (val) => `${val} sản phẩm`  // Định dạng tooltip cho dữ liệu sản phẩm
              }
            }
          },
          series: dummyData[chartType].seriesData
        };
      

    case "Pie Chart":
      return {
        options: {
          chart: {
            type: 'pie',
            height: 350
          },
          labels: dummyData[chartType].labels,
          title: {
            text: 'Tỷ lệ sản phẩm theo phân loại',
            align: 'left'
          }
        },
        series: dummyData[chartType].seriesData
      };

      case "Column Chart":
        return {
          options: {
            chart: {
              type: 'bar',
              height: 350,
              width: '1000px', // Điều chỉnh width để tạo không gian cuộn
            },
            plotOptions: {
              bar: {
                horizontal: false, // Sử dụng 'true' cho thanh ngang
              },
            },
            xaxis: {
              categories: [
                'Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E', 
                 'Sản phẩm M', 'Sản phẩm N', 'Sản phẩm O'
              ],
              // tickAmount: 5, // Số lượng nhãn hiển thị trên trục x (giới hạn số nhãn)
            },
            dataLabels: {
              enabled: false
            },
            yaxis: {
              title: {
                text: 'Số lượng'
              }
            },
            series: [
              {
                name: 'Số lượng',
                data: [100,  100, 200, 150, 250, 300]
              }
            ],
            tooltip: {
              y: {
                formatter: function (val) {
                  return `${val} sản phẩm`;
                }
              }
            }
          },
          series: [
            {
              name: 'Số lượng',
              data: [100, 200, 150, 250, 300, 100]
            }
          ]
        };
      
      
    case "Table":
      return {
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          xaxis: {
            categories: dummyData[chartType].categories,
            title: { text: category }
          },
          title: {
            text: 'Dữ liệu theo bảng',
            align: 'left'
          }
        },
        series: [{
          name: mappedValueField,
          data: dummyData[chartType].seriesData
        }]
      };

    case "Card":
      return {
        options: {
          chart: {
            type: 'radialBar',
            height: 350
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: { fontSize: '22px' },
                value: { fontSize: '16px' },
                total: {
                  show: true,
                  label: mappedValueField,
                  formatter: () => dummyData[chartType].seriesData[0]
                }
              }
            }
          },
          title: {
            text: 'Thống kê theo card',
            align: 'left'
          }
        },
        series: dummyData[chartType].seriesData
      };

    default:
      return null;
  }
};


// Hàm xử lý tổng hợp
const createChart = (
  chartType,
  inputCategory,
  inputValueField,
  functionType
) => {
  const rule = chartRules[chartType];
  console.log(rule);
  if (!rule) {
    throw new Error(`Loại biểu đồ không hợp lệ: ${chartType}`);
  }

  if (
    !rule.categories.includes(inputCategory) ||
    !rule.values.includes(inputValueField)
  ) {
    throw new Error(
      `Category hoặc ValueField không hợp lệ: ${inputCategory}, ${inputValueField}`
    );
  }

  return generateChartOptions({
    chartType,
    category: inputCategory,
    valueField: inputValueField,
    functionType,
  });
};

export default function Channels({
  chartType ,
  category ,
  valueField ,
  functionType,
}) {
  const chartData = createChart(chartType, category, valueField, functionType);
  console.log(chartType.replace(" Chart", "").toLowerCase());
  if (chartType.replace(" Chart", "").toLowerCase() == 'column') {
    chartType = "Bar Chart";
  }
  console.log(chartData.options, chartData.series);

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      {chartData ? (
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type={chartType.replace(" Chart", "").toLowerCase()} // Loại bỏ "Chart" và chuyển thành chữ thường
          width="100%"
          height="350"
        />
      ) : (
        <p>Biểu đồ không hợp lệ</p>
      )}
    </Box>
  );
}
