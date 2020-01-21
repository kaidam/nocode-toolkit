import React, { useEffect, useRef } from 'react'

const UserHTML = ({
  html,
}) => {
  const divRef = useRef(null)
  useEffect(() => {
    const slotHtml = document.createRange().createContextualFragment(html)
    divRef.current.appendChild(slotHtml)
  }, [])
  return (
    <div ref={divRef}></div>
  )
}

export default UserHTML