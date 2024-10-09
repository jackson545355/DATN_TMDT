import requests
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import datetime
import json

def get_data_from_api():
    orders_response = requests.get("http://localhost:3003/orders/all")
    if orders_response.status_code == 200:
        orders_data = orders_response.json()["orders"]
        return orders_data
    else:
        raise Exception("Failed to fetch data from API")

def process_data(orders_data):
    # Lọc ra các đơn hàng đã hoàn thành
    completed_orders = [order for order in orders_data if order["status"] == "completed"]
    completed_orders_df = pd.DataFrame(completed_orders)

    # Chuyển đổi cột 'createdAt' thành kiểu datetime và chuẩn hóa timezone
    completed_orders_df['createdAt'] = pd.to_datetime(completed_orders_df['createdAt']).dt.tz_convert(None)

    # Lọc dữ liệu từ ngày 15/7
    start_date = pd.to_datetime("2024-07-15")
    completed_orders_df = completed_orders_df[completed_orders_df['createdAt'] >= start_date]

    # Tạo cột 'date' từ 'createdAt' trong completed_orders_df
    completed_orders_df['date'] = completed_orders_df['createdAt'].dt.date

    # Tính tổng doanh thu trong mỗi ngày
    daily_revenue = completed_orders_df.groupby('date')['total'].sum().reset_index(name='revenue')

    return daily_revenue

def prepare_features(daily_revenue):
    # Tạo các đặc trưng từ cột 'date'
    daily_revenue['day_of_week'] = pd.to_datetime(daily_revenue['date']).dt.dayofweek
    daily_revenue['week_of_year'] = pd.to_datetime(daily_revenue['date']).dt.isocalendar().week
    daily_revenue['day_of_year'] = pd.to_datetime(daily_revenue['date']).dt.dayofyear

    return daily_revenue

def train_and_predict(daily_revenue):
    # Chuẩn bị dữ liệu huấn luyện
    X_train = daily_revenue[['day_of_week', 'week_of_year', 'day_of_year']]
    y_train = daily_revenue['revenue']

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

    # Dự đoán doanh thu
    future_df['predicted_revenue'] = model.predict(future_df[['day_of_week', 'week_of_year', 'day_of_year']])
    
    # Chuyển các giá trị âm về 0 (nếu cần thiết)
    future_df['predicted_revenue'] = future_df['predicted_revenue'].apply(lambda x: max(0, x))
    
    return future_df

def main():
    orders_data = get_data_from_api()
    daily_revenue = process_data(orders_data)
    daily_revenue = prepare_features(daily_revenue)
    
    # Dự đoán cho 7 ngày tiếp theo
    predicted_revenue = train_and_predict(daily_revenue)
    
    # In kết quả dưới dạng JSON để Node.js có thể đọc được
    print(predicted_revenue.to_json(date_format='iso', orient='records'))

if __name__ == "__main__":
    main()
