using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"), new DateOnly(2026, 5, 7), "user@example.com", "Regular User", "$2a$12$khWKbTxqEJcCiJj4Wfz9ReE27eQQsjQzylH4GYEfq/uz3hRUdvgRi", "User" },
                    { new Guid("c0df61de-cc12-483b-98a5-0279eaa34d19"), new DateOnly(2026, 5, 7), "admin@example.com", "Admin User", "$2a$12$y7rbIj26aVAoJWXwMzmMjO/UPrdn7FnMNCeTLk7.fEYo2Vg2/WlqS", "Admin" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c0df61de-cc12-483b-98a5-0279eaa34d19"));
        }
    }
}
