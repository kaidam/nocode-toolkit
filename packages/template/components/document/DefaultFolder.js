import React, { useRef, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import OnboardingContext from '../contexts/onboarding'

import icons from '../../icons'

import useMenuButton from '../hooks/useMenuButton'
import useDocumentEditor from '../hooks/useDocumentEditor'

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

const DefaultFolder = ({
  node,
  addContentFilter,
}) => {
  const buttonRef = useRef(null)
  const classes = useStyles()
  const context = useContext(OnboardingContext)

  const {
    getAddContentItems,
  } = useDocumentEditor({
    node,
    addContentFilter,
  })

  let title = ''
  let menus = null
  let onClick = null

  const items = getAddContentItems()

  if(items && items.length == 1) {
    const item = items[0]
    title = `Add ${item.title}`
    onClick = item.handler
  }
  else {
    const menuButton = useMenuButton({
      getItems: getAddContentItems,
    })

    title = 'Add Content'
    menus = menuButton.menus
    onClick = menuButton.onClick
  }

  useEffect(() => {
    setTimeout(() => {
      context.setFocusElement({
        id: 'defaultFolder',
        ref: buttonRef,
        handler: onClick,
        padding: 10,
      })
    }, 1000)
  }, [
    context.currentStep,
  ])

  return (
    <div className={ classes.root }>
      <h3 className={ classes.title }>Your Google folder is ready!</h3>
      <p>Any content you add to this folder will appear on this page.</p>
      <div>
        <Button
          ref={ buttonRef }
          color="secondary"
          variant="contained"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            context.progressOnboarding()
            onClick(e)
          }}
        >
          <AddIcon />&nbsp;&nbsp;{ title }
        </Button>
      </div>
      {
        menus
      }
    </div>
  )
}

export default DefaultFolder
