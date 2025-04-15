// src/app/not-found.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter()

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push('/')
        }, 6000) // 6 segundos reais

        return () => clearTimeout(timeout)
    }, [router])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f9f9f9'
        }}>
            <h1 style={{ fontSize: '2rem', color: '#333' }}>Erro 404</h1>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>
                Página não encontrada. Você será redirecionado em 6 segundos...
            </p>
        </div>
    )
}
