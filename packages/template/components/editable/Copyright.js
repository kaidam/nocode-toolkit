import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Suspense from '@nocode-works/template/components/system/Suspense'
import settingsSelectors from '@nocode-works/template/store/selectors/settings'
import systemSelectors from '@nocode-works/template/store/selectors/system'
import utils from '../utils'

const EditableSettings = lazy(() => import(/* webpackChunkName: "ui" */ '@nocode-works/template/components/settings/EditableSettings'))

const useStyles = makeStyles(theme => {  
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      //marginTop: theme.spacing(2),
    },
    copyrightText: {
      // marginLeft: theme.spacing(2),
      // marginRight: theme.spacing(2),
      color: theme.palette.primary.contrastText,
    },
    editButton: {
      //marginRight: theme.spacing(2),
    },
    editIcon: {
      color: theme.palette.primary.contrastText,
    }
  }
})

const Copyright = ({
  
}) => {
  const classes = useStyles()
  const settings = useSelector(settingsSelectors.settings)
  const showUI = useSelector(systemSelectors.showUI)

  const {
    copyright_mode,
    company_name,
    copyright_message,
  } = settings

  let value = ''

  if(copyright_mode == 'none' && showUI) {
    value = 'copyright message disabled'
  }
  else if(copyright_mode == 'auto' || !copyright_mode) {
    value = utils.autoCopyrightMessage({
      company_name,
    })
  }
  else if(copyright_mode == 'manual') {
    value = copyright_message
  }

  value = value.replace(/\d{4}/, new Date().getFullYear())
  
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
        title="Edit Copyright"
        form="copyright"
      >
        { content }
      </EditableSettings>
    </Suspense>
  ) : content
}

export default Copyright