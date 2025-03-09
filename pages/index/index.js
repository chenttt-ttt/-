const app = getApp()

Page({
    data: {
        banners: [{
                id: 1,
                imageUrl: '/images/banner1.png'
            },
            {
                id: 2,
                imageUrl: '/images/banner2.png'
            },
            {
                id: 3,
                imageUrl: '/images/banner3.png'
            }
        ],
        hotTournaments: [],
        rankings: [],
        // 初始化所有需要的数据状态
        hasMoreTournaments: true,
        pageNum: 1,
        pageSize: 10,
        loading: false,
        isRefreshing: false,
        searchKeyword: '',
        lastUpdateTime: null
    },

    onLoad: function() {
        // 先检查缓存数据
        this.loadDataFromCache()
            // 然后从服务器获取最新数据
        this.loadDataFromServer()
    },

    onShow: function() {
        // 检查数据是否需要更新（如超过30分钟）
        const now = new Date().getTime()
        const thirtyMinutes = 30 * 60 * 1000

        if (!this.data.lastUpdateTime || (now - this.data.lastUpdateTime > thirtyMinutes)) {
            this.loadHotTournamentsFromServer()
        }
    },

    // 从缓存加载数据
    loadDataFromCache: function() {
        const cachedTournaments = wx.getStorageSync('hotTournaments')
        const cachedRankings = wx.getStorageSync('rankings')
        const lastUpdateTime = wx.getStorageSync('lastUpdateTime')

        if (cachedTournaments && cachedTournaments.length > 0) {
            this.setData({
                hotTournaments: cachedTournaments,
                lastUpdateTime: lastUpdateTime || null
            })
        }

        if (cachedRankings && cachedRankings.length > 0) {
            this.setData({
                rankings: cachedRankings
            })
        }
    },

    // 从服务器加载所有数据
    loadDataFromServer: function() {
        wx.showLoading({
            title: '加载中',
        })

        Promise.all([
                this.loadHotTournamentsFromServer(),
                this.loadRankingsFromServer()
            ])
            .then(() => {
                // 更新最后更新时间并存入缓存
                const updateTime = new Date().getTime()
                this.setData({
                    lastUpdateTime: updateTime
                })
                wx.setStorageSync('lastUpdateTime', updateTime)
            })
            .catch(error => {
                this.handleError(error)
            })
            .finally(() => {
                wx.hideLoading()
            })
    },

    // 加载热门赛事
    loadHotTournaments: function() {
        // 这里通常应该从服务器获取数据
        // 为了演示，我们使用模拟数据
        const mockTournaments = [{
                id: 1,
                name: '2023羽毛球城市公开赛',
                coverImage: '/images/tournament1.png',
                location: {
                    name: '北京市 海淀区体育馆',
                    latitude: 39.9042,
                    longitude: 116.4074
                },
                startDate: '2023-06-15',
                endDate: '2023-06-20',
                status: '报名中'
            },
            {
                id: 2,
                name: '全国羽毛球俱乐部挑战赛',
                coverImage: '/images/tournament2.png',
                location: {
                    name: '上海市 浦东新区体育中心',
                    latitude: 31.2304,
                    longitude: 121.4737
                },
                startDate: '2023-07-10',
                endDate: '2023-07-15',
                status: '即将开始'
            }
        ]

        this.setData({
            hotTournaments: mockTournaments
        })

        // 保存到缓存
        wx.setStorageSync('hotTournaments', mockTournaments)
    },

    // 加载排行榜数据
    loadRankings: function() {
        // 这里通常应该从服务器获取数据
        // 为了演示，我们使用模拟数据
        const mockRankings = [{
                id: 1,
                name: '张三',
                avatarUrl: '/images/avatar1.png',
                points: 2450
            },
            {
                id: 2,
                name: '李四',
                avatarUrl: '/images/avatar2.png',
                points: 2350
            },
            {
                id: 3,
                name: '王五',
                avatarUrl: '/images/avatar3.png',
                points: 2280
            },
            {
                id: 4,
                name: '赵六',
                avatarUrl: '/images/avatar4.png',
                points: 2150
            },
            {
                id: 5,
                name: '刘七',
                avatarUrl: '/images/avatar5.png',
                points: 2000
            }
        ]

        this.setData({
            rankings: mockRankings
        })

        // 保存到缓存
        wx.setStorageSync('rankings', mockRankings)
    },

    // 点击轮播图
    onBannerTap: function(e) {
        const bannerId = e.currentTarget.dataset.id
        const bannerItem = this.data.banners.find(item => item.id === bannerId)

        if (!bannerItem) {
            return
        }

        // 根据bannerId跳转到相应页面
        console.log('点击了轮播图:', bannerId)
            // 示例: 可以根据banner类型跳转到不同页面
            // if (bannerItem.type === 'tournament') {
            //     this.goToTournamentDetail({ currentTarget: { dataset: { id: bannerItem.targetId } } })
            // } else if (bannerItem.type === 'news') {
            //     wx.navigateTo({
            //         url: '/pages/news/detail?id=' + bannerItem.targetId
            //     })
            // }
    },

    // 跳转到赛事详情
    goToTournamentDetail: function(e) {
        const tournamentId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/tournament/detail?id=' + tournamentId
        })
    },

    // 跳转到创建赛事页面
    goToCreateTournament: function() {
        wx.navigateTo({
            url: '/pages/tournament/create'
        })
    },

    // 下拉刷新
    onPullDownRefresh: function() {
        if (this.data.isRefreshing) {
            return
        }

        this.setData({
            isRefreshing: true
        })

        wx.showNavigationBarLoading()

        // 重置分页
        this.setData({
            pageNum: 1,
            hasMoreTournaments: true
        })

        // 重新加载数据
        Promise.all([this.loadHotTournamentsFromServer(), this.loadRankingsFromServer()])
            .then(() => {
                const updateTime = new Date().getTime()
                this.setData({
                    lastUpdateTime: updateTime
                })
                wx.setStorageSync('lastUpdateTime', updateTime)
            })
            .catch(error => {
                this.handleError(error)
            })
            .finally(() => {
                wx.hideNavigationBarLoading()
                wx.stopPullDownRefresh()
                this.setData({
                    isRefreshing: false
                })
            })
    },

    // 上拉加载更多
    onReachBottom: function() {
        if (!this.data.hasMoreTournaments || this.data.loading) {
            return
        }

        this.loadMoreTournaments()
    },

    // 从服务器加载热门赛事
    loadHotTournamentsFromServer: function() {
        return new Promise((resolve, reject) => {
            if (this.data.loading) {
                resolve()
                return
            }

            this.setData({
                loading: true
            })

            wx.showLoading({
                title: '加载中',
            })

            // 这里替换为实际的API调用
            // wx.request({
            //     url: 'https://your-api.com/api/tournaments/hot',
            //     data: {
            //         pageNum: this.data.pageNum,
            //         pageSize: this.data.pageSize,
            //         keyword: this.data.searchKeyword || ''
            //     },
            //     method: 'GET',
            //     success: (res) => {
            //         this.setData({
            //             hotTournaments: res.data.tournaments,
            //             hasMoreTournaments: res.data.hasMore
            //         })
            //         // 缓存数据
            //         wx.setStorageSync('hotTournaments', res.data.tournaments)
            //         resolve()
            //     },
            //     fail: (error) => {
            //         reject(error)
            //     },
            //     complete: () => {
            //         wx.hideLoading()
            //         this.setData({
            //             loading: false
            //         })
            //     }
            // })

            // 模拟数据加载
            setTimeout(() => {
                this.loadHotTournaments()
                this.setData({
                    loading: false
                })
                wx.hideLoading()
                resolve()
            }, 500)
        })
    },

    // 从服务器加载排行榜数据
    loadRankingsFromServer: function() {
        return new Promise((resolve, reject) => {
            // 实际项目中替换为API调用
            // wx.request({
            //     url: 'https://your-api.com/api/rankings',
            //     method: 'GET',
            //     success: (res) => {
            //         this.setData({
            //             rankings: res.data.rankings
            //         })
            //         // 缓存数据
            //         wx.setStorageSync('rankings', res.data.rankings)
            //         resolve()
            //     },
            //     fail: (error) => {
            //         reject(error)
            //     }
            // })

            // 模拟数据加载
            setTimeout(() => {
                this.loadRankings()
                resolve()
            }, 300)
        })
    },

    // 加载更多赛事
    loadMoreTournaments: function() {
        if (this.data.loading) {
            return
        }

        this.setData({
            loading: true
        })

        wx.showLoading({
            title: '加载更多',
        })

        // 模拟分页请求
        // wx.request({
        //     url: 'https://your-api.com/api/tournaments/hot',
        //     data: {
        //         pageNum: this.data.pageNum + 1,
        //         pageSize: this.data.pageSize,
        //         keyword: this.data.searchKeyword || ''
        //     },
        //     success: (res) => {
        //         if (res.data.tournaments && res.data.tournaments.length > 0) {
        //             this.setData({
        //                 hotTournaments: [...this.data.hotTournaments, ...res.data.tournaments],
        //                 hasMoreTournaments: res.data.hasMore,
        //                 pageNum: this.data.pageNum + 1
        //             })
        //         } else {
        //             this.setData({
        //                 hasMoreTournaments: false
        //             })
        //         }
        //     },
        //     fail: (error) => {
        //         this.handleError(error)
        //     },
        //     complete: () => {
        //         wx.hideLoading()
        //         this.setData({
        //             loading: false
        //         })
        //     }
        // })

        // 模拟加载更多
        setTimeout(() => {
            const newTournaments = [{
                id: 3,
                name: '区域羽毛球精英选拔赛',
                coverImage: '/images/tournament3.png',
                location: {
                    name: '广州市 天河体育中心',
                    latitude: 23.1291,
                    longitude: 113.3259
                },
                startDate: '2023-08-05',
                endDate: '2023-08-10',
                status: '报名中'
            }]

            // 只有在第一页时才添加新数据
            if (this.data.pageNum === 1) {
                this.setData({
                    hotTournaments: [...this.data.hotTournaments, ...newTournaments],
                    hasMoreTournaments: false,
                    pageNum: this.data.pageNum + 1
                })
            } else {
                this.setData({
                    hasMoreTournaments: false
                })
            }

            this.setData({
                loading: false
            })
            wx.hideLoading()
        }, 800)
    },

    // 搜索赛事
    searchTournaments: function(e) {
        const keyword = e.detail.value

        this.setData({
            searchKeyword: keyword,
            pageNum: 1,
            hasMoreTournaments: true
        })

        if (!keyword) {
            this.loadHotTournamentsFromServer()
            return
        }

        if (this.data.loading) {
            return
        }

        this.setData({
            loading: true
        })

        wx.showLoading({
            title: '搜索中',
        })

        // 实际项目中应该调用搜索API
        // wx.request({
        //     url: 'https://your-api.com/api/tournaments/search',
        //     data: { 
        //         keyword: keyword,
        //         pageNum: 1,
        //         pageSize: this.data.pageSize
        //     },
        //     method: 'GET',
        //     success: (res) => {
        //         this.setData({
        //             hotTournaments: res.data.tournaments,
        //             hasMoreTournaments: res.data.hasMore
        //         })
        //     },
        //     fail: (error) => {
        //         this.handleError(error)
        //     },
        //     complete: () => {
        //         wx.hideLoading()
        //         this.setData({
        //             loading: false
        //         })
        //     }
        // })

        // 模拟搜索结果
        setTimeout(() => {
            const filteredTournaments = this.data.hotTournaments.filter(
                tournament => tournament.name.indexOf(keyword) >= 0
            )

            this.setData({
                hotTournaments: filteredTournaments,
                hasMoreTournaments: false,
                loading: false
            })

            wx.hideLoading()

            if (filteredTournaments.length === 0) {
                wx.showToast({
                    title: '没有找到相关赛事',
                    icon: 'none'
                })
            }
        }, 500)
    },

    // 清除搜索
    clearSearch: function() {
        this.setData({
            searchKeyword: '',
            pageNum: 1,
            hasMoreTournaments: true
        })

        this.loadHotTournamentsFromServer()
    },

    // 共享赛事信息
    shareTournament: function(e) {
        const tournamentId = e.currentTarget.dataset.id
        const tournament = this.data.hotTournaments.find(item => item.id === tournamentId)

        if (!tournament) return

        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },

    // 分享给朋友
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            const tournamentId = res.target.dataset.id
            const tournament = this.data.hotTournaments.find(item => item.id === tournamentId)

            if (tournament) {
                return {
                    title: tournament.name,
                    path: '/pages/tournament/detail?id=' + tournamentId,
                    imageUrl: tournament.coverImage
                }
            }
        }

        // 来自菜单转发按钮
        return {
            title: '羽毛球赛事平台',
            path: '/pages/index/index',
            imageUrl: '/images/share-default.png' // 默认分享图片
        }
    },

    // 分享到朋友圈
    onShareTimeline: function() {
        return {
            title: '羽毛球赛事平台',
            query: '',
            imageUrl: '/images/share-default.png'
        }
    },

    // 错误处理
    handleError: function(error) {
        console.error('发生错误:', error)

        // 根据错误类型显示不同提示
        let errorMsg = '加载失败，请稍后重试'

        if (error && error.errMsg) {
            if (error.errMsg.includes('timeout')) {
                errorMsg = '网络请求超时，请检查网络连接'
            } else if (error.errMsg.includes('fail')) {
                errorMsg = '网络连接失败，请检查网络设置'
            }
        }

        wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
        })

        // 如果是首次加载失败，尝试从缓存加载
        if (this.data.hotTournaments.length === 0) {
            this.loadDataFromCache()
        }
    },

    // 跳转到所有赛事页面
    goToTournaments: function() {
        wx.switchTab({
            url: '/pages/tournaments/tournaments'
        })
    },

    // 跳转到我的赛事页面
    goToMyTournaments: function() {
        wx.navigateTo({
            url: '/pages/tournaments/tournaments?filter=my'
        })
    },

    // 跳转到个人中心
    goToProfile: function() {
        wx.switchTab({
            url: '/pages/user/profile'
        })
    },

    // 跳转到地图查看位置
    viewLocation: function(e) {
        const tournamentId = e.currentTarget.dataset.id
        const tournament = this.data.hotTournaments.find(item => item.id === tournamentId)

        if (!tournament || !tournament.location) return

        wx.openLocation({
            latitude: tournament.location.latitude,
            longitude: tournament.location.longitude,
            name: tournament.location.name,
            scale: 18
        })
    }
})