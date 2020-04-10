import React, { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  loadingRoot: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '1.3em',
  },
  link: {
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e5e5e5',
    }
  },
  nonSelectedLink: {
    color: blue[600],
    textDecoration: 'underline',
  },
  selectedLink: {
    color: '#444444',
    fontWeight: 'bold',
  }
}))

const DriveBreadcrumbs = ({
  ancestors,
  parent,
  searchActive,
  loading,
  onOpenFolder,
  onOpenTab,
}) => {

  const classes = useStyles()

  const onClick = useCallback((breadcrumb) => {
    if(breadcrumb.tab) onOpenTab(breadcrumb.tab)
    else if(breadcrumb.folder) onOpenFolder(breadcrumb.folder)
  }, [
    onOpenFolder,
    onOpenTab,
  ])

  if(searchActive) {
    return (
      <div className={ classes.root }>
        Search results...
      </div>
    )
  }

  let breadcrumbs = []

  if((!ancestors || ancestors.length <= 0)) {
    if(parent == 'root' || !parent) {
      breadcrumbs.push({
        title: 'My Drive',
        tab: 'root',
      })
    }
    else if(parent == 'shared') {
      breadcrumbs.push({
        title: 'Shared with me',
        tab: 'shared',
      })
    }
  }
  else {
    const ancestorWorkspace = [].concat(ancestors)
    if(ancestorWorkspace[0].name == 'My Drive') {
      ancestorWorkspace.shift()
      breadcrumbs.push({
        title: 'My Drive',
        tab: 'root',
      })
    }
    else {
      breadcrumbs.push({
        title: 'Shared with me',
        tab: 'shared',
      })
    }

    breadcrumbs = breadcrumbs.concat(ancestorWorkspace.map(ancestor => {
      return {
        title: ancestor.name,
        folder: ancestor.id,
      }
    }))
  }

  if(loading) {
    return (
      <div className={ classes.loadingRoot }>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={16}
          thickness={2}
        />
      </div>
    )
  }

  return (
    <div className={ classes.root }>
      {
        breadcrumbs.map((breadcrumb, i) => {
          
          const className = [
            classes.link,
            i == breadcrumbs.length - 1 ? classes.selectedLink : classes.nonSelectedLink,
          ].join(' ')

          return (
            <React.Fragment key={ i }>
              <span className={ className } onClick={ () => onClick(breadcrumb) }>
                { breadcrumb.title }
              </span>
              {
                i < breadcrumbs.length - 1 && (
                  <span>&nbsp;/&nbsp;</span>
                )
              }
            </React.Fragment>
          )
        })
      }
    </div>
  )
}

export default DriveBreadcrumbs