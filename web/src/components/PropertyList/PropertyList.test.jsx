import { render } from '@redwoodjs/testing/web'

import PropertyList from './PropertyList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PropertyList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PropertyList />)
    }).not.toThrow()
  })
})
