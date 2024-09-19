using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ProfessorCourse
{
    public int Id {get;set;}
    public int ProfessorId {get;set;}
    public Professor Professor {get;set;}
    
    public int CourseId {get;set;}
    public Course Course {get;set;}
    
    public List<Review> Reviews {get;set;}
}

public class ProfessorCourseGetDto
{
    public int Id {get;set;}
    public string Name {get;set;}
    public string Description {get;set;}
    
    public List<ReviewGetDto> Reviews {get;set;}
}

public class ProfessorCourseEntityTypeConfiguration : IEntityTypeConfiguration<ProfessorCourse>
{
    public void Configure(EntityTypeBuilder<ProfessorCourse> builder)
    {
        builder.ToTable("ProfessorCourses");
        
        builder.HasOne(x => x.Professor)
            .WithMany(x => x.Courses)
            .HasForeignKey(x => x.ProfessorId);
        
        builder.HasOne(x => x.Course)
            .WithMany()
            .HasForeignKey(x => x.CourseId);
    }
}