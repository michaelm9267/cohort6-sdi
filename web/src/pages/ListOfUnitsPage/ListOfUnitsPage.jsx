import { MetaTags } from '@redwoodjs/web'

import ListOfUnitsCell from 'src/components/ListOfUnitsCell'
const ListOfUnitsPage = () => {
  return (
    <>
      <MetaTags title="ListOfUnits" description="ListOfUnits page" />
      <ListOfUnitsCell />
    </>
  )
}

export default ListOfUnitsPage
