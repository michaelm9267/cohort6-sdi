import { render } from '@redwoodjs/testing/web'

import ListOfUnitsPage from './ListOfUnitsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ListOfUnitsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ListOfUnitsPage />)
    }).not.toThrow()
  })
})
