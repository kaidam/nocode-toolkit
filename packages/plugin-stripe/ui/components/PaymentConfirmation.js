import React from 'react'

const styles = {
  root: {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    zIndex: '1000',
    backgroundColor: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontWeight: 'bold',
    textAlign: 'center',
  }
}

const PaymentConfirmation = ({
  content,
  onClose,
}) => {
  return (
    <div style={ styles.root }>
      <div style={ styles.content }>
        <h4>Purchase complete!</h4>
        <p>Your purchase of { content.name } is complete.</p>
        <p>
          <button
            onClick={ onClose }
          >
            Close
          </button>
        </p>
      </div>
    </div>
  )
}

export default PaymentConfirmation