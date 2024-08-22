import { render } from '@redwoodjs/testing/web'

import OrderFormPage from './OrderFormPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OrderFormPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderFormPage />)
    }).not.toThrow()
  })
})
