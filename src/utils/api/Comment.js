import request from './request'
class Comment {
  async getCommentList(params){
    return await request({
      url: 'comment/getCommentList',
      method: 'get',
      params
    })
  }
  async deleteComment(data){
    return await request({
      url: 'comment/deleteComment',
      method: 'post',
      data
    })
  }
}
export default new Comment()
