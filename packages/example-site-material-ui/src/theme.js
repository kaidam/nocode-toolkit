const themeProcessor = ({
  config,
  route,
  settings,
  theme,
}) => {
  const usePrimaryColor = route.primaryColor || config.primaryColor
  if(usePrimaryColor) theme.palette.primary.main = usePrimaryColor
  return theme
}

export default themeProcessor