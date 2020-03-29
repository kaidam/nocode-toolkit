import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  searchContainer: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    marginBottom: theme.spacing(2),
  },
  searchButton: {
    marginLeft: theme.spacing(1),
  },
}))

const DriveHeader = ({
  search,
  onChange,
  onSubmit,
}) => {

  const classes = useStyles()

  const onUpdateSearchHandler = useCallback((ev) => {
    onChange(ev.target.value)
  }, [onChange])

  const onKeyPressHandler = useCallback((ev) => {
    if(ev.key == 'Enter') onSubmit()
  }, [onSubmit])

  return (
    <div className={ classes.root }>
      <div className={ classes.searchContainer }>
        <TextField
          fullWidth
          id='search'
          name='search'
          label='Search'
          helperText='Search for content'
          value={ search }
          onChange={ onUpdateSearchHandler }
          onKeyPress={ onKeyPressHandler }
        />
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
  )
}

export default DriveHeader