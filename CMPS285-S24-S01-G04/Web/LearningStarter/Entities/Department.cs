using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;


public class Department
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<Course> Courses {get;set;}
}

public class DepartmentGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<CourseGetDto> Courses {get;set;}
}

public class DepartmentCreateDto
{
    public string Name { get; set; }
}

public class DepartmentUpdateDto
{
    public string Name { get; set; }
}

public class DepartmentEntityTypeConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");
        
        builder.HasMany(x => x.Courses)
            .WithOne(x => x.Department);
    }
}