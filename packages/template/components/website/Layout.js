import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { v4 as uuid } from 'uuid'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

import FormDialog from '../form/Dialog'
import DeleteConfirm from '../dialog/DeleteConfirm'

import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'
import SimpleTable from '../table/SimpleTable'

import widgets from '../../widgets'

import icons from '../../icons'

const DeleteIcon = icons.delete
const EditIcon = icons.edit

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    backgroundColor: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexGrow: 0,
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  row: {

  },
  cell: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  buttons: {
    flexGrow: 0,
  },
  paper: {
    padding: theme.spacing(4),
    minHeight: '160px',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
  },
  addButton: {
    flexGrow: 0,
  },
  caption: {
    marginTop: theme.spacing(2),
  },
}))

const SettingsLayout = ({
  
}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const layouts = useSelector(websiteSelectors.templateLayouts)

  return (
    <Grid
      container
      spacing={ 4 }
      justify="center"
      alignItems="stretch"
    >
      {
        Object.keys(layouts).map(key => {
          const templateLayout = layouts[key]
          return (
            <Grid key={ key } item xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 }>
              <Card
                className={classes.card}
              >
                <CardActionArea
                  className={classes.header}
                  onClick={ () => console.log(key) }
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      { templateLayout.title }
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      { templateLayout.description }
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActionArea
                  className={classes.content}
                  onClick={ () => console.log(key) }
                >
                  {
                    templateLayout.layout.map((row, rowIndex) => {
                      return (
                        <div key={ rowIndex } className={ classes.row }>
                          {
                            row.map((cell, cellIndex) => {
                              const widget = widgets[cell.type]
                              return (
                                <Tooltip key={ cellIndex } title={ widget.description }>
                                  <div className={ classes.cell }>
                                    { widget.title }
                                  </div>
                                </Tooltip>                                
                              )
                            })
                          }
                        </div>
                      )
                    })
                  }
                </CardActionArea>
                <CardActions className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={ () => console.log(key) }
                  >
                    Choose...
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default SettingsLayout