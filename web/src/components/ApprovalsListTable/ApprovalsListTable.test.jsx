import { render } from '@redwoodjs/testing/web'

import ApprovalsListTable from './ApprovalsListTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ApprovalsListTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ApprovalsListTable />)
    }).not.toThrow()
  })
})
