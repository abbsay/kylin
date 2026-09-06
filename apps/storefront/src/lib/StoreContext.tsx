import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CartItem } from '../types';
import {
  useCartQuery,
  useAddToCartMutation,
  updateCartItemQtyInCache,
  removeCartItemFromCache,
  clearCartInCache,
  AddToCartVariables,
} from './cartQuery';
import {
  SaleorUser,

  SaleorAddress,
  AddressInputData,
  getStoredToken,
  setStoredToken,
  fetchSaleorMe,
  saleorLogin,
  saleorRegister,
  saleorUpdateAccount,
  saleorChangePassword,
  saleorCreateAddress,
  saleorUpdateAddress,
  saleorDeleteAddress,
  saleorSetDefaultAddress
} from './saleorAuth';

interface StoreContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: 'USD';
  cart: CartItem[];
  totalItems: number;
  addToCart: (item: CartItem, options?: { openDrawer?: boolean; simulateError?: boolean }) => Promise<void> | void;
  removeFromCart: (variantId: string) => void;
  updateQty: (variantId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  cartTotal: number;
  currentUser: SaleorUser | null;
  authToken: string | null;
  loginUser: (email: string, pass: string) => Promise<void>;
  registerUser: (email: string, pass: string) => Promise<void>;
  logoutUser: () => void;
  refreshUserData: () => Promise<void>;
  updateUserProfile: (firstName: string, lastName: string) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
  createAddress: (input: AddressInputData, type?: 'SHIPPING' | 'BILLING') => Promise<SaleorAddress>;
  updateAddress: (id: string, input: AddressInputData) => Promise<SaleorAddress>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string, type: 'SHIPPING' | 'BILLING') => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { cart, totalItems, cartTotal } = useCartQuery();
  const addToCartMutation = useAddToCartMutation();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const currency: 'USD' = 'USD';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Real Saleor Auth State
  const [authToken, setAuthToken] = useState<string | null>(getStoredToken());
  const [currentUser, setCurrentUser] = useState<SaleorUser | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync current customer state on mount
  useEffect(() => {
    if (authToken) {
      fetchSaleorMe(authToken).then(user => {
        if (user) {
          setCurrentUser(user);
        } else {
          setStoredToken(null);
          setAuthToken(null);
          setCurrentUser(null);
        }
      });
    }
  }, [authToken]);

  const refreshUserData = async () => {
    if (authToken) {
      const user = await fetchSaleorMe(authToken);
      setCurrentUser(user);
    }
  };

  const loginUser = async (email: string, pass: string) => {
    const res = await saleorLogin(email, pass);
    setAuthToken(res.token);
    setCurrentUser(res.user);
    // Fetch complete user profile with orders
    const fullUser = await fetchSaleorMe(res.token);
    if (fullUser) setCurrentUser(fullUser);
  };

  const registerUser = async (email: string, pass: string) => {
    await saleorRegister(email, pass);
    // Auto login after registration
    await loginUser(email, pass);
  };

  const updateUserProfile = async (firstName: string, lastName: string) => {
    if (!authToken) throw new Error('Not authenticated');
    await saleorUpdateAccount(authToken, { firstName, lastName });
    await refreshUserData();
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!authToken) throw new Error('Not authenticated');
    await saleorChangePassword(authToken, oldPass, newPass);
  };

  const createAddress = async (input: AddressInputData, type?: 'SHIPPING' | 'BILLING') => {
    if (!authToken) throw new Error('Not authenticated');
    const newAddr = await saleorCreateAddress(authToken, input, type);
    await refreshUserData();
    return newAddr;
  };

  const updateAddress = async (id: string, input: AddressInputData) => {
    if (!authToken) throw new Error('Not authenticated');
    const updated = await saleorUpdateAddress(authToken, id, input);
    await refreshUserData();
    return updated;
  };

  const deleteAddress = async (id: string) => {
    if (!authToken) throw new Error('Not authenticated');
    await saleorDeleteAddress(authToken, id);
    await refreshUserData();
  };

  const setDefaultAddress = async (id: string, type: 'SHIPPING' | 'BILLING') => {
    if (!authToken) throw new Error('Not authenticated');
    await saleorSetDefaultAddress(authToken, id, type);
    await refreshUserData();
  };

  const logoutUser = () => {
    setStoredToken(null);
    setAuthToken(null);
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToCart = (item: CartItem, options?: { openDrawer?: boolean; simulateError?: boolean }) => {
    addToCartMutation.mutate({
      item,
      simulateError: options?.simulateError,
    });
    if (options?.openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (variantId: string) => {
    removeCartItemFromCache(queryClient, variantId);
  };

  const updateQty = (variantId: string, delta: number) => {
    updateCartItemQtyInCache(queryClient, variantId, delta);
  };

  const clearCart = () => {
    clearCartInCache(queryClient);
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        cart,
        totalItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        cartTotal,
        currentUser,
        authToken,
        loginUser,
        registerUser,
        logoutUser,
        refreshUserData,
        updateUserProfile,
        changePassword,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
