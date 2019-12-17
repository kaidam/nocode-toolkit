import React from 'react'

const RenderRoot = ({
  navbar,
  editor,
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          justifyContent: 'flex-end',
        }}
      >
        { navbar }
      </div>
      {
        editor && (
          <div
            style={{
              flexGrow: 0,
              paddingLeft: '40px',
              paddingRight: '40px',
            }}
          >
            { editor }
          </div>
        )
      }
    </div>
  )
}

const RenderNavbar = ({
  children,
  ...props
}) => {
  return (
    <nav
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      { children }
    </nav>
  )
}

const RenderItem = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  ...props
}) => {
  return (
    <LinkComponent
      style={{
        textDecoration: isCurrent ? 'underline' : 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      {...linkProps}
    >
      { editor }
      { item.data.name }
    </LinkComponent>
  )
}

const RendererItemOptions = ({
  children,
  ...props
}) => {
  return children
}

const defaultRenderers = {
  root: RenderRoot,
  navbar: RenderNavbar,
  item: RenderItem,
  itemOptions: RendererItemOptions,
}

export default defaultRenderers
