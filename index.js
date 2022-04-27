const path = require('path')
const fs = require('fs')
const clc = require('cli-color')
const prompt = require("prompt-sync")({ sigint: true })

// const FolderGenerator = require('./src/FolderGenerator')
const web = require('./web')


const CreateDirectory = () => {
    const baseDir = prompt('please enter your movies directory address: ')
    const directoryPath = path.join(baseDir)
    fs.readdir(directoryPath, async (err, contents) => {
        
        if (err) {
            throw new Error(err)
        }

        contents.forEach(async (content) => {
            const ls = fs.lstatSync(path.join(baseDir, content))
            if (ls.isFile()) {
                const app = new FolderGenerator(baseDir, content)
                await app.beginGeneration()
            }

            if (ls.isDirectory()) {
                const app = new FolderGenerator(baseDir, content, true)
                await app.beginGeneration()
            }
        })
    })
}

try {
    const w = new web()
    w.start()

    // CreateDirectory()
    
} catch (err) {
    console.error(new Error(err.message))
    process.exit()
}

