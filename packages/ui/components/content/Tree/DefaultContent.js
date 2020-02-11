import React, { useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import icons from '../../../icons'

import SectionAdd from '../../buttons/SectionAdd'

const AddIcon = icons.add

const useStyles = makeStyles(theme => createStyles({
  root: {
    textAlign: 'center',
  },
  button: {
    textAlign: 'center',
  },
}))

const DefaultContent = ({
  section,
}) => {
  const classes = useStyles()

  const filter = useCallback((parentFilter) => parentFilter.indexOf('section') >= 0)

  return (
    <div className={ classes.root }>
      <p>Get started by adding content to this section:</p>
      <div className={ classes.button }>
        <SectionAdd
          id={ section }
          location={`section:${section}`}
          structure="tree"
          sectionType="sidebar"
          filter={ filter }
          getButton={onClick => (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={ onClick }
            >
              <AddIcon />&nbsp;&nbsp;Add Content
            </Button>
          )}
        />
      </div>
    </div>
  )
}

export default DefaultContent
