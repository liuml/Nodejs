var MongoClient = require('mongodb').MongoClient
var config = require('./config.js')

exports.insertOne = insertOne
exports.find = find
exports.getCount = getCount
exports.deleteOne = deleteOne
exports.findOneAndUpdate = findOneAndUpdate

function _connectDB(callback) {
  MongoClient.connect(config.url, function(err, client) {
    callback(err, client)
  })
}
function find(collection, query, options, callback) {
  _connectDB(function(err, client) {
    if (err) {
      callback('数据库连接失败！', null)
      return
    }
    const db = client.db(config.dbName)
    const limit = options.limit ? options.limit : 0
    const skip = options.skip ? options.skip : 0
    const sort = options.sort ? options.sort : null
    db.collection(collection).find(query).limit(limit).skip(skip).sort(sort).toArray(function (err, docs) {
      if (err) {
        callback(err, null)
        client.close()
        return
      }
      callback(null, docs)
      client.close()
    })
  })
}

function getCount(collection, query, options, callback) {
  _connectDB(function (err, client) {
    if (err) {
      callback('数据库连接失败！', null)
      return
    }
    const db = client.db(config.dbName)
    db.collection(collection).count(query, options, function (err, result) {
      if (err) {
        callback(err, null)
        client.close()
        return
      }
      callback(null, result)
      client.close()
    })
  })
}

function insertOne(collection, params, callback) {
  _connectDB(function (err, client) {
    if (err) {
      callback('数据库连接失败！', null)
      return
    }
    params.enterDate = new Date().getTime()

    client.db(config.dbName).collection(collection).insertOne(params, function (err, result) {
      if (err) {
        callback(err, null)
        client.close()
        return
      }
      callback(null, result.ops[0])
      client.close()
    })
  }) 
}

function deleteOne(collection, filter, callback) {
  _connectDB(function (err, client) {
    if (err) {
      callback('数据库连接失败！', null)
      return
    }
    client.db(config.dbName).collection(collection).deleteOne(filter, function (err, result) {
      if (err) {
        callback(err, null)
        client.close()
        return
      }
      callback(null, result.deletedCount)
      client.close()
    })
  })
}

function findOneAndUpdate(collection, filter, update, callback) {
  _connectDB(function (err, client) {
    if (err) {
      callback('数据库连接失败！', null)
      return
    }
    client.db(config.dbName).collection(collection).findOneAndUpdate(filter, update, function (err, result) {
      if (err) {
        callback(err, null)
        client.close()
        return
      }
      callback(null, result)
      client.close()
    })
  })
}