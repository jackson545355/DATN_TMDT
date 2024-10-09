FROM python:3.8

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép tất cả tệp vào thư mục làm việc
COPY . .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Mở cổng mà Flask sẽ lắng nghe
EXPOSE 3006

# Thiết lập lệnh khởi chạy ứng dụng Flask
CMD ["python", "app.py"]
