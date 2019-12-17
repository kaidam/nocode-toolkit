import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Link from '@nocode-toolkit/website/Link'
import BaseLogo from '@nocode-toolkit/ui/components/widgets/Logo'

const useStyles = makeStyles(theme => createStyles({  
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: ['none', '!important'],
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: theme.palette.primary.contrastText,
    whiteSpace: 'nowrap',
  },
  logoImage: {
    height: `${theme.layout.logoHeight}px`,
    padding: '3px',
    marginRight: theme.spacing(2),
  },
  editButton: {
    marginRight: theme.spacing(2),
  },
  logoEditButton: {
    marginLeft: theme.spacing(2),
  },
}))

const Renderer = ({
  value: {
    title,
    imageUrl,
  },
  props = {},
}) => {
  const classes = useStyles()
  const classOverrides = props.classes || {}
  const titleClassname = classOverrides.title || ''
  return (
    <Link
      path="/"
      className={ classes.link }
    >
      <div className={ classes.container }>
        {
          imageUrl && (
            <img className={ classes.logoImage } src={ imageUrl } />
          )
        }
        {
          title && (
            <Typography
              variant="h5"
              className={ `${classes.logoText} ${titleClassname}` }
            >
              { title }
            </Typography>
          )
        }
      </div>
    </Link>
  )
}

const Logo = (props = {}) => {
  return (
    <BaseLogo
      renderers={{
        content: Renderer
      }}
      {...props}
    />
  )
}

export default Logo