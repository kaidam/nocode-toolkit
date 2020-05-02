const hasContent = (html) => {
  const checkDiv = document.createElement('div')
  checkDiv.innerHTML = html

  const hasText = checkDiv.innerText.match(/\w/) ? true : false
  const hasImage = checkDiv.querySelector('img') ? true : false

  return hasText || hasImage
}

export default {
  hasContent,
}