import React, { lazy, useMemo, useCallback } from 'react'
import Layout from '../layout/Layout'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './TreePanelCellOptions'))

const TreePanel = ({
  layout,
  section,
  panelName,
}) => {

  const data = useMemo(() => {
    return {
      item: {
        data: {},
      },
      externals: [],
      layout,
    }
  }, [layout])

  const CellOptionsWrapper = useCallback((props) => {
    return (
      <CellOptions
        section={ section }
        panelName={ panelName }
        {...props}
      />
    )
  }, [section, panelName])

  return (
    <Layout
      data={ data }
      CellOptionsWrapper={ CellOptionsWrapper }
    />
  )
}

export default TreePanel
