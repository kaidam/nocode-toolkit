const processUser = (user) => {
  if(!user) return
  const userData = {
    id: user.id || user.username,
    username: user.username,
  }
  if(user.meta && user.meta.google) {
    const googleData = user.meta.google
    userData.email = googleData.emails[0].value
    userData.name = googleData.displayName
  }
  return userData
}

const tools = {
  processUser,
}

export default tools