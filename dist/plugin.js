exports.version = 1.1
exports.description = "Windows URL files (redirect on open)"
exports.apiRequired = 1
exports.repo = "rejetto/windows-url-files"
exports.changelog = [
    { "version": 1.1, "message": "Fix for WebDAV" }
]

exports.init = api => ({
    middleware: ctx => async () => { // wait for it to be processed, so that permissions and the rest is taken care of
        if (ctx.get('user-agent').includes('MiniRedir')) return // skip WebDAV request
        if ('dl' in ctx.query) return // forced download
        const file = ctx.state.fileSource
            || ctx.fileSource // legacy
        if (!file?.endsWith('.url')) return
        const { readFile } = api.require('fs/promises')
        const content = await readFile(file)
        if (!content.includes('[InternetShortcut]')) return
        const url = /^URL=(.+)$/m.exec(content)?.[1]
        if (!url) return
        ctx.redirect(url)
    }
})
