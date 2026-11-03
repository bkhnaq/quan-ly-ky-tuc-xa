using System.ComponentModel.DataAnnotations;

namespace Ktx.Api.Contracts;

public class AuthRequest
{
    private string email = "";

    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [MaxLength(254, ErrorMessage = "Email tối đa 254 ký tự.")]
    [RegularExpression(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", ErrorMessage = "Email không hợp lệ.")]
    public string Email
    {
        get => email;
        set => email = value?.Trim() ?? "";
    }

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [StringLength(128, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có từ 8 đến 128 ký tự.")]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*[0-9])[\s\S]+$", ErrorMessage = "Mật khẩu phải có ít nhất một chữ cái và một chữ số.")]
    public string Password { get; set; } = "";
}

// Chỉ trả thông tin công khai, không trả PasswordHash về frontend.
public record UserResponse(Guid Id, string Email, DateTime CreatedAt);
