function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const flatListData = require('./src/mock/bookFlatList')
const listData = require('./src/mock/bookList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/flat-list', flatListData)
      mock(app, '/book/list', listData)
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 524288
    }
  }
}
