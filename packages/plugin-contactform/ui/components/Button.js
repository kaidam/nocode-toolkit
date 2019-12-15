import React from 'react'

const ContactButton = ({
  content,
  onClick,
}) => {
  return (
    <button
      onClick={ onClick }
    >
      { content.buttonTitle || 'Contact Us' }
    </button>
  )
}

export default ContactButton