import React from 'react'

const RenderRoot = ({
  editor,
  children,
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
  item: RenderItem,
  itemOptions: RendererItemOptions,
}

export default defaultRenderers
