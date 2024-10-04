import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '../../../types/productInterface';

// Estado inicial del carrito
interface CartState {
  products: { productId: number; quantity: number }[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  products: [],  // Contendrá los productos con `productId` y `quantity`
  loading: false,
  error: null,
};

// Thunk para sincronizar el carrito (add new cart)
export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async (products: { productId: number; quantity: number }[], { rejectWithValue }) => {
    try {
      const res = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 5,  // Usaremos un userId estático para ejemplo, puedes obtenerlo de tu sesión
          date: new Date().toISOString(),
          products,
        }),
      });
      if (!res.ok) {
        throw new Error('Error al sincronizar el carrito');
      }
      const data = await res.json();
      return data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

// Thunk para obtener el carrito del usuario (get user cart)
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
      if (!res.ok) {
        throw new Error('Error al obtener el carrito');
      }
      const data = await res.json();
      return data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const existingProduct = state.products.find(p => p.productId === action.payload.productId);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    clearCart: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.products = action.payload.products.map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        }));
        state.loading = false;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
