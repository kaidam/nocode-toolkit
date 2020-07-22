import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import icons from '../../icons'
import useSectionEditor from '../hooks/useSectionEditor'
import useMenuButton from '../hooks/useMenuButton'

const CodeIcon = icons.code
const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'center',
    paddingTop: theme.spacing(4),
  },
  text: {
    color: '#999',
  },
  iconContainer: {
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
  icon: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#ccc',
  }
}))

const EmptyState = ({
  section,
}) => {
  const classes = useStyles()

  const {
    getAddItems,
  } = useSectionEditor({
    section,
    content_id: `section:${section}`,
    layout_id: 'widgets',
    withWidgets: true,
  })

  const menuButton = useMenuButton({
    getItems: getAddItems,
  })

  return (
    <div className={ classes.root }>
      <Typography variant="caption" className={ classes.text } gutterBottom>
        This is a section with no content.
        <br /><br />
        We can fix that by adding something:
      </Typography>
      <div className={ classes.buttonContainer }>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            menuButton.onClick(e)
          }}
        >
          <AddIcon />&nbsp;&nbsp;Add
        </Button>
      </div>
      {
        menuButton.menus
      }
    </div>
  )
}

export default EmptyState