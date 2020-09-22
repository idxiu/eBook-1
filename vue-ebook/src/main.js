import Vue from 'vue'
import i18n from './lang'
import App from './App.vue'
import router from './router'
import store from './store'
// import './mock/index'
import './assets/styles/iconfont.css'
import './assets/fonts/daysOne.css'
import './assets/styles/global.scss'
import './utils/boost'
import './utils/create-api'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
