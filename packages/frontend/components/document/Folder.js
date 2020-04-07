import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Link from '@nocode-toolkit/website/Link'
import contentSelectors from '../../store/selectors/content'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  row: {
    marginTop: theme.spacing(1), 
  }
}))

const Folder = ({
  node,
}) => {
  const classes = useStyles()
  const children = useSelector(contentSelectors.routeChildren)
  return (
    <div className={ classes.root }>
      {
        children
          .map((child, i) => {
            return (
              <div
                key={ i }
                className={ classes.row }
              >
                <Link
                  path={ child.route.path }
                  name={ child.route.name }
                >
                  { child.name }
                </Link>
              </div>
            )
          })
      }
    </div>
  )
}

export default Folder
