import React from 'react'

const RenderRoot = ({
  panelTop,
  editor,
  content,
  panelBottom,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {
        panelTop && (
          <div
            style={{
              flexGrow: 0,
            }}
          >
            { panelTop }
          </div>
        )
      }
      {
        editor && (
          <div
            style={{
              flexGrow: 0,
              padding: '10px',
            }}
          >
            { editor }
          </div>
        )
      }
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flexGrow: 1,
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        { children }
        { content }
      </div>
      {
        panelBottom && (
          <div
            style={{
              flexGrow: 0,
            }}
          >
            { panelBottom }
          </div>
        )
      }
    </div>
  )
}

const RendererList = ({
  children,
}) => {
  return (
    <div>
      { children }
    </div>
  )
}

const RendererChildItems = ({
  open,
  children,
}) => {
  return open ? (
    <div
      style={{
        paddingLeft: '20px',
      }}
    >
      { children }
    </div>
  ) : null
}

const RendererItemOptions = ({
  children,
}) => {
  return children
}

const RendererItem = ({
  item,
  itemOptions,
  isCurrentPage,
  isOpen,
  hasChildren,
  onClick,
  onRightClick,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={ onClick }
    >
      {
        itemOptions && (
          <div
            style={{
              flexGrow: 0,
              marginRight: '10px',
            }}
          >
            { itemOptions }
          </div>
        )
      }
      <div
        style={{
          flexGrow: 1,
        }}
      >
        { item.data.name}
      </div>
    </div>
  )
}

const renderers = {
  root: RenderRoot,
  list: RendererList,
  childItems: RendererChildItems,
  itemOptions: RendererItemOptions,
  item: RendererItem,
}

export default renderers