import { render } from '@redwoodjs/testing/web'

import OrderEdit from './OrderEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrderEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderEdit />)
    }).not.toThrow()
  })
})
