var crypto = require('crypto')
var models = require('../models/db.js')

// 获取全部学生信息
exports.getStudents = function (req, res) {
  var limit = req.query.limit
  var skip = req.query.offset
  var result = {}
  models.find('students', {}, {
    limit: parseInt(limit),
    skip: parseInt(skip),
    sort: {'s_id': 1}
  }, function (err, data) {
    result.rows = data
    models.getCount('students', {}, {}, function (err, data) {
      result.total = data
      res.json(result)
    })
  })
}
// 新增学生
exports.addStudent = function (req, res) {
  models.insertOne('students', req.body, function (err, result) {
    if (err) {
      res.json({
        success: false,
        msg: '增加失败!'
      })
      return
    }
    res.json({
      success: true,
      msg: '增加成功!',
      data: result
    })
  })
}
// 搜索学生（根据学生学号）
exports.search = function (req, res) {
  var s_id = req.params.id
  models.find('students', {'s_id': s_id}, {}, function (err, data) {
    if (!err) {
      res.json({
        rows: data,
        total: data.length
      })
    }
  })
}

// 删除学生
exports.deleteMany = function (req, res) {
  var ids = req.body.ids
  var deleteCount = 0
  if (ids.length) {
    iterator(0)
  }
  function iterator(i) {
    if (i >= ids.length) {
      res.json({
        success: true,
        count: deleteCount
      })
      return
    }
    models.deleteOne('students', {s_id: ids[i]}, function (err, data) {
      if (err) {
        res.json({
          success: false,
          msg: '删除学生失败！',
          count: deleteCount
        })
        return
      }
      deleteCount += data
      iterator(++i)
    })
  }
}

// 修改学生
exports.updateStudent = function (req, res) {
  var id = req.params.id
  models.findOneAndUpdate('students', {s_id: id}, {$set: req.body}, function (err, result) {
    if (err) {
      res.json({
        success: false,
        msg: '修改学生失败！'
      })
      return
    }
    res.json({
      success: true,
      msg: 'success',
      data: result.value
    })
  })
}

// 管理员登录
exports.login = function (req, res) {
  var name = req.body.name
  var password = req.body.password
  var md5 = crypto.createHash('md5')
  var md5Pass = md5.update(password).digest('base64')
  if (name) {
    models.find('administrators', {name: name}, {}, function (err, result) {
      if (result.length) {
        if (md5Pass === result[0].password) {
          res.json({
            success: true,
            msg: '登录成功！',
            data: result[0]
          })
        } else{
          res.json({
            success: false,
            msg: '用户名或密码不正确！'
          })
        }
      } else{
        res.json({
          success: false,
          msg: '用户不存在！'
        })
      }
    })
  }
}
// 管理员注册
exports.regist = function (req, res) {
  var name = req.body.name
  var password = req.body.password
  var md5 = crypto.createHash('md5')
  var md5Pass = md5.update(password).digest('base64')
  if (name) {
    models.find('administrators', {name: name}, {}, function (err, result) {
      if (result.length) {
        res.json({
          success: false,
          msg: '用户名已存在，换一个试试！'
        })
        return
      }
      models.insertOne('administrators', {name: name, password: md5Pass}, function (err, result) {
        if (err) {
          res.json({
            success: false,
            msg: '注册失败！'
          })
          return
        }
        res.json({
          success: true,
          msg: '注册成功！',
          data: result
        })
      })
    })
  }
}
