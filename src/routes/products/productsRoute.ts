import express from 'express'

import { shopify } from '../../shopify/shopify'

const router = express.Router()

router.get('/get-product', async (req, res) => {
  try {
    const productId = req.query['productId']
    if (!productId) throw Error('No product id provided')
    const product = await shopify.product.get(parseInt(productId as string))
    res.send(product)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

router.get('/products', async (req, res) => {
  try {
    const limit = req.query['limit'] ?? 30
    const products = await shopify.product.list({ limit: limit })
    res.send(products)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
  // const productId = req.
})

router.get('/get-variant', async (req, res) => {
  try {
    const variantId = req.query['variantId']
    if (!variantId) throw Error('No product id provided')
    const variant = await shopify.productVariant.get(
      parseInt(variantId as string)
    )
    res.send(variant)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

export default router
