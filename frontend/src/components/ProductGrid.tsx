import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './ProductCard';

interface ProductGridProps {
    onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect с пустым массивом [] в конце означает "выполни один раз при загрузке"
    useEffect(() => {
        // Делаем запрос к Docker-контейнеру CatalogService
        fetch('http://localhost:7002/api/catalog?page=1&size=8')
            .then(res => {
                if (!res.ok) throw new Error('Ошибка загрузки с сервера');
                return res.json();
            })
            .then(data => {
                setProducts(data.items || data); 
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Не удалось загрузить товары. Проверь, запущен ли Docker и настроен ли CORS.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Загрузка товаров...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (products.length === 0) return <p>Ничего не найдено </p>;

    return (
        <div className="products-grid">
            {products.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
        </div>
    );
};