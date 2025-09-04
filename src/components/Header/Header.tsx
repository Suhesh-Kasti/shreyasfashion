"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import SearchBar from "./SearchBar";
import { getBrandName, getNavigation, BRAND_CONFIG } from "@/config/brand";
import TypingAnimation from "../Common/TypingAnimation";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const { data: session } = useSession();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-danios-neutral-2 transition-all ease-in-out duration-300 ${
        stickyMenu && "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link className="flex-shrink-0" href="/">
            <div className="text-2xl lg:text-3xl font-bold text-brand-black tracking-tight">
              {/* Desktop: Show full brand name */}
              <span className="hidden sm:block">
                {getBrandName()}
              </span>
              {/* Mobile: Show typing animation */}
              <span className="block sm:hidden">
                <TypingAnimation
                  words={BRAND_CONFIG.typingWords}
                  className="text-2xl font-bold text-brand-black tracking-tight"
                  typingSpeed={120}
                  deletingSpeed={80}
                  pauseDuration={1500}
                />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {getNavigation().map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-text hover:text-brand-black transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Wishlist Icon */}
            <Link href="/wishlist" className="p-2 text-danios-text hover:text-danios-black transition-colors group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Authentication */}
            {session ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-danios-black rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-danios-text">
                    {session.user?.name || "User"}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="hidden lg:block text-sm text-danios-text-light hover:text-danios-black transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 p-2 text-danios-text hover:text-danios-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:block text-sm font-medium">Sign In</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={handleOpenCartModal}
              className="relative p-2 text-danios-text hover:text-danios-black transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5" />
              </svg>
              {product.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-danios-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {product.length}
                </span>
              )}
            </button>

            {/* Search Bar */}
            <SearchBar />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setNavigationOpen(!navigationOpen)}
              className="lg:hidden p-2 text-danios-text hover:text-danios-black transition-colors"
            >
              <span className="sr-only">Toggle navigation</span>
              {navigationOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {navigationOpen && (
          <div className="lg:hidden border-t border-brand-neutral-2 bg-white">
            <div className="px-4 py-6 space-y-4">
              {getNavigation().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-brand-text hover:text-brand-black transition-colors font-medium py-2"
                  onClick={() => setNavigationOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session && (
                <button
                  onClick={() => {
                    signOut();
                    setNavigationOpen(false);
                  }}
                  className="block text-danios-text-light hover:text-danios-black transition-colors font-medium py-2"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
