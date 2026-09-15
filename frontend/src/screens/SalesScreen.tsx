import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import Text from "../components/AppText";
import Page from "../components/Page";
import { useApp } from "../context/AppContext";
import type { PriceItem, SaleItem } from "../types";
import { colors, shadow } from "../theme";

const units = ["kg", "cái", "con", "phần"];

export default function SalesScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const { priceItems, loadingPrices, savePriceItem, deletePriceItem, saveSalesOrder } = useApp();

  // Bảng giá chỉ hiển thị danh sách. Form chỉ mở khi người dùng bấm "Thêm sản phẩm".
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUnit, setProductUnit] = useState("cái");
  const [customer, setCustomer] = useState("");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState("");
  const [savedOrderCustomer, setSavedOrderCustomer] = useState("");
  const [savedOrderTime, setSavedOrderTime] = useState("");
  const [savedOrderItems, setSavedOrderItems] = useState<SaleItem[]>([]);
  const [savedOrderTotal, setSavedOrderTotal] = useState(0);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Chỉ cộng các mặt hàng được thiết lập theo kg.
  const totalWeight = useMemo(
    () => cart.reduce((sum, item) => sum + (item.unit === "kg" ? item.quantity : 0), 0),
    [cart]
  );

  function resetForm() {
    setEditingId(null);
    setProductName("");
    setProductPrice("");
    setProductUnit("cái");
  }

  function openNewProduct() {
    resetForm();
    setShowForm(true);
  }

  async function submitProduct() {
    const price = Number(productPrice.replace(/[^0-9]/g, ""));
    if (!productName.trim() || !price || price < 0) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sản phẩm và giá bán hợp lệ.");
      return;
    }

    const item: PriceItem = {
      id: editingId || `price-${Date.now()}`,
      name: productName.trim(),
      price,
      unit: productUnit
    };

    await savePriceItem(item);
    resetForm();
    setShowForm(false);
  }

  function editProduct(item: PriceItem) {
    setEditingId(item.id);
    setProductName(item.name);
    setProductPrice(String(item.price));
    setProductUnit(item.unit);
    setShowForm(true);
  }

  async function removeProduct(item: PriceItem) {
    Alert.alert("Xóa sản phẩm?", `Bạn có chắc muốn xóa “${item.name}” khỏi bảng giá?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => deletePriceItem(item.id) }
    ]);
  }

  function addToCart(item: PriceItem) {
    setCart((current) => {
      const found = current.find((x) => x.id === item.id);
      if (found) {
        return current.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + stepFor(item) } : x
        );
      }
      return [...current, { ...item, quantity: stepFor(item) }];
    });
  }

  function changeQuantity(id: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: roundQuantity(item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function saveOrder() {
    if (!cart.length) {
      Alert.alert("Chưa có sản phẩm", "Hãy thêm ít nhất một sản phẩm vào đơn hàng.");
      return;
    }

    const orderItems = cart.map((item) => ({ ...item }));
    const orderTotal = total;
    const now = new Date();
    const orderId = `DH${String(Date.now()).slice(-6)}`;

    await saveSalesOrder(customer.trim(), orderItems, orderTotal);

    setSavedOrderId(orderId);
    setSavedOrderCustomer(customer.trim() || "Khách lẻ");
    setSavedOrderTime(now.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }));
    setSavedOrderItems(orderItems);
    setSavedOrderTotal(orderTotal);
    setShowOrderSuccess(true);
  }

  function closeOrderSuccess() {
    setShowOrderSuccess(false);
    setCart([]);
    setCustomer("");
  }

  const pricePanel = (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <View>
            <Text style={styles.panelTitle}>Bảng giá</Text>
            <Text style={styles.panelSubtitle}>Thiết lập tên món và giá bán</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={openNewProduct}>
        <Ionicons name="add-circle-outline" size={21} color="#fff" />
        <Text style={styles.primaryButtonText}>Thêm sản phẩm</Text>
      </Pressable>

      {showForm && (
        <View style={styles.formCard}>
          <View style={styles.formTitleRow}>
            <Text style={styles.formTitle}>{editingId ? "Chỉnh sửa sản phẩm" : "Sản phẩm mới"}</Text>
            <Pressable
              onPress={() => {
                resetForm();
                setShowForm(false);
              }}
              hitSlop={8}
            >
              <Ionicons name="close" size={21} color={colors.muted} />
            </Pressable>
          </View>

          <Text style={styles.label}>Tên sản phẩm</Text>
          <View style={styles.inputBox}>
            <Ionicons name="pricetag-outline" size={18} color={colors.rosePink} />
            <TextInput
              value={productName}
              onChangeText={setProductName}
              placeholder="Ví dụ: Đùi gà"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Giá bán</Text>
          <View style={styles.inputBox}>
            <Ionicons name="cash-outline" size={18} color={colors.rosePink} />
            <TextInput
              value={productPrice}
              onChangeText={setProductPrice}
              placeholder="45000"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text style={styles.currency}>đ</Text>
          </View>

          <Text style={styles.label}>Tính theo</Text>
          <View style={styles.unitRow}>
            {units.map((unit) => (
              <Pressable
                key={unit}
                style={[styles.unitChip, productUnit === unit && styles.unitChipActive]}
                onPress={() => setProductUnit(unit)}
              >
                <Text style={[styles.unitText, productUnit === unit && styles.unitTextActive]}>
                  {unit}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.formActions}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
            <Pressable style={styles.addProductButton} onPress={submitProduct}>
              <Text style={styles.addProductText}>
                {editingId ? "Lưu thay đổi" : "Thêm vào bảng giá"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.listTitle}>Sản phẩm đã thiết lập</Text>
      {loadingPrices ? (
        <Text style={styles.emptyText}>Đang tải bảng giá...</Text>
      ) : priceItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="pricetags-outline" size={30} color={colors.rosePink} />
          <Text style={styles.emptyTitle}>Chưa có sản phẩm</Text>
          <Text style={styles.emptyText}>Bấm “Thêm sản phẩm” để tạo món đầu tiên.</Text>
        </View>
      ) : (
        priceItems.map((item) => (
          <View style={styles.productRow} key={item.id}>
            <View style={styles.productIcon}>
              <Ionicons name="pricetag-outline" size={19} color={colors.rosePink} />
            </View>
            <Pressable style={{ flex: 1 }} onPress={() => addToCart(item)}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{formatMoney(item.price)} / {item.unit}</Text>
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => editProduct(item)}>
              <Ionicons name="create-outline" size={18} color={colors.rosePink} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => removeProduct(item)}>
              <Ionicons name="trash-outline" size={18} color={colors.magenta} />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );

  const salesPanel = (
    <View style={styles.panel}>
      <View style={styles.salesHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.salesBackSpacer} />
          <View>
            <Text style={styles.panelTitle}>Tính tiền bán hàng</Text>
            <Text style={styles.panelSubtitle}>Nhập số lượng để ra tổng</Text>
          </View>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="receipt-outline" size={21} color={colors.primary} />
        </View>
      </View>

      <View style={styles.customerBox}>
        <Ionicons name="person-outline" size={18} color={colors.rosePink} />
        <TextInput
          value={customer}
          onChangeText={setCustomer}
          placeholder="Tên khách hàng (không bắt buộc)"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      <View style={styles.saleList}>
        {priceItems.length === 0 ? (
          <View style={styles.salesEmpty}>
            <Ionicons name="cart-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>Bảng giá đang trống</Text>
            <Text style={styles.emptyText}>Thêm sản phẩm bên trái rồi bấm vào tên món để đưa vào đơn.</Text>
          </View>
        ) : (
          priceItems.map((item) => {
            const selected = cart.find((x) => x.id === item.id);
            const quantity = selected?.quantity || 0;
            const step = stepFor(item);

            return (
              <View style={[styles.saleRow, quantity > 0 && styles.saleRowActive]} key={item.id}>
                <Pressable style={{ flex: 1 }} onPress={() => addToCart(item)}>
                  <Text style={styles.saleName}>{item.name}</Text>
                  <Text style={styles.saleUnit}>{formatMoney(item.price)} / {item.unit}</Text>
                </Pressable>

                <View style={styles.quantityBox}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => quantity > 0 && changeQuantity(item.id, -step)}
                  >
                    <Ionicons
                      name="remove"
                      size={17}
                      color={quantity > 0 ? colors.primary : colors.muted}
                    />
                  </Pressable>
                  <TextInput
                    value={quantity === 0 ? "0" : formatQuantity(quantity)}
                    onChangeText={(text) => {
                      const normalized = text.replace(",", ".");

                      if (normalized === "") {
                        setCart((current) =>
                          current.map((cartItem) =>
                            cartItem.id === item.id
                              ? { ...cartItem, quantity: 0 }
                              : cartItem
                          )
                        );
                        return;
                      }

                      const value = Number(normalized);

                      if (!Number.isNaN(value) && value >= 0) {
                        setCart((current) => {
                          const exists = current.some(
                            (cartItem) => cartItem.id === item.id
                          );

                          if (exists) {
                            return current.map((cartItem) =>
                              cartItem.id === item.id
                                ? { ...cartItem, quantity: value }
                                : cartItem
                            );
                          }

                          // Cho phép gõ trực tiếp số lượng ngay cả khi
                          // sản phẩm chưa được thêm vào giỏ bằng nút +.
                          return [...current, { ...item, quantity: value }];
                        });
                      }
                    }}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                    style={styles.quantityInput}
                  />
                  <Pressable style={styles.quantityButton} onPress={() => addToCart(item)}>
                    <Ionicons name="add" size={17} color={colors.primary} />
                  </Pressable>
                </View>

                <Text style={styles.lineTotal}>
                  {quantity > 0 ? formatMoney(item.price * quantity) : "—"}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.totalLabel}>TỔNG TIỀN</Text>
          <Text style={styles.totalValue}>{formatMoney(total)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.totalLabel}>TỔNG SỐ CÂN NẶNG</Text>
          <Text style={styles.totalValue}>{formatWeight(totalWeight)}</Text>
          <Text style={styles.summaryHint}>Chỉ tính món theo kg</Text>
        </View>
      </View>

      <Pressable style={styles.saveButton} onPress={saveOrder}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveText}>Lưu đơn hàng</Text>
      </Pressable>
    </View>
  );

  const orderSuccessModal = (
    <Modal
      visible={showOrderSuccess}
      transparent
      animationType="fade"
      onRequestClose={closeOrderSuccess}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <Pressable style={styles.modalClose} onPress={closeOrderSuccess} hitSlop={8}>
            <Ionicons name="close" size={23} color={colors.textSoft} />
          </Pressable>

          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Lưu đơn hàng thành công!</Text>
          <Text style={styles.successSubtitle}>Đơn hàng đã được lưu vào hệ thống.</Text>

          <View style={styles.orderMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.metaLabel}>Khách hàng</Text>
                <Text style={styles.metaValue} numberOfLines={1}>{savedOrderCustomer}</Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.metaLabel}>Thời gian</Text>
                <Text style={styles.metaValue}>{savedOrderTime}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.detailTitle}>Chi tiết đơn hàng</Text>
          <View style={styles.detailTable}>
            <View style={[styles.detailRow, styles.detailHeaderRow]}>
              <Text style={[styles.detailCell, styles.detailNameCell, styles.detailHeaderText]}>Tên món</Text>
              <Text style={[styles.detailCell, styles.detailPriceCell, styles.detailHeaderText]}>Đơn giá</Text>
              <Text style={[styles.detailCell, styles.detailQtyCell, styles.detailHeaderText]}>Số lượng</Text>
              <Text style={[styles.detailCell, styles.detailAmountCell, styles.detailHeaderText]}>Thành tiền</Text>
            </View>
            <ScrollView style={styles.detailScroll} nestedScrollEnabled>
              {savedOrderItems.map((item) => (
                <View style={styles.detailRow} key={item.id}>
                  <Text style={[styles.detailCell, styles.detailNameCell, styles.detailItemText]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[styles.detailCell, styles.detailPriceCell, styles.detailItemText]}>{formatMoney(item.price)} / {item.unit}</Text>
                  <Text style={[styles.detailCell, styles.detailQtyCell, styles.detailItemText]}>{formatQuantity(item.quantity)} {item.unit}</Text>
                  <Text style={[styles.detailCell, styles.detailAmountCell, styles.detailAmountText]}>{formatMoney(item.price * item.quantity)}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.detailTotalRow}>
              <Text style={styles.detailTotalLabel}>Tổng cộng</Text>
              <Text style={styles.detailTotalValue}>{formatMoney(savedOrderTotal)}</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.closeOrderButton} onPress={closeOrderSuccess}>
              <Text style={styles.closeOrderText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Page contentStyle={wide ? styles.widePage : undefined}>
      <View style={[styles.wrapper, wide && styles.wrapperWide]}>
        <View style={wide ? styles.column : undefined}>{pricePanel}</View>
        <View style={wide ? styles.column : undefined}>{salesPanel}</View>
      </View>
      {orderSuccessModal}
    </Page>
  );
}

function stepFor(item: PriceItem) {
  return item.unit === "kg" ? 0.5 : 1;
}

function roundQuantity(value: number) {
  return Math.round(value * 10) / 10;
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function formatWeight(value: number) {
  return `${Number(value.toFixed(1)).toLocaleString("vi-VN")} kg`;
}

const styles = StyleSheet.create({
  widePage: { maxWidth: 1160 },
  wrapper: { gap: 14 },
  wrapperWide: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    maxWidth: 1120,
    alignSelf: "center"
  },
  column: { flex: 1 },
  panel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    padding: 18,
    ...shadow
  },
  panelHeader: { minHeight: 56, marginBottom: 10 },
  salesHeader: {
    minHeight: 56,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11
  },
  salesBackSpacer: { width: 2, marginRight: 0 },
  panelTitle: { color: colors.text, fontSize: 23, fontWeight: "900" },
  panelSubtitle: { color: colors.textSoft, fontSize: 12, marginTop: 1 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButton: {
    minHeight: 53,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 16
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  formTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13
  },
  formTitle: { color: colors.textStrong, fontSize: 16, fontWeight: "900" },
  label: {
    color: colors.textStrong,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 8
  },
  inputBox: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8
  },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 10 },
  currency: { color: colors.textSoft, fontWeight: "800" },
  unitRow: { flexDirection: "row", gap: 7 },
  unitChip: {
    paddingHorizontal: 14,
    minHeight: 38,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  unitChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  unitText: { color: colors.textSoft, fontWeight: "800", fontSize: 12 },
  unitTextActive: { color: "#fff" },
  formActions: { flexDirection: "row", gap: 8, marginTop: 14 },
  cancelButton: {
    flex: 0.55,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelText: { color: colors.textStrong, fontWeight: "900" },
  addProductButton: {
    flex: 1.45,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  addProductText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  listTitle: { color: colors.textStrong, fontSize: 14, fontWeight: "900", marginBottom: 8 },
  productRow: {
    minHeight: 69,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  productName: { color: colors.textStrong, fontSize: 14, fontWeight: "900" },
  productPrice: { color: colors.primaryDark, fontSize: 12, fontWeight: "800", marginTop: 2 },
  iconButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  emptyCard: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderInput,
    borderRadius: 17,
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.white
  },
  emptyTitle: { color: colors.textStrong, fontSize: 14, fontWeight: "900", marginTop: 7 },
  emptyText: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 3
  },
  customerBox: {
    minHeight: 48,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 14
  },
  saleList: { gap: 8 },
  saleRow: {
    minHeight: 67,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  saleRowActive: { borderColor: colors.primary, backgroundColor: "#FFF9FA" },
  saleName: { color: colors.textStrong, fontSize: 14, fontWeight: "900" },
  saleUnit: { color: colors.textSoft, fontSize: 11, marginTop: 2 },
  quantityBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  quantityButton: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  quantityInput: {
    width: 36,
    height: 36,
    textAlign: "center",
    color: colors.textStrong,
    fontSize: 15,
    fontWeight: "900",
    padding: 0,
  },
  lineTotal: {
    width: 72,
    textAlign: "right",
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900"
  },
  salesEmpty: { backgroundColor: colors.white, borderRadius: 18, padding: 25, alignItems: "center" },
  summaryGrid: { flexDirection: "row", gap: 8, marginTop: 14 },
  summaryCard: {
    flex: 1,
    minHeight: 91,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6
  },
  totalLabel: { color: colors.primaryDark, fontSize: 10, fontWeight: "900", textAlign: "center" },
  totalValue: { color: colors.primaryDark, fontSize: 25, fontWeight: "900", marginTop: 2 },
  summaryHint: { color: colors.textSoft, fontSize: 9, marginTop: 1 },
  saveButton: {
    minHeight: 53,
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 20, 28, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  successModal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  },
  modalClose: {
    position: "absolute",
    right: 16,
    top: 14,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  successIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#36C982",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3
  },
  successTitle: {
    color: colors.textStrong,
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 12
  },
  successSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 16
  },
  orderMeta: {
    backgroundColor: "#FFF4F6",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 15
  },
  metaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  metaLabel: { color: colors.textSoft, fontSize: 10, fontWeight: "800" },
  metaValue: { color: colors.primaryDark, fontSize: 12, fontWeight: "900", marginTop: 2 },
  detailTitle: { color: colors.textStrong, fontSize: 15, fontWeight: "900", marginBottom: 7 },
  detailTable: { borderRadius: 13, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  detailHeaderRow: { backgroundColor: "#FFE8ED" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 42,
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  detailScroll: { maxHeight: 150 },
  detailCell: { fontSize: 10, paddingVertical: 5 },
  detailNameCell: { flex: 1.25 },
  detailPriceCell: { flex: 1.05 },
  detailQtyCell: { flex: 0.8, textAlign: "center" },
  detailAmountCell: { flex: 1, textAlign: "right" },
  detailHeaderText: { color: colors.primaryDark, fontWeight: "900" },
  detailItemText: { color: colors.textStrong, fontWeight: "700" },
  detailAmountText: { color: colors.primaryDark, fontWeight: "900" },
  detailTotalRow: {
    minHeight: 47,
    backgroundColor: "#FFF0F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 11
  },
  detailTotalLabel: { color: colors.textStrong, fontSize: 13, fontWeight: "900" },
  detailTotalValue: { color: colors.primaryDark, fontSize: 17, fontWeight: "900" },
  modalActions: { marginTop: 15 },
  closeOrderButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  closeOrderText: { color: "#fff", fontSize: 13, fontWeight: "900" }
});
