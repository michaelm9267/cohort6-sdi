import { render } from '@redwoodjs/testing/web'

import CartEdit from './CartEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartEdit />)
    }).not.toThrow()
  })
})
