import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import icons from '../../icons'

const CodeIcon = icons.code

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'center',
    paddingTop: theme.spacing(4),
  },
  text: {
    color: '#999',
  },
  iconContainer: {
    marginTop: theme.spacing(2),
  },
  icon: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#ccc',
  }
}))

const EmptyState = ({
  
}) => {
  const classes = useStyles()

  return (
    <div className={ classes.root }>
      <Typography variant="caption" className={ classes.text } gutterBottom>
        This is a section with no content.
        <br /><br />
        We can fix that by adding some Google Documents to it.
      </Typography>
      <div className={ classes.iconContainer }>
        <CodeIcon className={ classes.icon } />
      </div>
    </div>
  )
}

export default EmptyState