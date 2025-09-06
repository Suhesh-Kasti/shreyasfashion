/**
 * Currency formatting utilities for fashion store
 * All prices are displayed in Nepali Rupees (Rs.)
 */

export const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Rs. 0';
  }
  
  // Format number with commas for thousands
  const formattedNumber = price.toLocaleString('en-IN');
  return `Rs. ${formattedNumber}`;
};

export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const formatDiscountPercentage = (originalPrice: number, discountedPrice: number): string => {
  const discount = calculateDiscount(originalPrice, discountedPrice);
  return discount > 0 ? `${discount}% OFF` : '';
};

// Convert USD to NPR (approximate rate - you should use real-time rates in production)
export const convertUSDToNPR = (usdAmount: number): number => {
  const exchangeRate = 132; // Approximate USD to NPR rate
  return Math.round(usdAmount * exchangeRate);
};

// Helper function to get price display data (for use in React components)
export const getPriceDisplayData = (price: number, discountedPrice?: number) => {
  const formattedPrice = formatPrice(price);
  const formattedDiscountedPrice = discountedPrice ? formatPrice(discountedPrice) : null;
  const discountPercentage = discountedPrice ? formatDiscountPercentage(price, discountedPrice) : '';
  const hasDiscount = discountedPrice && discountedPrice < price;

  return {
    formattedPrice,
    formattedDiscountedPrice,
    discountPercentage,
    hasDiscount,
  };
};
