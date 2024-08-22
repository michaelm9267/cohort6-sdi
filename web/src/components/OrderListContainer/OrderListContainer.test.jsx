import { render } from '@redwoodjs/testing/web'

import OrderListContainer from './OrderListContainer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrderListContainer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderListContainer />)
    }).not.toThrow()
  })
})
