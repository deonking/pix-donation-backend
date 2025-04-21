import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import QRCode from 'qrcode';

// Substitua pela sua chave de API da Virtupay
const API_KEY = 'at_U4RA@quTyOqOVegn-Pnd_he1GhbwgzHhlNf58-Q2JSMtPUnE'; // Obtenha no painel da Virtupay

const App = () => {
    const [amount, setAmount] = useState(50.00); // Valor padrão: R$50,00 (em reais)
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [pixCode, setPixCode] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const amounts = [10.00, 20.00, 50.00, 100.00, 200.00, 300.00]; // Valores em reais

    const createTransaction = async () => {
        const body = {
            amount: amount, // Valor em reais (ex.: 50.00)
            paymentMethod: 'pix',
            customer: {
                name: 'João da Silva',
                email: 'joao@email.com',
                cpf: '09624612536', // A Virtupay pode exigir apenas o número
            },
            orderId: `DOACAO_${Date.now()}`, // Identificador único do pedido
        };

        try {
            const response = await axios({
                method: 'POST',
                url: 'https://api.virtupayments.com.br/api/v1/transactions',
                headers: {
                    'Api-Key': API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: body,
            });

            // Logar a resposta para depuração
            console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

            // Ajuste conforme a estrutura real da resposta da Virtupay
            // Exemplo hipotético: { transactionId: 'id', pix: { qrcode: 'string' } }
            const qrCode = response.data.pix?.qrcode; // Ajuste o caminho
            const id = response.data.transactionId; // Ajuste o caminho

            if (!qrCode || !id) {
                console.error('Campos esperados:', { qrCode, id });
                throw new Error('QR code ou ID da transação não encontrados na resposta da API.');
            }

            setTransactionId(id);
            setPixCode(qrCode);

            // Gerar QR code como imagem
            QRCode.toDataURL(qrCode, (err, url) => {
                if (err) {
                    console.error('Erro ao gerar QR code:', err);
                    setPaymentStatus('Erro ao gerar QR code.');
                    return;
                }
                setQrCodeUrl(url);
            });

            setPaymentStatus('Aguardando pagamento...');
            checkPaymentStatus(id);
        } catch (error) {
            console.error('Erro ao criar transação:', error.response?.data || error.message);
            setPaymentStatus(error.response?.data?.message || 'Erro ao gerar PIX. Tente novamente.');
        }
    };

    const checkPaymentStatus = async (id) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`https://api.virtupayments.com.br/api/v1/transactions/${id}`, {
                    headers: { 'Api-Key': API_KEY },
                });
                console.log('Status da transação:', response.data);
                if (response.data.status === 'paid' || response.data.status === 'completed') {
                    setPaymentStatus('Pagamento confirmado! Obrigado!');
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Erro ao verificar pagamento:', error.response?.data || error.message);
            }
        }, 5000); // Verifica a cada 5 segundos
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixCode);
        alert('Código PIX copiado!');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Faça sua Doação</h1>

                {/* Seleção de valores */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {amounts.map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                val === amount
                                    ? 'bg-green-500 text-white scale-105'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${val === 50.00 ? 'relative' : ''}`}
                        >
                            R${val.toFixed(2).replace('.', ',')}
                            {val === 50.00 && (
                                <span className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 rounded-bl">
                                    Mais Escolhido
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Botão para gerar PIX */}
                <button
                    onClick={createTransaction}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Gerar PIX
                </button>

                {/* Exibição do QR Code e código PIX */}
                {qrCodeUrl && (
                    <div className="mt-6 text-center">
                        <img src={qrCodeUrl} alt="QR Code PIX" className="mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Escaneie o QR Code ou copie o código:</p>
                        <input
                            type="text"
                            value={pixCode}
                            readOnly
                            className="w-full p-2 border rounded-lg mb-2 text-center"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-700 transition"
                        >
                            Copiar Código
                        </button>
                    </div>
                )}

                {/* Status do pagamento */}
                {paymentStatus && (
                    <p className="mt-4 text-center text-lg font-semibold">
                        {paymentStatus.includes('Obrigado') ? (
                            <span className="text-green-600">🎉 {paymentStatus}</span>
                        ) : (
                            <span className="text-gray-600">{paymentStatus}</span>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
};

// Renderização com React 18
const root = createRoot(document.getElementById('root'));
root.render(<App />);