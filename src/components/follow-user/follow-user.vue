<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="btnLoading"
    v-if="isFollowed"
    @click="onFollow()"
  >
    关注
  </van-button>

  <van-button
    class="follow-btn"
    round
    size="small"
    v-else
    :loading="btnLoading"
    @click="onFollow()"
  >
    已关注
  </van-button>
</template>

<script>
import { addFollowAPI, deleteFollowAPI } from '../../api/index.js'
export default {
  name: 'follow-user',
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-follow' // 默认是 input
  },
  props: {
    isFollowed: { // 是否关注
      type: Boolean,
      default: false
    },
    userId: { // 用户id
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnLoading: false
    }
  },
  methods: {
    // 切换关注状态
    async onFollow () {
      this.btnLoading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollowAPI(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollowAPI(this.userId)
          // this.article.is_followed = true
        }
        // this.article.is_followed = !this.article.is_followed
        // 更新视图
        this.$emit('update-follow', !this.isFollowed)
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.btnLoading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style lang="less" scoped>

</style>
