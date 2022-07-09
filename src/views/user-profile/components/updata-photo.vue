<template>
<div class="updata-photo">
    <img :src="img" ref="img"/>
    <div class="toolbar">
      <span class="cancel" @click="$emit('close')">取消</span>
      <span class="confirm" @click="onConfirm()">完成</span>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhotoAPI } from '../../../api/index.js'
export default {
  name: 'UpdataPhoto',
  props: {
    img: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    // 获取图片页面元素
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 定义裁剪模式，0：裁剪框可以扩展到画布外， 1,2,3会将裁剪框限制在画布内
      dragMode: 'move', // 拖动模式 move: 移动画布
      aspectRatio: 1, // 截图比例, 1:1可以简写为1
      autoCropArea: 1, // 自动截图区
      cropBoxMovable: false, // 截图区域是否可以移动
      cropBoxResizable: false, // 截图区的缩放功能
      background: false, // 是否显示默认背景
      movable: true // 背景图片是否可以移动，默认true
      // crop (event) { // 当移动图片是会返回的各种数据（今天的案例中不需要使用）
      //   console.log(event.detail.x)
      //   console.log(event.detail.y)
      //   console.log(event.detail.width)
      //   console.log(event.detail.height)
      //   console.log(event.detail.rotate)
      //   console.log(event.detail.scaleX)
      //   console.log(event.detail.scaleY)
      // }
    })
  },

  methods: {
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },

    // 处理裁剪图片并上传
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则你必须传递 FormData 对象
        // 创建formData数据
        const formData = new FormData()
        formData.append('photo', blob)

        const { data: res } = await updateUserPhotoAPI(formData)

        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', res.data.photo)

        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.updata-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
