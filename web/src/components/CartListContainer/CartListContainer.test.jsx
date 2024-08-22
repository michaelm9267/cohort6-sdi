import { render } from '@redwoodjs/testing/web'

import CartListContainer from './CartListContainer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartListContainer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartListContainer />)
    }).not.toThrow()
  })
})
