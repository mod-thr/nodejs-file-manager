const express = require('express')
const path = require('path')
const FileManager = require('./src/FileManager')
const cookieParser = require("cookie-parser")
const helpers = require('./src/helper')

class Web {
    #app
    constructor() {

    }

    start() {
        console.log('started');
        const app = express()
        app.set('view engine', 'ejs')
        // app.set('views', 'views')
        // set static folder
        app.use(cookieParser())
        app.use(express.static(path.join(__dirname, 'static')))
        const PORT = 3000
        app.listen(PORT, () => {
            console.log(`server started at port ${PORT}`);
        })
        this.#app = app
        this.route()
    }

    route() {
        this.#app.get('/', async (req, res) => {
            const dir = req.query.dir
            const viewMode = req.cookies.viewMode || 'icon'
            const theme = req.cookies.theme || 'light'

            let drivers = null
            let title = null
            let contents = null

            if (!dir || dir === '') {
                drivers = await helpers.getDriversList()
                title = 'Drivers'
            } else {
                title = helpers.getTitle(dir)
                contents = helpers.getDirectoryContent(dir)
                contents = contents.map(content => {
                    return {
                        content,
                        fm: new FileManager(dir, content)
                    }
                })
            }
            
            res.render('index', {
                title,
                dir,
                drivers,
                viewMode,
                theme,
                contents,
                helpers
            })
        })

        this.#app.get('/open', (req, res) => {
            const dir = req.query.dir
            const viewMode = req.cookies.viewMode || 'icon'
            const theme = req.cookies.theme || 'light'
            const title = helpers.getTitle(dir)

            const fm = new FileManager(dir, '')
            console.log(fm.getFileMime());

            res.set('Content-Type', fm.getFileMime()).send('')
            // res.render('open', {
            //     dir,
            //     viewMode,
            //     theme,
            //     title
            // })
        })
    }
}

module.exports = Web