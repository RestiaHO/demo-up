<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
      :immediate-check="false"
    >
      <comment-item
        v-for="(item, i) in list"
        :key="i" :comment="item"
        @reply-click="$emit('reply-click', $event)"
      ></comment-item>
    </van-list>
  </div>
</template>

<script>
import { getCommentsAPI } from '../../../api/index.js'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: String,
      default: ''
    },
    commentList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'a'
    }
  },
  data () {
    return {
      list: this.commentList,
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      error: false
    }
  },
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data: res } = await getCommentsAPI({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.articleId.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10 // 每页大小
        })
        console.log(res)
        // 2. 将数据添加到列表中
        this.list.push(...res.data.results)
        // 更新总数据条数
        this.totalCount = res.data.total_count

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', res.data)

        // 3. 将加载更多的 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (res.data.results.length) {
          this.offset = res.data.last_id // 更新获取下一页数据的页码
        } else {
          this.finished = true // 没有数据了，关闭加载更多
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
