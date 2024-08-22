import { render } from '@redwoodjs/testing/web'

import CartDrawer from './CartDrawer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartDrawer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartDrawer />)
    }).not.toThrow()
  })
})
