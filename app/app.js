const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const Repo = require('../modules/git_repo');
const REPOSITORY = 'https://github.com/mcdonndi/DistributedFileSystem.git';
const DIRECTORY = 'master';

let nums = [1,2,3,4,5,6,7,8,9,10,11,12];
let workers = [];

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    let repo = new Repo(REPOSITORY, DIRECTORY);
    repo.cloneRepo();
    let allTotal = 0;

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers.push(worker);

        //Listen for returned work
        worker.on('message', function(message) {
            console.log(`Master ${process.pid} recevies message '${JSON.stringify(message)}' from worker ${worker.process.pid}`);
            allTotal += message.total;
            console.log(allTotal);
        });
    }


    //Send work to workers
    workers.forEach((worker) => {
        console.log(`Master ${process.pid} sends work to worker ${worker.process.pid}...`);
        let someNums = nums.splice(0,4);
        worker.send({ nums: someNums });
    }, this);

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    let total = 0;

    process.on('message', function(message) {
        console.log(`Worker ${process.pid} recevies message '${JSON.stringify(message)}'`);
        message.nums.forEach((value) =>{
            total += value;
        });

        console.log(`Worker ${process.pid} sends message to master...`);
        process.send({ total: total});
    });

    console.log(`Worker ${process.pid} finished`);
}

