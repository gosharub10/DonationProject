using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    target_amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    collected_amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateOnly>(type: "date", nullable: false),
                    wallet_address = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    photo_urls = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "wallets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    WalletAddress = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_wallets_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "projects",
                columns: new[] { "id", "created_at", "description", "photo_urls", "status", "target_amount", "title", "wallet_address" },
                values: new object[,]
                {
                    { new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"), new DateOnly(2026, 5, 10), "Сбор на курс терапии...", "https://picsum.photos/200?random=16;https://picsum.photos/200?random=11;https://picsum.photos/200?random=34", "Active", 2500000m, "Лечение ребёнка с редким заболеванием", "0x2345678901abcdef2345678901abcdef23456789" },
                    { new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"), new DateOnly(2026, 5, 10), "Сбор средств на покупку школьных принадлежностей...", "https://picsum.photos/200?random=117;https://picsum.photos/200?random=13;https://picsum.photos/200?random=17", "Active", 150000m, "Школьные рюкзаки для детей из детдомов", "0x1234567890abcdef1234567890abcdef12345678" }
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"), new DateOnly(2026, 5, 10), "user@example.com", "Regular User", "$2a$12$khWKbTxqEJcCiJj4Wfz9ReE27eQQsjQzylH4GYEfq/uz3hRUdvgRi", "User" },
                    { new Guid("c0df61de-cc12-483b-98a5-0279eaa34d19"), new DateOnly(2026, 5, 10), "admin@example.com", "Admin User", "$2a$12$y7rbIj26aVAoJWXwMzmMjO/UPrdn7FnMNCeTLk7.fEYo2Vg2/WlqS", "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_projects_wallet_address",
                table: "projects",
                column: "wallet_address",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_wallets_UserId",
                table: "wallets",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_wallets_WalletAddress",
                table: "wallets",
                column: "WalletAddress",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropTable(
                name: "wallets");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
