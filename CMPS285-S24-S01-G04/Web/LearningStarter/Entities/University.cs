using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace LearningStarter.Entities;

public class University
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<UniversityDepartment> Departments { get; set; }
}
public class UniversityGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<UniversityDepartmentGetDto> Departments { get; set; }
}
public class UniversityCreateDto
{
    public string Name { get; set; }
}
public class UniversityUpdateDto
{
    public string Name { get; set; }
}
public class UniversityEntityTypeConfiguration : IEntityTypeConfiguration<University>
{
    public void Configure(EntityTypeBuilder<University> builder)
    {
        builder.ToTable("University");
    }
    
    
}