<template>
<!-- 卡片视图区域 -->
<el-card>
  <audio controls autoplay loop :src="musicUrl">
    您的浏览器不支持 audio 元素。
  </audio>
  <el-collapse v-model="currentSongListId" accordion>
    <el-collapse-item 
      v-for="(songListItem, i) in songList" 
      :key="i" 
      :title="songListItem.song_list_name"
      :name="songListItem.song_list_id">
      <el-button type="primary" icon="el-icon-upload" @click="addSong">在此歌单上传</el-button>
      <el-tag
        class="music_item"
        v-for="(music, i) in songListItem.songItem"
        :key="i"
        closable
        :disable-transitions="true"
        @click="play(music.url)"
        @close="handleClose(songListItem,music)">
        {{music.name}}
      </el-tag>
    </el-collapse-item>
  </el-collapse>
  <!-- 添加或修改歌单的对话框 -->
  <el-dialog title="上传音乐" :visible.sync="isOpen" width="50%">
    <el-upload
      ref="upload"
      :action="upUrl"
      :multiple="true"
      :on-change="fileChange"
      :on-remove="fileRemove"
      :file-list="fileList"
      :auto-upload="false">
      <div slot="tip" class="el-upload__tip">只能上传mp3/m4a文件</div>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOpen = false">取 消</el-button>
      <el-button type="success" @click="submitUpload">确认上传</el-button>
    </span>
  </el-dialog>
</el-card>
</template>

<script>
import {Song} from '../../utils/api'
import {UP_URL} from "../../utils/config/index"
import {Loading} from 'element-ui'
// 单独在此引入axios
import axios from 'axios'
export default {
  data() {
    return {
      isOpen: false,
      songList: [],
      currentSongListId: 0,
      upUrl: UP_URL + 'resource/uploadMusic',
      deUrl: UP_URL + 'resource/deleteMusic',
      fileList: [],
      musicUrl: ""
    }
  },
  methods: {
    // 播放音乐
    play(url){
      this.musicUrl = url
    },
    handleClose(songListItem, music){
      this.$confirm(`确认删除--${music.name}？`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // // 删除音乐
        let res = await axios({
          method: "post",
          url: this.deUrl,
          data: {
            musicUrl: music.url
          },
          headers: {
            authorization: sessionStorage.getItem('jdAdminToken')
          }
        })
        loading.close()
        if(res.data.meta.status === 1){
          this.$message.success(res.data.meta.msg)
          // 更新数据
          this.loadSongList()
          this.currentSongListId = 0
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch( () => {
        this.$message.info('取消删除')
      })
    },
    fileChange(file, fileList){
      this.fileList = fileList
    },
    fileRemove(file, fileList){
      this.fileList = fileList
    },
    async submitUpload() {
      // this.$refs.upload.submit();
      let formData = new FormData() 
      this.fileList.forEach(file => {
        formData.append('musicFile', file.raw)
      })
      formData.append("listId", this.currentSongListId)
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 调用上传接口
      let res = await axios({
        method: "post",
        url: this.upUrl,
        data: formData,
        headers: {
          'Content-Type':'multipart/form-data',
          authorization: sessionStorage.getItem('jdAdminToken')
        }
      })
      loading.close()
      if(res.data.meta.status == 1){
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
      this.$refs.upload.clearFiles()
      this.loadSongList()
    },
    async loadSongList(){
      let result = await Song.getSongList({songListType:2})
      this.songList = result.data.data.songList
      this.songList.forEach(async e => {
        let res = await Song.getLocalSongByListId({listId: e.song_list_id})
        e.songItem = res.data.songList
      })
    },
    addSong(){
      this.isOpen = true
    },
  },
  created(){
    this.loadSongList()
  }
}
</script>

<style scoped>
.music_item {
  margin: 10px;
  cursor: pointer;
}
</style>
