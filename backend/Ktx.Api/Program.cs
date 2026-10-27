using Ktx.Api.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// Đường dẫn DB luôn tính từ thư mục backend, kể cả khi chạy ở thư mục gốc.
var connection = new SqliteConnectionStringBuilder(
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Thiếu ConnectionStrings:DefaultConnection."));
connection.DataSource = Path.GetFullPath(connection.DataSource, builder.Environment.ContentRootPath);
Directory.CreateDirectory(Path.GetDirectoryName(connection.DataSource)!);
builder.Services.AddDbContext<KtxDbContext>(options => options.UseSqlite(connection.ToString()));

// Cho phép frontend ở cổng 3000 gọi backend ở cổng 5000.
builder.Services.AddCors(options => options.AddPolicy("ReactApp", policy =>
    policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [])
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();
app.UseExceptionHandler();
app.UseCors("ReactApp");
app.MapControllers();
app.Run();
