const fs = require('fs');
const path = require('path');
const Stream = require('stream');

const modulesRef = require('../modules.json')
const distDir = path.join(__dirname, '../dist');

const readTmpl = () => {
    const buffer = fs.readFileSync(path.join(__dirname, 'index.tmpl.html'))
    return buffer.toString()
}


const buildFile = (tmpl, moduleRef) => {
    return tmpl.replaceAll(":modulePath", moduleRef).replaceAll(":originalModulePath", moduleRef);
}

const createFilePathIfNotExists = (filePath) => {
    const fileDir = filePath.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
}

async function main() {
    const tmpl = readTmpl();
    const readableStream = Stream.Readable.from(modulesRef)

    readableStream.on('data', (moduleRef) => {
        const file = buildFile(tmpl, moduleRef);
        console.log(file);
        const filePath = path.join(distDir, moduleRef, 'index.html');
        console.log(filePath);
        createFilePathIfNotExists(filePath)
        // console.log(createFilePathIfNotExists(filePath))
        fs.writeFileSync(filePath, file, { encoding: 'utf-8', flag: 'w' });
    })
}


main().then(() => {
    console.log('Pages generated successfully');
})