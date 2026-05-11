using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixProjectUrlsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("149dbd7d-3545-430d-a216-90497b8955a6"));

            migrationBuilder.DeleteData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"));

            migrationBuilder.DeleteData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"));

            migrationBuilder.AddColumn<string>(
                name: "photo_urls",
                table: "projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                columns: new[] { "description", "photo_urls" },
                values: new object[] { "Сбор на курс терапии...", "" });

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                columns: new[] { "description", "photo_urls" },
                values: new object[] { "Сбор средств на покупку школьных принадлежностей...", "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "photo_urls",
                table: "projects");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"),
                column: "description",
                value: "Сбор на курс терапии для 5-летнего Артёма, которому требуется дорогостоящее лечение за рубежом. Средства направляются в фонд «Надежда» с полным отчётом о расходах.");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                column: "description",
                value: "Сбор средств на покупку школьных принадлежностей, одежды и рюкзаков для 50 детей из региональных детдомов. В комплект входит: рюкзак, канцелярия, форма, спортивная одежда.");

            migrationBuilder.InsertData(
                table: "projects",
                columns: new[] { "id", "created_at", "description", "status", "target_amount", "title", "wallet_address" },
                values: new object[,]
                {
                    { new Guid("149dbd7d-3545-430d-a216-90497b8955a6"), new DateOnly(2026, 5, 10), "Благотворительный проект по созданию уютной игровой зоны для детей, проходящих длительное лечение. Включает: мягкую мебель, развивающие игрушки, книги, мультимедийное оборудование.", "Completed", 300000m, "Ремонт игровой комнаты в онкоцентре", "0x3456789012abcdef3456789012abcdef34567890" },
                    { new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"), new DateOnly(2026, 5, 10), "Подготовка и вручение новогодних подарков 200 детям из малообеспеченных семей и социальных центров. Каждый подарок включает: сладости, игрушки, тёплые вещи, письмо от Деда Мороза.", "Pending", 400000m, "Новогодние подарки для подопечных фондов", "0x456789ab0123cdef456789ab0123cdef456789ab" },
                    { new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"), new DateOnly(2026, 5, 10), "Проект создан для тестирования функционала отмены и архивации. Не является реальным сбором.", "Canceled", 10000m, "Старый тестовый проект", "0x56789abc01234def56789abc01234def56789abc" }
                });
        }
    }
}
