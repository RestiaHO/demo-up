<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        size="mini"
        round
        type="danger"
        plain
        @click="isEditShow = !isEditShow"
      >
        {{ isEditShow ? '完成': '编辑' }}
      </van-button>
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channelItem, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channelItem, index)"
      >
        <span class="text" :class="{active: active === index}" slot="text">{{ channelItem.name }}</span>
        <van-icon v-show="isEditShow && index!==0" slot="icon" name="close"></van-icon>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannelsAPI, addUserChannelAPI, deleteUserChannelAPI } from '../../../api/index.js'
import { mapState } from 'vuex'
import { setItem } from '../../../utils/storage.js'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      myChannelsClone: this.myChannels,
      allChannels: [], // 所有频道
      isEditShow: false // 控制编辑状态
    }
  },
  computed: {
    ...mapState(['user']),

    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      const list = this.allChannels.filter(channel => {
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
      // const list = [...this.$_.differenceBy(this.allChannels, this.myChannels, 'id')]
      return list
    }
  },
  created () {
    // 获取所有频道
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data: res } = await getAllChannelsAPI()
        this.allChannels = res.data.channels
        console.log(res.data)
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },

    // 添加频道
    async onAddChannel (channel) {
      // 不可以直接修改父组件传递过来的参数，所以拷贝一份在data中
      this.myChannelsClone.push(channel)

      // 数据持久化处理
      // 未登录，把数据储存到本地
      // 一登录, 把数据请求接口放到线上
      if (this.user) {
        // 已登录
        try {
          // 已登录，数据存储到线上
          await addUserChannelAPI({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登陆 把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 频道功能方法
    onMyChannelClick (channel, index) {
      if (this.isEditShow) {
        // 1. 编辑状态删除频道
        // 判断是否为推荐
        if (index === 0) return
        this.myChannelsClone.splice(index, 1)

        // 2. 让激活频道的索引 - 1
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        // 删除数据持久化
        this.deleteChannel(channel)
      } else {
        // 2. 非编辑状态切换频道( 通过isEditShow判断)
        this.$emit('update-active', index)
      }
    },

    // 删除数据持久化
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannelAPI(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  .title-text {
    height: 100%;
    line-height: 58px;
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    line-height: 48px;
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  .channel-item {
    height: 86px;
    width: 160px;

    /* 设置按钮背景 */
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;

      /* 设置按钮字体样式 */
      .van-grid-item__text, .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
      /* 设置高亮 */
      .active {
        color: red;
      }
      /* 去掉父容器相对定位 */
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .van-grid-item__content {
      white-space: nowrap;
      flex-direction: row;

      /* 设置按钮字体样式 */

      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }

  /deep/ .my-grid {
    .van-grid-item__content {
      .van-icon-close {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
