import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  heading: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}))

const Title = ({
  node,
}) => {
  const classes = useStyles()
  return (
    <Typography 
      variant="h5" 
      className={ classes.heading }
    >
      { node.name }
    </Typography>
  )
}

export default Title