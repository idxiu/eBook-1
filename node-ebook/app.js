const express = require('express')
const mysql = require('mysql')
const conf = require('./config')

const app = express()

function getConnection () {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TTTtry123456',
    database: 'book'
  })
}

function randomArray (l, n) {
  let rdn = []
  for (let i=0; i<l; i++) {
    rdn.push(Math.floor(Math.random() * n))
  }
  return rdn
}

function createData (results, key) {
  const data = results[key]
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${conf.resUrl}/img${data.cover}`
  }
  data['selected'] = false
  data['haveRead'] = 0
  data['private'] = false
  data['cache'] = false
  console.log(data.cover)
  return data
}

app.get('/book/home', (req, res) => {
  const conn = getConnection()
  conn.query('select * from book where cover != \'\'', (err, results) => {
    const length = results.length
    const guessYouLike = []
    const banner = ''
    const recommend = []
    const featured = []
    const random = []
    const categoryList = []
    const categories = []
    randomArray(9, length).forEach(key => {
      guessYouLike.push(createData(results, key))
    })
    res.json({
      guessYouLike,
      banner,
      recommend,
      featured,
      random,
      categoryList,
      categories
    })
    conn.end()
  })
})

app.get('/book/list', (req, res) => {
  const conn = getConnection()
  conn.query('select * from book', (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '数据库失败'
      })
    } else {
      res.json({
        error_code: 0,
        data: results
      })
    }
    conn.end()
  })
})

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Server is listening at http://%s:%s', host, port)
})