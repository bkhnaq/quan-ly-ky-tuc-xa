using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Ktx.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 4, nullable: false),
                    Building = table.Column<string>(type: "TEXT", maxLength: 1, nullable: false),
                    Capacity = table.Column<int>(type: "INTEGER", nullable: false),
                    Occupied = table.Column<int>(type: "INTEGER", nullable: false),
                    Price = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.CheckConstraint("CK_Rooms_Capacity", "Capacity BETWEEN 1 AND 20");
                    table.CheckConstraint("CK_Rooms_Occupied", "Occupied >= 0 AND Occupied <= Capacity");
                    table.CheckConstraint("CK_Rooms_Price", "Price BETWEEN 0 AND 100000000");
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "Building", "Capacity", "Occupied", "Price" },
                values: new object[,]
                {
                    { "A101", "A", 4, 3, 650000 },
                    { "A102", "A", 4, 4, 650000 },
                    { "A103", "A", 6, 2, 500000 },
                    { "B101", "B", 4, 4, 650000 },
                    { "B102", "B", 4, 2, 650000 },
                    { "B103", "B", 6, 3, 500000 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
