const hasContent = (html) => {
  const checkDiv = document.createElement('div')
  checkDiv.innerHTML = html

  const hasText = checkDiv.innerText.match(/\w/) ? true : false
  const hasImage = checkDiv.querySelector('img') ? true : false

  return hasText || hasImage
}


// look for any @import statements in the css
// and extract them returning an object with
// html (string) and imports ([]string)
const extractImports = (rawHTML) => {
  rawHTML = rawHTML || ''
  const cssImports = []
  const html = rawHTML.replace(/\@import url\(.*?\);/g, (importString) => {
    importString = importString
      .replace(/^\@import url\(/, '')
      .replace(/\);$/, '')
    cssImports.push(importString)
    return ''
  })
  return {
    html,
    cssImports,
  }
}

export default {
  hasContent,
  extractImports,
}