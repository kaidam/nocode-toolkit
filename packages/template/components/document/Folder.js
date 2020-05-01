import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Link from '../widgets/Link'
import contentSelectors from '../../store/selectors/content'
import Suspense from '../system/Suspense'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  row: {
    marginTop: theme.spacing(1), 
  }
}))

const Folder = ({
  node,
  DefaultFolder,
  addContentFilter,
}) => {
  const classes = useStyles()
  const children = useSelector(contentSelectors.routeChildren)

  if(!children || children.length <= 0) {
    return (
      <Suspense>
        <DefaultFolder
          node={ node }
          addContentFilter={ addContentFilter }
        />
      </Suspense>
    )
  }
  return (
    <div className={ classes.root }>
      <ul>
        {
          children
            .map((child, i) => {
              return (
                <li
                  key={ i }
                  className={ classes.row }
                >
                  <Link
                    path={ child.route.path }
                    name={ child.route.name }
                  >
                    { child.name }
                  </Link>
                </li>
              )
            })
        }
      </ul>
    </div>
  )
}

export default Folder
