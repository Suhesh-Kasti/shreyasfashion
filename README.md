# E-Commerce Platform

## 🌟 Introduction
Welcome to a modern, high-performance e-commerce website designed for selling clothing and accessories. This project is built to be fast, secure, and easy to manage explicitly for the Nepali market (supporting eSewa and Cash on Delivery).

### ✅ What This Website Can Do
-   **Showcase Products**: Display products with images, details, sizes, and colors.
-   **Search & Filter**: Users can search for items and filter by category, price, or size.
-   **User Accounts**: Users can sign in with **Google** to save their profile and order history.
-   **Shopping Cart**: Add items, adjust quantities, and see the total cost.
-   **Checkout**: robust checkout process collecting delivery details.
-   **Payments**: Supports **eSewa** (Digital Wallet) and **Cash on Delivery (COD)**.
-   **Email Notifications**: Automatically sends emails to the Admin (when a new order comes in) and the User (order confirmation).
-   **Mobile Responsive**: Looks great on phones, tablets, and computers.
-   **Print Orders**: Users can print their order confirmation receipt.

### ❌ What It Currently Can't Do (Future Improvements)
-   **Real-time Stock Deduction**: While it checks stock, complex inventory management for large warehouses isn't fully automated yet.
-   **International Payments**: Currently optimized for Nepal (eSewa/COD); Stripe/PayPal are not configured.

---

## 🛠️ Technology Stack (What We Used & Why)

We chose the best modern tools to ensure the site is fast, cheap to host, and easy to maintain.

| Technology | Why We Used It |
| :--- | :--- |
| **Next.js 15** | The engine of the website. It makes pages load instantly and helps with SEO (ranking on Google). |
| **Typescript** | A "safer" version of JavaScript. It prevents bugs by checking code before it runs. |
| **Tailwind CSS** | For styling. It allows us to create beautiful, custom designs without writing messy CSS files. |
| **Sanity.io** | The **Content Management System (CMS)**. This is where you add/remove products, change prices, and upload images *without touching code*. |
| **NextAuth.js** | Handles security. It manages the "Sign in with Google" functionality safely. |
| **Resend** | A service to send emails reliably. It ensures order confirmations don't go to Spam. |
| **eSewa** | The payment gateway integration for digital payments in Nepal. |

---

## 🔑 Step-by-Step Setup Guide

Follow these steps to get the project running on your computer or the internet.

### 1. 📥 Get the Code
If you haven't already, download this folder or "clone" it from GitHub.
```bash
git clone https://github.com/yourusername/danios-fashion.git
cd danios-fashion
```

### 2. 🔐 Get Your API Keys (The "Keys" to the Castle)
You need specific codes (API Keys) to connect the website to services like Google and Sanity. Create a file named `.env.local` in the main folder and fill it in:

#### A. Sanity CMS (For Products)
1.  Go to [Sanity.io](https://www.sanity.io/) and sign up.
2.  Create a new project.
3.  Go to **API** settings and add `http://localhost:3000` to **CORS Origins**.
4.  Copy your **Project ID** and **Dataset** name.

#### B. Google Cloud (For Sign In)
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Go to **APIs & Services > OAuth consent screen**. Text "External" and fill in required fields.
4.  Go to **Credentials > Create Credentials > OAuth Client ID**.
5.  **Application Type**: Web Application.
6.  **Authorized Origins**: `http://localhost:3000` (and your real website link later).
7.  **Authorized Redirect URIs**: `http://localhost:3000/api/auth/callback/google` (and your real link later).
8.  Copy the **Client ID** and **Client Secret**.

#### C. Resend (For Emails)
1.  Go to [Resend.com](https://resend.com/home) and sign up.
2.  Create an API Key.
3.  Verify your domain if you want to send from `orders@yourdomain.com`, usually `onboarding@resend.dev` works for testing.

#### D. Fill `.env.local`
Create a file named `.env.local` and paste this (replace values with yours):

```env
# Sanity (Content)
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2023-01-01"

# Google Auth (Login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth (Security)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any_super_long_random_password_here"

# Resend (Emails)
RESEND_API_KEY="re_123456789"
RESEND_FROM_EMAIL="onboarding@resend.dev"
ADMIN_EMAIL="your_personal_email@gmail.com"

# Payment
NEXT_PUBLIC_ESEWA_MERCHANT_CODE="EPAYTEST"
```

### 3. 🚀 Install & Run
Open your terminal (Command Prompt) in the project folder:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```
Now open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## ☁️ How to Deploy (Put it on the Internet)

### 1. Upload to GitHub
1.  Create an account on [GitHub.com](https://github.com/).
2.  Create a **New Repository** (this name is going to be used as *repo_name*.vercel.app or *repo_name*.pages.dev after we deploy it to vercel or cloudflare later).
3.  In your project folder terminal:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    git push -u origin main
    ```

### 2. Deploy on Vercel (Easiest Way)
1.  Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2.  Click **"Add New..."** > **Project** > Import your repo.
3.  **IMPORTANT**: In the "Environment Variables" section, paste all the values from your `.env.local` file.
4.  Click **Deploy**.
5.  Wait 2 minutes, and your site is live!

---

## 📧 How to Verify Domain for Resend (Emails)

To send emails from `orders@yourdomain.com` instead of the testing address:
1.  Go to [Resend Domains](https://resend.com/domains).
2.  Click **Add Domain**.
3.  Enter your website domain.
4.  Resend will give you **DNS Records** (DKIM, SPF).
5.  Go to where you bought your domain (GoDaddy, Namecheap, Cloudflare) and add these records.
6.  Once verified in Resend, update `RESEND_FROM_EMAIL` in your `.env.local` file.

---

## 🛍️ Sanity Studio Guide (Managing the Store)

### What is Sanity Studio?
Sanity Studio is your **admin dashboard** where you manage all content (products, orders, blog posts, etc.) **without writing code**. Think of it as the "back office" of your store.

### How to Access
- **Locally**: Run `npm run studio:dev` and visit `http://localhost:3333`
- **Live**: Visit `https://yoursite.com/studio`
- Login with the Google/GitHub account you used for Sanity

---

## 📋 Understanding All Sections

### 🛍️ Products
**Purpose**: Manage your product catalog

**Sub-sections**:
- **All Products**: Complete list of every product
- **Featured Products**: Products marked as "featured" (shown on homepage)
- **Out of Stock**: Products with inventory = 0
- **New Arrivals**: Recently added products
- **Best Sellers**: Popular/featured items

**Common Actions**:
- **Add Product**: Click Products → Create → Fill in details → Publish
- **Edit Product**: Click product → Modify → Publish
- **Delete Product**: Click product → ... menu → Delete

---

### 📂 Categories
**Purpose**: Organize products into groups (e.g., Shirts, Pants, Accessories)

**Sub-sections**:
- **All Categories**: All product categories
- **Featured Categories**: Categories shown prominently on homepage

**How to Use**:
1. Create a category first (e.g., "T-Shirts")
2. When adding a product, link it to a category

---

### 📦 Orders
**Purpose**: View all customer orders - THIS IS WHERE YOU SEE SALES!

**What You'll See**:
- Customer name, email, phone
- Items purchased
- Payment method (eSewa or Cash on Delivery)
- Payment status (Paid/Pending)
- Delivery address
- Order total

**Sub-sections** (filtered views):
- **All Orders**: Every order placed
- **Pending**: Orders awaiting confirmation
- **Confirmed**: Orders you've confirmed
- **Processing**: Orders being prepared
- **Shipped**: Orders sent out
- **Delivered**: Completed orders
- **eSewa Orders**: Paid via eSewa
- **Cash on Delivery**: COD orders

**Important**: Orders are automatically created when customers checkout. You just view and manage them here.

---

### 📝 Blog & Content
**Purpose**: Write blog posts about fashion trends, styling tips, etc.

**Sub-sections**:
- **All Blog Posts**: Every blog article
- **Featured Posts**: Highlighted on blog homepage
- **Draft Posts**: Unpublished articles
- **Blog Categories**: Organize blogs (e.g., "Style Tips", "News")
- **Authors**: People who write blogs

---

### 🎯 Marketing & Promotions
**Purpose**: Create sales, discounts, and special offers

**Sub-sections**:
- **All Promotions**: Every promotion/sale
- **Active Promotions**: Currently running sales
- **Featured Promotions**: Shown prominently
- **Flash Sales**: Limited-time deals
- **Seasonal Sales**: Holiday/seasonal promotions

**Example**: Create a "Summer Sale 2025" promotion with 20% off all T-Shirts

---

### 👁️ Product Enhancements
**Purpose**: Additional features for products

**Sub-sections**:
- **Quick View Content**: Info shown in product pop-ups
- **Sellers/Vendors**: If you allow multi-vendor sales
- **Featured Sellers**: Highlighted vendors
- **Active Sellers**: Currently active vendors

*(Most stores won't use this section unless you're running a marketplace)*

---

### ⚙️ Configuration
**Purpose**: Global website settings - **THIS IS IMPORTANT!**

**Sub-sections**:
- **Site Settings**: Site name, logo, homepage content, hero images
- **Footer Settings**: ✨ Customize footer links, social media, contact info
- **Search Settings**: ✨ Quick search links & popular search terms
- **Materials**: Product materials (Cotton, Polyester, etc.)
- **Styles**: Product styles (Casual, Formal, etc.)
- **Seasons**: Season tags (Summer, Winter, etc.)
- **Tags**: Product tags (Best Seller, New Arrival, etc.)

**How to Customize Footer**:
1. Go to Configuration → Footer Settings
2. Edit sections:
   - Help & Support (address, phone, email)
   - Quick Links (Privacy, Terms, FAQ, etc.)
   - Account Links (My Orders, Login, etc.)
   - Social Media (Facebook, Instagram, TikTok, etc.)
   - Payment Methods (eSewa, COD icons)
3. Click Publish

**How to Customize Search**:
1. Go to Configuration → Search Settings
2. Add Quick Search links (e.g., "Hoodies" → `/shop-collection?category=hoodies`)
3. Add Popular Search terms (e.g., "Black", "Oversized")
4. Click Publish

---

### 📊 Analytics
**Purpose**: Quick stats about your store

**Sub-sections**:
- **Sales Overview**: Recent orders
- **Popular Products**: Best-selling items

*(This is a simplified analytics view. For detailed stats, use Google Analytics or connect a proper analytics tool)*

---

### ➕ Quick Actions
**Purpose**: Shortcuts to create common items quickly

**Available Actions**:
- Add New Product
- Add New Category
- Create Blog Post
- Create Promotion
- Add Seller/Vendor
- Create Manual Order


