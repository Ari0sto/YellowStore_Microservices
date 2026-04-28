using BasketService.Models;
using BasketService.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BasketService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _repository;

        public BasketController(IBasketRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<ShoppingCart>> GetBasket(string userId)
        {
            var basket = await _repository.GetBasketAsync(userId);

            // Если корзины нет - возврат пустой корзины
            return Ok(basket ?? new ShoppingCart(userId));
        }

        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> UpdateBasket(ShoppingCart basket)
        {
            var updatedBasket = await _repository.UpdateBasketAsync(basket);
            return Ok(updatedBasket);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteBasket(string userId)
        {
            await _repository.DeleteBasketAsync(userId);
            return Ok();
        }
    }
}
