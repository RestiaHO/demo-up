<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{collected: value === 1 }"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addLikeAPI, deleteLikeAPI } from '../../api/index.js'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      default: 1
    },
    articleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已收藏，取消收藏
          await deleteLikeAPI(this.articleId)
        } else {
          // 没有收藏，添加收藏
          await addLikeAPI(this.articleId)
          status = 1
        }

        // 更新视图
        this.$emit('input', status)

        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: red;
  }
}
</style>
