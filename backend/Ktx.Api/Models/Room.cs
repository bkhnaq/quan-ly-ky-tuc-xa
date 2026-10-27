namespace Ktx.Api.Models;

public class Room
{
    public string Id { get; set; } = "";
    public string Building { get; set; } = "";
    public int Capacity { get; set; }
    public int Occupied { get; set; }
    public int Price { get; set; } // Giá nguyên theo VND, không dùng số thực.
}
