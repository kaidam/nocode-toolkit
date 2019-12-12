import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../store'

const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
}

const PaymentButtonWrapper = ({
  Renderer,
  ConfirmRenderer,
  content,
  cell,
  rowIndex,
  cellIndex,
}) => {
  const productId = `${rowIndex}-${cellIndex}`
  useEffect(() => {
    if(window.Stripe) return
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/"
    script.async = false
    document.body.appendChild(script)
  }, [])

  const dispatch = useDispatch()
  const currencySymbol = CURRENCY_SYMBOLS[content.currency]
  const buttonTitle = content.buttonTitle || `Purchase ${content.name}`
  const passContent = Object.assign({}, content, {
    currencySymbol,
    buttonTitle,
  })
  const onClick = () => {
    dispatch(actions.purchase({
      id: productId,
      ...content,
    }))
  }
  const purchasedProductId = useSelector(state => state.stripe.purchasedProductId)
  let confirmWindow = null
  if(purchasedProductId == `${rowIndex}-${cellIndex}`) {
    const onClose = () => {
      dispatch(actions.closeConfirmationWindow())
    }
    confirmWindow =  (
      <ConfirmRenderer
        content={ passContent }
        onClose={ onClose }
      />
    )
  }
  return (
    <div>
      <Renderer
        content={ passContent }
        cell={ cell }
        onClick={ onClick }
      />
      { confirmWindow }
    </div>
    
  )
}

export default PaymentButtonWrapper