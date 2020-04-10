import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'

import library from '../../library'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  title: {
    fontSize: 14,
  },
}))

const SettingsPluginInstall = ({
  active = {},
  onToggle,
}) => {

  const classes = useStyles()
  
  return (
    <div className={ classes.root }>
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
                  checked={ active[plugin.id] ? true : false }
                  onChange={ () => onToggle(plugin.id) }
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
