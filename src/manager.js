const mainService = require('./mainService.js');

async function startManager() {
    console.log('Starting Manager');
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    while(true){
        try {
            await mainService.checkUnpaidPayments();
        } catch (e) {
            console.error(`@startManager: ${e.message}`);
        }
        const mins = 720
        await sleep(60000 * mins);

    }
}

startManager();

