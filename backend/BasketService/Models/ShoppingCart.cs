namespace BasketService.Models
{
    public class ShoppingCart
    {
        // ID пользователя будет ключом в Redis
        public string UserId { get; set; } = string.Empty;
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public ShoppingCart() { }

        public ShoppingCart(string userId)
        {
            UserId = userId;
        }
    }
}
