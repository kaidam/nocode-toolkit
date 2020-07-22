import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'


import WidgetSummary from './WidgetSummary'
import widgets from '../../widgets'

const useStyles = makeStyles(theme => ({
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
  cell: ({greyBg}) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    border: '1px solid #ccc',
    backgroundColor: greyBg ? '#fff' : '',
  }),
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

const LayoutCard = ({
  greyBg,
  id,
  data,
  isSelected,
  onSelect,
}) => {

  const classes = useStyles({greyBg})
  const useColor = isSelected ? 'secondary' : 'textPrimary'
  
  return (
    
    <Card
      className={ classes.card }
    >
      <CardActionArea
        className={ classes.header }
        onClick={ () => !isSelected && onSelect(id) }
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color={ useColor }>
            { data.title }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" color={ useColor }>
            { data.description }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActionArea
        className={ classes.content }
        onClick={ () => !isSelected && onSelect(id) }
      >
        {
          data.layout.map((row, rowIndex) => {
            return (
              <div key={ rowIndex } className={ classes.row }>
                {
                  row.map((cell, cellIndex) => {
                    const widget = widgets[cell.type]
                    return (
                      <Tooltip key={ cellIndex } title={ widget.description }>
                        <div className={ classes.cell }>
                          <WidgetSummary
                            widget={ widget }
                          />
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
      <CardActions className={ classes.buttons }>
        <div className={ classes.buttonsFiller }></div>
        <div className={ classes.buttonsContent }>
          {
            isSelected ? (
              <Typography gutterBottom variant="body1" color={ useColor }>
                selected
              </Typography>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={ () => !isSelected && onSelect(id) }
              >
                Choose...
              </Button>
            )
          }
        </div>
      </CardActions>
    </Card>
  )
}

export default LayoutCard