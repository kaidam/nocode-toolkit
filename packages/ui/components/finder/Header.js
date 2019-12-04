import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import AddContentButton from '../buttons/AddContent'

const useStyles = makeStyles(theme => createStyles({
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  toolbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabsContainer: {
    flexGrow: 0,
    marginRight: theme.spacing(2),
  },
  searchContainer: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexGrow: 0,
  },
  search: {
    marginBottom: theme.spacing(2),
  },
  searchButton: {
    marginLeft: theme.spacing(1),
  }
}))

const DEFAULT_ARRAY = []

const FinderHeader = ({
  driver,
  parent,
  search,
  finderConfig,
  tab,
  title,
  onOpenTab,
  onUpdateSearch,
  onSearch,
  onResetSearch,
}) => {

  const classes = useStyles()

  const tabs = finderConfig.tabs ?
    finderConfig.tabs :
    DEFAULT_ARRAY

  const onOpenTabHandler = useCallback((ev, value) => {
    const tab = tabs[value]
    onOpenTab(tab.id)
  }, [tabs, onOpenTab])

  const onUpdateSearchHandler = useCallback((ev) => {
    onUpdateSearch(ev.target.value)
  }, [onUpdateSearch])

  const titleComponent = useMemo(() => {
    if(!title) return null
    return (
      <div className={ classes.titleContainer }>
        { title }
      </div>
    )
  }, [title])

  const tabComponent = useMemo(() => {
    if(tabs.length <= 0) return null

    let activeTabIndex = tabs
      .map(t => t.id)
      .indexOf(tab)

    if(activeTabIndex < 0) activeTabIndex = 0

    return (
      <div className={ classes.tabsContainer }>
        <Tabs
          value={ activeTabIndex }
          indicatorColor="primary"
          textColor="primary"
          onChange={ onOpenTabHandler }
        >
          {
            tabs.map((tab, i) => {
              return (
                <Tab
                  key={ i }
                  label={ tab.title }
                />
              )
            })
          }
        </Tabs>
      </div>
    )
  }, [
    tabs,
    tab,
  ])

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
        />
        <Button
          className={ classes.searchButton }
          variant="contained"
          color="secondary"
          size="small"
          onClick={ onSearch }
        >
          Search
        </Button>
        <Button
          className={ classes.searchButton }
          variant="contained"
          size="small"
          onClick={ onResetSearch }
        >
          Clear
        </Button>
      </div>
    )
  }, [
    finderConfig,
    search,
    onUpdateSearchHandler,
    onSearch,
    onResetSearch,
  ])

  const addButtonComponent = useMemo(() => {
    // if we are searching there is no parent
    // so we can't add anything
    if(search) return null

    // ask the finder config if we can add to where we are
    if(!finderConfig.canAddToFinder(tab)) return null

    return (
      <div className={ classes.buttonContainer }>
        <AddContentButton
          stashQueryParams
          filter={ (parentFilter) => parentFilter.indexOf(`${driver}.finder`) >= 0 }
          location={ `finder:${parent || 'root'}` }
        />
      </div>
      
    )
  }, [
    search,
    finderConfig,
    driver,
    parent,
  ])

  return (
    <div>
      { titleComponent }
      <div className={ classes.toolbarContainer }>
        { tabComponent }
        { searchComponent }
        { addButtonComponent }
      </div>
    </div>
  )
}

export default FinderHeader