import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import type { Product } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { LoginModal } from './components/LoginModal';
import { parseJwt } from './utils/jwtAuth';
import { RegisterModal } from './components/RegisterModal';
import { MyOrdersModal } from './components/MyOrdersModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Состояния для модалки логина
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  // Состояния для модалки регистрации
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Состояния для модалки "Мои заказы"
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // 1. АВТОМАТИЧЕСКИЙ ВХОД (срабатывает при обновлении страницы)
  useEffect(() => {
    const token = localStorage.getItem('techStoreToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setIsAuthenticated(true);
        // Достаем имя из токена (ищем email или sub)
        setUsername(decoded.email || decoded.sub || "User");
      } else {
        // Если токен сломан или истек, удаляем его
        localStorage.removeItem('techStoreToken');
      }
    }
  }, []);

  // 2. ОБРАБОТЧИК ЛОГИНА (отправка данных на сервер)
  const handleLoginSubmit = async (email: string, pass: string) => {
    try {
      const response = await fetch('http://localhost:7001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Сохраняем токен
        localStorage.setItem('techStoreToken', data.token);
        
        // Расшифровываем и обновляем интерфейс
        const decoded = parseJwt(data.token);
        if (decoded) {
            setIsAuthenticated(true);
            setUsername(decoded.email || decoded.sub || "User");
        }
        
        // Закрываем модалку и чистим ошибки
        setIsLoginOpen(false);
        setLoginError('');
      } else {
        setLoginError('Неверный email или пароль');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Ошибка сети. IdentityService запущен?');
    }
  };

  // 3. ОБРАБОТЧИК РЕГИСТРАЦИИ (отправка данных на сервер)
  const handleRegisterSubmit = async (email: string, pass: string) => {
  try {
    const response = await fetch('http://localhost:7001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    if (response.ok) {
      alert("Регистрация успешна! Теперь вы можете войти.");
      setIsRegisterOpen(false); // Закрываем окно регистрации
      setRegisterError('');
      setIsLoginOpen(true); // Сразу открываем окно логина
    } else {
      const errorText = await response.text();
      setRegisterError(`Ошибка: ${errorText}`);
    }
  } catch (err) {
    console.error(err);
    setRegisterError('Ошибка сети. IdentityService запущен?');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('techStoreToken');
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0); // Очищаем счетчик при выходе
  };

  const handleAddToCart = async (product: Product) => {
    const currentUserId = isAuthenticated ? username : "guest_user";
    const basketPayload = {
      userId: currentUserId,
      items: [{ productId: product.id, productName: product.name, price: product.price, quantity: 1 }]
    };

    try {
      const response = await fetch('http://localhost:7004/api/basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basketPayload)
      });

      if (response.ok) setCartCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    const currentUserId = isAuthenticated ? username : "guest_user";
    try {
      const response = await fetch(`http://localhost:7005/api/order/checkout/${currentUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert("🎉 Заказ успешно оформлен!");
        setCartCount(0);
        setIsCartOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header 
        cartCount={cartCount}
        isAuthenticated={isAuthenticated}
        username={username}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onCartClick={() => setIsCartOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
        onMyOrdersClick={() => setIsMyOrdersOpen(true)}
      />
      
      <main className="container" style={{ marginTop: '20px' }}>
        <h2>Каталог товаров</h2>
        <ProductGrid onAddToCart={handleAddToCart} />
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userId={isAuthenticated ? username : "guest_user"}
        onCheckout={handleCheckout}
      />

      {/* Подключаем новую модалку логина */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => { setIsLoginOpen(false); setLoginError(''); }}
        onLogin={handleLoginSubmit}
        errorMessage={loginError}
      />

      {/* Подключаем новую модалку регистрации */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => { setIsRegisterOpen(false); setRegisterError(''); }}
        onRegister={handleRegisterSubmit}
        errorMessage={registerError}
      />

      {/* Подключаем модалку "Мои заказы" */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        userId={isAuthenticated ? username : "guest_user"}
      />
    </div>
  );
}

export default App;