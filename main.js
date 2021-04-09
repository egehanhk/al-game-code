const https = require('https');
const fs = require('fs');
const path = require('path');

const to_download = [
    "https://adventure.land/js/game.js",
    "https://adventure.land/js/html.js",
    "https://adventure.land/js/functions.js",
    "https://adventure.land/js/common_functions.js",
    "https://adventure.land/js/ios-drag-drop.js",
    "https://adventure.land/js/keyboard.js",
    "https://adventure.land/js/payments.js",
    "https://adventure.land/data.js",
];
download_all(to_download);

function download_and_store(url) {
    return new Promise((resolve, reject) => {
        const al_url = "https://adventure.land/";
        const file_url = url.split(al_url)[1];
        if (!file_url) {
            console.error("unable to get file url from url: " + url);
            return;
        }
        const root_dir = "root/";
        const dir = root_dir + path.dirname(file_url);
    
        fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) reject(err);
        });
    
        const file = fs.createWriteStream(root_dir+file_url+"_temp");
        const request = https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();

                // Move from temp file
                fs.renameSync(root_dir+file_url+"_temp", root_dir+file_url);
                resolve();
            });
        }).on('error', function(err) {
            fs.unlink(root_dir+file_url+"_temp");
            reject(err);
        });
    });
}

async function download_all(download_list) {
    for (const url of download_list) {
        console.log("Downloading " + url);
        await download_and_store(url);
    }
}