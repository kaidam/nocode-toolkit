import React, { useState, useCallback, useMemo, useEffect } from 'react'

import { useSelector } from 'react-redux'
import routerSelectors from '../../store/selectors/router'

const useGoogleDocumentImages = ({
  containerSelector,
} = {}) => {

  const resizeImages = useCallback(() => {
    const images = [...document.querySelectorAll(`${containerSelector} img`)]
    images
      .filter(img => {
        return img.complete && img.naturalHeight !== 0
      })
      .forEach(img => {
        if (!img.getAttribute('data-original-size')) {
          img.setAttribute('data-original-size', `${img.style.width}:${img.style.height}`)
        }

        const width = parseFloat(img.getAttribute('data-original-size').split(':')[0].replace('px', ''))
        if(isNaN(width)) return

        if(width > window.innerWidth) {
          img.style.width = '100%'
          img.style.height = ''
          img.parentElement.style.width = '100%'
          img.parentElement.style.height = ''        
          img.parentElement.parentElement.style.width = '100%'
          img.parentElement.parentElement.style.height = ''
        } else {
          const [ originalWidth, originalHeight ] = img.getAttribute('data-original-size').split(':')
          img.style.width = originalWidth
          img.style.height = originalHeight
          img.parentElement.style.width = originalWidth
          img.parentElement.style.height = originalHeight
          img.parentElement.parentElement.style.width = originalWidth
          img.parentElement.parentElement.style.height = originalHeight
        }
      })
  }, [
    containerSelector,
  ])
  
  const route = useSelector(routerSelectors.route)
  useEffect(() => {

    window.addEventListener('resize', resizeImages)

    const intervalId = setInterval(() => {
      resizeImages()
    }, 100)

    const timeoutId = setInterval(() => {
      clearInterval(intervalId)
    }, 10000)

    resizeImages()
    
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      window.removeEventListener('resize', resizeImages)
    }
  }, [
    route,
  ])
  
}

export default useGoogleDocumentImages