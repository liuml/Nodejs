$(function(){
  regEvent()
  function regEvent() {
    $('#login_btn').on('click', function(event) {
      var name = $('#name').val()
      var password = $('#password').val()
      $.post('/login', {
          name: name,
          password: password
        }, function(data, textStatus, xhr) {
          if (data.success) {
            localStorage.admin = data.data.name
            location.href = '/'
          } else {
            $('#alert-text').html(data.msg)
            $('.alert').show()
          }
      });
    });
  }
})