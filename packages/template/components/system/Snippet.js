import React, { useEffect, useRef } from 'react'

export const HeadHTML = ({
  html
}) => {
  useEffect(() => {
    const slotHtml = document.createRange().createContextualFragment(html)
    document.getElementsByTagName('head')[0].appendChild(slotHtml)
    return () => {
      try {
        document.getElementsByTagName('head')[0].removeChild(slotHtml)
      } catch(e) {

      }
    }
  }, [
    html,
  ])
  return null
}

export const InlineHTML = ({
  html,
}) => {
  const divRef = useRef(null)
  useEffect(() => {
    const slotHtml = document.createRange().createContextualFragment(html)
    divRef.current.appendChild(slotHtml)
    return () => {
      try {
        divRef.current.removeChild(slotHtml)
      } catch(e) {

      }
    }
  }, [
    html,
  ])
  return (
    <div ref={divRef}></div>
  )
}

const Snippet = ({
  html,
  head,
}) => {
  return head ? (
    <HeadHTML
      html={ html }
    />
  ) : (
    <InlineHTML
      html={ html }
    />
  )
}

export default Snippet