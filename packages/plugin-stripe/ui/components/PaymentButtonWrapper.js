import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import actions from '../store'

const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
}

const PaymentButtonWrapper = ({
  Renderer,
  content,
}) => {
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
    dispatch(actions.purchase(content))
  }
  return (
    <Renderer
      content={ passContent }
      onClick={ onClick }
    />
  )
}

export default PaymentButtonWrapper