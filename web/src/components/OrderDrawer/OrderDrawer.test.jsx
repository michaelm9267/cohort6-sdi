import { render } from '@redwoodjs/testing/web'

import OrderDrawer from './OrderDrawer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrderDrawer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderDrawer />)
    }).not.toThrow()
  })
})
