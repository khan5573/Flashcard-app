let editId = null;

async function fetchCards() {
    const res = await fetch('/cards');
    const data = await res.json();

    const container = document.getElementById('cards');
    container.innerHTML = '';

    data.forEach(card => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <b>Q:</b> ${card.question}<br>
            <b>A:</b> ${card.answer}<br><br>
            <button onclick="editCard(${card.id}, '${card.question}', '${card.answer}')">Edit</button>
            <button onclick="deleteCard(${card.id})">Delete</button>
        `;

        container.appendChild(div);
    });
}

function editCard(id, question, answer) {
    document.getElementById('question').value = question;
    document.getElementById('answer').value = answer;

    editId = id;
    document.getElementById('submitBtn').innerText = "Update Card";
}

async function addOrUpdateCard() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    if (!question || !answer) {
        alert("Fill all fields!");
        return;
    }

    if (editId) {
        // UPDATE
        await fetch(`/cards/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer })
        });

        editId = null;
        document.getElementById('submitBtn').innerText = "Add Card";

    } else {
        // ADD
        await fetch('/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer })
        });
    }

    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';

    fetchCards();
}

async function deleteCard(id) {
    await fetch(`/cards/${id}`, {
        method: 'DELETE'
    });

    fetchCards();
}

fetchCards();