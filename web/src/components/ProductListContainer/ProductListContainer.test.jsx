import { render } from '@redwoodjs/testing/web'

import ProductListContainer from './ProductListContainer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductListContainer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductListContainer />)
    }).not.toThrow()
  })
})
