$(document).ready(function () {
      $('body').on('keypress', function(e) {
        if (e.which === 13) {
          $('#displaybox').val(function(index, val) {
            return val + $('#terms').val() + ' '})
          $('#terms').val('')
        }
      })
    })