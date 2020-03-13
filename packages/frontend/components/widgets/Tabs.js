import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  topbar: {
    flexGrow: 0,
  },
  content: {
    flexGrow: 0,
  },
  scroll: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
}))

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
  autoScroll = true,
  onChange,
}) => {

  const classes = useStyles()

  if(!tabs || tabs.length <= 0) return null
  let currentTab = tabs.find(tab => tab.id == current)
  currentTab = currentTab || tabs[0]

  const contentClassname = classnames({
    [classes.content]: true,
    [classes.scroll]: autoScroll,
  })
  return (
    <div className={ classes.container }>
      <div className={ classes.topbar }>
        <Tabs value={ currentTab.id } onChange={ (e, value) => onChange(value) }>
          {
            tabs.map((tab, i) => {
              return (
                <Tab key={ i } label={ tab.title } value={ tab.id } />
              )
            })
          }
        </Tabs>
      </div>
      <div className={ contentClassname }>
        {
          currentTab.element
        }
      </div>
    </div>
  )
  
}

export default TabsWrapper