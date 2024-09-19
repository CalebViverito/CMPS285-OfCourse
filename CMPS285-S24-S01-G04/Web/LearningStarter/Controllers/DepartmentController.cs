using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/departments")]
public class DepartmentController : ControllerBase
{
     private readonly DataContext _dataContext;
     public DepartmentController(DataContext dataContext)
     {
          _dataContext = dataContext;
     }

     // ** GET ALL **
     [HttpGet]
     public IActionResult GetAll()
     {
          var response = new Response();
          var data = _dataContext
               .Set<Department>()
               .Select(department => new DepartmentGetDto
               {
                    Id = department.Id,
                    Name = department.Name,
                    Courses = department.Courses.Select(x => new CourseGetDto
                    {
                         Id = x.Id,
                         Name = x.Name,
                         Description = x.Description,
                         DepartmentId = x.DepartmentId,
                         Department = x.Department.Name
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
          
          var departmentToGet = _dataContext.Set<Department>()
               .FirstOrDefault(x => x.Id == id);
          if (departmentToGet == null)
          {
               response.AddError(nameof(departmentToGet.Id), "Department not found.");
          }

          if (response.HasErrors)
          {
               return BadRequest(response);
          }
          
          var data = _dataContext
               .Set<Department>()
               .Select(department => new DepartmentGetDto
               {
                    Id = department.Id,
                    Name = department.Name,
                    Courses = department.Courses.Select(x => new CourseGetDto
                    {
                         Id = x.Id,
                         Name = x.Name,
                         Description = x.Description,
                         DepartmentId = x.DepartmentId,
                         Department = x.Department.Name
                    }).ToList()
               })
               .FirstOrDefault(department => department.Id == id);

          response.Data = data;
          return Ok(response);
     }
     
     // ** CREATE **
     [HttpPost]
     public IActionResult Create([FromBody] DepartmentCreateDto createDto)
     {
          var response = new Response();
          if (string.IsNullOrEmpty(createDto.Name))
          {
               response.AddError("name","Name must not be empty");
          }

          if (response.HasErrors)
          {
               return BadRequest(response);
          }
          
          var departmentToCreate = new Department
          {
               Name = createDto.Name,
          };
          _dataContext.Set<Department>().Add(departmentToCreate);
          _dataContext.SaveChanges();
          
          var departmentToReturn = new DepartmentGetDto
          {
               Id = departmentToCreate.Id,
               Name = departmentToCreate.Name,
          };
          response.Data = departmentToReturn;
          return Created("", response);
     }

     // ** UPDATE **
     [HttpPut("{id}")]
     public IActionResult Update([FromBody] DepartmentUpdateDto updateDto, int id)
     {
          var response = new Response();
          if (string.IsNullOrEmpty(updateDto.Name))
          {
               response.AddError("name","Name must not be empty");
          }
          
          var departmentToUpdate = _dataContext.Set<Department>()
               .FirstOrDefault(department => department.Id == id);
          if (departmentToUpdate == null)
          {
               response.AddError("id","Department not found");
          }

          if (response.HasErrors)
          {
               return BadRequest(response);
          }
          departmentToUpdate.Name = updateDto.Name;

          _dataContext.SaveChanges();

          var departmentToReturn = new DepartmentGetDto
          {
               Id = departmentToUpdate.Id,
               Name = departmentToUpdate.Name,
          };

          response.Data = departmentToReturn;
          return Ok(response);
     }

     // ** DELETE **
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var response = new Response();

          var departmentToDelete = _dataContext.Set<Department>()
               .FirstOrDefault(department => department.Id == id);
          if (departmentToDelete == null)
          {
               response.AddError("id","Department not found");
          }

          if (response.HasErrors)
          {
               return BadRequest(response);
          }
          
          _dataContext.Set<Department>().Remove(departmentToDelete);
          _dataContext.SaveChanges();
          
          response.Data = true;
          return Ok(response);
     }
}