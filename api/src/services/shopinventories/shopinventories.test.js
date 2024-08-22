import {
  shopinventories,
  shopinventory,
  createShopinventory,
  updateShopinventory,
  deleteShopinventory,
} from './shopinventories'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('shopinventories', () => {
  scenario('returns all shopinventories', async (scenario) => {
    const result = await shopinventories()

    expect(result.length).toEqual(Object.keys(scenario.shopinventory).length)
  })

  scenario('returns a single shopinventory', async (scenario) => {
    const result = await shopinventory({ id: scenario.shopinventory.one.id })

    expect(result).toEqual(scenario.shopinventory.one)
  })

  scenario('creates a shopinventory', async () => {
    const result = await createShopinventory({
      input: {
        nomenclature: 'String',
        nsn: 'String9613278',
        partNumber: 'String',
        cageCode: 'String',
        unitOfIssue: 'String',
        unitPrice: 'String',
        isg: 'String',
        commodityCode: 'String',
        shelfLifeCode: 'String',
        typeCargoCode: 'String',
        hazardousMaterialCode: 'String',
        rid: 'String',
        location: 'String',
        nmfc: 'String',
        wuc: 'String',
        description: 'String',
        manufacturer: 'String',
        qrCode: 'String',
      },
    })

    expect(result.nomenclature).toEqual('String')
    expect(result.nsn).toEqual('String9613278')
    expect(result.partNumber).toEqual('String')
    expect(result.cageCode).toEqual('String')
    expect(result.unitOfIssue).toEqual('String')
    expect(result.unitPrice).toEqual('String')
    expect(result.isg).toEqual('String')
    expect(result.commodityCode).toEqual('String')
    expect(result.shelfLifeCode).toEqual('String')
    expect(result.typeCargoCode).toEqual('String')
    expect(result.hazardousMaterialCode).toEqual('String')
    expect(result.rid).toEqual('String')
    expect(result.location).toEqual('String')
    expect(result.nmfc).toEqual('String')
    expect(result.wuc).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.manufacturer).toEqual('String')
    expect(result.qrCode).toEqual('String')
  })

  scenario('updates a shopinventory', async (scenario) => {
    const original = await shopinventory({
      id: scenario.shopinventory.one.id,
    })
    const result = await updateShopinventory({
      id: original.id,
      input: { nomenclature: 'String2' },
    })

    expect(result.nomenclature).toEqual('String2')
  })

  scenario('deletes a shopinventory', async (scenario) => {
    const original = await deleteShopinventory({
      id: scenario.shopinventory.one.id,
    })
    const result = await shopinventory({ id: original.id })

    expect(result).toEqual(null)
  })
})
