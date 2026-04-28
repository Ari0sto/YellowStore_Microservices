using InventoryService.Data;
using InventoryService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public InventoryController(InventoryDbContext context)
        {
            _context = context;
        }

        // Получить остаток конкретного товара
        [HttpGet("{productId}")]
        public async Task<ActionResult<int>> GetStock(Guid productId)
        {
            var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.ProductId == productId);
            return item != null ? item.Quantity : 0;
        }

        // Обновить остаток товара (например, после заказа)
        [HttpPost]
        public async Task<IActionResult> UpdateStock(InventoryItem request)
        {
            var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.ProductId == request.ProductId);

            if (item == null)
            {
                // Если товара еще нет на складе, создаем новую запись
                _context.InventoryItems.Add(request);
            }
            else
            {
                // Если есть - просто обновляем количество
                item.Quantity = request.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(request);
        }
    }
}