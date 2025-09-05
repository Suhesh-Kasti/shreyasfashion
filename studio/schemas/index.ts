import category from './category'
import product from './product'
import siteSettings from './siteSettings'
import order from './order'
import blog from './blog'
import blogCategory from './blogCategory'
import author from './author'
import promotion from './promotion'
import quickview from './quickview'
import seller from './seller'

export const schemaTypes = [
  // Main e-commerce types
  product,
  category,
  order,

  // Blog content types
  blog,
  blogCategory,
  author,

  // Marketing & promotions
  promotion,

  // Enhanced product features
  quickview,

  // Multi-vendor support
  seller,

  // Configuration types
  siteSettings,
]
