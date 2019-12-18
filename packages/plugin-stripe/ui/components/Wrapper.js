import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../store'

import Button from './Button'
import Confirmation from './Confirmation'

const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
}

let hasInjectedStripeLibrary = false

const PaymentButtonWrapper = ({
  renderers,
  content,
  cell,
}) => {

  const RenderButton = renderers.button || Button
  const RenderConfirmation = renderers.confirmation || Confirmation

  useEffect(() => {
    if(hasInjectedStripeLibrary) return
    hasInjectedStripeLibrary = true
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/"
    script.async = false
    document.body.appendChild(script)
  }, [hasInjectedStripeLibrary])

  const dispatch = useDispatch()
  const currencySymbol = CURRENCY_SYMBOLS[content.currency]
  const buttonTitle = content.buttonTitle || `Purchase ${content.name}`
  const passContent = Object.assign({}, content, {
    currencySymbol,
    buttonTitle,
  })
  const onClick = () => {
    dispatch(actions.purchase({
      id: cell.id,
      ...content,
    }))
  }
  const purchasedProductId = useSelector(state => state.stripe.purchasedProductId)
  let confirmWindow = null
  if(purchasedProductId == cell.id) {
    const onClose = () => {
      dispatch(actions.closeConfirmationWindow())
    }
    confirmWindow =  (
      <RenderConfirmation
        content={ passContent }
        onClose={ onClose }
      />
    )
  }
  return (
    <div>
      <RenderButton
        content={ passContent }
        cell={ cell }
        onClick={ onClick }
      />
      { confirmWindow }
    </div>
    
  )
}

export default PaymentButtonWrapper