import React, { useState, useEffect } from 'react';

interface CartItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

interface ShoppingCart {
    userName: string;
    items: CartItem[];
    totalPrice?: number;
}

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, userId, onCheckout }) => {
    const [cart, setCart] = useState<ShoppingCart | null>(null);
    const [loading, setLoading] = useState(false);

    // Этот useEffect срабатывает каждый раз, когда меняется переменная isOpen
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Стучимся в Redis через наш BasketService по имени пользователя
            fetch(`http://localhost:7004/api/basket/${userId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Корзина не найдена");
                    return res.json();
                })
                .then(data => {
                    setCart(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Ошибка или корзина пуста:", err);
                    setCart(null);
                    setLoading(false);
                });
        }
    }, [isOpen, userId]);

    // Если модалка закрыта, вообще ничего не рендерим (возвращаем null)
    if (!isOpen) return null;

    // Считаем итоговую сумму (если бэкенд не прислал готовый TotalPrice)
    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content cart-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Ваша корзина</h2>
                
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка из Redis... ⏳</p>
                ) : !cart || !cart.items || cart.items.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Ваша корзина пуста 😔</p>
                ) : (
                    <>
                        <div id="cart-items-container">
                            {cart.items.map((item, index) => (
                                <div key={`${item.productId}-${index}`} className="cart-item">
                                    <div className="cart-item-info">
                                        <p className="cart-item-title">{item.productName}</p>
                                        <small>{item.price} ₴ / шт.</small>
                                    </div>

                                    <div className="qty-controls">
                                        <span>x{item.quantity}</span>
                                    </div>

                                    <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                                        {item.price * item.quantity} ₴
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total-row">
                                <span>Итого:</span>
                                <span className="total-price">{calculateTotal()} ₴</span>
                            </div>
                            <button className="btn-primary" onClick={onCheckout}>
                                Оформить заказ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};