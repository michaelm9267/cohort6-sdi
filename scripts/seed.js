import { ShopInventory } from 'api/db/mock_data/Shopinventory'
import { UserRequest } from 'api/db/mock_data/UserRequest'
import { Notification } from 'api/db/mock_data/notification'
import { Order } from 'api/db/mock_data/orders'
import { Part } from 'api/db/mock_data/part'
import { Shop } from 'api/db/mock_data/shop'
import { User } from 'api/db/mock_data/user'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const generateData = async (data, table) => {
      for (let instance of data) {
        await db[table].create({
          data: instance,
        })
      }
      console.log('TABLE:\n', table)
      console.log('DATA:\n', data, '\n')
    }
    await generateData(Part, 'part')
    await generateData(Shop, 'shop')
    await generateData(UserRequest, 'UserRequest')
    await generateData(User, 'user')
    await generateData(Order, 'order')
    await generateData(Notification, 'notification')
    await generateData(ShopInventory, 'Shopinventory')
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
