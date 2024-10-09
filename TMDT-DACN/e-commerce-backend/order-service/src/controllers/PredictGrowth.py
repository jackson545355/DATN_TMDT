import requests
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import datetime

def get_data_from_api():
    products_response = requests.get("http://localhost:3002/products/getAll")
    orders_response = requests.get("http://localhost:3003/orders/all")

    if products_response.status_code == 200 and orders_response.status_code == 200:
        products_data = products_response.json()["products"]
        orders_data = orders_response.json()["orders"]
        return products_data, orders_data
    else:
        raise Exception("Failed to fetch data from API")

def process_data(products_data, orders_data):
    # Tạo DataFrame từ dữ liệu orders
    orders_df = pd.DataFrame(orders_data)

    # Chuyển đổi cột 'createdAt' thành kiểu datetime và chuẩn hóa timezone
    orders_df['createdAt'] = pd.to_datetime(orders_df['createdAt']).dt.tz_convert(None)

    # Lọc dữ liệu từ ngày 15/7
    start_date = pd.to_datetime("2024-07-15")
    orders_df = orders_df[orders_df['createdAt'] >= start_date]

    # Tạo cột 'date' từ 'createdAt' trong orders_df
    orders_df['date'] = orders_df['createdAt'].dt.date

    # Tính tổng số sản phẩm đã bán trong mỗi ngày
    orders_df['total_stock'] = orders_df['products'].apply(lambda products: sum([item['stock'] for item in products]))

    # Tính tổng số sản phẩm đã bán cho mỗi ngày
    daily_sales = orders_df.groupby('date')['total_stock'].sum().reset_index(name='sales')

    return daily_sales

def prepare_features(daily_sales):
    # Tạo các đặc trưng từ cột 'date'
    daily_sales['day_of_week'] = pd.to_datetime(daily_sales['date']).dt.dayofweek
    daily_sales['week_of_year'] = pd.to_datetime(daily_sales['date']).dt.isocalendar().week
    daily_sales['day_of_year'] = pd.to_datetime(daily_sales['date']).dt.dayofyear
    
    return daily_sales

def train_and_predict(daily_sales):
    # Chuẩn bị dữ liệu huấn luyện
    X_train = daily_sales[['day_of_week', 'week_of_year', 'day_of_year']]
    y_train = daily_sales['sales']

    # Khởi tạo mô hình hồi quy tuyến tính
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Dự đoán cho 7 ngày tiếp theo
    today = datetime.date.today()
    days_to_predict = [(today + datetime.timedelta(days=i)) for i in range(1, 8)]
    future_df = pd.DataFrame({
        'date': days_to_predict,
        'day_of_week': [date.weekday() for date in days_to_predict],
        'week_of_year': [date.isocalendar()[1] for date in days_to_predict],
        'day_of_year': [date.timetuple().tm_yday for date in days_to_predict]
    })

    # Dự đoán số lượng sản phẩm bán ra
    future_df['predicted_products'] = model.predict(future_df[['day_of_week', 'week_of_year', 'day_of_year']])
    
    return future_df

def main():
    products_data, orders_data = get_data_from_api()
    daily_sales = process_data(products_data, orders_data)
    daily_sales = prepare_features(daily_sales)
    
    # Dự đoán cho 7 ngày tiếp theo
    predicted_sales = train_and_predict(daily_sales)
    
    # In kết quả dưới dạng JSON để Node.js có thể đọc được
    print(predicted_sales.to_json(date_format='iso', orient='records'))

if __name__ == "__main__":
    main()
