import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      fontSize: '1em',
      color: theme.palette.grey[600],
    },
    text: {
      fontSize: '0.7em',
      color: theme.palette.grey[600],
    },
  }
})

const WidgetSummary = ({
  widget,
}) => {

  const classes = useStyles()
  const WidgetIcon = widget.icon

  return (
    <div className={ classes.root }>
      <WidgetIcon className={ classes.icon }/>&nbsp;&nbsp;<span className={ classes.text }>{ widget.title }</span>
    </div>
  )
}

export default WidgetSummary