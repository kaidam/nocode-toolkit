import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SectionAdd from './SectionAdd'
import SectionSettings from './SectionSettings'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  children: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
  sectionType,
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
      <div className={ classes.children }>
        { children }
      </div>
      <div className={ classes.add }>
        <SectionAdd
          id={ id }
          filter={ filter }
          location={ location }
          structure={ structure }
          sectionType={ sectionType }
          tiny={ tiny }
          stashQueryParams={ stashQueryParams }
          extraItems={ extraAddItems }
        />
      </div>
    </div>
  )
}

export default SectionEditor