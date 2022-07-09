<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.title"/> -->
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        >
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesAPI } from '../../../api/index.js'
import ArticleItem from '../../../components/article-item/article-item.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      // 1. 请求获取数据
      try {
        const { data: res } = await getArticlesAPI({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now() // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        })
        console.log(res)
        // 2. 把数据添加到 list 数组中
        this.list.push(...res.data.results)

        // 3. 设置本次加载中 loading 状态结束
        this.loading = false
        // 4. 判断数据是否加载结束
        if (res.data.results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true

        // 请求失败了，loading 也需要关闭
        this.loading = false
        console.log(err)
      }
    },

    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data: res } = await getArticlesAPI({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now() // 下拉刷线，每次请求获取最新数据，所以传递当前最新时间戳
        })

        // 2. 将数据追加到列表的顶部
        // this.list = res.data.results
        this.list.unshift(...res.data.results)

        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${res.data.results.length}条数据`
      } catch (error) {
        // 关闭下拉并且提示失败
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的，这里高度其实为0
  // height: 100%;
  // overflow-y: auto;
  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  /*
    兼容性：
    1. 在pc端已经兼容到IE9
    2. 移动端 IOS8以上， Androld 4.4 以上
    3. 微信x5内核
    已经2202年了，基本上就没有这种兼容性问题
  */
  height: 79vh;
  overflow-y: auto;
}
</style>
