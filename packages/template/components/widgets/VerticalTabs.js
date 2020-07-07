import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'


const useStyles = makeStyles(theme => ({
  selectedTab: {
    color: theme.palette.primary.main,
  },
}))

const VerticalTabs = ({
  selected,
  tabs,
  onChange,
}) => {
  const classes = useStyles()
  return (
    <List>
      {
        tabs.map((tab) => {
          const Icon = tab.icon
          const isSelected = tab.id == selected
          const useClassname = isSelected ? classes.selectedTab : ''
          const content = (
            <ListItem
              key={ tab.id }
              button
              selected={ isSelected }
              onClick={ () => onChange(tab.id) }
            >
              {
                Icon && (
                  <ListItemIcon className={ useClassname }><Icon /></ListItemIcon>
                )
              }
              {
                tab.title && (
                  <ListItemText className={ useClassname } primary={ tab.title } />
                )
              }
            </ListItem>
          )

          return tab.tooltip ? (
            <Tooltip title={ tab.tooltip } key={ tab.id }>
              { content }
            </Tooltip>
          ) : content
        })
      }
    </List>
  )
}

export default VerticalTabs