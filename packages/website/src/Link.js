import React from 'react'
import { connect } from 'react-redux'
import utils from './store/utils'
import routerActions from './store/moduleRouter'

@connect(
  state => ({}),
  {
    openPage: routerActions.navigateTo,
  },
)
class NocodeLink extends React.Component {

  constructor(props) {
    super(props)
    this.onClick = this.onClickHandler.bind(this)
  }

  onClickHandler(e) {
    const {
      path,
      name,
      openPage,
      onClick,
    } = this.props
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const routeName = name || utils.routePathToName(path)
    openPage(routeName)
    if(onClick) onClick()
    return false
  }

  render() {
    const {
      path,
      openPage,
      children,
      onClick,
      ...other
    } = this.props
    
    return (
      <a href={ path } onClick={ this.onClick } {...other}>
        { children }
      </a>
    )
  }
}

export default NocodeLink