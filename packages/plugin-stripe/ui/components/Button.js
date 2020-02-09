import React from 'react'

const PaymentButton = ({
  content,
  onClick,
}) => {
  return (
    <div>
      <div>
        <button
          onClick={ onClick }
        >
          { content.buttonTitle } ({content.currencySymbol}{content.price})
        </button>
      </div>
      {
        content.description && (
          <div style={{marginTop: '10px'}}>
            <p>
              { content.description }
            </p>
          </div>
        )
      }
    </div>
  )
}

export default PaymentButton