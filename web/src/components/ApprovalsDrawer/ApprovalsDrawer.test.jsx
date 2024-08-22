import { render } from '@redwoodjs/testing/web'

import ApprovalsDrawer from './ApprovalsDrawer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ApprovalsDrawer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ApprovalsDrawer />)
    }).not.toThrow()
  })
})
