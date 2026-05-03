import React, { useState, useEffect } from 'react';

// Типизация данных заказа
interface OrderItem {
    productName: string;
    quantity: number;
}

interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
}

interface MyOrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string; 
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose, userId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError('');
            
            fetch(`http://localhost:7005/api/order/my-orders/${userId}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || 'Ошибка загрузки заказов');
                }
                return res.json();
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    // Перевод статусов для красивого отображения
    const statusMap: Record<string, string> = {
        'Created': 'Создан',
        'Completed': 'Завершен',
        'Processing': 'В обработке',
        'Shipped': 'Отправлен',
        'Delivered': 'Доставлен',
        'Cancelled': 'Отменен'
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content" style={{ maxWidth: '95%', width: '1000px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>📦 Мои заказы</h2>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                
                {loading ? (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Загрузка заказов... ⏳</p>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                ) : orders.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Вы еще ничего не заказывали 🛍️</p>
                ) : (
                    <table className="admin-table" style={{ marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Товары</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td><strong>{order.totalAmount} ₴</strong></td>
                                    <td>{statusMap[order.status] || order.status}</td>
                                    <td>
                                        <small>
                                            {order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}
                                        </small>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};