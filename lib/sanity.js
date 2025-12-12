import { createClient } from '@sanity/client'
import { BRAND_CONFIG } from '../src/config/brand'

// Check if Sanity is properly configured
const isValidProjectId = (projectId) => {
  return projectId &&
    projectId !== 'your-project-id' &&
    projectId !== 'your_project_id_here' &&
    /^[a-z0-9-]+$/.test(projectId) &&
    projectId.length > 0;
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Create and configure the Sanity client only if we have a valid project ID
export const client = isValidProjectId(projectId) ? createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: true, // Enable CDN for faster response times
}) : null;

// Test Sanity connection
export async function testSanityConnection() {
  if (!client) {
    return { success: false, error: 'Sanity client not configured' };
  }

  try {
    const result = await client.fetch('*[_type == "product"][0...1] { _id, title }');
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GROQ queries for fetching data
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  price,
  discountedPrice,
  description,
  category->{
    _id,
    name,
    slug,
    "image": image.asset->url,
    "bannerImage": bannerImage.asset->url,
    "icon": icon.asset->url
  },
  "imgs": {
    "thumbnails": imgs.thumbnails[].asset->url,
    "gallery": imgs.gallery[].asset->url
  },
  reviews,
  slug,
  inStock,
  featured,
  gender,
  sizes,
  colors[] {
    name,
    value,
    "image": image.asset->url
  },
  "material": material->title,
  "style": style->title,
  "season": season[]->title,
  "tags": tags[]->title,
  priceRange,
  weight,
  dimensions,
  _createdAt,
  _updatedAt
}`

export const CATEGORIES_QUERY = `*[_type == "category"] | order(sortOrder asc) {
  _id,
  name,
  slug,
  description,
  "image": image.asset->url,
  "bannerImage": bannerImage.asset->url,
  "icon": icon.asset->url,
  featured,
  sortOrder
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  title,
  description,
  heroSection {
    "backgroundImage": backgroundImage.asset->url,
    title,
    subtitle,
    ctaText,
    secondaryCtaText
  },
  aboutSection {
    "founderImage": founderImage.asset->url,
    "companyImages": companyImages[].asset->url
  },
  brandStats[] {
    value,
    label
  }
}`

export const PRODUCT_BY_ID_QUERY = `*[_type == "product" && (_id == $id || id == $id)][0] {
  _id,
  title,
  price,
  discountedPrice,
  description,
  category->{
    _id,
    name,
    slug,
    "image": image.asset->url,
    "bannerImage": bannerImage.asset->url,
    "icon": icon.asset->url
  },
  "imgs": {
    "thumbnails": imgs.thumbnails[].asset->url,
    "gallery": imgs.gallery[].asset->url
  },
  reviews,
  slug,
  inStock,
  featured,
  gender,
  sizes,
  colors[] {
    name,
    value,
    "image": image.asset->url
  },
  "material": material->title,
  "style": style->title,
  "season": season[]->title,
  "tags": tags[]->title,
  priceRange,
  weight,
  dimensions
}`

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  price,
  discountedPrice,
  description,
  category->{
    _id,
    name,
    slug,
    "image": image.asset->url,
    "bannerImage": bannerImage.asset->url,
    "icon": icon.asset->url
  },
  "imgs": {
    "thumbnails": imgs.thumbnails[].asset->url,
    "gallery": imgs.gallery[].asset->url
  },
  reviews,
  slug,
  inStock,
  featured,
  gender,
  sizes,
  colors[] {
    name,
    value,
    "image": image.asset->url
  },
  "material": material->title,
  "style": style->title,
  "season": season[]->title,
  "tags": tags[]->title,
  priceRange,
  weight,
  dimensions
}`

// Blog queries
const BLOG_POSTS_QUERY = `*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "featuredImage": featuredImage.asset->url,
  "author": author->name,
  "categories": categories[]->title,
  publishedAt,
  featured
}`

const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  "featuredImage": featuredImage.asset->url,
  "author": author->{name, image},
  "categories": categories[]->{title, slug},
  tags,
  publishedAt,
  seo
}`

// Promotion queries
const PROMOTIONS_QUERY = `*[_type == "promotion" && active == true] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  type,
  "bannerImage": bannerImage.asset->url,
  discount,
  startDate,
  endDate,
  "products": products[]->{_id, name, slug, price, "thumbnail": thumbnail.asset->url},
  "categories": categories[]->{_id, title, slug},
  ctaText,
  ctaLink,
  featured,
  backgroundColor,
  textColor
}`

// Seller queries
const SELLERS_QUERY = `*[_type == "seller" && active == true] | order(featured desc, _createdAt desc) {
  _id,
  name,
  slug,
  "logo": logo.asset->url,
  "bannerImage": bannerImage.asset->url,
  description,
  specialties,
  rating,
  totalSales,
  featured
}`

// Fallback data for development - Fashion Products
const fallbackProducts = [ // No fallback products - only show real Sanity data


];

// Only show categories that have actual products - no dummy fallback data
const fallbackCategories = [];

// Fetch site settings
export async function getSiteSettings() {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback site settings');
    return {
      title: BRAND_CONFIG.name,
      description: BRAND_CONFIG.description,
      heroSection: {
        backgroundImage: '/images/hero-bg.jpg',
        title: BRAND_CONFIG.hero.title,
        subtitle: `${BRAND_CONFIG.tagline}. ${BRAND_CONFIG.hero.subtitle}`,
        ctaText: BRAND_CONFIG.hero.ctaText,
        secondaryCtaText: BRAND_CONFIG.hero.secondaryCtaText
      },
      aboutSection: {
        founderImage: '/images/founder.jpg',
        companyImages: ['/images/company1.jpg', '/images/company2.jpg']
      },
      brandStats: BRAND_CONFIG.features
    };
  }

  try {
    const settings = await client.fetch(SITE_SETTINGS_QUERY)
    return settings || {
      title: 'DANIOS',
      description: 'Premium streetwear crafted in Nepal',
      heroSection: {
        backgroundImage: '/images/hero-bg.jpg',
        title: 'Elevate Your Everyday',
        subtitle: 'Crafted in Nepal by Danios. Premium streetwear that defines your style.',
        ctaText: 'Shop Collection',
        secondaryCtaText: 'Our Story'
      },
      aboutSection: {
        founderImage: '/images/founder.jpg',
        companyImages: ['/images/company1.jpg', '/images/company2.jpg']
      },
      brandStats: [
        { value: '100%', label: 'Premium Cotton' },
        { value: 'Made', label: 'in Nepal' },
        { value: 'Free', label: 'Shipping' }
      ]
    };
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {
      title: BRAND_CONFIG.name,
      description: BRAND_CONFIG.description,
      heroSection: {
        backgroundImage: '/images/hero-bg.jpg',
        title: BRAND_CONFIG.hero.title,
        subtitle: `${BRAND_CONFIG.tagline}. ${BRAND_CONFIG.hero.subtitle}`,
        ctaText: BRAND_CONFIG.hero.ctaText,
        secondaryCtaText: BRAND_CONFIG.hero.secondaryCtaText
      },
      aboutSection: {
        founderImage: '/images/founder.jpg',
        companyImages: ['/images/company1.jpg', '/images/company2.jpg']
      },
      brandStats: BRAND_CONFIG.features
    };
  }
}

// Fetch all products
export async function getAllProducts() {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback data. Please set up your Sanity project ID in .env.local');
    return fallbackProducts;
  }

  try {
    const products = await client.fetch(PRODUCTS_QUERY)
    return products.map(product => ({
      id: product._id,
      title: product.title,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.imgs?.thumbnails || ['/images/placeholder.jpg'],
        previews: product.imgs?.gallery || ['/images/placeholder.jpg']
      },
      slug: product.slug?.current || '',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      gender: product.gender || 'unisex',
      sizes: product.sizes || [],
      colors: product.colors || [],
      material: product.material || '',
      style: product.style || '',
      season: product.season || [],
      tags: product.tags || [],
      priceRange: product.priceRange || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || {},
      createdAt: product._createdAt
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    console.warn('Falling back to sample data');
    return fallbackProducts;
  }
}

// Fetch product by ID
export async function getProductById(id) {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback data');
    return fallbackProducts.find(product => product.id === id) || null;
  }

  try {
    const product = await client.fetch(PRODUCT_BY_ID_QUERY, { id })
    if (!product) return null;

    return {
      id: product._id,
      title: product.title,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.imgs?.thumbnails || ['/images/placeholder.jpg'],
        previews: product.imgs?.gallery || ['/images/placeholder.jpg']
      },
      slug: product.slug?.current || '',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      gender: product.gender || 'unisex',
      sizes: product.sizes || [],
      colors: product.colors || [],
      material: product.material || '',
      style: product.style || '',
      season: product.season || [],
      tags: product.tags || [],
      priceRange: product.priceRange || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || {}
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return fallbackProducts.find(product => product.id === id) || null;
  }
}

// Fetch all categories
export async function getAllCategories() {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback data. Please set up your Sanity project ID in .env.local');
    return fallbackCategories;
  }

  try {
    const categories = await client.fetch(CATEGORIES_QUERY)
    return categories.map(category => ({
      id: category._id,
      title: category.name,
      img: category.image || '/images/placeholder.jpg',
      bannerImage: category.bannerImage || category.image || '/images/placeholder.jpg',
      icon: category.icon || category.image || '/images/placeholder.jpg',
      slug: category.slug?.current || '',
      description: category.description || '',
      featured: category.featured || false,
      sortOrder: category.sortOrder || 0
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    console.warn('Falling back to sample data');
    return fallbackCategories;
  }
}

// Fetch product by slug
export async function getProductBySlug(slug) {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, cannot fetch product by slug');
    return null;
  }

  try {
    const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug })
    if (!product) return null

    return {
      id: product._id,
      title: product.name,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.thumbnails || [product.image || '/images/placeholder.jpg'],
        previews: product.previews || [product.image || '/images/placeholder.jpg']
      },
      slug: product.slug?.current || ''
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Search products by query
export async function searchProducts(searchQuery) {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback search');
    return fallbackProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  try {
    const query = `*[_type == "product" && (name match $searchQuery || description match $searchQuery || material->title match $searchQuery || tags[]->title match $searchQuery)] {
      _id,
      name,
      price,
      discountedPrice,
      description,
      category->{
        _id,
        name,
        slug
      },
      "image": image.asset->url,
      "thumbnails": images[].asset->url,
      "previews": images[].asset->url,
      reviews,
      slug
    }`

    const products = await client.fetch(query, { searchQuery: `*${searchQuery}*` })
    return products.map(product => ({
      id: product._id,
      title: product.name,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.thumbnails || [product.image || '/images/placeholder.jpg'],
        previews: product.previews || [product.image || '/images/placeholder.jpg']
      },
      slug: product.slug?.current || ''
    }))
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// Fetch products by category
export async function getProductsByCategory(categorySlug) {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback category filter');
    return fallbackProducts.filter(product =>
      product.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  try {
    const query = `*[_type == "product" && category->slug.current == $categorySlug] {
      _id,
      name,
      price,
      discountedPrice,
      description,
      category->{
        _id,
        name,
        slug
      },
      "image": image.asset->url,
      "thumbnails": images[].asset->url,
      "previews": images[].asset->url,
      reviews,
      slug
    }`

    const products = await client.fetch(query, { categorySlug })
    return products.map(product => ({
      id: product._id,
      title: product.name,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.thumbnails || [product.image || '/images/placeholder.jpg'],
        previews: product.previews || [product.image || '/images/placeholder.jpg']
      },
      slug: product.slug?.current || ''
    }))
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

// Fetch products with combined filters (category + search)
export async function getFilteredProducts(categorySlug = null, searchQuery = null) {
  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback filtered search');
    let filtered = fallbackProducts;

    if (categorySlug) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === categorySlug.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  try {
    let query = `*[_type == "product"`;
    let params = {};

    // Build dynamic query based on filters
    const conditions = [];

    if (categorySlug) {
      conditions.push(`category->slug.current == $categorySlug`);
      params.categorySlug = categorySlug;
    }

    if (searchQuery) {
      conditions.push(`(title match $searchQuery || description match $searchQuery || material->title match $searchQuery || tags[]->title match $searchQuery)`);
      params.searchQuery = `*${searchQuery}*`;
    }

    if (conditions.length > 0) {
      query += ` && (${conditions.join(' && ')})`;
    }

    query += `] {
      _id,
      title,
      price,
      discountedPrice,
      description,
      category->{
        _id,
        name,
        slug,
        "image": image.asset->url,
        "bannerImage": bannerImage.asset->url,
        "icon": icon.asset->url
      },
      "imgs": {
        "thumbnails": imgs.thumbnails[].asset->url,
        "gallery": imgs.gallery[].asset->url
      },
      reviews,
      slug,
      inStock,
      featured,
      gender,
      sizes,
      colors[] {
        name,
        value,
        "image": image.asset->url
      },
      "material": material->title,
      "style": style->title,
      "season": season[]->title,
      "tags": tags[]->title,
      priceRange,
      weight,
      dimensions
    }`;

    const products = await client.fetch(query, params)
    return products.map(product => ({
      id: product._id,
      title: product.title,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.imgs?.thumbnails || ['/images/placeholder.jpg'],
        previews: product.imgs?.gallery || ['/images/placeholder.jpg']
      },
      slug: product.slug?.current || '',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      gender: product.gender || 'unisex',
      sizes: product.sizes || [],
      colors: product.colors || [],
      material: product.material || '',
      style: product.style || '',
      season: product.season || [],
      tags: product.tags || [],
      priceRange: product.priceRange || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || {},
      createdAt: product._createdAt
    }))
  } catch (error) {
    console.error('Error fetching filtered products:', error)
    return []
  }
}

// Advanced product filtering with multiple criteria
export async function getProductsWithFilters(filters = {}) {
  const {
    category,
    gender,
    sizes,
    colors,
    material,
    style,
    season,
    tags,
    priceMin,
    priceMax,
    search,
    sortBy = 'title',
    sortOrder = 'asc'
  } = filters;

  // Check if Sanity is configured and client is available
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback filtered data');
    let filtered = fallbackProducts;

    // Apply filters to fallback data
    if (category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (priceMin) {
      filtered = filtered.filter(product => product.price >= priceMin);
    }
    if (priceMax) {
      filtered = filtered.filter(product => product.price <= priceMax);
    }

    return filtered;
  }

  try {
    // Build dynamic GROQ query based on filters
    let queryConditions = ['_type == "product"'];
    let queryParams = {};

    if (category) {
      queryConditions.push('category->slug.current == $category');
      queryParams.category = category;
    }

    if (gender && gender !== 'all') {
      queryConditions.push('gender == $gender');
      queryParams.gender = gender;
    }

    if (material) {
      queryConditions.push('material->title == $material');
      queryParams.material = material;
    }

    if (style) {
      queryConditions.push('style->title == $style');
      queryParams.style = style;
    }

    if (tags && tags.length > 0) {
      queryConditions.push('count((tags[]->title)[@ in $tags]) > 0');
      queryParams.tags = tags;
    }

    if (priceMin) {
      queryConditions.push('price >= $priceMin');
      queryParams.priceMin = priceMin;
    }

    if (priceMax) {
      queryConditions.push('price <= $priceMax');
      queryParams.priceMax = priceMax;
    }

    if (search) {
      queryConditions.push('(title match $search || description match $search || material->title match $search || tags[]->title match $search)');
      queryParams.search = `*${search}*`;
    }

    // Build the complete query
    const whereClause = queryConditions.join(' && ');
    const orderClause = `order(${sortBy} ${sortOrder})`;

    const query = `*[${whereClause}] | ${orderClause} {
      _id,
      title,
      price,
      discountedPrice,
      description,
      category->{
        _id,
        name,
        slug
      },
      "imgs": {
        "thumbnails": imgs.thumbnails[].asset->url,
        "gallery": imgs.gallery[].asset->url
      },
      reviews,
      slug,
      inStock,
      featured,
      gender,
      sizes,
      colors[] {
        name,
        value,
        "image": image.asset->url
      },
      material,
      style,
      season,
      tags,
      priceRange,
      weight,
      dimensions
    }`;

    const products = await client.fetch(query, queryParams);

    // Additional client-side filtering for complex conditions
    let filteredProducts = products;

    if (sizes && sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes && product.sizes.some(size => sizes.includes(size))
      );
    }

    if (colors && colors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors && product.colors.some(color =>
          colors.includes(color.name) || colors.includes(color.value)
        )
      );
    }

    if (season && season.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.season && product.season.some(s => season.includes(s))
      );
    }

    return filteredProducts.map(product => ({
      id: product._id,
      title: product.title,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      description: product.description || '',
      category: product.category?.name || 'Uncategorized',
      reviews: product.reviews || 0,
      imgs: {
        thumbnails: product.imgs?.thumbnails || ['/images/placeholder.jpg'],
        previews: product.imgs?.gallery || ['/images/placeholder.jpg']
      },
      slug: product.slug?.current || '',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      gender: product.gender || 'unisex',
      sizes: product.sizes || [],
      colors: product.colors || [],
      material: product.material || '',
      style: product.style || '',
      season: product.season || [],
      tags: product.tags || [],
      priceRange: product.priceRange || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || {}
    }));

  } catch (error) {
    console.error('Error fetching products with filters:', error);
    return [];
  }
}

// Get unique filter values for filter UI
export async function getFilterOptions() {
  if (!client || !isValidProjectId(projectId)) {
    return {
      categories: fallbackCategories,
      genders: ['unisex', 'men', 'women'],
      sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
      colors: ['black', 'white', 'gray', 'navy', 'beige'],
      materials: ['100% Cotton', 'Cotton Blend', 'Premium Cotton'],
      styles: ['casual', 'streetwear', 'minimalist'],
      seasons: ['spring', 'summer', 'fall', 'winter'],
      tags: ['new-arrival', 'best-seller', 'premium']
    };
  }

  try {
    const [categories, products] = await Promise.all([
      client.fetch(CATEGORIES_QUERY),
      client.fetch(`*[_type == "product"] {
        gender,
        sizes,
        colors[].name,
        material,
        style,
        season,
        tags
      }`)
    ]);

    // Extract unique values
    const genders = [...new Set(products.map(p => p.gender).filter(Boolean))];
    const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
    const colors = [...new Set(products.flatMap(p => p.colors || []))];
    const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
    const styles = [...new Set(products.map(p => p.style).filter(Boolean))];
    const seasons = [...new Set(products.flatMap(p => p.season || []))];
    const tags = [...new Set(products.flatMap(p => p.tags || []))];

    return {
      categories: categories.map(cat => ({
        id: cat._id,
        title: cat.name,
        slug: cat.slug?.current || '',
        img: cat.image || '/images/placeholder.jpg'
      })),
      genders,
      sizes,
      colors,
      materials,
      styles,
      seasons,
      tags
    };

  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      categories: fallbackCategories,
      genders: ['unisex', 'men', 'women'],
      sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
      colors: ['black', 'white', 'gray', 'navy', 'beige'],
      materials: ['100% Cotton', 'Cotton Blend', 'Premium Cotton'],
      styles: ['casual', 'streetwear', 'minimalist'],
      seasons: ['spring', 'summer', 'fall', 'winter'],
      tags: ['new-arrival', 'best-seller', 'premium']
    };
  }
}

// Create a client with write permissions for orders
export const writeClient = isValidProjectId(projectId) ? createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: false, // Disable CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Required for write operations
}) : null;

// ORDER MANAGEMENT FUNCTIONS

/**
 * Create a new order in Sanity CMS
 */
export async function createOrder(orderData) {
  if (!writeClient) {
    throw new Error('Sanity write client not configured. Please check your environment variables.');
  }

  try {
    // Generate order number and format data
    const generateOrderNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      return `DANIOS-${year}${month}${day}-${random}`;
    };

    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const formattedOrder = {
      _type: 'order',
      orderNumber,
      orderStatus: 'confirmed',
      paymentStatus: 'completed',
      customer: orderData.customer,
      delivery: {
        ...orderData.delivery,
        estimatedDelivery: orderData.delivery.estimatedDelivery || (() => {
          const delivery = new Date();
          delivery.setDate(delivery.getDate() + 5); // 5 days from now
          return delivery.toISOString().split('T')[0];
        })(),
      },
      items: orderData.items.map((item, index) => ({
        _key: `item-${Date.now()}-${index}`,
        ...item,
      })),
      payment: {
        ...orderData.payment,
        esewaTransactionId: orderData.esewaTransactionId,
        esewaResponse: orderData.esewaResponse ? JSON.stringify(orderData.esewaResponse) : undefined,
      },
      orderDate: now,
      lastUpdated: now,
    };

    const result = await writeClient.create(formattedOrder);
    console.log('Order created successfully:', result._id);
    return result;

  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId) {
  if (!client) {
    throw new Error('Sanity client not configured');
  }

  try {
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0] {
        _id,
        orderNumber,
        orderStatus,
        paymentStatus,
        customer,
        delivery,
        items,
        payment,
        orderDate,
        lastUpdated,
        adminNotes,
        trackingNumber
      }`,
      { orderId }
    );

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
}

/**
 * Get orders by customer email
 */
export async function getOrdersByCustomerEmail(email) {
  if (!client) {
    throw new Error('Sanity client not configured');
  }

  try {
    const orders = await client.fetch(
      `*[_type == "order" && customer.email == $email] | order(orderDate desc) {
        _id,
        orderNumber,
        orderStatus,
        paymentStatus,
        customer,
        delivery,
        items,
        payment,
        orderDate,
        lastUpdated,
        trackingNumber
      }`,
      { email }
    );

    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw new Error(`Failed to fetch customer orders: ${error.message}`);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status, trackingNumber = null) {
  if (!writeClient) {
    throw new Error('Sanity write client not configured');
  }

  try {
    const updateData = {
      orderStatus: status,
      lastUpdated: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const result = await writeClient
      .patch(orderId)
      .set(updateData)
      .commit();

    console.log('Order status updated:', result._id);
    return result;

  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

// ============================================
// BLOG FUNCTIONS
// ============================================

/**
 * Get all blog posts
 */
export async function getAllBlogPosts() {
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback blog data');
    return [
      {
        _id: '1',
        title: 'The Art of Sustainable Fashion',
        slug: { current: 'sustainable-fashion' },
        excerpt: 'Discover how we create beautiful clothing while caring for our planet.',
        featuredImage: '/images/blog/sustainable-fashion.jpg',
        author: 'Shreya Ghimire',
        categories: ['Sustainability', 'Fashion'],
        publishedAt: '2024-01-15T10:00:00Z',
        featured: true
      },
      {
        _id: '2',
        title: 'Styling Tips for Cargo Pants',
        slug: { current: 'styling-cargo-pants' },
        excerpt: 'Learn how to style cargo pants for different occasions and seasons.',
        featuredImage: '/images/blog/cargo-pants-styling.jpg',
        author: 'Fashion Team',
        categories: ['Styling', 'Trends'],
        publishedAt: '2024-01-10T14:30:00Z',
        featured: false
      }
    ];
  }

  try {
    const posts = await client.fetch(BLOG_POSTS_QUERY);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug) {
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback blog post');
    return null;
  }

  try {
    const post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// ============================================
// PROMOTION FUNCTIONS
// ============================================

/**
 * Get all active promotions
 */
export async function getAllPromotions() {
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback promotion data');
    return [
      {
        _id: '1',
        title: 'Winter Sale',
        slug: { current: 'winter-sale' },
        description: 'Up to 50% off on selected items',
        type: 'seasonal',
        bannerImage: '/images/promo/winter-sale.jpg',
        discount: { type: 'percentage', value: 50 },
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        ctaText: 'Shop Sale',
        ctaLink: '/shop-collection?sale=true',
        featured: true
      }
    ];
  }

  try {
    const promotions = await client.fetch(PROMOTIONS_QUERY);
    return promotions;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

/**
 * Get featured promotions
 */
export async function getFeaturedPromotions() {
  if (!client || !isValidProjectId(projectId)) {
    return [];
  }

  try {
    const promotions = await client.fetch(
      `*[_type == "promotion" && active == true && featured == true] | order(_createdAt desc) {
        _id,
        title,
        slug,
        description,
        type,
        "bannerImage": bannerImage.asset->url,
        discount,
        ctaText,
        ctaLink,
        backgroundColor,
        textColor
      }`
    );
    return promotions;
  } catch (error) {
    console.error('Error fetching featured promotions:', error);
    return [];
  }
}

// ============================================
// SELLER FUNCTIONS
// ============================================

/**
 * Get all sellers
 */
export async function getAllSellers() {
  if (!client || !isValidProjectId(projectId)) {
    console.warn('Sanity not configured properly, using fallback seller data');
    return [
      {
        _id: '1',
        name: 'Shreya\'s Fashion',
        slug: { current: 'shreyas-fashion' },
        logo: '/images/sellers/shreyas-logo.jpg',
        bannerImage: '/images/sellers/shreyas-banner.jpg',
        description: 'Premium streetwear crafted in Nepal',
        specialties: ['Streetwear', 'Sustainable Fashion', 'Handcrafted'],
        rating: 4.8,
        totalSales: 1250,
        featured: true
      }
    ];
  }

  try {
    const sellers = await client.fetch(SELLERS_QUERY);
    return sellers;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}
