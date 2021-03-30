const titles = document.querySelectorAll('.itemName')

for (const title of titles) {
  title.onclick = function () {
    document.execCommand('copy')
  }

  title.addEventListener('copy', function (event) {
    event.preventDefault()
    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', title.textContent)
      console.log('maybe copied?')
    }
  })
}
