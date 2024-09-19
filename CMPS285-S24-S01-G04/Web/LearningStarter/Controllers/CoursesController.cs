using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/courses")]

public class CoursesController : ControllerBase
{
    private readonly DataContext _dataContext;
    public CoursesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    // ** GET **
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var data = _dataContext
            .Set<Course>()
            .Select(course => new CourseGetDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                DepartmentId = course.DepartmentId,
                Department = course.Department.Name
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
        
        var courseToGet = _dataContext.Set<Course>()
            .FirstOrDefault(x => x.Id == id);

        if (courseToGet == null)
        {
            response.AddError(nameof(courseToGet.Id), "Course not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var data = _dataContext
            .Set<Course>()
            .Select(course => new CourseGetDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                DepartmentId = course.DepartmentId,
                Department = course.Department.Name
            })
            .FirstOrDefault(course => course.Id == id);
        
        response.Data = data;
        
        return Ok(response);
    }
    
    // ** CREATE **
    [HttpPost]
    public IActionResult Create([FromBody] CourseCreateDto createDto)
    {
        var response = new Response();
        
        var checkDepartment = _dataContext.Set<Department>()
            .FirstOrDefault(x => x.Id == createDto.DepartmentId);

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be empty.");
        }

        if (string.IsNullOrEmpty(createDto.Description))
        {
            response.AddError(nameof(createDto.Description), "Description must not be empty.");
        }

        if (checkDepartment == null)
        {
            response.AddError(nameof(createDto.DepartmentId), "Department not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var courseToCreate = new Course
        {
            Name = createDto.Name,
            Description = createDto.Description,
            DepartmentId = createDto.DepartmentId
        };
        
        _dataContext.Set<Course>().Add(courseToCreate);
        _dataContext.SaveChanges();
        
        var courseToReturn = new CourseGetDto
        {
            Id = courseToCreate.Id,
            Name = courseToCreate.Name,
            Description = courseToCreate.Description,
            DepartmentId = courseToCreate.DepartmentId,
        };
        
        response.Data = courseToReturn;
        
        return Created("", response);
    }
    
    //** UPDATE **
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] CourseUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        var courseToUpdate = _dataContext.Set<Course>()
            .FirstOrDefault(course => course.Id == id);
        
        var checkDepartment = _dataContext.Set<Department>()
            .FirstOrDefault(department => department.Id == updateDto.DepartmentId);
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name must not be empty.");
        }

        if (string.IsNullOrEmpty(updateDto.Description))
        {
            response.AddError(nameof(updateDto.Description), "Description must not be empty.");
        }

        if (checkDepartment == null)
        {
            response.AddError(nameof(updateDto.DepartmentId), "Department not found.");
        }
        
        if (courseToUpdate == null)
        {
            response.AddError("id", "Course not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        courseToUpdate.Name = updateDto.Name;
        courseToUpdate.Description = updateDto.Description;
        courseToUpdate.DepartmentId = updateDto.DepartmentId;
        
        _dataContext.SaveChanges();
        
        var courseToReturn = new CourseGetDto()
        {
            Id = courseToUpdate.Id,
            Name = courseToUpdate.Name,
            Description = courseToUpdate.Description,
            DepartmentId = courseToUpdate.DepartmentId,
        };
        
        response.Data = courseToReturn;
        
        return Ok(response);
    }

    // ** DELETE **
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        
        var courseToDelete = _dataContext.Set<Course>()
            .FirstOrDefault(course => course.Id == id);

        if (courseToDelete == null)
        {
            response.AddError("id", "Course not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        _dataContext.Set<Course>().Remove(courseToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}