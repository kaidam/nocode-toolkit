import React, { lazy } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Link from '@nocode-toolkit/website/lib/Link'

import Suspense from '../system/Suspense'

const EditButton = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/EditButton'))

import selectors from '../../store/selectors'

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

const Logo = ({

}) => {
  const classes = useStyles()
  const logo = useSelector(selectors.layout.logo)

  let logoTitle = logo.title
  const imageUrl = logo.image ?
    logo.image.url :
    null

  if(!logoTitle && !imageUrl) logoTitle = 'My Website'

  return (
    <Link
      path="/"
      className={ classes.link }
    >
      <div className={ classes.container }>
        <Suspense>
          <div className={ classes.editButton }>
            <EditButton 
              id="logo"
              driver="local"
              type="logo"
              location="singleton:logo"
              tiny
            />
          </div>
        </Suspense>
        {
          imageUrl && (
            <img className={ classes.logoImage } src={ imageUrl } />
          )
        }
        {
          logoTitle && (
            <Typography
              variant="h5"
              className={ classes.logoText }
            >
              { logoTitle }
            </Typography>
          )
        }
      </div>
    </Link>
  )
}

export default Logo