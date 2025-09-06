"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  // Use reviews from Sanity product data, ensure it's always an array
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (Array.isArray(product.reviews)) {
      return product.reviews;
    }
    // If reviews is not an array (could be a number or other type), return empty array
    return [];
  });

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    customerName: '',
    email: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const review: Review = {
      id: Date.now().toString(),
      customerName: newReview.customerName,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
      customerName: '',
      email: ''
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Reviews List */}
      <div className="max-w-[570px] w-full">
        <div className="mb-6">
          <h2 className="font-medium text-2xl text-dark mb-2">
            {reviews.length} Review{reviews.length !== 1 ? 's' : ''} for {product.title}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} out of 5 stars
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {Array.isArray(reviews) && reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark">
                      {review.customerName}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="font-medium text-dark mb-2">{review.title}</h5>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="hover:text-gray-700">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="max-w-[550px] w-full">
        <form onSubmit={handleSubmitReview}>
          <h2 className="font-medium text-2xl text-dark mb-3.5">Add a Review</h2>
          <p className="mb-6 text-gray-600">
            Your email address will not be published. Required fields are marked *
          </p>

          <div className="flex items-center gap-3 mb-7.5">
            <span>Your Rating*</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                  className={`text-2xl ${index < newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-2.5">Name *</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={newReview.customerName}
                  onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                  className="rounded-md border border-gray-3 bg-gray-1 w-full p-3 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2.5">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={newReview.email}
                  onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                  className="rounded-md border border-gray-3 bg-gray-1 w-full p-3 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block mb-2.5">Review Title</label>
              <input
                type="text"
                id="title"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="rounded-md border border-gray-3 bg-gray-1 w-full p-3 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block mb-2.5">Comments *</label>
              <textarea
                id="comment"
                rows={5}
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                className="rounded-md border border-gray-3 bg-gray-1 w-full p-3 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <button
              type="submit"
              className="inline-flex font-medium text-white bg-black py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-800"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;
