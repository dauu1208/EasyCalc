# EasyCalc Mobile

Đây là phiên bản **React Native + Expo + TypeScript** của EasyCalc, được chuyển từ bản React Web trước đó để hướng tới Android/iOS và App Store.

## Công nghệ

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- expo-sqlite
- Không cần backend ở phiên bản hiện tại
- Dữ liệu lịch sử được lưu trong SQLite trên thiết bị

Expo SDK 57 hiện dùng React Native 0.86 và yêu cầu Node.js 22.13.x trở lên theo tài liệu Expo. `expo-sqlite` cung cấp database SQLite được lưu bền vững qua các lần mở lại app.

## 1. Cài Node.js

Cài Node.js phiên bản phù hợp với Expo SDK 57.

Kiểm tra:

```bash
node -v
npm -v
```

## 2. Cài package

Mở terminal trong thư mục project:

```bash
npm install
```

Nếu Expo báo lệch phiên bản dependency:

```bash
npx expo install --fix
```

## 3. Chạy thử

```bash
npx expo start
```

Sau đó:

- Nhấn `a` để mở Android Emulator.
- Hoặc quét QR bằng Expo Go nếu môi trường của bạn hỗ trợ.
- Có thể nhấn `w` để chạy bản web thử giao diện.

## 4. Android

Nếu muốn build native local:

```bash
npx expo run:android
```

Cần Android Studio và Android SDK/Emulator.

## 5. iOS

Nếu có Mac + Xcode:

```bash
npx expo run:ios
```

## 6. Build App Store

Cài EAS CLI:

```bash
npm install -g eas-cli
```

Đăng nhập:

```bash
eas login
```

Thiết lập project:

```bash
eas build:configure
```

Build iOS:

```bash
eas build --platform ios
```

Sau khi build xong, submit:

```bash
eas submit --platform ios
```

Bạn cần Apple Developer Account để phát hành App Store.

## 7. Trước khi đưa lên Store

Trong `app.json`, đổi:

```json
"bundleIdentifier": "com.yourcompany.easycalc"
```

và:

```json
"package": "com.yourcompany.easycalc"
```

thành identifier riêng của bạn, ví dụ:

```text
com.tencongty.easycalc
```

Không dùng identifier của người khác.

Bạn cũng cần thêm icon/app splash và hoàn thiện App Store metadata.

## Chức năng hiện có

- Trang chủ
- Tạo mới: tên, ngày, thực phẩm, đơn vị, ghi chú
- Bảng tính từng lần
- Cộng, trừ, nhân, chia
- Tự động tính kết quả từng dòng
- Tổng cuối cùng
- Thêm/xóa/sửa giá trị
- Lưu dữ liệu vào SQLite
- Lịch sử
- Tìm kiếm
- Lọc hôm nay/tháng này
- Xem chi tiết
- Chỉnh sửa bảng cũ
- Xóa lịch sử
- Cài đặt giao diện
- Cỡ chữ
- Đơn vị
- Chế độ tối/âm thanh là phần UI prototype, có thể hoàn thiện thêm

## Cấu trúc

```text
app/
  _layout.tsx
  index.tsx
  new.tsx
  calculator.tsx
  saved.tsx
  history.tsx
  history/[id].tsx
  settings.tsx

src/
  components/
  context/
  db/
  screens/
  utils/
  theme.ts
  types.ts
```

## Backend

Phiên bản này **chưa có backend/server**. Đây là chủ ý thiết kế.

Nếu app chỉ cần lưu dữ liệu trên một điện thoại thì SQLite là đủ.

Nếu sau này cần:
- đăng nhập
- đồng bộ iPhone/Android
- nhiều nhân viên dùng chung dữ liệu
- sao lưu cloud

thì có thể thêm backend/API sau mà không cần bỏ toàn bộ UI hiện tại.
