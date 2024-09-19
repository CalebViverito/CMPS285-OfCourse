using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ReviewTag
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public Review Review {get;set;}
    
    public int TagId{ get; set; }
    public Tag Tag {get;set;}
}

public class ReviewTagGetDto
{
    public int Id { get; set; }
    public string Name {get;set;}
}

public class ReviewTagEntityTypeConfiguration : IEntityTypeConfiguration<ReviewTag>
{
    public void Configure(EntityTypeBuilder<ReviewTag> builder)
    {
        builder.ToTable("ReviewTags");
        
        builder.HasOne(x => x.Review)
            .WithMany(x => x.Tags)
            .HasForeignKey(x => x.ReviewId);
        
        builder.HasOne(x => x.Tag)
            .WithMany()
            .HasForeignKey(x => x.TagId);
    }
}