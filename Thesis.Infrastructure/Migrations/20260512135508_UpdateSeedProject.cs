using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "target_amount",
                table: "projects",
                type: "numeric(18,5)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "collected_amount",
                table: "projects",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldDefaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "target_amount",
                value: 25m);

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "target_amount",
                value: 1m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "target_amount",
                table: "projects",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)");

            migrationBuilder.AlterColumn<decimal>(
                name: "collected_amount",
                table: "projects",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldDefaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "target_amount",
                value: 2500000m);

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "target_amount",
                value: 150000m);
        }
    }
}
