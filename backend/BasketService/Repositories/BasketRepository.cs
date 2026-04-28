using System.Text.Json;
using BasketService.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace BasketService.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDistributedCache _cache;

        public BasketRepository(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<ShoppingCart?> GetBasketAsync(string userId)
        {
            var basketString = await _cache.GetStringAsync(userId);

            if (string.IsNullOrEmpty(basketString))
                return null;

            return JsonSerializer.Deserialize<ShoppingCart>(basketString);
        }

        public async Task<ShoppingCart?> UpdateBasketAsync(ShoppingCart basket)
        {
            // время жизни корзины - 7 дней
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7)
            };

            var basketJson = JsonSerializer.Serialize(basket);
            await _cache.SetStringAsync(basket.UserId, basketJson, options);

            return await GetBasketAsync(basket.UserId);
        }

        public async Task DeleteBasketAsync(string userId)
        {
            await _cache.RemoveAsync(userId);
        }
    }
}
