using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Course
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    public int DepartmentId {get;set;}
    public Department Department {get;set;}
}

public class CourseGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int DepartmentId {get;set;}
    public string Department {get;set;}
}

public class CourseCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int DepartmentId {get;set;}
}

public class CourseUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int DepartmentId {get;set;}
}

public class CourseEntityTypeConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.ToTable("Courses");
        
        builder.HasOne(x => x.Department)
            .WithMany(x => x.Courses)
            .HasForeignKey(x => x.DepartmentId);
    }
}