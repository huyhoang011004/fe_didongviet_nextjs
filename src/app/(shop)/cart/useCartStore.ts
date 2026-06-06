import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  product: string; // productId
  variant: string; // variantId
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  salePrice: number;
  discountPercentage?: number;
  slug?: string;
  categorySlug?: string;
  selectedColor?: string;
  selectedStorage?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  addItem: (newItem: CartItem) => Promise<boolean>;
  removeItem: (productId: string, variantId: string) => Promise<boolean>;
  updateQuantity: (productId: string, variantId: string, quantity: number) => Promise<boolean>;
  changeVariant: (
    productId: string,
    oldVariantId: string,
    newVariantId: string,
    quantity: number,
    newItemDetails: any,
  ) => Promise<boolean>;
  clearCart: () => void;
  selected: string[];
  toggleSelectItem: (productId: string, variantId: string) => void;
  setSelectedItems: (keys: string[]) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selected: [],
      loading: false,
 
      fetchCart: async () => {
        try {
          set({ loading: true });
          const res = await fetch('/api/cart');
          if (res.status === 200) {
            const data = await res.json();
            if (data.success && data.data) {
              const dbItems = data.data.items || [];
              const mappedItems = dbItems.map((item: any) => {
                const prod = item.product || {};
                const variant = prod.variants?.find((v: any) => v._id === item.variantId);
                const variantImage = variant?.variantImage;
                
                const thumbnail = variantImage || prod.images?.find((img: any) => img.isThumbnail)?.url || prod.imageUrl || '/placeholder-product.png';
                return {
                  product: prod._id || item.product,
                  variant: item.variantId,
                  name: prod.name || 'Sản phẩm',
                  imageUrl: thumbnail.startsWith('http') ? thumbnail : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${thumbnail}`,
                  quantity: item.quantity,
                  price: item.price,
                  salePrice: item.price,
                  selectedColor: item.selectedColor,
                  selectedStorage: item.selectedStorage,
                  slug: prod.slug,
                  categorySlug: prod.category?.slug
                };
              });
              set({ items: mappedItems });
            }
          }
        } catch (err) {
          console.error('Error fetching cart from server:', err);
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (newItem) => {
        try {
          // Gửi thử lên server trước
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: newItem.product,
              variantId: newItem.variant,
              quantity: newItem.quantity,
            }),
          });

          if (res.status === 200) {
            // Đã đăng nhập -> cập nhật lại giỏ hàng từ server
            await get().fetchCart();
            return true;
          } else if (res.status === 401) {
            // Chưa đăng nhập -> lưu giỏ hàng local cho khách vãng lai
            set((state) => {
              const existingItemIndex = state.items.findIndex(
                (i) => i.product === newItem.product && i.variant === newItem.variant
              );

              if (existingItemIndex >= 0) {
                const newItems = [...state.items];
                newItems[existingItemIndex].quantity += newItem.quantity;
                return { items: newItems };
              } else {
                return { items: [...state.items, newItem] };
              }
            });
            return true;
          }
          return false;
        } catch (err) {
          console.error('Error adding item to cart:', err);
          return false;
        }
      },

      removeItem: async (productId, variantId) => {
        try {
          const res = await fetch(`/api/cart/${productId}/${variantId}`, {
            method: 'DELETE',
          });

          if (res.status === 200) {
            await get().fetchCart();
            return true;
          } else if (res.status === 401) {
            set((state) => ({
              items: state.items.filter(
                (i) => !(i.product === productId && i.variant === variantId)
              ),
            }));
            return true;
          }
          return false;
        } catch (err) {
          console.error('Error removing item from cart:', err);
          return false;
        }
      },

      changeVariant: async (productId, oldVariantId, newVariantId, quantity, newItemDetails) => {
        try {
          const res = await fetch('/api/cart/change-variant', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId,
              oldVariantId,
              newVariantId,
              quantity,
            }),
          });

          if (res.status === 200) {
            await get().fetchCart();
            return true;
          } else if (res.status === 401) {
            set((state) => {
              const newItems = [...state.items];
              const oldItemIdx = newItems.findIndex(
                (i) => i.product === productId && i.variant === oldVariantId
              );

              if (oldItemIdx > -1) {
                const newVariantIdx = newItems.findIndex(
                  (i) => i.product === productId && i.variant === newVariantId
                );
                if (newVariantIdx > -1 && newVariantIdx !== oldItemIdx) {
                  newItems[newVariantIdx].quantity += quantity;
                  newItems.splice(oldItemIdx, 1);
                } else {
                  newItems[oldItemIdx] = {
                    ...newItems[oldItemIdx],
                    variant: newVariantId,
                    imageUrl: newItemDetails.imageUrl || newItems[oldItemIdx].imageUrl,
                    price: newItemDetails.price,
                    salePrice: newItemDetails.salePrice,
                    selectedColor: newItemDetails.selectedColor,
                    selectedStorage: newItemDetails.selectedStorage,
                    quantity,
                  };
                }
              }
              return { items: newItems };
            });
            return true;
          }
          return false;
        } catch (err) {
          console.error('Error changing variant in store:', err);
          return false;
        }
      },

      updateQuantity: async (productId, variantId, quantity) => {
        try {
          const res = await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId,
              variantId,
              quantity,
            }),
          });

          if (res.status === 200) {
            await get().fetchCart();
            return true;
          } else if (res.status === 401) {
            set((state) => ({
              items: state.items.map((i) => {
                if (i.product === productId && i.variant === variantId) {
                  return { ...i, quantity: Math.max(1, quantity) };
                }
                return i;
              }),
            }));
            return true;
          }
          return false;
        } catch (err) {
          console.error('Error updating quantity in cart:', err);
          return false;
        }
      },

      toggleSelectItem: (productId, variantId) => {
        const key = `${productId}|${variantId}`;
        set((state) => {
          const exists = state.selected.includes(key);
          return { selected: exists ? state.selected.filter(k => k !== key) : [...state.selected, key] };
        });
      },

      setSelectedItems: (keys) => set({ selected: keys }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        // Đếm số lượng sản phẩm duy nhất (không cộng dồn số lượng biến thể)
        const uniqueProducts = new Set(get().items.map((item) => item.product));
        return uniqueProducts.size;
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.salePrice || item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'didongviet-guest-cart', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
