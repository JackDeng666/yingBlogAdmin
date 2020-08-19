// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import moment from "moment"

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/global.css'
// jsoneditorCss
import 'jsoneditor/dist/jsoneditor.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
