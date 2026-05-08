using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "projects",
                columns: new[] { "id", "created_at", "description", "status", "target_amount", "title" },
                values: new object[,]
                {
                    { new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"), new DateOnly(2026, 4, 30), "Сбор на курс терапии для 5-летнего Артёма, которому требуется дорогостоящее лечение за рубежом. Средства направляются в фонд «Надежда» с полным отчётом о расходах.", "Active", 2500000m, "Лечение ребёнка с редким заболеванием" },
                    { new Guid("149dbd7d-3545-430d-a216-90497b8955a6"), new DateOnly(2026, 2, 6), "Благотворительный проект по созданию уютной игровой зоны для детей, проходящих длительное лечение. Включает: мягкую мебель, развивающие игрушки, книги, мультимедийное оборудование.", "Completed", 300000m, "Ремонт игровой комнаты в онкоцентре" },
                    { new Guid("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"), new DateOnly(2026, 5, 7), "Подготовка и вручение новогодних подарков 200 детям из малообеспеченных семей и социальных центров. Каждый подарок включает: сладости, игрушки, тёплые вещи, письмо от Деда Мороза.", "Pending", 400000m, "Новогодние подарки для подопечных фондов" },
                    { new Guid("7feb015d-b162-4f93-b944-3a8a4ccbd61c"), new DateOnly(2025, 11, 8), "Проект создан для тестирования функционала отмены и архивации. Не является реальным сбором.", "Canceled", 10000m, "Старый тестовый проект" },
                    { new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"), new DateOnly(2026, 4, 7), "Сбор средств на покупку школьных принадлежностей, одежды и рюкзаков для 50 детей из региональных детдомов. В комплект входит: рюкзак, канцелярия, форма, спортивная одежда.", "Active", 150000m, "Школьные рюкзаки для детей из детдомов" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("0300b30c-644a-41bb-99b8-e55fbecce271"));

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

            migrationBuilder.DeleteData(
                table: "projects",
                keyColumn: "id",
                keyValue: new Guid("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"));
        }
    }
}
