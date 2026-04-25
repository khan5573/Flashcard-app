const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const dirPath = path.join(__dirname, 'data');
const filePath = path.join(dirPath, 'cards.json');

// Ensure folder + file exist
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
}

// GET all cards
app.get('/cards', (req, res) => {
    const data = JSON.parse(fs.readFileSync(filePath));
    res.json(data);
});

// ADD card
app.post('/cards', (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const data = JSON.parse(fs.readFileSync(filePath));

    const newCard = {
        id: Date.now(),
        question,
        answer
    };

    data.push(newCard);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json(newCard);
});

// DELETE card
app.delete('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);

    let data = JSON.parse(fs.readFileSync(filePath));
    data = data.filter(card => card.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Deleted' });
});

// UPDATE card (EDIT)
app.put('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { question, answer } = req.body;

    let data = JSON.parse(fs.readFileSync(filePath));

    const index = data.findIndex(card => card.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }

    data[index].question = question;
    data[index].answer = answer;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Updated' });
});

app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});