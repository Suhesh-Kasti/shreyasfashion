"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { Product } from "@/types/product";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";
import ProductReviews from "./ProductReviews";
import RecentlyViewdItems from "./RecentlyViewd";
import Newsletter from "../Common/Newsletter";
import { formatPrice, calculateDiscount } from "@/utils/currency";
// Removed direct Sanity import to prevent CORS errors
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
        console.log('Fetching product with ID:', productId);

        // Try to fetch from API first (which connects to Sanity)
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const fetchedProduct = await response.json();
            console.log('Fetched product from API:', fetchedProduct);
            setProduct(fetchedProduct);
            return;
          }
        } catch (apiError) {
          console.log('API fetch failed, using fallback data:', apiError);
        }

        // Fallback data if API fails
        const fallbackProducts = [ // No fallback data - only use real Sanity data


        ];

        const fetchedProduct = fallbackProducts.find(p => p._id === productId || p.id === productId);
        console.log('Using fallback product:', fetchedProduct);
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

    // Check stock status
    if (!product.inStock || (product.quantity !== undefined && product.quantity < 1)) {
      toast.error("Sorry, this item is out of stock");
      return;
    }

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/shop-collection"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
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
          <section className="overflow-hidden bg-white py-8 lg:py-12 transition-colors duration-300">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="w-full">
                  <ProductImageGallery
                    product={product}
                    selectedColor={selectedColor ? product.colors?.find(c =>
                      (typeof c === 'string' ? c : c.name) === selectedColor
                    ) : null}
                  />
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
                        Rs. {formatPrice(product.price)}
                      </span>
                      {product.discountedPrice && (
                        <span className="text-xl text-gray-500 line-through">
                          Rs. {formatPrice(product.discountedPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        {product.inStock
                          ? (product.quantity ? `${product.quantity} in Stock` : "In Stock")
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <p className="mb-8 text-gray-600 leading-relaxed">
                    {product.description?.slice(0, 150)}...
                  </p>

                  <ProductVariants
                    product={product}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    onSizeChange={setSelectedSize}
                    onColorChange={setSelectedColor}
                    onQuantityChange={setQuantity}
                  />

                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock || (product.quantity !== undefined && product.quantity < 1)}
                      className={`flex-1 text-white py-3 px-6 font-medium transition-colors duration-300 flex items-center justify-center gap-2 rounded-lg ${!product.inStock || (product.quantity !== undefined && product.quantity < 1)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5" />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-3 border rounded-lg transition-colors duration-300 ${isInWishlist(product.id.toString())
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-gray-300 hover:border-black text-gray-700"
                        }`}
                      aria-label="Add to Wishlist"
                    >
                      <svg className={`w-6 h-6 ${isInWishlist(product.id.toString()) ? "fill-current" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>


                </div>
              </div>
            </div>
          </section >

          <section className="overflow-hidden bg-gray-2 py-20 transition-colors duration-300">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* Tab Header */}
              <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6 transition-colors duration-300">
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium text-lg ease-out duration-200 ${activeTab === item.id
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
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 transition-colors duration-300 ${activeTab === "tabOne" ? "block" : "hidden"
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
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 transition-colors duration-300 ${activeTab === "tabTwo" ? "block" : "hidden"
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
                          {Array.isArray(product.season) ? product.season.join(', ') : product.season}
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
                          {Array.isArray(product.additionalInfo?.careInstructions)
                            ? product.additionalInfo.careInstructions.join(', ')
                            : product.additionalInfo?.careInstructions || 'N/A'
                          }
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
                          {Array.isArray(product.additionalInfo?.sustainability)
                            ? product.additionalInfo.sustainability.join(', ')
                            : product.additionalInfo?.sustainability || 'N/A'
                          }
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
                          {Array.isArray(product.sizes) && product.sizes.length > 0
                            ? product.sizes.join(', ').toUpperCase()
                            : 'N/A'
                          }
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
                            : (product.colors as Array<{ name: string }>).map(color => color.name).join(', ')
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
                  className={`mt-12.5 ${activeTab === "tabThree" ? "block" : "hidden"
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
