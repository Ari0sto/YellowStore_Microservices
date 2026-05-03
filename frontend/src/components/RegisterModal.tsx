import React, { useState } from 'react';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (email: string, pass: string) => void;
    errorMessage: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister, errorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Локальная ошибка для проверки паролей
    const [localError, setLocalError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(''); // Сбрасываем прошлые ошибки

        if (password !== confirmPassword) {
            setLocalError('Пароли не совпадают!');
            return;
        }

        if (password.length < 6) {
            setLocalError('Пароль должен быть минимум 6 символов');
            return;
        }

        // Если всё ок, передаем данные в App.tsx
        onRegister(email, password);
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Регистрация</h2>
                
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
                    <input 
                        type="password" 
                        placeholder="Повторите пароль" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                    />
                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                        Зарегистрироваться
                    </button>
                </form>
                
                {/* Показываем либо локальную ошибку (пароли), либо ошибку от сервера */}
                {(localError || errorMessage) && (
                    <p style={{ color: 'red', marginTop: '10px' }}>
                        {localError || errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
};