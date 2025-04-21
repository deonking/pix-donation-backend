const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'at_U4RA@quTyOqOVegn-Pnd_he1GhbwgzHhlNf58-Q2JSMtPUnE';
const auth = 'Basic ' + Buffer.from(`${SECRET_KEY}:x`).toString('base64');

app.post('/create-pix', async (req, res) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://app.virtupay.com.br/transactions',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
            },
            data: req.body,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao criar transação:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Erro ao gerar Pix' });
    }
});

// Opcional: Endpoint para verificar status da transação
app.get('/transaction/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.conta.skalepay.com.br/v1/transactions/${req.params.id}`, {
            headers: { 'Authorization': auth },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao verificar transação:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Erro ao verificar transação' });
    }
});

// Servir arquivos estáticos do frontend
app.use(express.static('public'));

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
