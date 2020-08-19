import request from './request'

class Blog {
  async getBlogTypes(){
    return await request({
      method: 'get',
      url: 'blog/getBlogTypes'
    })
  }
  async addBlogTypes(data){
    return await request({
      method: 'post',
      url: 'blog/addBlogTypes',
      data
    })
  }
  async updateBlogTypes(data){
    return await request({
      method: 'post',
      url: 'blog/updateBlogTypes',
      data
    })
  }
  async deleteBlogTypes(data){
    return await request({
      method: 'post',
      url: 'blog/deleteBlogTypes',
      data
    })
  }
  async getBlogDetail(blogId){
    return await request({
      method: 'get',
      url: 'blog/getBlogDetail',
      params: {
        blogId
      }
    })
  }
  async getBlogList(status,currentPage,pageSize){
    return await request({
      method: 'get',
      url: 'blog/getBlogList',
      params: {
        currentPage,
        pageSize,
        "status": status
      }
    })
  }
  async getBlogListByType(typeId,status,currentPage,pageSize){
    return await request({
      method: 'get',
      url: 'blog/getBlogListByType',
      params: {
        typeId,
        currentPage,
        pageSize,
        "status": status
      }
    })
  }
  async addBlog(blog){
    return await request({
      method: 'post',
      url: 'blog/addBlog',
      data: {
        blog
      }
    })
  }
  async updateBlogDetail(blog){
    let result = await request({
      method: 'post',
      url: 'blog/updateBlogDetail',
      data: blog
    })
    return result
  }
  async deleteBlog(blogId){
    return await request({
      method: 'post',
      url: 'blog/deleteBlog',
      data: {
        blogId
      }
    })
  }
}

export default new Blog()
