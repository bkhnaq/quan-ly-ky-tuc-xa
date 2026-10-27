using Ktx.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ktx.Api.Data;

public class KtxDbContext(DbContextOptions<KtxDbContext> options) : DbContext(options)
{
    public DbSet<Room> Rooms => Set<Room>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(room => room.Id);
            entity.Property(room => room.Id).HasMaxLength(4);
            entity.Property(room => room.Building).HasMaxLength(1).IsRequired();
            entity.ToTable("Rooms", table =>
            {
                table.HasCheckConstraint("CK_Rooms_Capacity", "Capacity BETWEEN 1 AND 20");
                table.HasCheckConstraint("CK_Rooms_Occupied", "Occupied >= 0 AND Occupied <= Capacity");
                table.HasCheckConstraint("CK_Rooms_Price", "Price BETWEEN 0 AND 100000000");
            });

            // Migration đầu tiên thêm 6 phòng mẫu để có thể demo ngay.
            entity.HasData(
                new Room { Id = "A101", Building = "A", Capacity = 4, Occupied = 3, Price = 650000 },
                new Room { Id = "A102", Building = "A", Capacity = 4, Occupied = 4, Price = 650000 },
                new Room { Id = "A103", Building = "A", Capacity = 6, Occupied = 2, Price = 500000 },
                new Room { Id = "B101", Building = "B", Capacity = 4, Occupied = 4, Price = 650000 },
                new Room { Id = "B102", Building = "B", Capacity = 4, Occupied = 2, Price = 650000 },
                new Room { Id = "B103", Building = "B", Capacity = 6, Occupied = 3, Price = 500000 });
        });
    }
}
