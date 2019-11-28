const themeProcessor = ({
  config,
  route,
}) => {
  const primaryColor = route.primaryColor || config.primaryColor
  return primaryColor ? {
    palette: {
      primary: {
        main: primaryColor,
      }
    }
  } : {}
}

export default themeProcessor