import React, { createContext, useContext, useEffect, useState } from 'react';

import { Product } from '../../modules/HomePage/HomePage';
import { normalizeProduct } from '../../utils/imageUtils';

export interface CartItem extends Product {
  id: string | number;

  quantity: number;
}

interface ContextProps {
  favorites: Product[];

  clearCart: () => void;

  cart: CartItem[];

  addToFavorites: (p: Product) => void;

  addToCart: (p: Product) => void;

  removeFromCart: (id: string | number) => void;

  removeFromFavorites: (id: string) => void;

  updateQuantity: (id: string | number, delta: number) => void;

  isInCart: (id: string | number) => boolean;
  isFavorite: (id: string | number) => boolean;
}

const GlobalContext = createContext<ContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id: string | number) => {
    return cart.some(item => String(item.itemId) === String(id));
  };

  const isFavorite = (id: string | number) => {
    return favorites.some(
      item => String(item.itemId || item.id) === String(id),
    );
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');

    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    const normalizedProduct = normalizeProduct(product);
    console.log('Adding product:', normalizedProduct);
    const productKey = product.itemId || product.id;
    setCart(prev => {
      const isExists = prev.find(
        i => String(i.itemId || i.id) === String(productKey),
      );

      if (isExists) {
        return prev.filter(
          i => String(i.itemId || i.id) !== String(productKey),
        );
      }

      const normalizedProduct = {
        ...product,
        itemId: productKey,
      };

      return [...prev, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      const productKey = product.itemId || product.id;
      const isExist = prev.find(
        item => String(item.itemId || item.id) === String(productKey),
      );

      if (isExist) {
        return prev.filter(
          item => String(item.itemId || item.id) !== String(productKey),
        );
      }

      return [...prev, product];
    });
  };

  const removeFromCart = (itemId: string | number) => {
    setCart(prevCart =>
      prevCart.filter(item => String(item.itemId) !== String(itemId)),
    );
  };

  const removeFromFavorites = (itemId: string | number) => {
    setFavorites(prev =>
      prev.filter(product => String(product.itemId) !== String(itemId)),
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        favorites,
        cart,
        addToFavorites,
        addToCart,
        removeFromCart,
        removeFromFavorites,
        updateQuantity,
        isInCart,
        isFavorite,
        clearCart
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobal must be used within GlobalProvider');
  }

  return context;
};
