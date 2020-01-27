import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Popper from '@material-ui/core/Popper'
import selectors from '../../store/selectors'

import searchActions from '../../store/modules/search'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  popper: {
    zIndex: '2000',
  },
  searchResults: {
    border: '1px solid #999',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    maxHeight: '300px',
    minWidth: '400px',
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
}))

const Search = ({
  content,
}) => {

  const classes = useStyles()
  const delayTimeout = useRef(null)
  const anchorEl = useRef(null)
  const dispatch = useDispatch()
  const results = useSelector(selectors.search.results)
  //const showUI = useSelector(selectors.ui.showUI)
  const showUI = false
  const [value, setValue] = useState('')

  const doSearch = useCallback(query => {
    dispatch(searchActions.search({
      query,
    }))
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
  }, [
    value,
  ])

  const open = value && results && results.hits && results.hits.length > 0 ? true : false

  return (
    <div className={ classes.root }>
      <TextField
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
                    Search will activate once the website has been published.
                  </div>
                ) : (
                  <div>
                    <div
                      className={ classes.clearResults }
                      onClick={ clearSearch }
                    >
                      Clear Results X
                    </div>
                    {
                      results.hits.map((result, i) => {
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

export default Search