import request from './request'

class Song {
  async getSongList(){
    return await request({
      method: 'get',
      url: 'song/getSongList'
    })
  }
  async addSongList(data){
    return await request({
      method: 'post',
      url: 'song/addSongList',
      data
    })
  }
  async deleteSongList(data){
    return await request({
      method: 'post',
      url: 'song/deleteSongList',
      data
    })
  }
  async updateSongList(data){
    return await request({
      method: 'post',
      url: 'song/updateSongList',
      data
    })
  }
}

export default new Song()
