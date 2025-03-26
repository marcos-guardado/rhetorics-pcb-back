import 'dotenv/config'
import express from 'express'
import { shopify } from './shopify/shopify'

import ordersRoute from './routes/orders/ordersRoute'
import productsRoute from './routes/products/productsRoute'

const app = express()
const port = 3000

app.use(ordersRoute)
app.use(productsRoute)

app.get('/get-inventory-by-id', async (req, res) => {
  try {
    const inventoryId = req.query['inventoryId']
    if (!inventoryId) throw Error('No inventory id provided')
    const inventory = await shopify.inventoryItem.get(
      parseInt(inventoryId as string)
    )
    res.send(inventory)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.listen(port, () => {
  return console.log(`Local listening at http://localhost:${port}`)
})
