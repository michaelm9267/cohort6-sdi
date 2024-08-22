import { render } from '@redwoodjs/testing/web'

import ProductDrawer from './ProductDrawer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductDrawer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductDrawer />)
    }).not.toThrow()
  })
})
