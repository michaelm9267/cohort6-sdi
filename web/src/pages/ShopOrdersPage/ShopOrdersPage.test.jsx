import { render } from '@redwoodjs/testing/web'

import ShopOrdersPage from './ShopOrdersPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ShopOrdersPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShopOrdersPage />)
    }).not.toThrow()
  })
})
