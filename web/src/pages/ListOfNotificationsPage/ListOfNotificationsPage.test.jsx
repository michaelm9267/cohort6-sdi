import { render } from '@redwoodjs/testing/web'

import ListOfNotificationsPage from './ListOfNotificationsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ListOfNotificationsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ListOfNotificationsPage />)
    }).not.toThrow()
  })
})
