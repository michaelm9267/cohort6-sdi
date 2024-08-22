import { render } from '@redwoodjs/testing/web'

import OrderDetails from './OrderDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrderDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderDetails />)
    }).not.toThrow()
  })
})
