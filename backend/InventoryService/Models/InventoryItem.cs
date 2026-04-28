namespace InventoryService.Models
{
    public class InventoryItem
    {
        // Первичный ключ - ID записи на складе
        public Guid Id { get; set; } = Guid.NewGuid();


        // Хранение ID продукта из CatalogService
        public Guid ProductId { get; set; }

        // Доступное количество
        public int Quantity { get; set; }
    }
}
