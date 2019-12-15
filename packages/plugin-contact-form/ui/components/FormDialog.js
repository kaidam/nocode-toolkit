import React from 'react'

const styles = {
  root: {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    zIndex: '1000',
    backgroundColor: 'rgba(255,255,255,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: '50px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #000000',
    fontWeight: 'bold',
    textAlign: 'center',
  }
}

const FormDialog = ({
  content,
  onSubmit,
  onClose,
}) => {
  return (
    <div style={ styles.root }>
      <div style={ styles.content }>
        <h4>Contact Form</h4>
        <p>
          <button
            onClick={ onClose }
          >
            Close
          </button>
          <button
            onClick={ onSubmit }
          >
            Submit
          </button>
        </p>
      </div>
    </div>
  )
}

export default FormDialog