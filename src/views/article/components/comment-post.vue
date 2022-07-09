<template>
  <div class="post-comment">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button
      class="post-btn"
      size="small"
      @click="onAddComment()"
      :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
import { addCommentAPI } from '../../../api/index.js'
export default {
  name: 'CommentPost',
  props: {
    articleId: {
      type: String,
      default: ''
    }
  },
  inject: {
    articleIdPro: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async onAddComment () {
      try {
        const message = this.message.trim()

        // 非空校验
        if (!message.length) {
          return
        }

        // 请求添加
        const { data: res } = await addCommentAPI({
          target: this.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: message, // 评论内容
          art_id: this.articleIdPro ? this.articleIdPro.toString() : '' // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })

        // 关闭弹出层
        // 将发布内容显示到列表顶部
        // 清空文本框
        this.message = ''
        this.$emit('post-success', res.data)
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
