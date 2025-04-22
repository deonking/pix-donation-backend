const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2NjOWExODAwYWU3Y2U1MzMzOGU4Mjc5MTM0NTcyZTExM2U1ZjE5Y2U1ZmY1ZjQxNTc5YmYzM2ZhZWE1YTg1ZTFiNjcxYzhhMTRmMjBiMjIiLCJpYXQiOjE3NDUwMjc5NzUuOTkzMTEyLCJuYmYiOjE3NDUwMjc5NzUuOTkzMTE0LCJleHAiOjI2OTE3MTI3NzUuOTc2MzkzLCJzdWIiOiI0OTkiLCJzY29wZXMiOlsiYWRtaW4iXX0.TmOo-kWYtcM3nU0jXLqwpI_Cw0sH75v6Ml-CRHwSdGfqRU9yTlJnsEdiI2xy8ZuP-k0joluqTBdWXq2IU3kh-tMjWiDIM3Y6MP68PtbvlPHWYrA2T1erHHr3WptsFt7ocNpTyAoPq-ktndGPm6DJCqXvZMIu19Ox2h4nekUECxEqNv8_bV-DQqkiJ8hS2YngGlQl4OkrTyMnVSBAIpmOa_t3rKVWMownuzdyV6hrQ7f-vuM8ksdN6S0jVCz1OxKcWk9LeXCMwraKey2Wx1rOVkKi_5Kyw3ujKua4XFCMEN0fU9QzWUFLAzo2t9vQ8jvWzYr7KwQ2ouHNHaHQV2JrCBdeiWEq7-D3Rr8APZK_eU90C9rWMf0_QF8Bdak5_dskV3PMWpsoJDXDN5FcbcziQr_xpdFo3RUR1I6fjak7wSIamJ3Nohy_fEfIgGF9Hvu35HG6am-8--Zfe2KzHHfQqENcubnc-E1bi-aUCvz8wS6tvIPu6uzecEVEPiYGWUWImIr7T6qq531aoVKkeQM9p17a9F6Pasdi4Q2Iq9eOUKb90qHFo9JXwrS8e_1Ag7xbJr-Qi5oskqHKeNljI-vxXwYbp0Pe5DmO94UuPFDaEm7CGJwsJ_OY5sUMHB228WxCpsuD-GpsFUCSxunvgbc_aoJmv9KAf9HR7znhl0mWbuU';
const auth = `Bearer ${SECRET_KEY}`; // Usar o token diretamente como Bearer

app.post('/create-pix', async (req, res) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://checkout.lunarcash.com.br/api/v1/payments',
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
        const response = await axios.get(`https://checkout.lunarcash.com.br/api/v1/payments/${req.params.id}`, { // Corrigido o template string
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
            },
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
