import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Shreya's Fashion Studio")
    .items([
      // Products Section
      S.listItem()
        .title('🛍️ Products')
        .child(
          S.list()
            .title('Product Management')
            .items([
              S.listItem()
                .title('All Products')
                .child(S.documentTypeList('product').title('All Products')),
              S.listItem()
                .title('Featured Products')
                .child(
                  S.documentList()
                    .title('Featured Products')
                    .filter('_type == "product" && featured == true')
                ),
              S.listItem()
                .title('Out of Stock')
                .child(
                  S.documentList()
                    .title('Out of Stock Products')
                    .filter('_type == "product" && inStock == false')
                ),
              S.listItem()
                .title('New Arrivals')
                .child(
                  S.documentList()
                    .title('New Arrivals')
                    .filter('_type == "product" && "new-arrival" in tags')
                ),
              S.listItem()
                .title('Best Sellers')
                .child(
                  S.documentList()
                    .title('Best Sellers')
                    .filter('_type == "product" && "best-seller" in tags')
                ),
            ])
        ),

      // Categories Section
      S.listItem()
        .title('📂 Categories')
        .child(
          S.list()
            .title('Category Management')
            .items([
              S.listItem()
                .title('All Categories')
                .child(S.documentTypeList('category').title('All Categories')),
              S.listItem()
                .title('Featured Categories')
                .child(
                  S.documentList()
                    .title('Featured Categories')
                    .filter('_type == "category" && featured == true')
                ),
            ])
        ),

      // Orders Section
      S.listItem()
        .title('📦 Orders')
        .child(
          S.list()
            .title('Order Management')
            .items([
              S.listItem()
                .title('All Orders')
                .child(S.documentTypeList('order').title('All Orders')),
              S.listItem()
                .title('Pending Orders')
                .child(
                  S.documentList()
                    .title('Pending Orders')
                    .filter('_type == "order" && orderStatus == "pending"')
                ),
              S.listItem()
                .title('Confirmed Orders')
                .child(
                  S.documentList()
                    .title('Confirmed Orders')
                    .filter('_type == "order" && orderStatus == "confirmed"')
                ),
              S.listItem()
                .title('Processing Orders')
                .child(
                  S.documentList()
                    .title('Processing Orders')
                    .filter('_type == "order" && orderStatus == "processing"')
                ),
              S.listItem()
                .title('Shipped Orders')
                .child(
                  S.documentList()
                    .title('Shipped Orders')
                    .filter('_type == "order" && orderStatus == "shipped"')
                ),
              S.listItem()
                .title('Delivered Orders')
                .child(
                  S.documentList()
                    .title('Delivered Orders')
                    .filter('_type == "order" && orderStatus == "delivered"')
                ),
              S.listItem()
                .title('eSewa Orders')
                .child(
                  S.documentList()
                    .title('eSewa Payment Orders')
                    .filter('_type == "order" && payment.method == "esewa"')
                ),
              S.listItem()
                .title('Cash on Delivery')
                .child(
                  S.documentList()
                    .title('Cash on Delivery Orders')
                    .filter('_type == "order" && payment.method == "cod"')
                ),
            ])
        ),

      // Blog Section
      S.listItem()
        .title('📝 Blog & Content')
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.listItem()
                .title('All Blog Posts')
                .child(S.documentTypeList('blog').title('All Blog Posts')),
              S.listItem()
                .title('Featured Posts')
                .child(
                  S.documentList()
                    .title('Featured Posts')
                    .filter('_type == "blog" && featured == true')
                ),
              S.listItem()
                .title('Draft Posts')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "blog" && !defined(publishedAt)')
                ),
              S.listItem()
                .title('Blog Categories')
                .child(S.documentTypeList('blogCategory').title('Blog Categories')),
              S.listItem()
                .title('Authors')
                .child(S.documentTypeList('author').title('Authors')),
            ])
        ),

      // Marketing Section
      S.listItem()
        .title('🎯 Marketing & Promotions')
        .child(
          S.list()
            .title('Marketing Management')
            .items([
              S.listItem()
                .title('All Promotions')
                .child(S.documentTypeList('promotion').title('All Promotions')),
              S.listItem()
                .title('Active Promotions')
                .child(
                  S.documentList()
                    .title('Active Promotions')
                    .filter('_type == "promotion" && active == true')
                ),
              S.listItem()
                .title('Featured Promotions')
                .child(
                  S.documentList()
                    .title('Featured Promotions')
                    .filter('_type == "promotion" && featured == true')
                ),
              S.listItem()
                .title('Flash Sales')
                .child(
                  S.documentList()
                    .title('Flash Sales')
                    .filter('_type == "promotion" && type == "flash"')
                ),
              S.listItem()
                .title('Seasonal Sales')
                .child(
                  S.documentList()
                    .title('Seasonal Sales')
                    .filter('_type == "promotion" && type == "seasonal"')
                ),
            ])
        ),

      // Enhanced Product Features
      S.listItem()
        .title('👁️ Product Enhancements')
        .child(
          S.list()
            .title('Product Features')
            .items([
              S.listItem()
                .title('Quick View Content')
                .child(S.documentTypeList('quickview').title('Quick View Content')),
              S.listItem()
                .title('Sellers/Vendors')
                .child(S.documentTypeList('seller').title('Sellers/Vendors')),
              S.listItem()
                .title('Featured Sellers')
                .child(
                  S.documentList()
                    .title('Featured Sellers')
                    .filter('_type == "seller" && featured == true')
                ),
              S.listItem()
                .title('Active Sellers')
                .child(
                  S.documentList()
                    .title('Active Sellers')
                    .filter('_type == "seller" && active == true')
                ),
            ])
        ),

      // Divider
      S.divider(),

      // Configuration Section
      S.listItem()
        .title('⚙️ Configuration')
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
            ])
        ),

      // Analytics Section
      S.listItem()
        .title('📊 Analytics')
        .child(
          S.list()
            .title('Store Analytics')
            .items([
              S.listItem()
                .title('Sales Overview')
                .child(
                  S.documentList()
                    .title('Recent Orders')
                    .filter('_type == "order"')
                ),
              S.listItem()
                .title('Popular Products')
                .child(
                  S.documentList()
                    .title('Best Selling Products')
                    .filter('_type == "product" && "best-seller" in tags')
                ),
            ])
        ),

      // Quick Actions
      S.divider(),
      S.listItem()
        .title('➕ Quick Actions')
        .child(
          S.list()
            .title('Quick Actions')
            .items([
              S.listItem()
                .title('Add New Product')
                .child(S.documentTypeList('product').title('Products')),
              S.listItem()
                .title('Add New Category')
                .child(S.documentTypeList('category').title('Categories')),
              S.listItem()
                .title('Create Blog Post')
                .child(S.documentTypeList('blog').title('Blog Posts')),
              S.listItem()
                .title('Create Promotion')
                .child(S.documentTypeList('promotion').title('Promotions')),
              S.listItem()
                .title('Add Seller/Vendor')
                .child(S.documentTypeList('seller').title('Sellers')),
              S.listItem()
                .title('Create Manual Order')
                .child(S.documentTypeList('order').title('Orders')),
            ])
        ),
    ])
