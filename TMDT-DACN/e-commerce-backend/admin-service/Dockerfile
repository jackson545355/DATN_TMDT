# Sử dụng Node.js image chính thức
FROM node:20

# Đặt thư mục làm việc của container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Đặt biến môi trường cho cổng
ENV PORT=3009

# Mở cổng mà service sẽ chạy
EXPOSE 3009

# Lệnh để chạy service với nodemon trong môi trường phát triển
# Thay thế CMD này bằng `npm run start` trong môi trường sản xuất
CMD ["npm", "run", "start"]