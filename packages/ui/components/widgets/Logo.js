import React from 'react'
import Link from '@nocode-toolkit/website/Link'
import ContentEditor from './ContentEditor'
import useSingleton from '../hooks/useSingleton'
import useShowUI from '../hooks/useShowUI'

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

const DefaultRenderer = ({
  value: {
    title,
    imageUrl,
  },
  ...props
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

const Logo = ({
  renderers,
  ...props
}) => {
  const singleton = useSingleton('logo')
  const showUI = useShowUI()
  const Renderer = renderers.content || DefaultRenderer
  return (
    <ContentEditor
      id="logo"
      type="logo"
      location={`singleton:logo`}
      renderers={ renderers }
    >
      <Renderer
        value={ getValue(singleton) }
        showUI={ showUI }
        {...props}
      />
    </ContentEditor>
  )
}

export default Logo