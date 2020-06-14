import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

import useMenuButton from '../hooks/useMenuButton'
import useDocumentEditor from '../hooks/useDocumentEditor'
import contentSelectors from '../../store/selectors/content'

const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Roboto',
    padding: theme.spacing(1),
  },
  title: {
    margin: '0px',
  },
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
}))

const DefaultHome = ({
  
}) => {
  const classes = useStyles()

  const sectionSelector = useMemo(contentSelectors.section, [])
  const sectionData = useSelector(state => sectionSelector(state, 'topbar'))

  const {
    getAddMenu,
  } = useDocumentEditor({
    node: {
      id: sectionData ? sectionData.defaultFolderId : '',
    },
    addContentParams: {
      homepage: true,
    }
  })

  const {
    menus,
    onClick,
  } = useMenuButton({
    getItems: getAddMenu,
  })

  if(!sectionData || !sectionData.defaultFolderId) {
    return (
      <div className={ classes.root }>
        <h3 className={ classes.title }>Homepage</h3>
      </div>
    )
  }

  return (
    <div className={ classes.root }>
      <h3 className={ classes.title }>Create your homepage!</h3>
      <p>Create a new Google Document or Folder and it will appear here, on your homepage</p>
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick(e)
          }}
        >
          <AddIcon />&nbsp;&nbsp;Add Content
        </Button>
      </div>
      {
        menus
      }
    </div>
  )
}

export default DefaultHome
