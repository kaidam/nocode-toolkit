import React from 'react'
import Link from '@nocode-toolkit/website/Link'
import SingletonWidget from './SingletonWidget'

const getValue = (logo) => {
  let title = logo.title
  const imageUrl = logo.image ?
    logo.image.url :
    null
  if(!title && !imageUrl) title = 'My Website'
  return {
    title,
    imageUrl,
  }
}

const RenderContent = ({
  value: {
    title,
    imageUrl,
  },
  props,
}) => {
  return (
    <Link
      path="/"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {
        imageUrl && (
          <img
            style={{
              height: '40px',
              marginRight: '20px',
              marginTop: '10px',
              marginBottom: '10px',
            }}
            src={ imageUrl }
          />
        )
      }
      {
        title && (
          <h5
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            { title }
          </h5>
        )
      }
    </Link>
  )
}

const defaultRenderers = {
  content: RenderContent,
}

const Logo = ({
  renderers,
  ...props
}) => {
  const useRenderers = Object.assign({}, defaultRenderers, renderers)
  return (
    <SingletonWidget
      id="logo"
      type="logo"
      getValue={ getValue }
      renderers={ useRenderers }
      props={ props }
    />
  )
}

export default Logo