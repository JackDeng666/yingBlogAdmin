import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  editBlogStatus: 0,
  editBlogDetail:{}
}
const mutations = {
  changeEditBlogStatus(state,val){state.editBlogStatus=val},
  changeEditBlogDetail(state,val){state.editBlogDetail=val}
}
export default new Vuex.Store({
  state,
  mutations
})
