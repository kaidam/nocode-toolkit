import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Suspense from '../system/Suspense'
import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'

const EditableSettings = lazy(() => import(/* webpackChunkName: "ui" */ '../settings/EditableSettings'))

const useStyles = makeStyles(theme => {  
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      //marginTop: theme.spacing(2),
    },
    copyrightText: ({color}) => ({
      // marginLeft: theme.spacing(2),
      // marginRight: theme.spacing(2),
      color: color == 'light' ?
        theme.palette.primary.contrastText :
        '#666'
    }),
    editButton: {
      //marginRight: theme.spacing(2),
    },
    editIcon: ({color}) => ({
      // marginLeft: theme.spacing(2),
      // marginRight: theme.spacing(2),
      color: color == 'light' ?
        theme.palette.primary.contrastText :
        '#666'
    }),
  }
})

const autoCopyrightMessage = title => `© ${new Date().getFullYear()} ${title || ''}`

const Copyright = ({
  color = 'light',
  field = 'company_name',
}) => {
  const classes = useStyles({
    color,
  })
  const settings = useSelector(settingsSelectors.settings)
  const showUI = useSelector(systemSelectors.showUI)

  const value = autoCopyrightMessage(settings[field])

  const content = (
    <div className={ classes.container }>
      <Typography
        variant="body1"
        className={ classes.copyrightText }
      >
        { value }
      </Typography>
    </div>
  )

  return showUI ? (
    <Suspense>
      <EditableSettings
        title="Copyright"
        group="copyright"
      >
        { content }
      </EditableSettings>
    </Suspense>
  ) : content
}

export default Copyright