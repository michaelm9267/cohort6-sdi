import { render } from '@redwoodjs/testing/web'

import ShopMap from './ShopMap'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ShopMap', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShopMap />)
    }).not.toThrow()
  })
})
