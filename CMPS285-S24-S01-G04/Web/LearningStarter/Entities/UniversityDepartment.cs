using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LearningStarter.Entities;

public class UniversityDepartment
{
    public int Id {get;set;}
    public int UniversityId {get;set;}
    public University University {get;set;}
    
    public int DepartmentId {get;set;}
    public Department Department {get;set;}
}

public class UniversityDepartmentGetDto
{
    public int Id {get;set;}
    public string Name {get;set;}
}

public class UniversityDepartmentEntityTypeConfiguration : IEntityTypeConfiguration<UniversityDepartment>
{
    public void Configure(EntityTypeBuilder<UniversityDepartment> builder)
    {
        builder.ToTable("UniversityDepartments");
        {
            builder.HasOne(x => x.University)
                .WithMany(x => x.Departments);
            
            builder.HasOne(x => x.Department)
                .WithMany();
        }
    }
}