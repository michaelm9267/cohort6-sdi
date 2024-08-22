import { render } from '@redwoodjs/testing/web'

import ProductEdit from './ProductEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductEdit />)
    }).not.toThrow()
  })
})
