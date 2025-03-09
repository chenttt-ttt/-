// tournaments.js
const app = getApp()

Page({
    data: {
        tournaments: [],
        searchKeyword: '',
        showFilterModal: false,
        statusFilter: 'all',
        typeFilter: 'all',
        levelFilter: 'all',
        activeFilters: []
    },

    onLoad: function(options) {
        // 如果有筛选参数
        if (options.filter && options.filter === 'my') {
            this.setData({
                activeFilters: ['我的赛事']
            })
        }

        this.loadTournaments()
    },

    onShow: function() {
        // 每次显示页面时刷新数据
        this.loadTournaments()
    },

    onPullDownRefresh: function() {
        // 下拉刷新
        this.loadTournaments()
        wx.stopPullDownRefresh()
    },

    // 加载赛事数据
    loadTournaments: function() {
        // 这里通常应该从服务器获取数据
        // 为了演示，我们使用模拟数据
        const mockTournaments = [{
                id: 1,
                name: '2023羽毛球城市公开赛',
                coverImage: '/images/tournament1.png',
                type: '单打',
                level: 'A',
                location: {
                    name: '北京市 海淀区体育馆',
                    latitude: 39.9042,
                    longitude: 116.4074
                },
                startDate: '2023-06-15',
                endDate: '2023-06-20',
                status: '报名中',
                sponsors: [{
                    id: 1,
                    name: '李宁体育'
                }]
            },
            {
                id: 2,
                name: '全国羽毛球俱乐部挑战赛',
                coverImage: '/images/tournament2.png',
                type: '双打',
                level: 'B',
                location: {
                    name: '上海市 浦东新区体育中心',
                    latitude: 31.2304,
                    longitude: 121.4737
                },
                startDate: '2023-07-10',
                endDate: '2023-07-15',
                status: '即将开始',
                sponsors: [{
                    id: 2,
                    name: '尤尼克斯'
                }]
            },
            {
                id: 3,
                name: '羽毛球爱好者友谊赛',
                coverImage: '/images/tournament3.png',
                type: '混合',
                level: 'C',
                location: {
                    name: '广州市 天河体育中心',
                    latitude: 23.1291,
                    longitude: 113.3263
                },
                startDate: '2023-08-05',
                endDate: '2023-08-07',
                status: '报名中',
                sponsors: []
            }
        ]

        // 应用筛选
        let filteredTournaments = this.applyFiltersToData(mockTournaments)

        // 如果有我的赛事筛选
        if (this.data.activeFilters.includes('我的赛事')) {
            // 假设用户id为1
            filteredTournaments = filteredTournaments.filter(item => item.id === 1 || item.id === 3)
        }

        // 应用搜索
        if (this.data.searchKeyword) {
            const keyword = this.data.searchKeyword.toLowerCase()
            filteredTournaments = filteredTournaments.filter(item =>
                item.name.toLowerCase().includes(keyword) ||
                (item.location && item.location.name.toLowerCase().includes(keyword))
            )
        }

        this.setData({
            tournaments: filteredTournaments
        })
    },

    // 应用筛选到数据
    applyFiltersToData: function(data) {
        let result = [...data]

        // 应用状态筛选
        if (this.data.statusFilter !== 'all') {
            result = result.filter(item => item.status === this.data.statusFilter)
        }

        // 应用类型筛选
        if (this.data.typeFilter !== 'all') {
            result = result.filter(item => item.type === this.data.typeFilter)
        }

        // 应用等级筛选
        if (this.data.levelFilter !== 'all') {
            result = result.filter(item => item.level === this.data.levelFilter)
        }

        return result
    },

    // 搜索输入
    onSearchInput: function(e) {
        this.setData({
            searchKeyword: e.detail.value
        })
        this.loadTournaments()
    },

    // 显示筛选弹窗
    showFilterModal: function() {
        this.setData({
            showFilterModal: true
        })
    },

    // 隐藏筛选弹窗
    hideFilterModal: function() {
        this.setData({
            showFilterModal: false
        })
    },

    // 阻止冒泡
    stopPropagation: function() {
        return
    },

    // 设置状态筛选
    setStatusFilter: function(e) {
        this.setData({
            statusFilter: e.currentTarget.dataset.status
        })
    },

    // 设置类型筛选
    setTypeFilter: function(e) {
        this.setData({
            typeFilter: e.currentTarget.dataset.type
        })
    },

    // 设置等级筛选
    setLevelFilter: function(e) {
        this.setData({
            levelFilter: e.currentTarget.dataset.level
        })
    },

    // 应用筛选
    applyFilters: function() {
        // 更新活跃筛选标签
        let newActiveFilters = this.data.activeFilters.filter(item => item !== '报名中' && item !== '即将开始' && item !== '进行中' && item !== '已结束' &&
            item !== '单打' && item !== '双打' && item !== '混合' &&
            item !== 'A级' && item !== 'B级' && item !== 'C级')

        if (this.data.statusFilter !== 'all') {
            newActiveFilters.push(this.data.statusFilter)
        }

        if (this.data.typeFilter !== 'all') {
            newActiveFilters.push(this.data.typeFilter)
        }

        if (this.data.levelFilter !== 'all') {
            newActiveFilters.push(this.data.levelFilter + '级')
        }

        this.setData({
            activeFilters: newActiveFilters,
            showFilterModal: false
        })

        this.loadTournaments()
    },

    // 重置筛选
    resetFilters: function() {
        this.setData({
            statusFilter: 'all',
            typeFilter: 'all',
            levelFilter: 'all'
        })
    },

    // 移除筛选标签
    removeFilter: function(e) {
        const index = e.currentTarget.dataset.index
        const filter = this.data.activeFilters[index]

        let newActiveFilters = [...this.data.activeFilters]
        newActiveFilters.splice(index, 1)

        // 重置相应的筛选
        if (filter === '报名中' || filter === '即将开始' || filter === '进行中' || filter === '已结束') {
            this.setData({ statusFilter: 'all' })
        } else if (filter === '单打' || filter === '双打' || filter === '混合') {
            this.setData({ typeFilter: 'all' })
        } else if (filter === 'A级' || filter === 'B级' || filter === 'C级') {
            this.setData({ levelFilter: 'all' })
        }

        this.setData({
            activeFilters: newActiveFilters
        })

        this.loadTournaments()
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
    }
})