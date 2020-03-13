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
  if(!tabs || tabs.length <= 0) return null
  let currentTab = tabs.find(tab => tab.id == current)
  currentTab = currentTab || tabs[0]
  return (
    <React.Fragment>
      <Tabs value={ currentTab.id } onChange={ (e, value) => onChange(value) }>
        {
          tabs.map((tab, i) => {
            return (
              <Tab key={ i } label={ tab.title } value={ tab.id } />
            )
          })
        }
      </Tabs>
      {
        currentTab.element
      }
    </React.Fragment>
  )
  
}

export default TabsWrapper