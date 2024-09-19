using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ProfessorDepartment
{
    public int Id { get; set; }
    
    public int ProfessorId { get; set; }
    public Professor Professor { get; set; }
    
    public int DepartmentId { get; set; }
    public Department Department { get; set; }
    
}

public class ProfessorDepartmentGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class ProfessorDepartmentEntityTypeConfiguration : IEntityTypeConfiguration<ProfessorDepartment>
{
    public void Configure(EntityTypeBuilder<ProfessorDepartment> builder)
    {
        builder.ToTable("ProfessorDepartments");

        builder.HasOne(x => x.Professor)
            .WithMany(x => x.Departments);

        builder.HasOne(x => x.Department)
            .WithMany();
    }
    
    
}