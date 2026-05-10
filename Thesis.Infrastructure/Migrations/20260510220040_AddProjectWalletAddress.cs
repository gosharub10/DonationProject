using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectWalletAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "wallet_address",
                table: "projects",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "wallet_address",
                value: "0x2345678901abcdef2345678901abcdef23456789");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("149dbd7d-3545-430d-a216-90497b8955a6"),
                column: "wallet_address",
                value: "0x3456789012abcdef3456789012abcdef34567890");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"),
                column: "wallet_address",
                value: "0x456789ab0123cdef456789ab0123cdef456789ab");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"),
                column: "wallet_address",
                value: "0x56789abc01234def56789abc01234def56789abc");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "wallet_address",
                value: "0x1234567890abcdef1234567890abcdef12345678");

            migrationBuilder.CreateIndex(
                name: "IX_projects_wallet_address",
                table: "projects",
                column: "wallet_address",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_projects_wallet_address",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "wallet_address",
                table: "projects");
        }
    }
}
