<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <span slot="title" v-html="highlight(item)"></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestionsAPI } from '../../../api/index.js'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 监视的处理函数
      handler: debounce(function (newVal) {
        // 调用查询方法
        this.loadSearchSuggestion(newVal)
      }, 200),
      // 首次监视触发
      immediate: true
    }
  },
  methods: {
    // 查询数据进口
    async loadSearchSuggestion (val) {
      try {
        const { data: res } = await getSearchSuggestionsAPI(val)
        this.suggestions = res.data.options
      } catch {
        this.$toast('获取失败')
      }
    },

    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 方案一
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      // const reg = new RegExp(this.searchText, 'gi')
      // return text.replace(reg, highlightStr)

      // 方案二
      return text && text.split(this.searchText).join(highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
