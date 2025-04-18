'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Garante que o componente foi montado no cliente
    }, []);

    const handleLogout = () => {
        router.push('/'); // Redireciona para o início da página
    };

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        nomeEmpresa: '',
        cnpj: '',
        telefone: '',
    });

    const [mensagem, setMensagem] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateSenha = (senha: string) => {
        return senha.length >= 6; // Senha deve ter pelo menos 6 caracteres
    };

    const validateCNPJ = (cnpj: string) => {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cnpjRegex.test(cnpj);
    };

    const validateTelefone = (telefone: string) => {
        const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return telefoneRegex.test(telefone);
    };

    const validateNome = (nome: string) => {
        return nome.trim().length > 0; // Nome não pode ser vazio
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de carregamento

        if (!validateNome(formData.nome)) {
            setMensagem('Nome inválido.');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setMensagem('Email inválido.');
            setIsLoading(false);
            return;
        }

        if (!validateSenha(formData.senha)) {
            setMensagem('Senha deve ter pelo menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        if (!validateCNPJ(formData.cnpj)) {
            setMensagem('CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX.');
            setIsLoading(false);
            return;
        }

        if (!validateTelefone(formData.telefone)) {
            setMensagem('Telefone inválido. Use o formato (XX) XXXXX-XXXX.');
            setIsLoading(false);
            return;
        }

        try {
            // Recupera os dados existentes no localStorage
            const existingData = JSON.parse(localStorage.getItem('cadastros') || '[]');

            // Adiciona o novo cadastro à lista
            const updatedData = [...existingData, formData];

            // Salva os dados atualizados no localStorage
            localStorage.setItem('cadastros', JSON.stringify(updatedData));

            setMensagem('Cadastro realizado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', nomeEmpresa: '', cnpj: '', telefone: '' });
        } catch {
            setMensagem('Erro ao salvar os dados. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    };

    if (!isMounted) {
        return null; // Evita renderização no servidor
    }

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
                <div className="form-group">
                    <label htmlFor="nomeEmpresa" className="form-label">Nome da Empresa:</label>
                    <input
                        type="text"
                        id="nomeEmpresa"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cnpj" className="form-label">CNPJ:</label>
                    <input
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone" className="form-label">Telefone:</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="button-group">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading} // Desativa o botão enquanto carrega
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                    <button type="button" className="login-button" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </form>
            {mensagem && (
                <p className="mensagem" aria-live="polite">
                    {mensagem}
                </p>
            )}
        </div>
    );
}