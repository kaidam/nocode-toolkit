import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import SectionAdd from './SectionAdd'
import SectionSettings from './SectionSettings'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  settings: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
  },
  add: {
    flexGrow: 0,
  }
}))

const SectionEditor = ({
  id,
  filter,
  location,
  structure,
  tiny,
  stashQueryParams,
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
      <div className={ classes.add }>
        <SectionAdd
          id={ id }
          filter={ filter }
          location={ location }
          structure={ structure }
          tiny={ tiny }
          stashQueryParams={ stashQueryParams }
        />
      </div>
    </div>
  )
}

export default SectionEditor