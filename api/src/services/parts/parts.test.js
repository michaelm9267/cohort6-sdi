import { parts, part, createPart, updatePart, deletePart } from './parts'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('parts', () => {
  scenario('returns all parts', async (scenario) => {
    const result = await parts()

    expect(result.length).toEqual(Object.keys(scenario.part).length)
  })

  scenario('returns a single part', async (scenario) => {
    const result = await part({ id: scenario.part.one.id })

    expect(result).toEqual(scenario.part.one)
  })

  scenario('creates a part', async () => {
    const result = await createPart({
      input: {
        nomenclature: 'String',
        nsn: 'String',
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
    expect(result.nsn).toEqual('String')
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

  scenario('updates a part', async (scenario) => {
    const original = await part({ id: scenario.part.one.id })
    const result = await updatePart({
      id: original.id,
      input: { nomenclature: 'String2' },
    })

    expect(result.nomenclature).toEqual('String2')
  })

  scenario('deletes a part', async (scenario) => {
    const original = await deletePart({ id: scenario.part.one.id })
    const result = await part({ id: original.id })

    expect(result).toEqual(null)
  })
})
