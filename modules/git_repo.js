const Git = require('nodegit');

class GitRepo{
    constructor(url){
        this.url = url;
        this.repo = null;
    }

    cloneRepo(){
        this.repo = Git.Clone(this.url, "master");
    }
}

module.exports = GitRepo;