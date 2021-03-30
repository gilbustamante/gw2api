const input = document.getElementById('filterInput')

function filterSearch () {
  const filter = input.value.toUpperCase()
  const lis = document.getElementsByClassName('list-group-item')
  const titles = document.getElementsByClassName('itemTitle')
  // Loop through results and hide those which don't match query
  for (let i = 0; i < lis.length; i++) {
    const title = titles[i].textContent
    if (title.toUpperCase().indexOf(filter) > -1) {
      lis[i].classList.remove('hidden')
    } else {
      lis[i].classList.add('hidden')
    }
  }
}

input.addEventListener('input', filterSearch)
