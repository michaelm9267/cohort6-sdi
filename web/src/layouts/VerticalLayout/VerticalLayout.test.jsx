import { render } from '@redwoodjs/testing/web'

import VerticalLayout from './VerticalLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('VerticalLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<VerticalLayout />)
    }).not.toThrow()
  })
})
