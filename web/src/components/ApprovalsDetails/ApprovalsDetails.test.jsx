import { render } from '@redwoodjs/testing/web'

import ApprovalsDetails from './ApprovalsDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ApprovalsDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ApprovalsDetails />)
    }).not.toThrow()
  })
})
