import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

const useStyles = makeStyles(theme => ({
  menuItem: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
  },
  menuIcon: {
    marginRight: '0px',
  },
  normalListItem: {
    color: theme.palette.grey[600],
  },
}))

const ButtonList = ({
  items,
  theme = {},
  getTitle = (item, i) => item.name,
  IconClass,
  getButtons,
}) => {
  const classes = useStyles()
  return (
    <div className={ theme.root }>
      <List>
        {
          items.map((item, index) => {
            return (
              <ListItem
                key={ index }
                dense
                className={ classes.menuItem }
              >
                {
                  IconClass && (
                    <ListItemIcon>
                      <IconClass />
                    </ListItemIcon>
                  )
                }
                <ListItemText
                  classes={{
                    primary: classes.normalListItem
                  }}
                  primary={ getTitle(item, index) }
                />
                {
                  getButtons && (
                    <ListItemSecondaryAction>
                      { getButtons(item) }
                    </ListItemSecondaryAction>
                  )
                }
              </ListItem>  
            )
          })
        }
      </List>
    </div>
  )
}

export default ButtonList
