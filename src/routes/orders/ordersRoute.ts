import express from 'express'
import bodyParser from 'body-parser'

import { shopify } from '../../shopify/shopify'
import { createDateObject } from '../../utils/dates'

import { ICustomer, ILineItem, IOrder } from './orders.interface'

const router = express.Router()

const jsonParser = bodyParser.json()

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms))

router.put('/order', async (req, res) => {
  try {
    const { orderId } = req.query
    if (!orderId) throw Error('No order id provided')
    const id = parseInt(orderId as string)
    const order = await shopify.order.get(id)

    const IN_RHETORICS_ACCOUNT_TAG = 'In Rhetorics Account'
    const resp = await shopify.order.update(id, {
      tags: `${order.tags}, ${IN_RHETORICS_ACCOUNT_TAG}`,
    })

    res.json(resp)
  } catch (error) {
    res.sendStatus(error)
  }
})

router.put('/orders', jsonParser, async (req, res) => {
  const IN_RHETORICS_ACCOUNT_TAG = 'In Rhetorics Account'

  try {
    const { ordersId } = req.body
    const ids = ordersId as Array<string>
    if (ids.length === 0) throw Error('No orders id provided')

    const updateExecution = ids.map(async orderId => {
      const id = parseInt(orderId as string)
      const order = await shopify.order.get(id)

      return shopify.order.update(id, {
        tags: `${order.tags}, ${IN_RHETORICS_ACCOUNT_TAG}`,
      })
    })

    await delay(1000)

    const resp = await Promise.all(updateExecution)

    res.json(resp)
  } catch (error) {
    res.sendStatus(error)
  }
})

router.get('/orders', async (req, res) => {
  try {
    const { month, year, tag: tagToFilter } = req.query
    if (!month || !year) throw Error('Need a month and year to get orders')
    const { startDate, endDate } = createDateObject(
      parseInt(month as string),
      parseInt(year as string)
    )

    const resp = await shopify.order.list({
      status: 'closed',
      fields:
        'id,closed_at,created_at,current_total_price,order_number,total_price,customer,line_items,tags',
      created_at_min: startDate.toISOString(),
      created_at_max: endDate.toISOString(),
    })
    const orders = resp
      .filter(order => {
        if (!tagToFilter) return order
        const tags = tagToFilter
          ? order.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.trim() !== '')
          : []
        if (tags.includes(tagToFilter as string)) return order
      })
      .map(
        ({
          id,
          closed_at,
          created_at,
          current_total_price,
          order_number,
          total_price,
          customer,
          line_items,
          tags,
        }) => {
          const finalCustomerInfo: ICustomer = {
            id: customer.id,
            email: customer.email,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
          }

          const finalLineItems: ILineItem[] = line_items.map(
            ({
              id,
              name,
              price,
              price_set,
              product_id,
              quantity,
              sku,
              title,
              variant_id,
              variant_title,
            }) => {
              return {
                id,
                name,
                price,
                price_set,
                product_id,
                quantity,
                sku,
                title,
                variant_id,
                variant_title,
              } as ILineItem
            }
          )

          return {
            id,
            closed_at,
            created_at,
            current_total_price,
            order_number,
            total_price,
            customer: finalCustomerInfo,
            line_items: finalLineItems,
            tags,
          } as IOrder
        }
      )

    const formattedOrders = orders.map(getOrderDetails)
    const totalSales = formattedOrders.reduce((acc, sale) => {
      return acc + sale.saleTotal
    }, 0)
    const ordersByMonth = {
      orders: formattedOrders,
      totalByMonth: totalSales,
    }

    res.status(200).json(ordersByMonth)
  } catch (error) {
    res.sendStatus(error)
  }
})

const getOrderDetails = (order: IOrder) => {
  const { first_name, last_name } = order.customer
  const clientName = `${first_name} ${last_name}`
  const {
    id,
    tags,
    order_number,
    current_total_price,
    created_at: saleDate,
  } = order

  const relevantInfoPerOrder = {
    id,
    tags,
    saleDate,
    clientName,
    orderNumber: order_number,
    saleTotal: parseFloat(current_total_price),
  }

  return relevantInfoPerOrder
}

export default router
