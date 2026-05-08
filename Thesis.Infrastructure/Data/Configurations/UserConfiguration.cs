using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thesis.Domain.Entities;
using Thesis.Domain.Enums;

namespace Thesis.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.Role)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.CreatedAt)
            .HasColumnType("date")
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();
        
        builder.HasData(
            new User(
                id: Guid.Parse("66d484b7-ccd6-4dbe-9c3a-3649fb9b64cb"),
                name: "Regular User",
                email: "user@example.com",
                passwordHash: "$2a$12$khWKbTxqEJcCiJj4Wfz9ReE27eQQsjQzylH4GYEfq/uz3hRUdvgRi",
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10)),
                role: Role.User
            ),
            new User(
                id: Guid.Parse("c0df61de-cc12-483b-98a5-0279eaa34d19"),
                name: "Admin User",
                email: "admin@example.com",
                passwordHash: "$2a$12$y7rbIj26aVAoJWXwMzmMjO/UPrdn7FnMNCeTLk7.fEYo2Vg2/WlqS",
                createdAt: DateOnly.FromDateTime(new DateTime(2026, 5, 10)),
                role: Role.Admin
            )
        );
    }
}