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
  finderConfig,
  title,
  onUpdateSearch,
  onSearch,
  onResetSearch,
}) => {

  const classes = useStyles()

  const onUpdateSearchHandler = useCallback((ev) => {
    onUpdateSearch(ev.target.value)
  }, [onUpdateSearch])

  const onKeyPressHandler = useCallback((ev) => {
    if(ev.key == 'Enter') onSearch()
  }, [onSearch])

  const searchComponent = useMemo(() => {
    if(!finderConfig.canSearch()) return null
    return (
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
          onClick={ onSearch }
        >
          Search
        </Button>
        {/* <Button
          className={ classes.searchButton }
          variant="contained"
          size="small"
          onClick={ onResetSearch }
        >
          Clear
        </Button> */}
      </div>
    )
  }, [
    finderConfig,
    search,
    onUpdateSearchHandler,
    onSearch,
    onResetSearch,
  ])

  return (
    <div className={ classes.root }>
      { searchComponent }
    </div>
  )
}

export default DriveHeader