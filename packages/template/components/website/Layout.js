import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

import widgets from '../../widgets'

import icons from '../../icons'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  card: ({greyBg}) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: greyBg ? theme.palette.grey[100] : '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
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
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    border: '1px solid #ccc',
    textAlign: 'center',
    fontSize: '0.8em',
  },
  buttons: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  buttonsFiller: {
    flexGrow: 1,
  },
  buttonsContent: {
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
  greyBg,
  selected,
  layouts,
  onSelect,
}) => {

  const classes = useStyles({greyBg})
  
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
          const useColor = key == selected ? 'secondary' : 'textPrimary'
          return (
            <Grid key={ key } item xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 }>
              <Card
                className={classes.card}
              >
                <CardActionArea
                  className={classes.header}
                  onClick={ () => onSelect(key) }
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2" color={ useColor }>
                      { templateLayout.title }
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" color={ useColor }>
                      { templateLayout.description }
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActionArea
                  className={classes.content}
                  onClick={ () => onSelect(key) }
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
                  <div className={ classes.buttonsFiller }></div>
                  <div className={ classes.buttonsContent }>
                    {
                      key == selected ? (
                        <Typography gutterBottom variant="body1" color={ useColor }>
                          selected
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={ () => onSelect(key) }
                        >
                          Choose...
                        </Button>
                      )
                    }
                  </div>
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