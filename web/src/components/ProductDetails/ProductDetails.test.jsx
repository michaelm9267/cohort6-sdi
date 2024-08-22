import { render } from '@redwoodjs/testing/web'

import ProductDetails from './ProductDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductDetails />)
    }).not.toThrow()
  })
})
