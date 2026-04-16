const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyLine = env.split('\n').find(line => line.includes('GEMINI_KEY'));
const key = keyLine ? keyLine.split('=')[1].replace(/"/g, '').trim() : '';

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(r => r.json())
  .then(d => {
    if (d.error) {
      console.error("API Error:", d.error);
    } else {
      console.log("Available Flash Models:");
      console.log(d.models.map(m => m.name).filter(n => n.includes("flash")));
    }
  })
  .catch(console.error);
