import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import SectionAdd from './SectionAdd'
import SectionSettings from './SectionSettings'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  filler: {
    flexGrow: 1,
  },
  children: {
    flexGrow: 0,
  },
  settings: {
    flexGrow: 0,
    marginRight: theme.spacing(1),
  },
  add: {
    flexGrow: 0,
  },
}))

const SectionEditor = ({
  id,
  filter,
  location,
  structure,
  tiny,
  stashQueryParams,
  children,
  extraAddItems,
}) => {
  const classes = useStyles()
  
  return (
    <div className={ classes.root }>
      <div className={ classes.settings }>
        <SectionSettings
          id={ id }
          tiny={ tiny }
        />
      </div>
      <div className={ classes.filler }>
      </div>
      {
        children && (
          <div className={ classes.children }>
            { children }
          </div>
        )
      }
      <div className={ classes.add }>
        <SectionAdd
          id={ id }
          filter={ filter }
          location={ location }
          structure={ structure }
          tiny={ tiny }
          stashQueryParams={ stashQueryParams }
          extraItems={ extraAddItems }
        />
      </div>
    </div>
  )
}

export default SectionEditor