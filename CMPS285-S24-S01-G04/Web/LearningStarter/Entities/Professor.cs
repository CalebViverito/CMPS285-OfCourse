using System.Collections.Generic;
using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Professor
{
    public int Id {get;set;}
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public List<ProfessorDepartment> Departments {get;set;}
    public List<ProfessorCourse> Courses {get;set;}
}

public class ProfessorGetDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public List<ProfessorDepartmentGetDto> Departments {get;set;}
    public List<ProfessorCourseGetDto> Courses {get;set;}
}

public class ProfessorCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class ProfessorUpdateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
    public class ProfessorEntityTypeConfiguration : IEntityTypeConfiguration<Professor>
    {
        public void Configure(EntityTypeBuilder<Professor> builder)
        {
            builder.ToTable("Professors");
        }
    }
