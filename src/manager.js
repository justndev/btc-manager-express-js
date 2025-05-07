const { parentPort } = require('worker_threads');
const mainService = require('./mainService.js');
async function startManager() {
    console.log('Starting Manager');
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    while(true){
        const mins = 10/144
        await mainService.checkUnpaidPayments();
        await sleep(60000 * mins);

    }

}

startManager();

