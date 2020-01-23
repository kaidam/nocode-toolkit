import React, { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '20px',
    paddingBottom: '20px',
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
    color: '#666666',
  },
  selectedLink: {
    color: '#444444',
    fontWeight: 'bold',
  }
}))

const DriveBreadcrumbs = ({
  ancestors,
  parent,
  search,
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

  if(search) {
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