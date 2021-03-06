const express = require('express')
const path = require('path')
const cookieParser = require("cookie-parser")
const args = require('args-parser')(process.argv)
const FileManager = require('./src/FileManager')
const helpers = require('./src/helper')

class Web {
    #app
    constructor() {

    }

    start() {
        const app = express()
        app.set('view engine', 'ejs')
        // app.set('views', 'views')
        // set static folder
        app.use(cookieParser())
        app.use(express.static(path.join(__dirname, 'static')))
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))
        const PORT = 3000
        app.listen(PORT, () => {
            if (args.host) {
                console.log(`server started at http://${args.host}:${PORT}`);
            } else {
                console.log(`server started at port ${PORT}`);
            }
        })
        this.#app = app
        this.route()
        this.apiRoutes()
    }

    route() {
        this.#app.get('/', async (req, res) => {
            const dir = req.query.dir
            const viewMode = req.cookies.viewMode || 'icon'
            const theme = req.cookies.theme || 'light'
            const pasteAction = (req.cookies.pasteAction) || null

            let drivers = null
            let title = null
            let contents = null
            let fm = null

            if (!dir || dir === '') {
                drivers = await helpers.getDriversList()
                title = 'Drivers'
            } else {
                title = helpers.getTitle(dir)
                contents = helpers.getDirectoryContent(dir)
                fm = new FileManager(dir, '')
                contents = contents.map(content => {
                    return {
                        content,
                        fm: new FileManager(dir, content)
                    }
                })
            }
            
            return res.render('index', {
                title,
                dir,
                drivers,
                viewMode,
                theme,
                contents,
                helpers,
                fm,
                pasteAction
            })
        })

        this.#app.get('/open', (req, res) => {
            const dir = req.query.dir
            const fm = new FileManager(dir, '')
            fm.openFileLocation()
            return res.redirect('back')
        })
    }

    apiRoutes() {
        this.#app.post('/api/directory/create', (req, res) => {
            // TODO | or : chars cannot use to create new folder
            const recursive = req.body.recursive === 'on'
            const fm = new FileManager(req.body.dir, '')
            fm.createDirectory(req.body.dir_name, recursive)
            return res.redirect('back')
        })

        this.#app.post('/api/directory/delete', (req, res) => {
            const dir = req.body.dir
            const fm = new FileManager(dir, '')
            fm.removeDirectory()
            return res.redirect(helpers.createLink(helpers.getPreviousDir(dir)))
        })

        this.#app.post('/api/directory/rename', (req, res) => {
            const fm = new FileManager(req.body.dir, '')
            fm.renameDirectory(req.body.new_name)
            return res.redirect(helpers.createLink(path.join(helpers.getPreviousDir(req.body.dir), req.body.new_name)))
        })

        this.#app.post('/api/group/delete', (req, res) => {
            const dirs = req.body.dirs
            dirs.forEach(dir => {
                const fm = new FileManager(dir, '')
                if (fm.isDirectory()) {
                    fm.removeDirectory()
                } else if (fm.isFile()) {
                    fm.removeFile()
                }
            })
            return res.status(204).json({ message: 'files deleted'})
        })

        this.#app.post('/api/group/rename', (req, res) => {
            const dirs = req.body
            Object.entries(dirs).forEach(dir => {
                const fm = new FileManager(dir[0], '')
                if (fm.isDirectory()) {
                    fm.renameDirectory(dir[1])
                } else if (fm.isFile()) {
                    fm.renameFile(dir[1])
                }
            })
            return res.redirect('back')
        })

        this.#app.post('/api/group/paste', (req, res) => {
            const dirs = req.body.contents
            const action = req.body.action
            const destination = req.body.destination
            dirs.forEach(dir => {
                const fm = new FileManager(dir, '')
                if (action === 'copy') {
                    // fm.copyTo(destination)
                } else if (action === 'cut') {
                    // fm.moveTo(destination)
                }
            })
            return res.json({ 'message': 'paste done' })
        })

        this.#app.post('/api/file/create', (req, res) => {
            const dir = req.body.dir
            const fm = new FileManager(dir, '')
            fm.createFile(req.body.file_name, req.body.file_content)
            return res.redirect('back')
        })
    }
}

module.exports = Web