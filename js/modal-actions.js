module.exports = function () {
  var modal = document.getElementById('selectModal')

  var btn = document.getElementById('selectButton')

  var span = document.getElementsByClassName('close')[0]

  btn.onclick = function () {
      modal.style.display = 'block'
  }

  span.onclick = function () {
      modal.style.display = 'none'
  }

  window.onclick = function (event) {
      if (event.target === modal) {
          modal.style.display = 'none'
      }
  }
}
