import axios from 'axios';

// Function to create a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main image command function
const imageCommand = async (message, bot) => {
    const prefix = message.body.startsWith('/') ? '/' : ''; // Adjust prefix as needed
    const command = message.body.startsWith(prefix) 
        ? message.body.slice(prefix.length).split(' ')[0].toLowerCase() 
        : '';

    const searchQuery = message.body.slice(prefix.length + command.length).trim();
    const validCommands = ['pinterest', 'pint', 'pintdl'];

    // Check if the command is valid
    if (!validCommands.includes(command)) return;

    // If no search query provided
    if (!searchQuery) {
        return bot.sendMessage(message.from, {
            text: `Usage: ${prefix}${command} <search query>`
        });
    }

    try {
        await message.react('📥'); // React to the message
        const response = await axios.get(`https://api.maskser.me/api/search/pinterest?text=${encodeURIComponent(searchQuery)}`);
        const imageUrls = response.data.result;

        // If no images found
        if (imageUrls.length === 0) {
            return bot.sendMessage(message.from, {
                text: 'No images found for your search query.'
            });
        }

        // Send images one by one
        for (const imageUrl of imageUrls) {
            await sleep(500); // Delay between requests
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');

            await bot.sendMessage(message.from, { image: imageBuffer }, { quoted: message });
            await message.react('✅'); // Confirm successful send
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        await bot.sendMessage(message.from, { text: 'Error fetching images.' });
    }
};

export default imageCommand;
