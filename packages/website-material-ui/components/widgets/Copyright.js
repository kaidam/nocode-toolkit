import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BaseCopyright from '@nocode-toolkit/ui/components/widgets/Copyright'

const useStyles = makeStyles(theme => createStyles({  
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: theme.spacing(2),
  },
  copyrightText: {
    color: theme.palette.primary.contrastText,
  },
}))

const Renderer = ({
  value,
  ...props
}) => {
  const classes = useStyles()
  return (
    <Typography
      variant="body1"
      className={ classes.copyrightText }
    >
      <span dangerouslySetInnerHTML={{__html: value}}>
      </span>
    </Typography>
  )
}

const Copyright = (props = {}) => {
  return (
    <BaseCopyright
      renderers={{
        content: Renderer
      }}
      {...props}
    />
  )
}

export default Copyright