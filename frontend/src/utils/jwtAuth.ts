
// Типизируем структуру данных, которая лежит внутри токена
export interface DecodedToken {
    email?: string;
    sub?: string;
    role?: string | string[];
    [key: string]: any;
}

export function parseJwt(token: string): DecodedToken | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Ошибка парсинга токена", e);
        return null;
    }
}