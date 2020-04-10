import React from 'react'

const UnsplashLogo = ({
  size = 24,
}) => {
  return (
    <img
      style={{
        width: `${size}px`,
      }}
      src="https://unsplash.com/assets/core/logo-black-df2168ed0c378fa5506b1816e75eb379d06cfcd0af01e07a2eb813ae9b5d7405.svg"
    />
  )
}

export default UnsplashLogo
