import React from 'react'
import {
  useRoute,
  useConfig,
} from '@nocode-toolkit/ui/selectors'

const Page = ({

}) => {
  const route = useRoute()
  const config = useConfig()
  return (
    <React.Fragment>
      <p>hello nocode page { route.name }</p>
      {
        route.pageContent && (
          <p>page data: { route.pageContent }</p>
        )
      }
      {
        config.clickMessage && (
          <p>{ config.clickMessage }</p>
        )
      }
    </React.Fragment>
  )
}

export default Page