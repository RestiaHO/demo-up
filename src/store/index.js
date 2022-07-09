import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '../utils/storage.js'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  // 1. 存储数据的地方 - 类比于vue文件的data()
  state: {
    // 一个对象，储存当前登录用户的token数据
    user: getItem(TOKEN_KEY)
  },
  // 2. 外界修改store中state的属性值，必须通过mutations中设置的修改方法 - 类比methods
  // 注意：这里方法里面的代码和.vue文件中的书写方式有差异，注意区分
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止刷新丢失，需要把数据备份到本地存储
      setItem(TOKEN_KEY, state.user)
    }
  },
  // 3. 涉及到异步操作后修改state数据时，必须先过actions中的自定义方法，通过actions去调用mutations中的方法
  actions: {
  },
  // 4. 是state中数据的计算属性 - 类比computed
  getters: {
  },
  // 5. 模块化vuex，可以让每一个模块拥有自己的 state、mutation、action、 getters，使得结构非常清晰，方便管理。
  modules: {
  }
})
