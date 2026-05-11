using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Thesis.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoUrlsToProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "photo_urls",
                table: "projects",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "photo_urls",
                table: "projects");
        }
    }
}
