using System.ComponentModel.DataAnnotations;

namespace Ktx.Api.Contracts;

// DTO: chỉ nhận những trường mà người dùng được phép nhập.
public class RoomRequest : IValidatableObject
{
    [Required(ErrorMessage = "Vui lòng nhập mã phòng.")]
    [RegularExpression(@"^[A-Za-z][0-9]{3}$", ErrorMessage = "Mã phòng gồm 1 chữ cái và 3 số, ví dụ A101.")]
    public string Id { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập tòa nhà.")]
    [RegularExpression(@"^[A-Za-z]$", ErrorMessage = "Tòa nhà gồm 1 chữ cái, ví dụ A.")]
    public string Building { get; set; } = "";

    [Required, Range(1, 20, ErrorMessage = "Sức chứa phải từ 1 đến 20.")]
    public int? Capacity { get; set; }

    [Required, Range(0, 20, ErrorMessage = "Số người đang ở phải từ 0 đến 20.")]
    public int? Occupied { get; set; }

    [Required, Range(0, 100000000, ErrorMessage = "Giá phòng phải từ 0 đến 100.000.000 đồng.")]
    public int? Price { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Occupied > Capacity)
            yield return new ValidationResult("Số người đang ở không được vượt sức chứa.", [nameof(Occupied)]);
        if (!string.IsNullOrEmpty(Id) && !string.IsNullOrEmpty(Building)
            && !Id.StartsWith(Building, StringComparison.OrdinalIgnoreCase))
            yield return new ValidationResult("Mã phòng phải bắt đầu bằng ký tự của tòa nhà.", [nameof(Id)]);
    }
}
