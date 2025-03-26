import Shopify from 'shopify-api-node'

export const shopify = new Shopify({
  shopName: process.env.SHOPIFY_DOMAIN_ALT,
  // apiKey: process.env.SHOPIFY_API_KEY,
  // password: process.env.SHOPIFY_SECRET_API_KEY,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: '2025-01'
})
