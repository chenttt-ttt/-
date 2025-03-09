const app = getApp()

Page({
    data: {
        formData: {
            name: '',
            coverImage: '',
            type: '',
            level: '',
            organizer: '',
            sponsors: [],
            startDate: '',
            endDate: '',
            registrationDeadline: '',
            entryFee: '',
            location: {
                name: '',
                address: '',
                latitude: 0,
                longitude: 0,
                contact: ''
            },
            description: '',
            rules: '',
            rewards: []
        },
        typeOptions: ['单打', '双打', '混合'],
        levelOptions: ['A', 'B', 'C'],
        showRewardModal: false,
        newReward: {
            rank: '',
            points: '',
            prize: ''
        }
    },

    onLoad: function(options) {
        // 初始化表单
    },

    // 选择封面图片
    chooseImage: function() {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // 通常这里应该上传图片到服务器，然后获取URL
                // 为了演示，我们直接使用本地临时文件路径
                this.setData({
                    'formData.coverImage': res.tempFilePaths[0]
                })
            }
        })
    },

    // 选择赛事类型
    bindTypeChange: function(e) {
        this.setData({
            'formData.type': this.data.typeOptions[e.detail.value]
        })
    },

    // 选择赛事等级
    bindLevelChange: function(e) {
        this.setData({
            'formData.level': this.data.levelOptions[e.detail.value]
        })
    },

    // 选择开始日期
    bindStartDateChange: function(e) {
        this.setData({
            'formData.startDate': e.detail.value
        })
    },

    // 选择结束日期
    bindEndDateChange: function(e) {
        this.setData({
            'formData.endDate': e.detail.value
        })
    },

    // 选择报名截止日期
    bindDeadlineChange: function(e) {
        this.setData({
            'formData.registrationDeadline': e.detail.value
        })
    },

    // 添加赞助商
    addSponsor: function() {
        let sponsors = this.data.formData.sponsors || []
        sponsors.push({ name: '' })
        this.setData({
            'formData.sponsors': sponsors
        })
    },

    // 输入赞助商名称
    inputSponsorName: function(e) {
        const index = e.currentTarget.dataset.index
        const name = e.detail.value
        let sponsors = this.data.formData.sponsors
        sponsors[index].name = name
        this.setData({
            'formData.sponsors': sponsors
        })
    },

    // 删除赞助商
    deleteSponsor: function(e) {
        const index = e.currentTarget.dataset.index
        let sponsors = this.data.formData.sponsors
        sponsors.splice(index, 1)
        this.setData({
            'formData.sponsors': sponsors
        })
    },

    // 选择场馆位置
    chooseLocation: function() {
        const plugin = requirePlugin('chooseLocation')
        const key = 'MAPKEY' // 需要替换为实际的地图Key
        plugin.setLocation({
            latitude: 39.9042,
            longitude: 116.4074
        })
        wx.navigateTo({
            url: 'plugin://chooseLocation/index?key=' + key,
            success: () => {
                // 选择地点成功后返回，在onShow中处理结果
            }
        })
    },

    onShow: function() {
        // 处理选择的位置
        const plugin = requirePlugin('chooseLocation')
        const location = plugin.getLocation()
        plugin.setLocation(null) // 清空

        if (location) {
            this.setData({
                'formData.location.name': location.name,
                'formData.location.address': location.address,
                'formData.location.latitude': location.latitude,
                'formData.location.longitude': location.longitude
            })
        }
    },

    // 输入场馆联系电话
    inputVenueContact: function(e) {
        this.setData({
            'formData.location.contact': e.detail.value
        })
    },

    // 显示添加奖励弹窗
    showAddRewardModal: function() {
        this.setData({
            showRewardModal: true,
            newReward: {
                rank: '',
                points: '',
                prize: ''
            }
        })
    },

    // 隐藏添加奖励弹窗
    hideAddRewardModal: function() {
        this.setData({
            showRewardModal: false
        })
    },

    // 输入新奖励字段
    inputNewRewardField: function(e) {
        const field = e.currentTarget.dataset.field
        const value = e.detail.value
        this.setData({
            [`newReward.${field}`]: value
        })
    },

    // 添加奖励
    addReward: function() {
        const newReward = this.data.newReward

        // 验证必填字段
        if (!newReward.rank || !newReward.points) {
            wx.showToast({
                title: '请填写名次和积分',
                icon: 'none'
            })
            return
        }

        let rewards = this.data.formData.rewards || []
        rewards.push({
            rank: newReward.rank,
            points: newReward.points,
            prize: newReward.prize
        })

        this.setData({
            'formData.rewards': rewards,
            showRewardModal: false
        })
    },

    // 输入奖励字段
    inputRewardField: function(e) {
        const index = e.currentTarget.dataset.index
        const field = e.currentTarget.dataset.field
        const value = e.detail.value

        this.setData({
            [`formData.rewards[${index}].${field}`]: value
        })
    },

    // 删除奖励
    deleteReward: function(e) {
        const index = e.currentTarget.dataset.index
        let rewards = this.data.formData.rewards
        rewards.splice(index, 1)

        this.setData({
            'formData.rewards': rewards
        })
    },

    // 阻止冒泡
    stopPropagation: function() {
        return
    },

    // 取消创建
    onCancel: function() {
        wx.showModal({
            title: '提示',
            content: '确定要放弃创建吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.navigateBack()
                }
            }
        })
    },

    // 提交表单
    submitForm: function(e) {
        const formData = this.data.formData

        // 验证必填字段
        if (!formData.name) {
            this.showError('请输入赛事名称')
            return
        }

        if (!formData.coverImage) {
            this.showError('请上传赛事封面')
            return
        }

        if (!formData.type) {
            this.showError('请选择赛事类型')
            return
        }

        if (!formData.level) {
            this.showError('请选择赛事等级')
            return
        }

        if (!formData.organizer) {
            this.showError('请输入主办方名称')
            return
        }

        if (!formData.startDate) {
            this.showError('请选择开始日期')
            return
        }

        if (!formData.endDate) {
            this.showError('请选择结束日期')
            return
        }

        if (!formData.registrationDeadline) {
            this.showError('请选择报名截止日期')
            return
        }

        if (!formData.location.name) {
            this.showError('请选择场馆位置')
            return
        }

        // 添加表单中的其他字段
        formData.status = '报名中'
        formData.entryFee = formData.entryFee || 0

        // 这里应该调用创建赛事API
        wx.showLoading({
            title: '创建中',
        })

        // 模拟API调用
        setTimeout(() => {
            wx.hideLoading()

            // 添加到全局赛事列表
            const tournaments = app.globalData.tournaments || []
            formData.id = tournaments.length + 1
            tournaments.push(formData)
            app.globalData.tournaments = tournaments

            // 缓存到本地
            wx.setStorageSync('tournaments', tournaments)

            wx.showToast({
                title: '创建成功',
                icon: 'success',
                success: () => {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/tournament/detail?id=' + formData.id
                        })
                    }, 1500)
                }
            })
        }, 1500)
    },

    // 显示错误信息
    showError: function(message) {
        wx.showToast({
            title: message,
            icon: 'none'
        })
    }
})