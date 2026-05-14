using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinanceManager : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role" },
                values: new object[] { new Guid("5e4f2a02-7d75-410b-81c8-3c4e31b062fa"), new DateOnly(2026, 5, 10), "fin@example.com", "Finance User", "$2a$12$y7rbIj26aVAoJWXwMzmMjO/UPrdn7FnMNCeTLk7.fEYo2Vg2/WlqS", "FinanceManager" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("5e4f2a02-7d75-410b-81c8-3c4e31b062fa"));
        }
    }
}
