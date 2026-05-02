import { useState } from 'react'
import { Header } from './components/Header'
import { ProductGrid } from './components/ProductGrid';
import type { Product } from './components/ProductCard'
import { CartModal } from './components/CartModal'

function App() {
  // useState - это хранилище данных компонента. 
  // Если эти данные изменятся, React сам перерисует интерфейс
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Функции-заглушки для кнопок (позже будут реальные запросы)
  const handleLogin = () => {
    // Временная симуляция успешного логина
    setIsAuthenticated(true);
    setUsername('TestUser');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleAddToCart = async (product: Product) => {
    const currentUserId = isAuthenticated ? username : "guest_user";

    const basketPayload = {
      userId: currentUserId,
      items: [
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1
        }
      ]
    };

    try {
      // Стучимся в Докер-контейнер Корзины
      const response = await fetch('http://localhost:7004/api/basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basketPayload)
      });

      if (response.ok) {
        setCartCount(prev => prev + 1);
        console.log("Успех: Товар сохранен в Redis!");
      } else {
        const errorText = await response.text();
        alert(`Ошибка от сервера: ${errorText}`);
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      alert("Не удалось связаться с сервисом корзины. Он запущен?");
    }
  };

  const handleCheckout = async () => {
  const currentUserId = isAuthenticated ? username : "guest_user";

  try {
    // Дергаем эндпоинт оркестратора (как было в Swagger)
    const response = await fetch(`http://localhost:7005/api/order/checkout/${currentUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      alert("Заказ успешно оформлен! Оркестратор списал товары со склада и очистил корзину.");
      // Обнуляем счетчик в шапке и закрываем модалку
      setCartCount(0);
      setIsCartOpen(false);
    } else {
      const errorText = await response.text();
      alert(`Ошибка оформления: ${errorText}`);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
    alert("Не удалось связаться с сервисом заказов.");
  }
};

  return (
    <div>
      <Header 
        cartCount={cartCount}
        isAuthenticated={isAuthenticated}
        username={username}
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout}
        onCartClick={handleOpenCart}
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
    </div>
  )
}

export default App