# CalcNote (EasyCalc Mobile)

Ứng dụng ghi chép & tính toán nhanh, xây dựng bằng **React Native + Expo + TypeScript**. Đây là bản chuyển đổi từ phiên bản React Web trước đó sang mobile (Android/iOS), dữ liệu được lưu trực tiếp trên thiết bị bằng SQLite — **không cần backend/server**.

## Tính năng chính

- **Trang chủ** — điều hướng nhanh tới các chức năng.
- **Tạo phép tính mới** — nhập tên, ngày, loại thực phẩm/hàng hóa, đơn vị, ghi chú.
- **Bảng tính** — cộng, trừ, nhân, chia theo từng dòng, tự động ra kết quả và tổng cuối.
- **Thêm/xóa/sửa** giá trị trong bảng tính.
- **Lịch sử** — tìm kiếm, lọc theo hôm nay/tháng này, xem chi tiết, chỉnh sửa lại bảng cũ, xóa.
- **Bán hàng (Sales)** — tạo đơn hàng với danh sách sản phẩm, số lượng, đơn giá và tổng tiền.
- **Cài đặt** — cỡ chữ.
- Toàn bộ dữ liệu lưu persistent trong **SQLite** trên máy, không mất khi tắt app.

## Công nghệ sử dụng

| Thành phần | Phiên bản |
|---|---|
| Expo SDK | 57 |
| React Native | 0.86 |
| React | 19.2 |
| Expo Router | 57 |
| TypeScript | 6.0 |
| expo-sqlite | 57 |

> Expo SDK 57 yêu cầu **Node.js 22.13.x trở lên**.

## Cấu trúc thư mục

```text
EasyCalc/
├── app/                     # Expo Router — định nghĩa route/màn hình
│   ├── _layout.tsx
│   ├── index.tsx            # Trang chủ
│   ├── new.tsx               # Tạo phép tính mới
│   ├── calculator.tsx        # Màn hình tính toán
│   ├── saved.tsx              # Danh sách đã lưu
│   ├── history.tsx            # Lịch sử
│   ├── history/[id].tsx       # Chi tiết một mục lịch sử
│   ├── sales.tsx               # Bán hàng
│   └── settings.tsx            # Cài đặt
├── src/
│   ├── components/           # Component dùng chung (Page, PageHeader, BottomTabs, AppText, PrimaryButton)
│   ├── context/                # AppContext, SettingsContext (React Context state)
│   ├── db/                      # database.ts — thao tác SQLite
│   ├── screens/                  # Nội dung từng màn hình (Home, New, Calculator, History, HistoryDetail, Sales, Settings, Saved)
│   ├── utils/                    # calculation.ts — logic tính toán
│   ├── theme.ts
│   └── types.ts                  # Định nghĩa kiểu dữ liệu (Entry, Calculation, PriceItem, SaleItem, SalesOrder...)
├── assets/                    # Icon, splash, favicon
├── app.json                   # Cấu hình Expo
├── eas.json                   # Cấu hình EAS Build
└── package.json
```

## Yêu cầu môi trường

- Node.js ≥ 22.13.x
- npm
- Với build native: Android Studio (Android) hoặc Xcode trên macOS (iOS)

Kiểm tra:

```bash
node -v
npm -v
```

## Cài đặt

```bash
cd EasyCalc
npm install
```

Nếu Expo báo lệch phiên bản dependency:

```bash
npx expo install --fix
```

## Chạy thử

```bash
npx expo start
```

Sau đó trong terminal Expo:

- Nhấn `a` → mở Android Emulator
- Quét mã QR bằng ứng dụng **Expo Go** để chạy trên điện thoại thật
- Nhấn `w` → chạy thử trên trình duyệt (web)

## Chạy native

**Android** (cần Android Studio + SDK/Emulator):

```bash
npx expo run:android
```

**iOS** (cần máy Mac + Xcode):

```bash
npx expo run:ios
```

## Kiểm tra kiểu dữ liệu TypeScript

```bash
npm run typecheck
```

## Build & phát hành lên App Store / Play Store

1. Cài EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Đăng nhập và cấu hình project:

   ```bash
   eas login
   eas build:configure
   ```

3. Build:

   ```bash
   eas build --platform android
   eas build --platform ios
   ```

4. Nộp lên store:

   ```bash
   eas submit --platform ios
   ```

   Cần có **Apple Developer Account** để phát hành lên App Store.

### Trước khi phát hành

Trong `app.json`, đổi `bundleIdentifier` (iOS) và `package` (Android) hiện tại (`com.nguyenngocminh.CalcNote`) thành identifier riêng của bạn, ví dụ `com.tencongty.easycalc`. Không sử dụng identifier của người khác. Chuẩn bị đầy đủ icon, splash screen và metadata cho store.

## Về backend

Phiên bản hiện tại **chưa có backend/server** — đây là lựa chọn thiết kế có chủ đích. Nếu chỉ cần lưu dữ liệu trên một thiết bị, SQLite là đủ.

Nếu về sau cần các tính năng như:

- Đăng nhập tài khoản
- Đồng bộ dữ liệu giữa nhiều thiết bị (iPhone/Android)
- Nhiều nhân viên dùng chung dữ liệu
- Sao lưu lên cloud

thì có thể bổ sung backend/API mà không cần viết lại toàn bộ phần UI hiện có.
