using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Review
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User {get;set;}
    
    public int ProfessorCourseId {get;set;}
    public ProfessorCourse ProfessorCourse {get;set;}
    
    public DateTime DateCreated { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    
    public List<ReviewTag> Tags {get;set;}
}

public class ReviewGetDto
{
    public int Id { get; set; }
    public int UserId {get;set;}
    public string User { get; set; }
    
    public int ProfessorCourseId {get;set;}
    public string ProfessorName { get; set; }
    public string CourseName {get;set;}
    
    public DateTime DateCreated { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    
    public List<ReviewTagGetDto> Tags {get;set;}
}

public class ReviewCreateDto
{
    public int UserId { get; set; }
    public int ProfessorCourseId { get; set; }
    public DateTime DateCreated { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}

public class ReviewUpdateDto
{
    public int UserId { get; set; }
    public int ProfessorCourseId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}

public class ReviewEntityTypeConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        
        builder.HasOne(x => x.ProfessorCourse)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.ProfessorCourseId);
        
        builder.HasOne(x => x.User)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.UserId);
    }
}
