'use client';

import React, { useState } from 'react';

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
    });

    const [mensagem, setMensagem] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMensagem('Cadastro realizado com sucesso!');
                setFormData({ nome: '', email: '', senha: '' });
            } else {
                const errorData = await response.json();
                setMensagem(`Erro: ${errorData.message || 'Não foi possível realizar o cadastro.'}`);
            }
        } catch {
            setMensagem('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="cadastro-container">
            <h1 className="cadastro-title">Cadastro</h1>
            <form onSubmit={handleSubmit} className="cadastro-form">
                <div className="form-group">
                    <label htmlFor="nome" className="form-label">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha" className="form-label">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">
                    Cadastrar
                </button>
            </form>
            {mensagem && <p className="mensagem">{mensagem}</p>}
        </div>
    );
}