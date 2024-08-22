import {
  UserRequests,
  UserRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from './UserRequests'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('UserRequests', () => {
  scenario('returns all UserRequests', async (scenario) => {
    const result = await UserRequests()

    expect(result.length).toEqual(Object.keys(scenario.UserRequest).length)
  })

  scenario('returns a single UserRequest', async (scenario) => {
    const result = await UserRequest({ id: scenario.UserRequest.one.id })

    expect(result).toEqual(scenario.UserRequest.one)
  })

  scenario('creates a UserRequest', async () => {
    const result = await createUserRequest({
      input: {
        email: 'String',
        firstName: 'String',
        lastName: 'String',
        rank: 'String',
        password: 'String',
        shopID: 9035134,
      },
    })

    expect(result.email).toEqual('String')
    expect(result.firstName).toEqual('String')
    expect(result.lastName).toEqual('String')
    expect(result.rank).toEqual('String')
    expect(result.password).toEqual('String')
    expect(result.shopID).toEqual(9035134)
  })

  scenario('updates a UserRequest', async (scenario) => {
    const original = await UserRequest({
      id: scenario.UserRequest.one.id,
    })
    const result = await updateUserRequest({
      id: original.id,
      input: { email: 'String2' },
    })

    expect(result.email).toEqual('String2')
  })

  scenario('deletes a UserRequest', async (scenario) => {
    const original = await deleteUserRequest({
      id: scenario.UserRequest.one.id,
    })
    const result = await UserRequest({ id: original.id })

    expect(result).toEqual(null)
  })
})
