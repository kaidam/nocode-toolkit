import React from 'react'

const NocodeLogo = ({
  size = 24,
}) => {
  return (
    <img
      style={{
        width: `${size}px`,
      }}
      src="https://nocode.works/assets/favicon.png"
    />
  )
}

export default NocodeLogo
