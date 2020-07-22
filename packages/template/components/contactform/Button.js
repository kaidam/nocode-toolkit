import React from 'react'
import Button from '@material-ui/core/Button'

const ContactButton = ({
  content,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={ onClick }
    >
      { content.buttonTitle || 'Contact Us' }
    </Button>
  )
}

export default ContactButton