import React from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

/*

  tabs is an array of:

   * id
   * title
   * element
   
  we pass already rendered elements so we reset forms

*/
const TabsWrapper = ({
  tabs,
  current,
  onChange,
}) => {
  return (
    <Tabs value={ current } onChange={ (e, value) => onChange(value) }>
      {
        tabs.map((tab, i) => {
          return (
            <Tab key={ i } label={ tab.title } value={ tab.id } />
          )
        })
      }
    </Tabs>
  )
}

export default TabsWrapper