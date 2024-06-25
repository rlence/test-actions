const fs = require('fs');
const JSZip = require('jszip');

const PATH = 'dist/application/actions/test-poc-aio';

const zip = new JSZip();

const copyFile = (path,  data) => {
    fs.writeFile(path, data, function(err) {
        if (err) {
            console.error(`Error tu create file : ${path}`, err);
            return;
        }
        console.log(`File created successfully ${path} ...`);
    });
}

const readAndCopyFile = (path, copyPath, zipName) => {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            console.error(`Error to read file ${path}`, err);
            return;
        }
        copyFile(copyPath, data);
        zip.file(zipName, data);
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(`${PATH}/${zipName}.zip`))
        .on('finish', function () {
            console.log(`${PATH}/${zipName}.zip`);
        });
    });
};


const createActionsFolder = () => {
    fs.mkdir(`dist/application/actions/`, (err) => {
        fs.mkdir(`${PATH}`, (err) => {
            if (err) {
                console.log('Error creating directory', err);
            }
    
            fs.mkdir(`${PATH}/generic-temp`, (err) => {
                if (err) {
                    console.log('Error creating directory', err);
                }
    
                readAndCopyFile(`actions/generic/index.js`, `${PATH}/generic-temp/index.js`, 'generic');
            });
    
            fs.mkdir(`${PATH}/publish-events-temp`, (err) => {
                if (err) {
                    console.log('Error creating directory', err);
                }
                readAndCopyFile(`actions/publish-events/index.js`, `${PATH}/publish-events-temp/index.js`, 'publish-events');
            });
        });
    });

}


const main = () => {
    console.log('Creating directory...')
    if(fs.existsSync('dist/application/actions')) {
        fs.rm('dist/application/actions', {recursive: true, force: true}, (err) => {
            if (err) {
                console.error('Error to remove directory', err);
                return;
            }
            createActionsFolder();
        });
    }

};

main();