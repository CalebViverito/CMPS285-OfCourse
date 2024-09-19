using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;
[ApiController]
[Route("api/professors")]
public class ProfessorsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public ProfessorsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    // ** GET ALL **
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<Professor>()
            .Select(professor => new ProfessorGetDto
            {
                Id = professor.Id,
                FirstName = professor.FirstName,
                LastName = professor.LastName,
                Departments = professor.Departments.Select(x => new ProfessorDepartmentGetDto
                {
                    Id = x.Department.Id,
                    Name = x.Department.Name
                }).ToList(),
                Courses = professor.Courses.Select(x => new ProfessorCourseGetDto
                {
                    Id = x.Course.Id,
                    Name = x.Course.Name,
                    Description = x.Course.Description,
                    Reviews = x.Reviews.Select(x => new ReviewGetDto
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        User = x.User.UserName,
                        ProfessorCourseId = x.ProfessorCourseId,
                        ProfessorName = $"{x.ProfessorCourse.Professor.FirstName} {x.ProfessorCourse.Professor.LastName}",
                        CourseName = x.ProfessorCourse.Course.Name,
                        DateCreated = x.DateCreated,
                        Rating = x.Rating,
                        Comment = x.Comment,
                        Tags = x.Tags.Select(x => new ReviewTagGetDto
                        {
                            Id = x.Tag.Id,
                            Name = x.Tag.Name
                        }).ToList()
                    }).ToList()
                }).ToList()
            })
            .ToList();

        response.Data = data;
        return Ok(response);
    }

    // ** GET BY ID **
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var professorToGet = _dataContext.Set<Professor>()
            .FirstOrDefault(x => x.Id == id);

        if (professorToGet == null)
        {
            response.AddError(nameof(professorToGet.Id), "Professor not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var data = _dataContext
            .Set<Professor>()
            .Select(professor => new ProfessorGetDto
            {
                Id = professor.Id,
                FirstName = professor.FirstName,
                LastName = professor.LastName,
                Departments = professor.Departments.Select(x => new ProfessorDepartmentGetDto
                {
                    Id = x.Department.Id,
                    Name = x.Department.Name
                }).ToList(),
                Courses = professor.Courses.Select(x => new ProfessorCourseGetDto
                {
                    Id = x.Course.Id,
                    Name = x.Course.Name,
                    Description = x.Course.Description,
                    Reviews = x.Reviews.Select(x => new ReviewGetDto
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        User = x.User.UserName,
                        ProfessorCourseId = x.ProfessorCourseId,
                        ProfessorName = $"{x.ProfessorCourse.Professor.FirstName} {x.ProfessorCourse.Professor.LastName}",
                        CourseName = x.ProfessorCourse.Course.Name,
                        DateCreated = x.DateCreated,
                        Rating = x.Rating,
                        Comment = x.Comment,
                        Tags = x.Tags.Select(x => new ReviewTagGetDto
                        {
                            Id = x.Tag.Id,
                            Name = x.Tag.Name
                        }).ToList()
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefault(professor => professor.Id == id);
        response.Data = data;
        return Ok(response);
    }

    [HttpGet("course/id")]
    public IActionResult GetByCourseId(int courseId)
    {
        var response = new Response();

        // Assuming there's a relation between Professor and Course through a join entity or direct navigation property
        var professorsTeachingCourse = _dataContext
            .Set<Professor>()
            .Where(professor => professor.Courses.Any(course => course.CourseId == courseId))
            .Select(professor => new ProfessorGetDto
            {
                Id = professor.Id,
                FirstName = professor.FirstName,
                LastName = professor.LastName,
                Departments = professor.Departments.Select(department => new ProfessorDepartmentGetDto
                {
                    Id = department.Department.Id,
                    Name = department.Department.Name
                }).ToList(),
                Courses = professor.Courses.Where(course => course.CourseId == courseId).Select(course => new ProfessorCourseGetDto
                {
                    Id = course.Course.Id,
                    Name = course.Course.Name,
                    Description = course.Course.Description,
                    Reviews = course.Reviews.Select(review => new ReviewGetDto
                    {
                        Id = review.Id,
                        UserId = review.UserId,
                        User = review.User.UserName,
                        ProfessorCourseId = review.ProfessorCourseId,
                        ProfessorName = $"{review.ProfessorCourse.Professor.FirstName} {review.ProfessorCourse.Professor.LastName}",
                        CourseName = review.ProfessorCourse.Course.Name,
                        DateCreated = review.DateCreated,
                        Rating = review.Rating,
                        Comment = review.Comment,
                        Tags = review.Tags.Select(tag => new ReviewTagGetDto
                        {
                            Id = tag.Tag.Id,
                            Name = tag.Tag.Name
                        }).ToList()
                    }).ToList()
                }).ToList()
            }).ToList();

        if (!professorsTeachingCourse.Any())
        {
            response.AddError(nameof(courseId), "No professors found teaching the specified course.");
            return BadRequest(response);
        }

        response.Data = professorsTeachingCourse;
        return Ok(response);
    }

    // ** CREATE **
    [HttpPost]
    public IActionResult Create([FromBody] ProfessorCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.FirstName))
        {
            response.AddError(nameof(createDto.FirstName), "First Name must not be empty.");
        }
        if (string.IsNullOrEmpty(createDto.LastName))
        {
            response.AddError(nameof(createDto.LastName), "Last Name must not be empty.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        var professorToCreate = new Professor
        {
            FirstName = createDto.FirstName,
            LastName = createDto.LastName
        };
        _dataContext.Set<Professor>().Add(professorToCreate);
        _dataContext.SaveChanges();
        var professorToReturn = new ProfessorGetDto
        {
            Id = professorToCreate.Id,
            FirstName = professorToCreate.FirstName,
            LastName = professorToCreate.LastName
        };
        response.Data = professorToReturn;
        return Created("", response);
    }

    [HttpGet("{professorId}/course/{courseId}")]
    public IActionResult GetByCourseAndProfessor(int professorId, int courseId)
    {
        var response = new Response();

        var professorCourse = _dataContext.Set<ProfessorCourse>()
            .FirstOrDefault(x => x.ProfessorId == professorId && x.CourseId == courseId);

        response.Data = professorCourse;

        return Ok(response);

    }

    // ** ADD COURSE TO PROFESSOR **
    [HttpPost("{professorId}/course/{courseId}")]
    public IActionResult AddCourseToProfessor(int professorId, int courseId)
    {
        var response = new Response();

        var professor = _dataContext.Set<Professor>()
            .FirstOrDefault(x => x.Id == professorId);

        var course = _dataContext.Set<Course>()
            .FirstOrDefault(x => x.Id == courseId);

        var checkProfessorCourse = _dataContext.Set<ProfessorCourse>()
            .Any(x => x.ProfessorId == professorId && x.CourseId == courseId);

        if (professor == null)
        {
            response.AddError(nameof(professor.Id), "Professor not found.");
        }

        if (course == null)
        {
            response.AddError(nameof(course.Id), "Course not found.");
        }

        if (checkProfessorCourse)
        {
            response.AddError($"{professor.FirstName} {professor.LastName}", "Professor already has course.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var professorCourse = new ProfessorCourse()
        {
            Professor = professor,
            Course = course
        };

        _dataContext.Set<ProfessorCourse>().Add(professorCourse);
        _dataContext.SaveChanges();

        response.Data = new ProfessorGetDto
        {
            Id = professor.Id,
            FirstName = professor.FirstName,
            LastName = professor.LastName,
            Courses = professor.Courses.Select(x => new ProfessorCourseGetDto
            {
                Id = x.Course.Id,
                Name = x.Course.Name,
                Description = x.Course.Description,
            }).ToList()
        };

        return Ok(response);
    }

    // ** ADD DEPARTMENT TO PROFESSOR **
    [HttpPost("{professorId}/department/{departmentId}")]
    public IActionResult AddDepartmentToProfesser(int professorId, int departmentId)
    {
        var response = new Response();

        var professor = _dataContext.Set<Professor>()
            .FirstOrDefault(x => x.Id == professorId);

        var department = _dataContext.Set<Department>()
            .FirstOrDefault(x => x.Id == departmentId);

        var checkProfessorDepartment = _dataContext.Set<ProfessorDepartment>()
            .Any(x => x.ProfessorId == professorId && x.DepartmentId == departmentId);

        if (professor == null)
        {
            response.AddError(nameof(professor.Id), "Professor not found");
        }

        if (department == null)
        {
            response.AddError(nameof(department.Id), "Department not found");
        }

        if (checkProfessorDepartment)
        {
            response.AddError($"{professor.FirstName} {professor.LastName}", "Professor already has that department.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var professorDepartment = new ProfessorDepartment
        {
            Professor = professor,
            Department = department
        };

        _dataContext.Set<ProfessorDepartment>().Add(professorDepartment);
        _dataContext.SaveChanges();

        response.Data = new ProfessorGetDto
        {
            Id = professor.Id,
            FirstName = professor.FirstName,
            LastName = professor.LastName,
            Departments = professor.Departments.Select(x => new ProfessorDepartmentGetDto
            {
                Id = x.Department.Id,
                Name = x.Department.Name
            }).ToList()
        };
        return Ok(response);
    }

    // ** UPDATE **
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ProfessorUpdateDto updateDto, int id)
    {
        var response = new Response();

        var professorToUpdate = _dataContext.Set<Professor>()
            .FirstOrDefault(professor => professor.Id == id);

        if (string.IsNullOrEmpty(updateDto.FirstName))
        {
            response.AddError(nameof(updateDto.FirstName), "First Name must not be empty.");
        }

        if (string.IsNullOrEmpty(updateDto.LastName))
        {
            response.AddError(nameof(updateDto.LastName), "Last Name must not be empty.");
        }

        if (professorToUpdate == null)
        {
            response.AddError("id", "Professor not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        professorToUpdate.FirstName = updateDto.FirstName;
        professorToUpdate.LastName = updateDto.LastName;
        _dataContext.SaveChanges();
        var professorToReturn = new ProfessorGetDto()
        {
            FirstName = professorToUpdate.FirstName,
            LastName = professorToUpdate.LastName
        };
        response.Data = professorToReturn;
        return Ok(response);
    }

    // ** DELETE **
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var professorToDelete = _dataContext.Set<Professor>()
            .FirstOrDefault(professor => professor.Id == id);

        if (professorToDelete == null)
        {
            response.AddError("id", "Professor not found.");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        _dataContext.Set<Professor>().Remove(professorToDelete);
        _dataContext.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
    
    [HttpDelete("{professorId}/course/{courseId}")]
    public IActionResult DeleteProfessorCourse(int professorId, int courseId)
    {
        var response = new Response();

        var professor = _dataContext.Set<Professor>()
            .FirstOrDefault(x => x.Id == professorId);

        var course = _dataContext.Set<Course>()
            .FirstOrDefault(x => x.Id == courseId);

        var professorCourseToDelete = _dataContext.Set<ProfessorCourse>()
            .FirstOrDefault(x => x.ProfessorId == professorId && x.CourseId == courseId);

        if (professor == null)
        {
            response.AddError(nameof(professor.Id), "Professor not found.");
        }

        if (course == null)
        {
            response.AddError(nameof(course.Id), "Course not found.");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        _dataContext.Set<ProfessorCourse>().Remove(professorCourseToDelete);
        _dataContext.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
    
    [HttpDelete("{professorId}/department/{departmentId}")]
    public IActionResult DeleteProfessorDepartment(int professorId, int departmentId)
    {
        var response = new Response();

        var professor = _dataContext.Set<Professor>()
            .FirstOrDefault(x => x.Id == professorId);

        var course = _dataContext.Set<Department>()
            .FirstOrDefault(x => x.Id == departmentId);

        var professorDepartmentToDelete = _dataContext.Set<ProfessorDepartment>()
            .FirstOrDefault(x => x.ProfessorId == professorId && x.DepartmentId == departmentId);

        if (professor == null)
        {
            response.AddError(nameof(professor.Id), "Professor not found.");
        }

        if (course == null)
        {
            response.AddError(nameof(course.Id), "Course not found.");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        _dataContext.Set<ProfessorDepartment>().Remove(professorDepartmentToDelete);
        _dataContext.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
    
}