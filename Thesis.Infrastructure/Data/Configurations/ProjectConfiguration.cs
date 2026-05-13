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
            .HasColumnType("decimal(18,5)")
            .IsRequired();

        builder.Property(p => p.CollectedAmount)
            .HasColumnName("collected_amount")
            .HasColumnType("decimal(18,5)")
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

        builder.Property(p => p.WalletAddress)
            .HasColumnName("wallet_address")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.PhotoUrls)
            .HasColumnName("photo_urls")
            .HasConversion(
                v => string.Join(";", v),
                v => v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList()
            );

        builder.HasIndex(p => p.WalletAddress)
            .IsUnique();

        builder.HasData(
            new Project(
                id: Guid.Parse("dd86daa5-3736-4bc3-8558-6e4e6cb142b5"),
                title: "Школьные рюкзаки для детей из детдомов",
                description: "Сбор средств на покупку школьных принадлежностей...",
                targetAmount: 1m,
                walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
                status: ProjectStatus.Active,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10)),
                photoUrls: [
                    "https://picsum.photos/200?random=117",
                    "https://picsum.photos/200?random=13",
                    "https://picsum.photos/200?random=17"
                ]
            ),

            new Project(
                id: Guid.Parse("0300b30c-644a-41bb-99b8-e55fbecce271"),
                title: "Лечение ребёнка с редким заболеванием",
                description: "Сбор на курс терапии...",
                targetAmount: 25m,
                walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
                status: ProjectStatus.Active,
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10)),
                photoUrls: [
                    "https://picsum.photos/200?random=16",
                    "https://picsum.photos/200?random=11",
                    "https://picsum.photos/200?random=34"
                ]
            )
        );
    }
}