import React from 'react';

// Описание типа данных для продукта
export interface Product {
    id: string; // это GUID
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {

    return (
        <div className="product-card">
            <img
                src={product.imageUrl || 'https://placehold.co/300x300/png?text=No+Image'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                    // Если картинка битая, принудительно ставим заглушку
                    e.currentTarget.src = 'https://placehold.co/300x300/png?text=No+Image';
                }}
            />
            <h3 className="product-title">{product.name}</h3>
            <div className="product-price">{product.price} ₴</div>
            <button className="btn-buy" onClick={() => onAddToCart(product)}>
                В корзину
            </button>
        </div>
    );
};