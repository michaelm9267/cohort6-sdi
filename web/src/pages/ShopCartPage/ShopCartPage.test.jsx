import { render } from '@redwoodjs/testing/web'

import ShopCartPage from './ShopCartPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ShopCartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShopCartPage />)
    }).not.toThrow()
  })
})
