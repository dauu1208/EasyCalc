# EasyCalc — chạy trên Windows + Android Emulator

Mở terminal tại thư mục project, ví dụ:
`C:\EasyCacl\frontend`

## Cài package

```powershell
npm install
```

## Chạy Expo

```powershell
npx expo start
```

Mở Android Studio -> Device Manager -> Start emulator, rồi ở terminal Expo nhấn:

```text
a
```

Hoặc chạy native:

```powershell
npx expo run:android
```

## Nếu npm báo dependency conflict

```powershell
npx expo install --fix
npm install
```

## Kiểm tra TypeScript

```powershell
npm run typecheck
```

## Build iOS sau này

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
```

## Lưu ý

Project này dùng SQLite để lưu lịch sử ngay trên thiết bị và chưa có backend/server.
