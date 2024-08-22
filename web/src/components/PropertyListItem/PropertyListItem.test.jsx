import { render } from '@redwoodjs/testing/web'

import PropertyListItem from './PropertyListItem'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PropertyListItem', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PropertyListItem />)
    }).not.toThrow()
  })
})
