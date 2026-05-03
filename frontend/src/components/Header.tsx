
interface HeaderProps {
    cartCount: number;
    isAuthenticated: boolean;
    username: string;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onCartClick: () => void;
    onRegisterClick: () => void;
    onMyOrdersClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    cartCount, 
    isAuthenticated, 
    username, 
    onLoginClick, 
    onLogoutClick, 
    onCartClick,
    onRegisterClick,
    onMyOrdersClick
}) => {
    
    return (
        <header>
            <div className="container">
                <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    YellowStore
                </div>
                
                <div className="header-controls">
                    {/* Кнопка корзины */}
                    <button onClick={onCartClick} className="cart-btn" style={{ position: 'relative' }}>
                        🛒 <span id="cart-count" className="cart-badge">{cartCount}</span>
                    </button>
                    
                    {/* Панель авторизации */}
                    <div id="auth-status">
                        {isAuthenticated ? (
                            // Блок для авторизованного пользователя
                            <>
                                <span style={{ color: 'white', marginRight: '10px' }}>
                                    Привет, {username}!
                                </span>
                                <button className="btn-login" onClick={onMyOrdersClick} style={{ background: '#2196F3', marginRight: '5px' }}>
                                    Мои заказы
                                </button>
                                <button className="btn-login" onClick={onLogoutClick}>
                                    Выйти
                                </button>
                            </>
                        ) : (
                            // Блок для гостя
                            <>
                                <button className="btn-login" onClick={onLoginClick}>
                                    Войти
                                </button>
                                <button className="btn-login" style={{ background: '#00a046', marginLeft: '5px' }} onClick={onRegisterClick}>
                                    Регистрация
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};