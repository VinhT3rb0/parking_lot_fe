# Hệ Thống Quản Lý Bãi Đỗ Xe

## Giới thiệu
Hệ thống quản lý bãi đỗ xe là một ứng dụng web cho phép quản lý và theo dõi hoạt động của các bãi đỗ xe. Hệ thống hỗ trợ các chức năng như gửi xe, lấy xe, quản lý bãi đỗ, và theo dõi doanh thu.

## Tính năng chính

### 1. Quản lý bãi đỗ xe
- Xem danh sách các bãi đỗ xe
- Thêm mới bãi đỗ xe
- Chỉnh sửa thông tin bãi đỗ xe
- Xóa bãi đỗ xe
- Lọc bãi đỗ xe theo:
  - Tên bãi đỗ
  - Loại xe được phép đỗ
  - Có mái che hay không
  - Trạng thái hoạt động

### 2. Gửi xe
- Chụp ảnh biển số xe tự động
- Nhận diện biển số xe bằng AI
- Chọn loại xe
- Tạo mã xe tự động
- Lưu thông tin gửi xe

### 3. Lấy xe
- Nhập mã xe hoặc biển số xe
- Chụp ảnh biển số xe khi lấy xe
- Tính phí gửi xe tự động
- Xác nhận lấy xe

### 4. Quản lý nhân viên
- Xem danh sách nhân viên
- Thêm mới nhân viên
- Chỉnh sửa thông tin nhân viên
- Xóa nhân viên
- Phân công ca làm việc

### 5. Báo cáo và thống kê
- Xem doanh thu theo bãi đỗ
- Xem doanh thu theo thời gian
- Thống kê số lượng xe gửi/lấy
- Báo cáo chi tiết

## Cài đặt và Chạy Project

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Git

### Các bước cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd parking-lot-fe
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Tạo file môi trường:
- Tạo file `.env` trong thư mục gốc
- Thêm các biến môi trường cần thiết:
```
REACT_APP_API_URL=http://localhost:8080
```

4. Chạy project:
```bash
npm start
# hoặc
yarn start
```

## Cấu trúc Project

```
src/
├── api/                    # API endpoints và interfaces
├── components/            # Components dùng chung
├── contexts/             # React contexts
├── hooks/               # Custom hooks
├── pages/              # Các trang chính của ứng dụng
├── utils/             # Các utility functions
└── config.ts         # Cấu hình chung
```

## Hướng dẫn sử dụng

### Quản lý bãi đỗ xe
1. Đăng nhập với tài khoản admin
2. Vào mục "Quản lý bãi đỗ"
3. Sử dụng các nút chức năng để thêm/sửa/xóa bãi đỗ
4. Sử dụng bộ lọc để tìm kiếm bãi đỗ

### Gửi xe
1. Vào mục "Gửi xe"
2. Chọn bãi đỗ xe
3. Nhấn nút "Gửi xe"
4. Chụp ảnh biển số xe
5. Kiểm tra và xác nhận thông tin
6. Lưu mã xe được cấp

### Lấy xe
1. Vào mục "Lấy xe"
2. Nhập mã xe hoặc biển số xe
3. Chụp ảnh biển số xe khi lấy xe
4. Xác nhận thông tin và thanh toán

## API Documentation

### Endpoints chính

#### Bãi đỗ xe
- GET `/api/parking-lots` - Lấy danh sách bãi đỗ
- POST `/api/parking-lots` - Thêm bãi đỗ mới
- PUT `/api/parking-lots/{id}` - Cập nhật bãi đỗ
- DELETE `/api/parking-lots/{id}` - Xóa bãi đỗ

#### Gửi/Lấy xe
- POST `/api/parking/entry` - Gửi xe
- POST `/api/parking/exit/{code}` - Lấy xe
- POST `/api/parking/recognize` - Nhận diện biển số xe

## Bảo mật
- Sử dụng JWT cho xác thực
- Mã hóa mật khẩu
- Phân quyền người dùng
- Bảo vệ các endpoints API


