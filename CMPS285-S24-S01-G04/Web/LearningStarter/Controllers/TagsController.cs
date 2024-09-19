using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/tags")]

public class TagsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public TagsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    // ** GET ALL **
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var data = _dataContext
            .Set<Tag>()
            .Select(tag => new TagGetDto
            {
                Id = tag.Id,
                Name = tag.Name
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
        
        var tagToGet = _dataContext.Set<Tag>()
            .FirstOrDefault(tag => tag.Id == id);

        if (tagToGet == null)
        {
            response.AddError("id", "Tag not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var data = _dataContext
            .Set<Tag>()
            .Select(tag => new TagGetDto
            {
                Id = tag.Id,
                Name = tag.Name
            })
            .FirstOrDefault(tag => tag.Id == id);
        
        response.Data = data;
        
        return Ok(response);
    }
    
    // ** CREATE **
    [HttpPost]
    public IActionResult Create([FromBody] TagCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be empty");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var tagToCreate = new Tag
        {
            Name = createDto.Name
        };
        
        _dataContext.Set<Tag>().Add(tagToCreate);
        _dataContext.SaveChanges();
        
        var tagToReturn = new TagGetDto
        {
            Id = tagToCreate.Id,
            Name = tagToCreate.Name
        };
        
        response.Data = tagToReturn;
        
        return Created("", response);
    }
    
    // ** UPDATE **
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] TagUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        var tagToUpdate = _dataContext.Set<Tag>()
            .FirstOrDefault(tag => tag.Id == id);
        

        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name must not be empty.");
        }

        if (tagToUpdate == null)
        {
            response.AddError("id", "Tag not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        tagToUpdate.Name = updateDto.Name;
        
        _dataContext.SaveChanges();
        
        var tagToReturn = new TagGetDto()
        {
            Id = tagToUpdate.Id,
            Name = tagToUpdate.Name
        };
        
        response.Data = tagToReturn;
        
        return Ok(response);
    }
    
    // ** DELETE **
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        
        var tagToDelete = _dataContext.Set<Tag>()
            .FirstOrDefault(tag => tag.Id == id);

        if (tagToDelete == null)
        {
            response.AddError("id", "Tag not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        _dataContext.Set<Tag>().Remove(tagToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}