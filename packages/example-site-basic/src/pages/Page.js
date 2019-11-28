import React from 'react'
import {
  useRoute,
} from '@nocode-toolkit/ui/selectors'

const Page = ({

}) => {
  const route = useRoute()
    return (
      <React.Fragment>
        <div>hello nocode page { route.name }</div>
        {
          route.pageContent && (
            <div>page data: { route.pageContent }</div>
          )
        }
      </React.Fragment>
    )
}

export default Page