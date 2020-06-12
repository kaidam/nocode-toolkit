const noHover = window.matchMedia("(any-hover: none)").matches

export const isTouchscreen = () => noHover ? true : false
export const hasMouse = () => noHover ? false : true