namespace OrderService.Models
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty; // Кто заказал
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; } // Итоговая сумма
        public string Status { get; set; } = "Pending"; // Статус (Pending, Completed, Cancelled)

        // Список покупок
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
