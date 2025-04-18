"use client";
import { useState } from "react";

type Transacao = {
    tipo: "ganho" | "custo";
    descricao: string;
    valor: number;
};

type AdicionarTransacaoProps = {
    onAdicionar: (transacao: Transacao) => void;
};

export default function AdicionarTransacao({ onAdicionar }: AdicionarTransacaoProps) {
    const [tipo, setTipo] = useState<"ganho" | "custo">("ganho");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState<number | "">("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!descricao || valor === "" || valor <= 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        onAdicionar({ tipo, descricao, valor: Number(valor) });
        setDescricao("");
        setValor("");
    }

    return (
        <form className="adicionar-transacao" onSubmit={handleSubmit}>
            <h3>Adicionar Transação</h3>
            <div>
                <label>
                    Tipo:
                    <select value={tipo} onChange={(e) => setTipo(e.target.value as "ganho" | "custo")}>
                        <option value="ganho">Ganho</option>
                        <option value="custo">Custo</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Descrição:
                    <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição"
                    />
                </label>
            </div>
            <div>
                <label>
                    Valor:
                    <input
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value ? Number(e.target.value) : "")}
                        placeholder="Valor"
                    />
                </label>
            </div>
            <button type="submit">Adicionar</button>
        </form>
    );
}