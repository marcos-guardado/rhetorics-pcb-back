export interface IOrder {
  id: number
  closed_at: string
  created_at: string
  current_total_price: string
  order_number: number
  total_price: string
  customer: ICustomer
  line_items: ILineItem[]
  tags: string
}

export interface ICustomer {
  id: number
  email: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  phone: string
}

export interface ILineItem {
  id: number
  name: string
  price: string
  price_set: PriceSet
  product_id: number
  quantity: number
  sku: string
  title: string
  variant_id: number
  variant_title?: string
}

export interface PriceSet {
  shop_money: ShopMoney
  presentment_money: PresentmentMoney
}

export interface ShopMoney {
  amount: string
  currency_code: string
}

export interface PresentmentMoney {
  amount: string
  currency_code: string
}

export interface TotalDiscountSet {
  shop_money: ShopMoney2
  presentment_money: PresentmentMoney2
}

export interface ShopMoney2 {
  amount: string
  currency_code: string
}

export interface PresentmentMoney2 {
  amount: string
  currency_code: string
}

export interface TaxLine {
  channel_liable: boolean
  price: string
  price_set: PriceSet2
  rate: number
  title: string
}

export interface PriceSet2 {
  shop_money: ShopMoney3
  presentment_money: PresentmentMoney3
}

export interface ShopMoney3 {
  amount: string
  currency_code: string
}

export interface PresentmentMoney3 {
  amount: string
  currency_code: string
}
