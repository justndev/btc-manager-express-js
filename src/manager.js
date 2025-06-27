const mainService = require('./mainService.js');

async function startManager() {
    console.log('Starting Manager');
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    while(true){
        try {
            const mins = 720
            await mainService.checkUnpaidPayments();
            await sleep(60000 * mins);
        } catch (e) {
            console.error(`@startManager: ${e.message}`);
        }
    }
}

startManager();

