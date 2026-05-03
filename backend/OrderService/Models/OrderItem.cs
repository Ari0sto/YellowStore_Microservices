namespace OrderService.Models
{
    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProductId { get; set; } // Какой товар
        public decimal Price { get; set; }  // Цена на момент покупки (фикс!)

        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }   // Сколько штук

        // Внешний ключ для связи с заказом
        public Guid OrderId { get; set; }
    }
}
