module.exports = ->
  @loadNpmTasks 'grunt-contrib-connect'

  @config 'connect',
    options:
      hostname: '0.0.0.0'
      port: 8000

    development: {}

    release:
      options:
        keepalive: true
        base: 'docs'

    test:
      options:
        port: 8001
