// pages/post-detail/post-detail.js
import postList from '../../data/data'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    _pid: null,
    isPlaying: false,
    collected: false,
    _postsCollected: {},
    _mgr: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const postData = postList[options.pid]
    this.data._pid = options.pid
    const postsCollected = wx.getStorageSync('posts_collected')
    this.data._postsCollected = postsCollected || {}
    const collected = postsCollected[this.data._pid]
    this.setData({
      postData,
      collected,
      isPlaying: this.currentMusicIsPlaying()
    })
    const mgr = wx.getBackgroundAudioManager()
    this.data._mgr = mgr
    mgr.onPlay(this.onMusicStart)
    mgr.onPause(this.onMusicStop)
  },
  currentMusicIsPlaying() {
    if (app.g_isPlaying && app.g_isPlayingId === this.data._pid) {
      return true
    }
    return false
  },
  onMusicStart(event) {
    const mgr = this.data._mgr
    const music = this.data.postData.music
    mgr.src = music.url
    mgr.title = music.title
    mgr.coverImgUrl = music.coverImg
    app.g_isPlaying = true
    app.g_isPlayingId = this.data._pid
    this.setData({
      isPlaying: true
    })
  },
  onMusicStop() {
    const mgr = this.data._mgr
    mgr.pause()
    app.g_isPlaying = false
    app.g_isPlayingId = -1
    this.setData({
      isPlaying: false
    })
  },
  onShare(event) {
    wx.showActionSheet({
      itemList: ['分享到QQ', '分享到微信', '分享到朋友圈'],
    })
  },
  onCollect() {
    // 假设未收藏 -> 收藏
    // todo true->false状态改变后为什么仓库也跟着改变了
    // 赋值的是地址并未进行拷贝操作
    const postsCollected = this.data._postsCollected
    postsCollected[this.data._pid] = !postsCollected[this.data._pid]
    this.setData({
      collected: postsCollected[this.data._pid]
    })
    wx.setStorageSync('posts_collected', postsCollected)
    wx.showToast({
      title: this.data.collected ? '收藏成功' : '取消收藏',
      duration: 3000
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})