"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { Product } from "@/types/product";
// Using SVG icons instead of Heroicons
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";
import ProductReviews from "./ProductReviews";
import RecentlyViewdItems from "./RecentlyViewd";
import Newsletter from "../Common/Newsletter";
import { formatPrice, calculateDiscount } from "@/utils/currency";
import { getProductById } from "../../../lib/sanity";
import { getBrandName, BRAND_CONFIG } from "@/config/brand";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface ShopDetailsProps {
  productId: string;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const { data: session } = useSession();

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);

        // Set default selections
        if (fetchedProduct?.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
        if (fetchedProduct?.colors && fetchedProduct.colors.length > 0) {
          const firstColor = fetchedProduct.colors[0];
          setSelectedColor(typeof firstColor === 'string' ? firstColor : firstColor.name);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice || product.price,
      quantity,
      imgs: product.imgs,
    }));

    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (!session) {
      signIn();
      return;
    }

    if (isInWishlist(product.id.toString())) {
      dispatch(removeItemFromWishlist(product.id));
      toast.success(`${product.title} removed from wishlist`);
    } else {
      dispatch(addItemToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        quantity: 1,
        imgs: product.imgs,
        status: product.inStock ? 'In Stock' : 'Out of Stock',
      }));
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const tabs = [
    { id: "tabOne", label: "Description" },
    { id: "tabTwo", label: "Additional Information" },
    { id: "tabThree", label: "Reviews" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/shop-with-sidebar"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = calculateDiscount(product.price, product.discountedPrice);

  return (
    <>
      {product && (
        <>
          <section className="overflow-hidden bg-gray-50 py-12 lg:py-16">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="w-full">
                  <ProductImageGallery product={product} />
                </div>

                {/* Product Info */}
                <div className="w-full lg:pl-8">
                  <div className="flex items-center gap-2 mb-4">
                    {product.featured && (
                      <span className="bg-black text-white px-3 py-1 text-sm font-medium">
                        Featured
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="bg-red-500 text-white px-3 py-1 text-sm font-medium">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  <h1 className="font-bold text-3xl xl:text-4xl text-black mb-4">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-black">
                        {formatPrice(product.discountedPrice || product.price)}
                      </span>
                      {product.discountedPrice && product.price > product.discountedPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Product Variants */}
                  <ProductVariants
                    product={product}
                    onVariantChange={(variant) => {
                      setSelectedSize(variant.size || '');
                      setSelectedColor(variant.color?.name || '');
                      setQuantity(variant.quantity || 1);
                    }}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5" />
                      </svg>
                      Add to Cart
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      className="p-3 border border-gray-300 hover:bg-gray-100 transition-colors duration-300 rounded-lg"
                    >
                      {isInWishlist(product.id.toString()) ? (
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Product Meta */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {product.category && (
                      <p>
                        <span className="font-medium">Category:</span> {product.category}
                      </p>
                    )}
                    {product.material && (
                      <p>
                        <span className="font-medium">Material:</span> {product.material}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden bg-gray-2 py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* Tab Header */}
              <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium text-lg ease-out duration-200 ${
                      activeTab === item.id
                        ? "text-black border-b-2 border-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Description Tab */}
              <div>
                <div
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${
                    activeTab === "tabOne" ? "block" : "hidden"
                  }`}
                >
                  <div className="prose max-w-none">
                    {product.description ? (
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        This premium {product.title.toLowerCase()} is crafted with attention to detail and quality.
                        Perfect for everyday wear, it combines comfort with style to create a versatile piece
                        that fits seamlessly into your wardrobe.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information Tab */}
              <div>
                <div
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${
                    activeTab === "tabTwo" ? "block" : "hidden"
                  }`}
                >
                  {/* Brand */}
                  {(product.additionalInfo?.brand || getBrandName()) && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Brand</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.additionalInfo?.brand || getBrandName()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Material */}
                  {product.material && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Material</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.material}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fit */}
                  {product.additionalInfo?.fit && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Fit</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.additionalInfo.fit.charAt(0).toUpperCase() + product.additionalInfo.fit.slice(1)} Fit
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Gender */}
                  {product.gender && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Gender</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Season */}
                  {product.season && product.season.length > 0 && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Season</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.season.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Made In */}
                  {(product.additionalInfo?.origin || BRAND_CONFIG.country) && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Made In</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.additionalInfo?.origin || BRAND_CONFIG.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Care Instructions */}
                  {product.additionalInfo?.careInstructions && product.additionalInfo.careInstructions.length > 0 && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Care Instructions</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.additionalInfo.careInstructions.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Weight */}
                  {product.weight && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Weight</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.weight}g
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sustainability */}
                  {product.additionalInfo?.sustainability && product.additionalInfo.sustainability.length > 0 && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Sustainability</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.additionalInfo.sustainability.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Available Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Available Sizes</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {product.sizes.join(', ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Available Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">Available Colors</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {Array.isArray(product.colors) && typeof product.colors[0] === 'string'
                            ? (product.colors as string[]).join(', ')
                            : (product.colors as Array<{name: string}>).map(color => color.name).join(', ')
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Tab */}
              <div>
                <div
                  className={`mt-12.5 ${
                    activeTab === "tabThree" ? "block" : "hidden"
                  }`}
                >
                  <ProductReviews product={product} />
                </div>
              </div>
            </div>
          </section>

          <RecentlyViewdItems />

          <Newsletter />
        </>
      )}
    </>
  );
};

export default ShopDetails;
