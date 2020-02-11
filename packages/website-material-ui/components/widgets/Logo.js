import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Link from '@nocode-toolkit/website/Link'
import BaseLogo from '@nocode-toolkit/ui/components/widgets/Logo'

const useStyles = makeStyles(theme => {  
  return {
    link: {
      color: theme.palette.primary.contrastText,
      textDecoration: ['none', '!important'],
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: ({contrast,showUI}) => ({
      paddingLeft: showUI ? '0px' : '4px',
      color: contrast ? 
        theme.palette.primary.contrastText :
        theme.palette.primary.main,
      whiteSpace: 'nowrap',
    }),
    logoImage: {
      height: `${theme.layout.topbarHeight-40}px`,
      marginRight: theme.spacing(2),
    },
    editButton: {
      marginRight: theme.spacing(2),
    },
    logoEditButton: {
      marginLeft: theme.spacing(2),
    },
  }
})

const Renderer = ({
  showUI,
  value: {
    title,
    imageUrl,
  },
  contrast,
  ...props
}) => {
  const classes = useStyles({contrast,showUI})
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