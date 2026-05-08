using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thesis.Domain.Entities;
using Thesis.Domain.Enums;

namespace Thesis.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("projects");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasColumnName("id")
            .HasColumnType("uuid")
            .ValueGeneratedNever(); 

        builder.Property(p => p.Title)
            .HasColumnName("title")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasColumnName("description")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(p => p.TargetAmount)
            .HasColumnName("target_amount")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.CollectedAmount)
            .HasColumnName("collected_amount")
            .HasColumnType("decimal(18,2)")
            .HasDefaultValue(0m)
            .IsRequired();

        builder.Property(p => p.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("date")
            .IsRequired();
        
        builder.HasData(
            new Project(
                id: Guid.Parse("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                title: "Школьные рюкзаки для детей из детдомов",
                description: "Сбор средств на покупку школьных принадлежностей, одежды и рюкзаков для 50 детей из региональных детдомов. В комплект входит: рюкзак, канцелярия, форма, спортивная одежда.",
                targetAmount: 150000m,
                status: ProjectStatus.Active,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10))
            ) , 

            new Project(
                id: Guid.Parse("0300b30c-644a-41bb-99b8-e55fbecce271"),
                title: "Лечение ребёнка с редким заболеванием",
                description: "Сбор на курс терапии для 5-летнего Артёма, которому требуется дорогостоящее лечение за рубежом. Средства направляются в фонд «Надежда» с полным отчётом о расходах.",
                targetAmount: 2500000m,
                status: ProjectStatus.Active,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10))
            ),

            new Project(
                id: Guid.Parse("149dbd7d-3545-430d-a216-90497b8955a6"),
                title: "Ремонт игровой комнаты в онкоцентре",
                description: "Благотворительный проект по созданию уютной игровой зоны для детей, проходящих длительное лечение. Включает: мягкую мебель, развивающие игрушки, книги, мультимедийное оборудование.",
                targetAmount: 300000m,
                status: ProjectStatus.Completed,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10))
            ),

            new Project(
                id: Guid.Parse("1f49c201-5c87-470f-b2bf-5dc23b0ff45d"),
                title: "Новогодние подарки для подопечных фондов",
                description: "Подготовка и вручение новогодних подарков 200 детям из малообеспеченных семей и социальных центров. Каждый подарок включает: сладости, игрушки, тёплые вещи, письмо от Деда Мороза.",
                targetAmount: 400000m,
                status: ProjectStatus.Pending,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10))
            ),

            new Project(
                id: Guid.Parse("7feb015d-b162-4f93-b944-3a8a4ccbd61c"),
                title: "Старый тестовый проект",
                description: "Проект создан для тестирования функционала отмены и архивации. Не является реальным сбором.",
                targetAmount: 10000m,
                status: ProjectStatus.Canceled,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10))
            )
        );
    }
}