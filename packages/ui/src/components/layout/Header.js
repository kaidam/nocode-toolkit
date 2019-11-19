import React from 'react'
import { useSelector } from 'react-redux'
import Header from '@nocode-toolkit/website/lib/Header'

import selectors from '../../store/selectors'

const SiteHeader = ({

}) => {
  const settings = useSelector(selectors.layout.settings)
  return (
    <Header
      title={ settings.title || 'Website Title' } 
    > 
      <meta name="description" content={ settings.description } />
      <meta name="keywords" content={ settings.keywords } />
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
      <link rel="shortcut icon" href="images/favicon.png" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </Header>
  )
}

export default SiteHeader
