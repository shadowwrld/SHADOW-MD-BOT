const { zokou } = require('../framework/zokou');
const speed = require('../zokou/speed');

function delay(ms) {
    console.log(`Delay for ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loading(dest, zk) {
    const loadingMessages = [
        "Loading... 0%",
        "Loading... 10%",
        "Loading... 20%",
        "Loading... 30%",
        "Loading... 40%",
        "Loading... 50%",
        "Loading... 60%",
        "Loading... 70%",
        "Loading... 80%",
        "Loading... 90%",
        "Loading... 100%"
    ];

    const { key } = await zk.sendMessage(dest, { text: "Loading..." });

    for (let i = 0; i < loadingMessages.length; i++) {
        await zk.sendMessage(dest, { text: loadingMessages[i], edit: key });
        await delay(500); // Adjust the delay time as needed
    }
}

// Command to check performance
zokou({
    nomCom: 'checkPerformance',
    desc: 'Check the performance of the application.',
    Categorie: 'Performance',
    reaction: '⚡',
    fromMe: true
}, async (dest, zk) => {
    await loading(dest, zk);
    const performanceResponse = await speed(); // Assuming speed is a function that returns performance data
    await zk.sendMessage(dest, { text: `Performance: ${performanceResponse}` });
});

// Command to check server uptime
zokou({
    nomCom: 'uptime',
    desc: 'Check the server uptime.',
    Categorie: 'General',
    reaction: '🕒',
    fromMe: true
}, async (dest, zk) => {
    const uptime = process.uptime(); // Get the uptime in seconds
    await zk.sendMessage(dest, { text: `Server uptime: ${uptime} seconds` });
});

// Add more commands as necessary...
