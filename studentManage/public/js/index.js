$(function(){
  loginSetting()
  initTable()
  regEvent()
  function initTable () {
    $('#table').bootstrapTable({
      url: '/getStudents',
      queryParams: function(params){
        return params
      },
      pagination: true,
      sidePagination: 'server',
      pageSize: 15,
      pageList: [10, 15, 20, 25, 30],
      idField: 's_id',
      striped: true,
      locale: 'zh-cn',
      columns: [{
        checkbox: true
      },{
        field: 's_id',
        title: '学号'
      },{
        field: 'name',
        title: '姓名'
      },{
        field: 'enterDate',
        title: '入学日期',
        formatter: function (value) {
          var date = new Date(value)
          var y = date.getFullYear()
          var m = date.getMonth() + 1
          var d = date.getDate()
          return y + '/' + m + '/' + d
        }
      },{
        field: 'sex',
        title: '性别',
        formatter: function (value) {
          if (value === '1') {
            return '男';
          } else{
            return '女';
          }
        }
      },{
        field: 'institute',
        title: '学院'
      },{
        field: 'major',
        title: '专业'
      },{
        field: 'clazz',
        title: '班级'
      }, {
        field: 'operate',
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
          return '<a href="javascript:void(0)" data-id='+ row.s_id +' class="update">修改</a>&nbsp;&nbsp;<a href="javascript:void(0)" data-id='+ row.s_id +' class="delete">删除</a>'
        }
      }]
    })
  }
  function loginSetting() {
    console.log(localStorage.admin)
    if (localStorage.admin) {
      return $('#account').removeClass('hidden').find('li a').html('欢迎您，' + localStorage.admin + '!')
    } else {
      return $('#login_regist').removeClass('hidden')
    }
  }
  function regEvent() {
    $('#add_btn').on('click', function(event) {
      var $confirm_modal = $('#confirm_modal')
      var form_html = '<div class="row">'+
                          '<form class="col-xs-10 col-xs-offset-1">'+
                          '  <div class="form-group">'+
                          '    <label for="s_id">学号</label>'+
                          '    <input type="text" class="form-control" id="s_id" placeholder="请输入学号">'+
                          '  </div>'+
                          '  <div class="form-group">'+
                          '    <label for="name">姓名</label>'+
                          '    <input type="text" class="form-control" id="name" placeholder="请输入姓名">'+
                          '  </div>'+
                          '  <div class="form-group">'+
                          '    <label for="sex">性别</label>'+
                          '    <div class="radio">'+
                          '      <label>'+
                          '        <input type="radio" name="sex" value="1">男'+
                          '      </label>'+
                          '      <label>'+
                          '        <input type="radio" name="sex" value="0">女'+
                          '      </label>'+
                          '    </div>'+
                          '  </div>'+
                          '  <div class="form-group">'+
                          '    <label for="institute">学院</label>'+
                          '    <input type="text" class="form-control" id="institute" placeholder="请输入学院">'+
                          '  </div>'+
                          '  <div class="form-group">'+
                          '    <label for="major">专业</label>'+
                          '    <input type="text" class="form-control" id="major" placeholder="请输入专业">'+
                          '  </div>   '+
                          '  <div class="form-group">'+
                          '    <label for="clazz">班级</label>'+
                          '    <input type="text" class="form-control" id="clazz" placeholder="请输入班级">'+
                          '  </div>'+
                          '</form>'+
                        '</div>'
      $confirm_modal.find('.modal-title').html('新增学生')
      $confirm_modal.find('.modal-body').html(form_html)
      $confirm_modal.data('type', 'add').modal('show')
    })
    $('#search_btn').on('click', function(event) {
      var s_id = $('#search_input').val()
      $.get('/search/' + s_id, function (result) {
        $('#table').bootstrapTable('load', result)
      })
    })
    $('#delete_btn').on('click', function(event) {
      var students = $('#table').bootstrapTable('getSelections')
      var ids = []
      var $msg_modal = $('#msg-modal')
      var $confirm_modal = $('#confirm_modal')
      if (!students.length) {
        $msg_modal.find('.modal-body').html('请选择要删除的学生！')
        $msg_modal.modal('show')
      } else {
        students.forEach(function (student) {
          ids.push(student.s_id)
        })
        $confirm_modal.find('.modal-title').html('删除学生')
        $confirm_modal.find('.modal-body').html('确定要删除选中的学生吗？')
        $confirm_modal.data('type', 'delete').data('ids', ids).modal('show')
      }
    });
    $('#confirm_btn').on('click', function(event) {
      var $confirm_modal = $('#confirm_modal')
      var type = $confirm_modal.data('type')
      switch(type) {
        case 'add':
          addStudent()
          break
        case 'update':
          updateStudent($confirm_modal.data('id'))
          break
        case 'delete':
          deleteStudents($confirm_modal.data('ids'))
          break
      }
    })
    $('#table').on('click', '.delete', function(event) {
      var id = $(event.currentTarget).data('id')
      var $confirm_modal = $('#confirm_modal')
      $confirm_modal.find('.modal-title').html('删除学生')
      if (id) {
        $.get('/search/' + id, function (result) {
          if (result.rows.length) {
            var student = result.rows[0]
            $confirm_modal.find('.modal-body').html('确定要删除'+ student.name +'？')
            $confirm_modal.data('type', 'delete').data('ids', [id]).modal('show')
          }
        })
      }
    }).on('click', '.update', function(event) {
      var id = $(event.currentTarget).data('id')
      if (id) {
        $.get('/search/' + id, function (result) {
          if (result.rows.length) {
            var student = result.rows[0]
            var $confirm_modal = $('#confirm_modal')
            var form_html = '<div class="row">'+
                              '<form class="col-xs-10 col-xs-offset-1">'+
                              '  <div class="form-group">'+
                              '    <label for="s_id">学号</label>'+
                              '    <input type="text" class="form-control" id="s_id" value='+student.s_id+' disabled placeholder="请输入学号">'+
                              '  </div>'+
                              '  <div class="form-group">'+
                              '    <label for="name">姓名</label>'+
                              '    <input type="text" class="form-control" id="name" value='+student.name+' placeholder="请输入姓名">'+
                              '  </div>'+
                              '  <div class="form-group">'+
                              '    <label for="sex">性别</label>'+
                              '    <div class="radio">'+
                              '      <label>'+
                              '        <input type="radio" name="sex" value="1">男'+
                              '      </label>'+
                              '      <label>'+
                              '        <input type="radio" name="sex" value="0">女'+
                              '      </label>'+
                              '    </div>'+
                              '  </div>'+
                              '  <div class="form-group">'+
                              '    <label for="institute">学院</label>'+
                              '    <input type="text" class="form-control" id="institute" value='+student.institute+' placeholder="请输入学院">'+
                              '  </div>'+
                              '  <div class="form-group">'+
                              '    <label for="major">专业</label>'+
                              '    <input type="text" class="form-control" id="major" value='+student.major+' placeholder="请输入专业">'+
                              '  </div>   '+
                              '  <div class="form-group">'+
                              '    <label for="clazz">班级</label>'+
                              '    <input type="text" class="form-control" id="clazz" value='+student.clazz+' placeholder="请输入班级">'+
                              '  </div>'+
                              '</form>'+
                            '</div>'
            
            
            $confirm_modal.find('.modal-title').html('修改学生')
            $confirm_modal.find('.modal-body').html(form_html)
            $confirm_modal.find('input[name="sex"][value="'+student.sex+'"]').prop('checked','checked')
            $confirm_modal.data('type', 'update').data('id', id).modal('show')
          }
        })
      }
    });
  }
  function addStudent() {
    $.post('/addStudent', {
      s_id: $('#s_id').val(),
      name: $('#name').val(),
      sex: $('input[name="sex"]:checked').val(),
      institute: $('#institute').val(),
      major: $('#major').val(),
      clazz: $('#clazz').val()
    }, function(result) {
      $('#confirm_modal').modal('hide')
      if (result.success) {
        $('#table').bootstrapTable('refresh')
      } else {
        var $msg_modal = $('#msg-modal')
        $msg_modal.find('.modal-body').html(result.msg)
        $msg_modal.modal('show')
      }
    })
  }
  function deleteStudents(ids) {
    $.post('/deleteStudents', {ids: ids}, function(data, textStatus, xhr) {
      $('#confirm_modal').modal('hide')
      if (data.success) {
        $('#table').bootstrapTable('refresh')
      } else{
        var $msg_modal = $('#msg-modal')
        $msg_modal.find('.modal-body').html(data.msg)
        $msg_modal.modal('show')
      }
    })
  }
  function updateStudent(id) {
    $.post('/updateStudent/' + id, {
      name: $('#name').val(),
      sex: $('input[name="sex"]:checked').val(),
      institute: $('#institute').val(),
      major: $('#major').val(),
      clazz: $('#clazz').val()
    }, function(data, textStatus, xhr) {
      $('#confirm_modal').modal('hide')
      if (data.success) {
        $('#table').bootstrapTable('refresh')
      } else{
        var $msg_modal = $('#msg-modal')
        $msg_modal.find('.modal-body').html(data.msg)
        $msg_modal.modal('show')
      }
    });
  }
})