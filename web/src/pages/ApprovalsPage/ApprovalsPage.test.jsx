import { render } from '@redwoodjs/testing/web'

import ApprovalsPage from './ApprovalsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ApprovalsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ApprovalsPage />)
    }).not.toThrow()
  })
})
