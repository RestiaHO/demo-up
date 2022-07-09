import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
// 加载全局样式
import './styles/index.less'
// 动态设置rem加载
import 'amfe-flexible'
// 加载dayjs初始化
import './utils/dayjs'
// 导入lodash
import _ from 'lodash'

Vue.use(Vant)
Vue.config.productionTip = false
Vue.prototype.$_ = _

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
