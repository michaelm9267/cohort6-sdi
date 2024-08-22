import { render } from '@redwoodjs/testing/web'

import CartDetails from './CartDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartDetails />)
    }).not.toThrow()
  })
})
