import React from 'react'
import { useSelector } from 'react-redux'
import selectors from './selectors'

const ErrorPage = ({message}) => (
  <div>{ message }</div>
)

const Router = ({
  templates,
}) => {
  const route = useSelector(selectors.router.route)

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
    </PageLayout>
  )
}

export default Router