// main app router
import React from 'react'
import { useSelector } from 'react-redux'
import routerSelectors from './store/selectors/router'

const ErrorPage = ({message}) => (
  <div>{ message }</div>
)

const Router = ({
  templates,
  children,
}) => {
  const route = useSelector(routerSelectors.route)
  
  if(!route) {
    return (
      <ErrorPage
        message="page not found"
      />
    )
  }

  const layoutName = route.layout || 'default'
  const pageName = route.page || 'default'

  const PageLayout = templates.layouts[layoutName]
  const PageComponent = templates.pages[pageName]

  if(!PageLayout) {
    return (
      <ErrorPage
        message={ `layout template not found: ${layoutName}` }
      />
    )
  }

  if(!PageComponent) {
    return (
      <ErrorPage
        message={ `page template not found: ${pageName}` }
      />
    )
  }

  return (
    <PageLayout>
      <PageComponent />
      { children }
    </PageLayout>
  )
}

export default Router