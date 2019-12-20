import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'

import selectors from '../../store/selectors'
import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'

import library from '../../types/library'


const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  title: {
    fontSize: 14,
  },
}))

const SettingsPluginInstall = ({
  
}) => {

  const classes = useStyles()
  const settings = useSelector(selectors.ui.settings)
  const settingsData = settings ? settings.data : {}
  const activePlugins = settingsData.activePlugins || {}

  const actions = Actions(useDispatch(), {
    onTogglePlugin: (plugin) => {
      return uiActions.togglePlugin({
        id: plugin.id,
        title: plugin.title,
        value: activePlugins[plugin.id] ? false : true,
      })
    },
  }, [activePlugins])
  

  return (
    <div>
      {
        library.plugins.map((plugin, i) => {
          return (
            <Card
              key={ i }
              className={classes.card}
            >
              <CardContent>
                <Typography className={classes.title} gutterBottom>
                  { plugin.title }
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  { plugin.description }
                </Typography>
              </CardContent>
              <CardActions>
                <Switch
                  checked={ activePlugins[plugin.id] ? true : false }
                  onChange={ () => actions.onTogglePlugin(plugin) }
                  value="yes"
                />
              </CardActions>
            </Card>
          )
        })
      }
    </div>
  )
}

export default SettingsPluginInstall
