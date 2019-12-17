import React from 'react'
import BaseNavBar from '@nocode-toolkit/ui/components/content/NavBar/NavBar'
import useStyles from './styles'

import renderersLarge from './renderersLarge'
import renderersSmall from './renderersSmall'

const NavBar = ({
  section,
  withHome,
  ...props
}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={ classes.largeNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersLarge }
          {...props}
        />
      </div>
      <div className={ classes.smallNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersSmall }
          {...props}
        />
      </div>
    </React.Fragment>
    
  )
}

export default NavBar