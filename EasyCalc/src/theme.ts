import { Platform } from "react-native";

// Bảng màu tông đỏ hồng pastel, đồng bộ toàn app
export const colors = {
  primary: "#E0445F",        // đỏ hồng chính — nút chính, phép "Cộng", tab active
  primaryDark: "#9F1D3E",    // đỏ hồng đậm — tổng tiền/kết quả, chữ nhấn mạnh
  primarySoft: "#FCE4EA",    // hồng pastel nhạt — thẻ tổng, nền icon

  magenta: "#C2185B",        // đỏ magenta — phép "Trừ", icon/nút xoá (danger)
  magentaSoft: "#FBE2EA",    // nền hồng nhạt cho nút xoá

  rosePink: "#E0568C",       // hồng tươi — phép "Nhân", icon sửa/thêm dòng
  rosePinkSoft: "#FCE7F1",   // nền hồng nhạt cho nút sửa/thêm dòng

  peach: "#F2A154",          // cam đào ấm — phép "Chia" (điểm nhấn ấm trong tông hồng đỏ)
  mauve: "#B4667A",          // hồng mận — icon phụ (vd. mục Lịch sử ở Trang chủ)

  background: "#FFF6F8",     // nền toàn app, hồng trắng rất nhạt
  white: "#FFFFFF",

  text: "#3B1F2B",           // chữ chính, nâu mận đậm
  textStrong: "#5A2A3C",     // chữ phụ đậm (thay cho slate cũ)
  textSoft: "#9C7784",       // chữ phụ nhạt, nhãn

  border: "#F5D9E1",         // viền hồng nhạt
  borderInput: "#F0C3D2",    // viền ô nhập liệu, đậm hơn chút để dễ nhìn
  surfaceMuted: "#FCEEF2",   // nền phụ nhạt (bảng, chip, nút phụ)
  muted: "#C9909F"           // icon mờ, placeholder, track tắt
};

export const shadow = Platform.select({
  ios: {
    shadowColor: "#9F1D3E",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  android: { elevation: 2 },
  default: {}
});

export const spacing = {
  page: 16,
  card: 16,
  radius: 16
};
