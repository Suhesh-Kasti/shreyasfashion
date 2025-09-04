"use client";
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { addItemToCart, removeItemFromCart, removeAllItemsFromCart } from '@/redux/features/cart-slice';
import { formatPrice } from '@/utils/currency';
import toast from 'react-hot-toast';

const CartTest: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector((state) => 
    state.cartReducer.items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0)
  );

  const testProduct = {
    id: 'test-product-1',
    title: 'Test DANIOS Hoodie',
    price: 3500,
    discountedPrice: 2800,
    quantity: 1,
    imgs: {
      thumbnails: ['/images/test-product.jpg'],
      previews: ['/images/test-product.jpg'],
    },
  };

  const handleAddTestProduct = () => {
    dispatch(addItemToCart(testProduct));
    toast.success('Test product added to cart!');
  };

  const handleRemoveItem = (id: string | number) => {
    dispatch(removeItemFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(removeAllItemsFromCart());
    toast.success('Cart cleared');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">🛒 Cart Functionality Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={handleAddTestProduct}
            className="bg-danios-black text-white px-4 py-2 rounded hover:bg-danios-text transition-colors"
          >
            Add Test Product
          </button>
          
          <button
            onClick={handleClearCart}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Cart Items ({cartItems.length})</h3>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × {formatPrice(item.discountedPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {formatPrice(item.discountedPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Redux State Debug</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify({ cartItems, totalPrice }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CartTest;
