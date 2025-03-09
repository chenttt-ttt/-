// app.js
App({
    globalData: {
        userInfo: null,
        tournaments: [],
        currentTournament: null
    },
    onLaunch: function() {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            this.globalData.userInfo = res.userInfo
                        }
                    })
                }
            }
        })

        // 从本地存储加载赛事数据
        const tournaments = wx.getStorageSync('tournaments') || []
        this.globalData.tournaments = tournaments
    }
})