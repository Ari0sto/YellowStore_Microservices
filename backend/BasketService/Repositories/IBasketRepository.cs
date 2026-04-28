using BasketService.Models;

namespace BasketService.Repositories
{
    public interface IBasketRepository
    {
        Task<ShoppingCart?> GetBasketAsync(string userId);
        Task<ShoppingCart?> UpdateBasketAsync(ShoppingCart basket);
        Task DeleteBasketAsync(string userId);
    }
}
