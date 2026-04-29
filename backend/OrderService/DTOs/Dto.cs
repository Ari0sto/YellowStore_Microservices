namespace OrderService.DTOs
{
    public class BasketDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<BasketItemDto> Items { get; set; } = new();
    }

    public class BasketItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    // Обертка для получения цены из Каталога
    public class ProductDto
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
    }
}
