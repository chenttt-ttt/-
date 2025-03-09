// detail.js
const app = getApp()

Page({
  data: {
    tournament: null,
    tournamentId: null,
    activeTab: 0,
    markers: [],
    isRegistered: false
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        tournamentId: options.id
      })
      this.loadTournamentDetail(options.id)
    }
  },

  // 加载赛事详情
  loadTournamentDetail: function(id) {
    // 这里通常应该从服务器获取数据
    // 为了演示，我们使用模拟数据
    const mockTournament = {
      id: id,
      name: '2023羽毛球城市公开赛',
      coverImage: '/images/tournament1.png',
      organizer: '城市体育局',
      type: '单打',
      level: 'A',
      location: {
        name: '北京市 海淀区体育馆',
        address: '北京市海淀区学院路38号',
        latitude: 39.9042,
        longitude: 116.4074,
        contact: '010-12345678'
      },
      startDate: '2023-06-15',
      endDate: '2023-06-20',
      registrationDeadline: '2023-06-10',
      status: '报名中',
      entryFee: 100,
      description: '这是一个面向城市羽毛球爱好者的大型赛事，旨在推广羽毛球运动，提高市民身体素质。比赛分为多个级别，适合不同水平的选手参与。',
      rules: '比赛采用21分制，三局两胜。小组循环赛+淘汰赛制度。每位选手保证至少能参加3场比赛。',
      sponsors: [
        {
          id: 1,
          name: '李宁体育'
        }
      ],
      rewards: [
        {
          rank: '冠军',
          points: 500,
          prize: '奖杯+奖金2000元'
        },
        {
          rank: '亚军',
          points: 300,
          prize: '奖杯+奖金1000元'
        },
        {
          rank: '季军',
          points: 150,
          prize: '奖杯+奖金500元'
        }
      ],
      players: [
        {
          id: 1,
          name: '张三',
          avatarUrl: '/images/avatar1.png',
          rank: 5
        },
        {
          id: 2,
          name: '李四',
          avatarUrl: '/images/avatar2.png',
          rank: 8
        },
        {
          id: 3,
          name: '王五',
          avatarUrl: '/images/avatar3.png',
          rank: 12
        }
      ],
      matches: [
        {
          date: '2023-06-15',
          matches: [
            {
              id: 1,
              time: '09:00',
              court: '1号场地',
              playerA: '张三',
              playerB: '李四',
              status: '即将开始'
            },
            {
              id: 2,
              time: '10:00',
              court: '2号场地',
              playerA: '王五',
              playerB: '赵六',
              status: '即将开始'
            }
          ]
        },
        {
          date: '2023-06-16',
          matches: [
            {
              id: 3,
              time: '09:00',
              court: '1号场地',
              playerA: '胜者1',
              playerB: '胜者2',
              status: '未开始'
            }
          ]
        }
      ]
    }

    // 设置地图标记点
    const markers = [{
      id: 1,
      latitude: mockTournament.location.latitude,
      longitude: mockTournament.location.longitude,
      name: mockTournament.location.name,
      callout: {
        content: mockTournament.location.name,
        padding: 10,
        borderRadius: 5,
        display: 'ALWAYS'
      }
    }]

    this.setData({
      tournament: mockTournament,
      markers: markers
    })

    // 缓存当前赛事信息
    app.globalData.currentTournament = mockTournament
  },

  // 切换选项卡
  switchTab: function(e) {
    const tab = parseInt(e.currentTarget.dataset.tab)
    this.setData({
      activeTab: tab
    })
  },

  // 打开地图位置
  openLocation: function() {
    const location = this.data.tournament.location
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      address: location.address || location.name,
      scale: 18
    })
  },

  // 报名参赛
  registerTournament: function() {
    wx.showModal({
      title: '确认报名',
      content: `报名费用: ${this.data.tournament.entryFee || 0}元，确认要报名吗？`,
      success: (res) => {
        if (res.confirm) {
          // 这里应该调用报名API
          wx.showLoading({
            title: '报名中',
          })

          // 模拟API调用
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '报名成功',
              icon: 'success'
            })
            this.setData({
              isRegistered: true
            })
          }, 1500)
        }
      }
    })
  },

  // 收藏赛事
  saveTournament: function() {
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
  },

  // 跳转到比赛详情
  goToMatchDetail: function(e) {
    const matchId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/match/detail?id=' + matchId
    })
  },

  // 举报赞助商
  reportSponsor: function() {
    wx.showActionSheet({
      itemList: ['内容涉黄涉暴', '虚假广告', '侵权', '其他问题'],
      success: (res) => {
        if (!res.cancel) {
          // 这里应该调用举报API
          wx.showModal({
            title: '举报理由',
            placeholderText: '请详细描述您举报的原因...',
            editable: true,
            success: (result) => {
              if (result.confirm) {
                wx.showToast({
                  title: '举报成功',
                  icon: 'success'
                })
              }
            }
          })
        }
      }
    })
  },

  // 分享
  onShareAppMessage: function() {
    return {
      title: this.data.tournament.name,
      path: '/pages/tournament/detail?id=' + this.data.tournament.id,
      imageUrl: this.data.tournament.coverImage
    }
  }
}) 