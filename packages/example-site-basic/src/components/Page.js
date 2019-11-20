import React from 'react'
import { connect } from 'react-redux'
import selectors from '@nocode-toolkit/website/src/selectors'

@connect(
  state => {
    const route = selectors.router.route(state)
    const pageData = route && route.externals ? selectors.nocode.external(state, route.externals[0]) : null
    return {
      route,
      pageData,
    }
  }
)
class Page extends React.Component {

  render() {
    const {
      route,
      pageData,
    } = this.props
    return (
      <React.Fragment>
        <div>hello nocode page { route.name }</div>
        {
          pageData && (
            <div>page data: { pageData }</div>
          )
        }
      </React.Fragment>
    )
  }
}

export default Page