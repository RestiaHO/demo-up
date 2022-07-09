<template>
  <van-cell class="article-item" :to="`/article/${article.art_id}`">
    <!-- 标题信息 -->
    <template #title>
      <!-- 设置vant中的内置class让标题两行后省略 -->
      <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    </template>

    <!-- 底部信息 -->
    <template #label>
      <!-- 根据type数量来判断有没有封面 0是没有 1是有一个 3是有3个 -->
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="right-color" fit="cover" :src="img" />
        </div>
      </div>
      <!-- 设置底部文字容器 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </template>

    <!-- 右侧图片信息 -->
    <!-- 根据type数量来判断有没有封面 0是没有 1是有一个 3是有3个 -->
    <template #default v-if="article.cover.type === 1">
      <van-image class="right-color" fit="cover" :src="article.cover.images[0]" />
    </template>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  /* 固定右侧盒子 */
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  /* 设置图片样式 */
  .right-color {
    width: 100%;
    height: 146px;
  }

  /* 底部文字样式 */
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  /* 多图展示样式 */
  .cover-wrap {
    display: flex;
    padding: 30px 0;

    .cover-item {
      /* 每张图均分宽度 */
      flex: 1;
      height: 146px;

      &:not(:last-child) {
        padding-right: 4px;
      }
    }
  }
}
</style>
