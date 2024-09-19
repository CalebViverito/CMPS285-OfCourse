using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/universities")]

public class UniversityController : ControllerBase
{
    private readonly DataContext _dataContext;

    public UniversityController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    // ** GET ALL **
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var data = _dataContext
            .Set<University>()
            .Select(university => new UniversityGetDto
            {
                Id = university.Id,
                Name = university.Name,
                Departments = university.Departments.Select(x => new UniversityDepartmentGetDto
                {
                    Id = x.Department.Id,
                    Name = x.Department.Name
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
        
        var universityToGet = _dataContext.Set<University>()
            .FirstOrDefault(x => x.Id == id);

        if (universityToGet == null)
        {
            response.AddError(nameof(universityToGet.Id), "University not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var data = _dataContext
            .Set<University>()
            .Select(university => new UniversityGetDto
            {
                Id = university.Id,
                Name = university.Name,
                Departments = university.Departments.Select(x => new UniversityDepartmentGetDto
                {
                    Id = x.Department.Id,
                    Name = x.Department.Name
                }).ToList()
            })
            .FirstOrDefault(university => university.Id == id);

        response.Data = data;
        return Ok(response);
    }
    
    // ** ADD DEPARTMENT TO UNIVERSITY **
    [HttpPost("{universityId}/department/{departmentId}")]
    public IActionResult AddDepartmentToUniversity(int universityId, int departmentId)
    {
        
        var response = new Response();
        
        var university = _dataContext.Set<University>()
            .FirstOrDefault(x => x.Id == universityId);
        
        var department = _dataContext.Set<Department>()
            .FirstOrDefault(x => x.Id == departmentId);
        
        var checkUniversityDepartment = _dataContext.Set<UniversityDepartment>()
            .Any(x => x.UniversityId == universityId && x.DepartmentId == departmentId);

        if (university == null)
        {
            response.AddError(nameof(university.Id), "University not found.");
        }

        if (department == null)
        {
            response.AddError(nameof(department.Id), "Department not found.");
        }

        if (checkUniversityDepartment)
        {
            response.AddError(nameof(university.Name), "University already has that department.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var universityDepartment = new UniversityDepartment()
        {
            University = university,
            Department = department
        };
        
        _dataContext.Set<UniversityDepartment>().Add(universityDepartment);
        _dataContext.SaveChanges();
        
        response.Data = new UniversityGetDto()
        {
            Id = university.Id,
            Name = university.Name,
            Departments = university.Departments.Select(x => new UniversityDepartmentGetDto
            {
                Id = x.Department.Id,
                Name = x.Department.Name
            }).ToList()
        };
        
        return Ok(response);
        
    }
    
    // ** CREATE **
    [HttpPost]
    public IActionResult Create([FromBody] UniversityCreateDto createDto)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name),"Name must not be empty");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
          
        var universityToCreate = new University
        {
            Name = createDto.Name
        };
        _dataContext.Set<University>().Add(universityToCreate);
        _dataContext.SaveChanges();
          
        var universityToReturn = new UniversityGetDto
        {
            Id = universityToCreate.Id,
            Name = universityToCreate.Name
        };
        
        response.Data = universityToReturn;
        return Created("", response);
    }
    
    // ** UPDATE **
   [HttpPut("{id}")]
   public IActionResult Update([FromBody] UniversityUpdateDto updateDto, int id)
   {
       var response = new Response();
       
       var universityToUpdate = _dataContext.Set<University>()
           .FirstOrDefault(department => department.Id == id);
       
       if (string.IsNullOrEmpty(updateDto.Name))
       {
           response.AddError(nameof(updateDto.Name),"Name must not be empty");
       }
       
       if (universityToUpdate == null)
       {
           response.AddError("id","University not found");
       }
       
       if (response.HasErrors)
       {
           return BadRequest(response);
       }
       
       universityToUpdate.Name = updateDto.Name;
       
       _dataContext.SaveChanges();
       
       var universityToReturn = new UniversityGetDto
       {
           Id = universityToUpdate.Id,
           Name = universityToUpdate.Name
       };
       
       response.Data = universityToReturn;
       return Ok(response);
    }
   
   // ** DELETE **
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
       
        var universityToDelete = _dataContext.Set<University>()
            .FirstOrDefault(department => department.Id == id);
        
        if (universityToDelete == null)
        {
            response.AddError("id","University not found");
        }
       
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
                 
        _dataContext.Set<University>().Remove(universityToDelete);
        _dataContext.SaveChanges();
                 
        response.Data = true;
        return Ok(response);
    }
    
    [HttpDelete("{universityId}/department/{departmentId}")]
    public IActionResult DeleteUniversityDepartment(int universityId, int departmentId)
    {
        var response = new Response();
        
        var university = _dataContext.Set<University>()
            .FirstOrDefault(x => x.Id == universityId);
        
        var department = _dataContext.Set<Department>()
            .FirstOrDefault(x => x.Id == departmentId);
        
        var universityDepartmentToDelete = _dataContext.Set<UniversityDepartment>()
            .FirstOrDefault(x => x.UniversityId == universityId && x.DepartmentId == departmentId);

        if (university == null)
        {
            response.AddError(nameof(university.Id), "University not found.");
        }

        if (department == null)
        {
            response.AddError(nameof(department.Id), "Department not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
                 
        _dataContext.Set<UniversityDepartment>().Remove(universityDepartmentToDelete);
        _dataContext.SaveChanges();
                 
        response.Data = true;
        return Ok(response);
    }
}