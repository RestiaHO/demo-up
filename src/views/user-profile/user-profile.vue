<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 头像上传 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange()"
    />

    <!-- 个人信息 -->
    <van-cell title="头像" class="photo-cell" center is-link @click="$refs.file.click()">
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true"/>
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true"/>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true"/>
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom"
    >
      <updata-name v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false"></updata-name>
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <updata-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <updata-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <updata-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      ></updata-photo>
    </van-popup>
    <!-- 编辑头像弹层 -->
  </div>
</template>

<script>
import { getUserProfileAPI } from '../../api/index.js'
import UpdataName from './components/updata-name.vue'
import UpdataGender from './components/updata-gender.vue'
import UpdataBirthday from './components/updata-birthday.vue'
import UpdataPhoto from './components/updata-photo.vue'
export default {
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday,
    UpdataPhoto
  },
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 昵称弹框状态
      isUpdateGenderShow: false, // 性别弹框状态
      isUpdateBirthdayShow: false, // 生日弹框状态
      img: null, // 预览的图片
      isUpdatePhotoShow: false // 预览图片弹框状态
    }
  },

  created () {
    // 获取用户基本信息
    this.loadProfile()
  },

  methods: {
    async loadProfile () {
      try {
        const { data: res } = await getUserProfileAPI()
        this.user = res.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },

    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)

      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang='less'>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background: #f5f7f9;
  }

  .photo-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
