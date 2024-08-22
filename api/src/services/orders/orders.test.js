import { orders, order, createOrder, updateOrder, deleteOrder } from './orders'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('orders', () => {
  scenario('returns all orders', async (scenario) => {
    const result = await orders()

    expect(result.length).toEqual(Object.keys(scenario.order).length)
  })

  scenario('returns a single order', async (scenario) => {
    const result = await order({ id: scenario.order.one.id })

    expect(result).toEqual(scenario.order.one)
  })

  scenario('creates a order', async (scenario) => {
    const result = await createOrder({
      input: {
        orderNumber: 'String',
        orderDate: '2024-01-18T20:37:02.132Z',
        orderStatus: 'String',
        shopID: scenario.order.two.shopID,
        userID: scenario.order.two.userID,
        partId: scenario.order.two.partId,
        orderQuantity: 2333054,
        dueInDoc: 'String',
        dueOutDoc: 'String',
        rdd: 'String',
        ujc: 'String',
        dodaac: 'String',
        sd: 'String',
      },
    })

    expect(result.orderNumber).toEqual('String')
    expect(result.orderDate).toEqual(new Date('2024-01-18T20:37:02.132Z'))
    expect(result.orderStatus).toEqual('String')
    expect(result.shopID).toEqual(scenario.order.two.shopID)
    expect(result.userID).toEqual(scenario.order.two.userID)
    expect(result.partId).toEqual(scenario.order.two.partId)
    expect(result.orderQuantity).toEqual(2333054)
    expect(result.dueInDoc).toEqual('String')
    expect(result.dueOutDoc).toEqual('String')
    expect(result.rdd).toEqual('String')
    expect(result.ujc).toEqual('String')
    expect(result.dodaac).toEqual('String')
    expect(result.sd).toEqual('String')
  })

  scenario('updates a order', async (scenario) => {
    const original = await order({ id: scenario.order.one.id })
    const result = await updateOrder({
      id: original.id,
      input: { orderNumber: 'String2' },
    })

    expect(result.orderNumber).toEqual('String2')
  })

  scenario('deletes a order', async (scenario) => {
    const original = await deleteOrder({ id: scenario.order.one.id })
    const result = await order({ id: original.id })

    expect(result).toEqual(null)
  })
})
