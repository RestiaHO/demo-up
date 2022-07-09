<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!--
      通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过animated属性可以开启切换标签内容时的转场动画
      通过swipeable属性可以开启滑动切换标签页
      通过swipe-threshold属性设置最低滑动标签数
    -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 文章列表 -->
        <article-list :channel="item"></article-list>
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder">
      </div>
      <div slot="nav-right" class="hamburger-btn" @click="isChennelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isChennelEditShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channal-edit @update-active="onUpdateActive" :myChannels="channels" :active="active"></channal-edit>
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
// 1. 导入 获取频道列表的方法
import { getUserChannelsAPI } from '../../api/index.js'
import ArticleList from './components/article-list.vue'
import ChannalEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '../../utils/storage.js'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannalEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },

  computed: {
    ...mapState(['user'])
  },

  created () {
    // 调用获取频道列表
    this.loadChannels()
  },

  methods: {
    async loadChannels () {
      try {
        let channles = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 登录 或者 本地没有存储 获取后端数据
          const { data: res } = await getUserChannelsAPI()
          this.channels = res.data.channels
          return false
        } else {
          // 未登录并且本地没有数据
          channles = localChannels
        }
        this.channels = channles
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },

    // 子组件切换频道
    onUpdateActive (index, isShow = false) {
      this.active = index
      this.isChennelEditShow = isShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;

  // 深度设置组件样式
  /deep/.van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;

    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      /* flex布局需要用这个属性不让它参与flex计算 */
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);

      i.toutiao {
        font-size: 33px;
      }

      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 2px;
        height: 58px;
        background-image: url(../../assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
