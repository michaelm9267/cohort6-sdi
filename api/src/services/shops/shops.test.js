import { shops, shop, createShop, updateShop, deleteShop } from './shops'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('shops', () => {
  scenario('returns all shops', async (scenario) => {
    const result = await shops()

    expect(result.length).toEqual(Object.keys(scenario.shop).length)
  })

  scenario('returns a single shop', async (scenario) => {
    const result = await shop({ id: scenario.shop.one.id })

    expect(result).toEqual(scenario.shop.one)
  })

  scenario('creates a shop', async () => {
    const result = await createShop({
      input: {
        name: 'String',
        phone: 'String',
        address: 'String',
        city: 'String',
        state: 'String',
        zip: 311355,
        orgCode: 'String',
        shopCode: 'String',
        owner: 'String',
        userRole: 'String',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.phone).toEqual('String')
    expect(result.address).toEqual('String')
    expect(result.city).toEqual('String')
    expect(result.state).toEqual('String')
    expect(result.zip).toEqual(311355)
    expect(result.orgCode).toEqual('String')
    expect(result.shopCode).toEqual('String')
    expect(result.owner).toEqual('String')
    expect(result.userRole).toEqual('String')
  })

  scenario('updates a shop', async (scenario) => {
    const original = await shop({ id: scenario.shop.one.id })
    const result = await updateShop({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a shop', async (scenario) => {
    const original = await deleteShop({ id: scenario.shop.one.id })
    const result = await shop({ id: original.id })

    expect(result).toEqual(null)
  })
})
