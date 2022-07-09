<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{collected: value}"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollectAPI, deleteCollectAPI } from '../../api/index.js'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      default: false
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
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollectAPI(this.articleId)
        } else {
          // 没有收藏，添加收藏
          await addCollectAPI(this.articleId)
        }

        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)

        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
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
    color: #ffa500;
  }
}
</style>
