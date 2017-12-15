const Git = require('nodegit');
const fs = require('fs');

class GitRepo{
    constructor(url, dir){
        this.url = url;
        this.dir = dir;
        this.repo = null;
    }

    cloneRepo(){
        this.repo = Git.Clone(this.url, this.dir);
    }

    countFilesInRepo(cb){
        fs.readdir(this.dir, (err, files) => {
            console.log(files.length);
            cb(files.length)
        })
    }
}

module.exports = GitRepo;