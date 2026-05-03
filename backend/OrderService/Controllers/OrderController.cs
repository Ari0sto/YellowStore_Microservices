using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.Models;
using OrderService.DTOs;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public OrderController(OrderDbContext context, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        [HttpPost("checkout/{userId}")]
        public async Task<IActionResult> Checkout(string userId)
        {
            var client = _httpClientFactory.CreateClient();
            var basketUrl = _config["ServiceUrls:BasketApi"];
            var inventoryUrl = _config["ServiceUrls:InventoryApi"];
            var catalogUrl = _config["ServiceUrls:CatalogApi"];

            // Получаем корзину пользователя
            var basketResponse = await client.GetAsync($"{basketUrl}/api/basket/{userId}");
            if (!basketResponse.IsSuccessStatusCode) return BadRequest("Не удалось получить корзину");

            var basket = await basketResponse.Content.ReadFromJsonAsync<BasketDto>();
            if (basket == null || !basket.Items.Any()) return BadRequest("Корзина пуста");

            //Создаем заготовку для заказа
            var newOrder = new Order { UserId = userId, Status = "Pending", TotalAmount = 0 };

            // 3. Проходим по каждому товару из корзины: проверяем остатки и узнаем цену
            foreach (var item in basket.Items)
            {
                // Проверяем склад
                var stock = await client.GetFromJsonAsync<int>($"{inventoryUrl}/api/inventory/{item.ProductId}");
                if (stock < item.Quantity)
                {
                    return BadRequest($"Недостаточно товара с ID {item.ProductId} на складе. Доступно: {stock}, запрошено: {item.Quantity}");
                }

                // Получаем цену из каталога
                var product = await client.GetFromJsonAsync<ProductDto>($"{catalogUrl}/api/catalog/{item.ProductId}");
                if (product == null) return BadRequest($"Товар с ID {item.ProductId} не найден в каталоге");

                // Добавляем товар в заказ
                newOrder.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    Price = product.Price
                });

                // Считаем итоговую сумму
                newOrder.TotalAmount += product.Price * item.Quantity;
            }

            // 4. Сохраняем заказ в БД
            newOrder.Status = "Completed";
            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            // 5. команда складу списать остатки
            foreach (var item in basket.Items)
            {
                var currentStock = await client.GetFromJsonAsync<int>($"{inventoryUrl}/api/inventory/{item.ProductId}");

                // Отправляем обновленное количество (было - купили)
                await client.PostAsJsonAsync($"{inventoryUrl}/api/inventory", new
                {
                    ProductId = item.ProductId,
                    Quantity = currentStock - item.Quantity
                });
            }

            // 6. Очистка корзины
            await client.DeleteAsync($"{basketUrl}/api/basket/{userId}");

            return Ok(new { Message = "Заказ успешно оформлен!", OrderId = newOrder.Id });
        }

        [HttpGet("my-orders/{userId}")]
        public async Task<IActionResult> GetMyOrders(string userId)
        {
            // Ищем в БД все заказы конкретного пользователя
            // .Include(o => o.Items) нужен, чтобы EF Core "подтянул" связанные товары из другой таблицы
            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }
    }
}
