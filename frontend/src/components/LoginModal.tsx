import React, { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, pass: string) => void;
    errorMessage: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, errorMessage }) => {
    // Локальные состояния для полей ввода
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Останавливаем перезагрузку страницы
        onLogin(email, password); // Передаем данные наверх, в App.tsx
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Вход в YellowStore</h2>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                    />
                    <button type="submit" className="btn-primary">Войти</button>
                </form>
                
                {/* Если есть ошибка - показываем её */}
                {errorMessage && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                )}
            </div>
        </div>
    );
};