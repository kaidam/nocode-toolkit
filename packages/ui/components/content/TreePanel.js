import React, { lazy } from 'react'
import Layout from '../layout/Layout'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './TreePanelCellOptions'))

const TreePanel = ({
  data,
}) => {
  return (
    <Layout
      data={ data }
      CellOptionsWrapper={ CellOptions }
    />
  )
}

export default TreePanel
