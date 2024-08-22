import { render } from '@redwoodjs/testing/web'

import ShopInventoryPage from './ShopInventoryPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ShopInventoryPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShopInventoryPage />)
    }).not.toThrow()
  })
})
