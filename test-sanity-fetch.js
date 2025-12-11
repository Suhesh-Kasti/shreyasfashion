
import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

console.log('Config:', { projectId, dataset, apiVersion });

if (!projectId) {
    console.error('Missing Project ID');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Use fresh data
});

const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  "material": material->title,
  "style": style->title,
  "season": season[]->title,
  "tags": tags[]->title,
  category->{ name }
}[0...5]`;

async function testFetch() {
    try {
        console.log('Fetching products...');
        const products = await client.fetch(PRODUCTS_QUERY);
        console.log('Success! Fetched', products.length, 'products.');
        console.log('Sample product:', JSON.stringify(products[0], null, 2));
    } catch (error) {
        console.error('Fetch failed:', error.message);
        process.exit(1);
    }
}

testFetch();
