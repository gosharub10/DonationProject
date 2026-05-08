using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedProjects2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "created_at",
                value: new DateOnly(2026, 5, 1));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("149dbd7d-3545-430d-a216-90497b8955a6"),
                column: "created_at",
                value: new DateOnly(2026, 2, 7));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"),
                column: "created_at",
                value: new DateOnly(2026, 5, 8));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"),
                column: "created_at",
                value: new DateOnly(2025, 11, 9));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "created_at",
                value: new DateOnly(2026, 4, 8));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"),
                column: "CreatedAt",
                value: new DateOnly(2026, 5, 8));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c0df61de-cc12-483b-98a5-0279eaa34d19"),
                column: "CreatedAt",
                value: new DateOnly(2026, 5, 8));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "created_at",
                value: new DateOnly(2026, 4, 30));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("149dbd7d-3545-430d-a216-90497b8955a6"),
                column: "created_at",
                value: new DateOnly(2026, 2, 6));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"),
                column: "created_at",
                value: new DateOnly(2026, 5, 7));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"),
                column: "created_at",
                value: new DateOnly(2025, 11, 8));

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "created_at",
                value: new DateOnly(2026, 4, 7));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"),
                column: "CreatedAt",
                value: new DateOnly(2026, 5, 7));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c0df61de-cc12-483b-98a5-0279eaa34d19"),
                column: "CreatedAt",
                value: new DateOnly(2026, 5, 7));
        }
    }
}
