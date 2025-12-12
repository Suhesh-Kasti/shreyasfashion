"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchBarProps {
  className?: string;
}

interface QuickSearchLink {
  label: string;
  url: string;
}

const SearchBar = ({ className = "" }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quickLinks, setQuickLinks] = useState<QuickSearchLink[]>([]);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch search settings from Sanity
  useEffect(() => {
    const fetchSearchSettings = async () => {
      try {
        const response = await fetch('/api/search-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            setQuickLinks(data.settings.quickSearch || []);
            setPopularTerms(data.settings.popularSearches || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch search settings:', error);
        // Use default values as fallback
        setQuickLinks([
          { label: "Sweatshirts", url: "/shop-collection?category=sweatshirts" },
          { label: "T-Shirts", url: "/shop-collection?category=tshirts" },
          { label: "Pants", url: "/shop-collection?category=pants" }
        ]);
        setPopularTerms(["Premium Cotton", "Oversized", "Black", "Minimalist"]);
      }
    };

    fetchSearchSettings();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Navigate to shop page with search query
      router.push(`/shop-collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Toggle Button */}
      <button
        onClick={toggleSearch}
        className="p-2 text-danios-text hover:text-danios-black transition-colors group"
        aria-label="Search products"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Search Dropdown */}
      {isOpen && (

        <div className="fixed inset-x-4 top-20 z-50 lg:absolute lg:top-full lg:right-0 lg:left-auto lg:mt-2 lg:w-80 bg-white border border-danios-neutral-2 shadow-lg rounded-lg">
          <div className="p-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-3 bg-white text-black border border-danios-neutral-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-danios-accent focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-danios-text hover:text-danios-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-danios-accent border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Links */}
            {quickLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-danios-neutral-2">
                <p className="text-sm text-danios-text-muted mb-3 uppercase tracking-wider">
                  Quick Search
                </p>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url.startsWith('/') ? link.url : `/shop-collection?search=${encodeURIComponent(link.label)}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {popularTerms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-danios-neutral-2">
                <p className="text-sm text-danios-text-muted mb-3 uppercase tracking-wider">
                  Popular
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTerms.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch({ preventDefault: () => { } } as React.FormEvent);
                      }}
                      className="px-3 py-1 text-xs bg-danios-neutral text-danios-text hover:bg-danios-neutral-2 transition-colors rounded-full"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
      }

      {/* Overlay for mobile */}
      {
        isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )
      }
    </div >
  );
};

export default SearchBar;
