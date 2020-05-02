import React, { useContext, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import OnboardingContext from '../contexts/onboarding'

import icons from '../../icons'

const EditIcon = icons.edit

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

const DefaultBody = ({
  onClick,
}) => {
  const buttonRef = useRef(null)
  const classes = useStyles()
  const context = useContext(OnboardingContext)

  useEffect(() => {
    setTimeout(() => {
      context.setFocusElement({
        id: 'defaultBody',
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
      <h3 className={ classes.title }>Your Google document is ready!</h3>
      <p>Any content you add to this document will appear on this page.</p>
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
            onClick()
          }}
        >
          <EditIcon />&nbsp;&nbsp;Edit Document
        </Button>
      </div>
    </div>
  )
}

export default DefaultBody
