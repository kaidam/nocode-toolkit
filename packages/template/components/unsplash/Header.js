import React, { useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  titleContainer: {
    flexGrow: 0,
    fontSize: '1.4em',
    textAlign: 'center',
  },
  toolbarContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    width: '300px',
    marginRight: theme.spacing(1),
  },
  sizeContainer: {
    width: '420px',
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    width: '200px',
    marginRight: theme.spacing(1),
  },
  search: {
    marginBottom: theme.spacing(2),
  },
  searchButton: {
    marginLeft: theme.spacing(1),
  },
}))

const UnsplashHeader = ({
  search,
  size,
  onUpdateSearch,
  onUpdateSize,
  onSubmit,
}) => {

  const classes = useStyles()

  const onUpdateSearchHandler = useCallback((ev) => {
    onUpdateSearch(ev.target.value)
  }, [onUpdateSearch])

  const onUpdateSizeHandler = useCallback((ev) => {
    onUpdateSize(ev.target.value)
  }, [onUpdateSize])

  const onKeyPressHandler = useCallback((ev) => {
    if(ev.key == 'Enter') onSubmit()
  }, [onSubmit])

  return (
    <div className={ classes.root }>
      <div className={ classes.titleContainer }>
        images by <a
          style={{
            color: '#000000',
          }}
          target="_blank"
          href="https://unsplash.com/?utm_source=nocode&utm_medium=referral"
        >Unsplash</a>
      </div>
      <div className={ classes.toolbarContainer }>
        <div className={ classes.searchContainer }>
          <TextField
            fullWidth
            id='search'
            name='search'
            label='Search'
            helperText='Search for images'
            value={ search }
            onChange={ onUpdateSearchHandler }
            onKeyPress={ onKeyPressHandler }
          />
        </div>
        <div className={ classes.sizeContainer }>
          <RadioGroup row value={ size } onChange={ onUpdateSizeHandler }>
            <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
            <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
            <FormControlLabel value="sqaure" control={<Radio />} label="Square" />
            <FormControlLabel value="any" control={<Radio />} label="Any" />
          </RadioGroup>
        </div>
        <div className={ classes.buttonContainer }>
          <Button
            className={ classes.searchButton }
            variant="contained"
            size="small"
            onClick={ onSubmit }
          >
            Search
          </Button>
        </div>
        
      </div>
      
    </div>
  )
}

export default UnsplashHeader