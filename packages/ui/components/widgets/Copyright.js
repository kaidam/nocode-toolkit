import React, { lazy } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'

import selectors from '../../store/selectors'

import Suspense from '../system/Suspense'

const EditButton = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/EditButton'))

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

const Copyright = ({

}) => {
  const classes = useStyles()
  const settings = useSelector(selectors.layout.settings)

  const copyright_message = settings.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())

  return (
    <div className={ classes.container }>
      <Suspense>
        <div className={ classes.editButton }>
          <EditButton 
            id="settings"
            driver="local"
            type="settings"
            location="singleton:settings"
            tiny
          />
        </div>
      </Suspense>
      <Typography
        variant="body1"
        color="textSecondary"
        className={ classes.copyrightText }
      >
        <span dangerouslySetInnerHTML={{__html: copyrightMessage}}>
        </span>
      </Typography>
    </div>
    
  )
}

export default Copyright