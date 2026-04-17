const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scripts/data/questions.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const questions = JSON.parse(rawData);

const cleanedQuestions = questions.map(q => {
    // Keep all fields as is, but modify 'options'
    if (q.options) {
        q.options = q.options.map(opt => typeof opt === 'string' ? opt : opt.de);
    }
    return q;
});

fs.writeFileSync(filePath, JSON.stringify(cleanedQuestions, null, 2));
console.log(`Cleaned options for ${cleanedQuestions.length} questions. Explanations preserved.`);
