import { render } from '@redwoodjs/testing/web'

import CartListTable from './CartListTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartListTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartListTable />)
    }).not.toThrow()
  })
})
