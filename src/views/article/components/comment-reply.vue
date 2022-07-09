<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->

       <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <comment-list
        :commentList="list"
        :articleId="comment.com_id"
        type="c"
      />
      <!-- /评论的回复列表 -->

      <!-- 底部区域 -->
      <div class="reply-bottom">
        <van-button
          class="write-btn"
          size="small"
          round
          @click="isPostShow = true"
        >写评论</van-button>
      </div>
    <!-- /底部区域 -->

      <!-- 发布评论 -->
      <van-popup v-model="isPostShow" position="bottom">
        <comment-post
          :articleId="comment.com_id"
          @post-success="postSuccess"
        ></comment-post>
      </van-popup>
      <!-- /发布评论 -->
    </div>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      commentClone: this.comment,
      list: [],
      isPostShow: false
    }
  },
  methods: {
    postSuccess (data) {
      // 更新回复的数量
      this.commentClone.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      console.log(this.list)
      this.list.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
