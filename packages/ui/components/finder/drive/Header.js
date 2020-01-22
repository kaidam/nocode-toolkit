import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import GoogleDriveLogo from '../../../styles/GoogleDriveLogo'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleContainer: {
    display: 'flex',
    width: '256px',
    paddingTop: '20px',
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
  driveTitle: {
    color: '#999',
    display: 'inline-block',
    paddingLeft: '10px',
  }
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

  const titleComponent = useMemo(() => {
    return (
      <div className={ classes.titleContainer }>
        <GoogleDriveLogo /> <span className={ classes.driveTitle }>Drive</span>
      </div>
    )
  }, [])

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
      { titleComponent }
      { searchComponent }
    </div>
  )
}

export default DriveHeader