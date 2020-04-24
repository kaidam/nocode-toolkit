import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Popper from '@material-ui/core/Popper'

import routerUtils from '../utils/route'
import searchSelectors from '../store/selectors/search'
import systemSelectors from '../store/selectors/system'
import searchActions from '../store/modules/search'
import routerActions from '../store/modules/router'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '0px',
  },
  searchBox: {
    padding: '0px', 
    margin: '0px',
  },
  popper: {
    zIndex: '2000',
  },
  searchResults: {
    border: '1px solid #999',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    maxHeight: '300px',
    minWidth: '200px',
    maxWidth: '400px',
    overflowY: 'auto',
  },
  clearResults: {
    textAlign: 'right',
    color: 'blue',
    cursor: 'pointer',
  },
  resultContainer: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e5e5e5',
    }
  },
  resultTitle: {
    fontWeight: 'bold',    
  },
  resultUrl: {
    color: 'blue',
    fontSize: '0.9em',
  },
  resultSnippet: {
    fontSize: '0.9em',
    color: '#999',
    '& em': {
      fontWeight: 'bold',
    }
  },
  disabledMessage: {
    padding: theme.spacing(1),
    color: '#999',
  }
}))

const Search = ({
  
} = {}) => {

  const classes = useStyles()
  const delayTimeout = useRef(null)
  const anchorEl = useRef(null)
  const dispatch = useDispatch()
  const results = useSelector(searchSelectors.results)
  const loading = useSelector(searchSelectors.loading)
  const showUI = useSelector(systemSelectors.showCoreUI)
  const [value, setValue] = useState('')

  const doSearch = useCallback(query => {
    dispatch(searchActions.search({
      query,
    }))
  }, [])

  const openPage = useCallback(pathname => {
    dispatch(searchActions.setResults([]))
    setValue('')
    const routeName = routerUtils.routePathToName(pathname)
    dispatch(routerActions.navigateTo(routeName))
  }, [])

  const clearSearch = useCallback(() => {
    dispatch(searchActions.setResults([]))
    setValue('')
  })

  useEffect(() => {
    if(delayTimeout.current) clearTimeout(delayTimeout.current)
    delayTimeout.current = setTimeout(() => {
      doSearch(value)
    }, 500)
    dispatch(searchActions.setLoading(true))
  }, [
    value,
  ])

  const open = value && results && results.hits ? true : false

  return (
    <div className={ classes.root }>
      <TextField
        className={ classes.searchBox }
        label="Search"
        variant="outlined"
        fullWidth
        margin="dense"
        value={ value }
        onChange={ (e) => setValue(e.target.value) }
        ref={ anchorEl }
      />
      {
        open && (
          <Popper
            id="search-results-popper"
            open={ open }
            anchorEl={ anchorEl.current }
            placement="bottom-start"
            modifiers={{
              flip: {
                enabled: true,
              },
            }}
            className={ classes.popper }
          >
            <div className={ classes.searchResults }>
              {
                showUI ? (
                  <div>
                    <div
                      className={ classes.clearResults }
                      onClick={ clearSearch }
                    >
                      Clear X
                    </div>
                    <div
                      className={ classes.disabledMessage }
                    >
                      Search will activate once the website has been published.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className={ classes.clearResults }
                      onClick={ clearSearch }
                    >
                      Clear X
                    </div>
                    {
                      results.hits.length <= 0 && (
                        <div
                          className={ classes.disabledMessage }
                        >
                          {
                            loading ? 'Loading...' : 'No results found...'
                          }
                        </div>
                      )
                    }
                    {
                      results.hits
                        .filter(result => {
                          if(!result) return false
                          if(!result._source) return false
                          if(!result.highlight) return false
                          if(!result.highlight.content) return false
                          return true
                        })
                        .map((result, i) => {
                          const {
                            _source: {
                              title,
                              pathname,
                            },
                            highlight: {
                              content,
                            }
                          } = result                  
                          return (
                            <div
                              key={ i }
                              className={ classes.resultContainer }
                              onClick={ () => openPage(pathname) }
                            >
                              <div className={ classes.resultTitle }>
                                { title }
                              </div>
                              <div className={ classes.resultUrl }>
                                { pathname }
                              </div>
                              <div
                                className={ classes.resultSnippet }
                                dangerouslySetInnerHTML={{__html: content.join(', ') }}
                              >
                              </div>
                            </div>
                          )
                        })
                    }
                  </div>
                )
              }
            </div>
          </Popper>
        )
      }
    </div>
  )
}

const widget = () => ({
  id: 'search',
  title: 'Search',
  Render: Search,
})

export default widget