module.exports = {
  // publicPath: './',
  chainWebpack: (config) => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        vuex: 'Vuex',
        'video.js': 'videojs'
        // lodash: '_',
        // echarts: 'echarts',
        // nprogress: 'NProgress',
        // 'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap((args) => {
        args[0].isProd = true
        return args
      })
      config
        .plugin('CompressionPlugin')
        .use('compression-webpack-plugin', [
          {
            // test: /\.js$|\.css$|\.html$/, // gzip压缩规则
            // threshold: 10240, // 大于10K的数据会被压缩
            // algorithm: 'gzip', // 压缩方式
            // minRatio: 0.8 // 压缩比小于这个的才压缩
            filename: '[file].gz[query]',
            algorithm: 'gzip',
            include: /\.(js|css|html|svg|json)(\?.*)?$/i,
            minRatio: 0.8
          }
        ])
        .end()
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap((args) => {
        args[0].isProd = false
        return args
      })
    })
  }
}
