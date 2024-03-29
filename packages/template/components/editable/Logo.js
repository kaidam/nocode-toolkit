import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '../widgets/Link'
import Suspense from '../system/Suspense'
import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'

const EditableSettings = lazy(() => import(/* webpackChunkName: "ui" */ '../settings/EditableSettings'))

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
    logoText: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      whiteSpace: 'nowrap',
    },
    logoImage: {
      height: `${theme.layout.topbarHeight * 0.5}px`,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    editButton: {
      
    },
    editIcon: {
      //color: theme.palette.primary.main,
    }
  }
})


const Logo = ({
  defaultLogo,
  hideText,
}) => {
  const classes = useStyles()
  const settings = useSelector(settingsSelectors.settings)
  const showUI = useSelector(systemSelectors.showUI)

  let {
    logo,
    logo_text,
  } = settings

  if(!logo_text && !logo && showUI) logo_text = 'Your Logo'

  const content = (
    <div className={ classnames(classes.container, 'nocode-logo-container') }>
      {
        logo && logo.url && (
          <img className={ classnames(classes.logoImage, 'nocode-logo-image') } src={ logo.url } />
        )
      }
      {
        (!logo || !logo.url) && defaultLogo && (
          <img className={ classnames(classes.logoImage, 'nocode-logo-image') } src={ defaultLogo } />
        )
      }
      {
        logo_text && !hideText && (
          <Typography
            variant="h5"
            className={ classnames(classes.logoText, 'nocode-logo-text') }
          >
            { logo_text }
          </Typography>
        )
      }
    </div>
  )

  return showUI ? (
    <Suspense>
      <EditableSettings
        title="Logo"
        group="logo"
      >
        { content }
      </EditableSettings>
    </Suspense>
  ) : (
    <Link
      path="/"
      className={ classes.link }
    >
      { content }
    </Link>
  )
}

export default Logo