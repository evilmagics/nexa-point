const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const model = google('gemini-1.5-flash');
    console.log('Testing gemini-1.5-flash...');
    const { text } = await generateText({
      model,
      prompt: 'Hello',
    });
    console.log('Success:', text);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.data) {
      console.error('Error Data:', JSON.stringify(error.data, null, 2));
    }
  }
}

main();
