using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ReviewsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    // ** CREATE **
    [HttpPost]
    public IActionResult Create([FromBody] ReviewCreateDto createDto)
    {
        var response = new Response();

        var checkUser = _dataContext.Set<User>()
            .FirstOrDefault(x => x.Id == createDto.UserId);

        var checkProfessorCourse = _dataContext.Set<ProfessorCourse>()
            .FirstOrDefault(x => x.Id == createDto.ProfessorCourseId);

        if (createDto.Rating < 0 || createDto.Rating > 50)
        {
            response.AddError(nameof(createDto.Rating), "Rating must be between 0 - 50.");
        }

        if (checkUser == null)
        {
            response.AddError(nameof(createDto.UserId), "User not found.");
        }

        if (checkProfessorCourse == null)
        {
            response.AddError(nameof(createDto.ProfessorCourseId), "ProfessorCourse not found");
        }

        if (string.IsNullOrEmpty(createDto.Comment))
        {
            response.AddError(nameof(createDto.Comment), "Comment cannot be empty.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var reviewToCreate = new Review
        {
            UserId = createDto.UserId,
            ProfessorCourseId = createDto.ProfessorCourseId,
            DateCreated = DateTime.Now,
            Rating = createDto.Rating,
            Comment = createDto.Comment,
        };
        _dataContext.Set<Review>().Add(reviewToCreate);
        _dataContext.SaveChanges();

        var reviewToReturn = new ReviewGetDto
        {
            Id = reviewToCreate.Id,
            UserId = reviewToCreate.UserId,
            ProfessorCourseId = reviewToCreate.ProfessorCourseId,
            DateCreated = reviewToCreate.DateCreated,
            Rating = reviewToCreate.Rating,
            Comment = reviewToCreate.Comment
        };

        response.Data = reviewToReturn;
        return Created("", response);
    }

    // ** ADD TAGS TO REVIEW **
    [HttpPost("{reviewId}/tags/{tagId}")]
    public IActionResult AddTagToReview(int reviewId, int tagId)
    {
        var response = new Response();

        var review = _dataContext.Set<Review>()
            .FirstOrDefault(x => x.Id == reviewId);

        var tag = _dataContext.Set<Tag>()
            .FirstOrDefault(x => x.Id == tagId);

        var checkReviewTag = _dataContext.Set<ReviewTag>()
            .Any(x => x.ReviewId == reviewId && x.TagId == tagId);

        if (review == null)
        {
            response.AddError(nameof(review.Id), "Review not found.");
        }

        if (tag == null)
        {
            response.AddError(nameof(tag.Id), "Tag not found.");
        }

        if (checkReviewTag)
        {
            response.AddError("Id", "Review already has that tag.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var ReviewTag = new ReviewTag()
        {
            Review = review,
            Tag = tag
        };

        _dataContext.Set<ReviewTag>().Add(ReviewTag);
        _dataContext.SaveChanges();

        response.Data = new ReviewGetDto
        {
            Id = review.Id,
            UserId = review.UserId,
            ProfessorCourseId = review.ProfessorCourseId,
            DateCreated = review.DateCreated,
            Rating = review.Rating,
            Comment = review.Comment,
            Tags = review.Tags.Select(x => new ReviewTagGetDto
            {
                Id = x.Tag.Id,
                Name = x.Tag.Name
            }).ToList()
        };

        return Ok(response);

    }

    // ** GET BY ID **
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var reviewToGet = _dataContext.Set<Review>()
            .FirstOrDefault(x => x.Id == id);

        if (reviewToGet == null)
        {
            response.AddError(nameof(reviewToGet.Id), "Review not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var data = _dataContext
            .Set<Review>()
            .Select(review => new ReviewGetDto
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
                Tags = review.Tags.Select(x => new ReviewTagGetDto
                {
                    Id = x.Tag.Id,
                    Name = x.Tag.Name
                }).ToList()
            })
            .FirstOrDefault(course => course.Id == id);

        response.Data = data;

        return Ok(response);
    }

    // ** GET BY PROFESSOR COURSE ID **
    [HttpGet("professor-course/{professorCourseId}")]
    public IActionResult GetAllByProfessorCourseId([FromRoute] int professorCourseId)
    {
        var response = new Response();

        var professorCourse = _dataContext.Set<ProfessorCourse>()
            .FirstOrDefault(x => x.Id == professorCourseId);

        if (professorCourse == null)
        {
            response.AddError(nameof(professorCourse.Id), "ProfessorCourse not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var reviews = _dataContext.Set<Review>()
            .Where(review => review.ProfessorCourseId == professorCourseId)
            .Select(review => new ReviewGetDto
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
                Tags = review.Tags.Select(x => new ReviewTagGetDto
                {
                    Id = x.Tag.Id,
                    Name = x.Tag.Name
                }).ToList()
            })
            .ToList();

        response.Data = reviews;

        return Ok(response);
    }

    // ** GET BY COURSE ID **
    [HttpGet("course/{courseId}")]
    public IActionResult GetAllByCourseId([FromRoute] int courseId)
    {
        var response = new Response();


        var data = _dataContext
            .Set<ProfessorCourse>()
            .Where(course => course.CourseId == courseId)
            .SelectMany(professorCourse => professorCourse.Reviews.Select(review => new ReviewGetDto
            {
                Id = review.Id,
                UserId = review.UserId,
                User = review.User.UserName,
                ProfessorCourseId = review.ProfessorCourseId,
                ProfessorName = $"{professorCourse.Professor.FirstName} {professorCourse.Professor.LastName}",
                CourseName = professorCourse.Course.Name,
                DateCreated = review.DateCreated,
                Rating = review.Rating,
                Comment = review.Comment,
                Tags = review.Tags.Select(tag => new ReviewTagGetDto
                {
                    Id = tag.Tag.Id,
                    Name = tag.Tag.Name,
                }).ToList()
            })).ToList();

        response.Data = data;

        return Ok(response);
    }

    // ** UPDATE **
    [HttpPut("{id}")]
    public IActionResult Edit([FromRoute] int id, [FromBody] ReviewUpdateDto reviewUpdateDto)
    {
        var response = new Response();

        var reviewToEdit = _dataContext.Set<Review>()
            .FirstOrDefault(x => x.Id == id);

        var checkUser = _dataContext.Set<User>()
            .FirstOrDefault(x => x.Id == reviewUpdateDto.UserId);

        var checkProfessorCourse = _dataContext.Set<ProfessorCourse>()
            .FirstOrDefault(x => x.Id == reviewUpdateDto.ProfessorCourseId);

        if (reviewToEdit == null)
        {
            response.AddError("id", "Review not found.");
        }

        if (checkUser == null)
        {
            response.AddError(nameof(reviewUpdateDto.UserId), "User not found.");
        }

        if (checkProfessorCourse == null)
        {
            response.AddError(nameof(reviewUpdateDto.ProfessorCourseId), "ProfessorCourse not found.");
        }

        if (reviewUpdateDto.Rating < 0 || reviewUpdateDto.Rating > 50)
        {
            response.AddError(nameof(reviewUpdateDto.Rating), "Rating must be between 0 - 50.");
        }

        if (string.IsNullOrEmpty(reviewUpdateDto.Comment))
        {
            response.AddError(nameof(reviewUpdateDto.Comment), "Comment cannot be empty.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        reviewToEdit.UserId = reviewUpdateDto.UserId;
        reviewToEdit.ProfessorCourseId = reviewUpdateDto.ProfessorCourseId;
        reviewToEdit.Rating = reviewUpdateDto.Rating;
        reviewToEdit.Comment = reviewUpdateDto.Comment;

        _dataContext.SaveChanges();

        var reviewGetDto = new ReviewGetDto()
        {
            UserId = reviewToEdit.UserId,
            ProfessorCourseId = reviewToEdit.ProfessorCourseId,
            DateCreated = reviewToEdit.DateCreated,
            Rating = reviewToEdit.Rating,
            Comment = reviewToEdit.Comment,
        };

        response.Data = reviewGetDto;

        return Ok(response);
    }

    // ** DELETE **
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var review = _dataContext.Set<Review>().FirstOrDefault(x => x.Id == id);

        if (review == null)
        {
            response.AddError("id", "Review not found.");
            return NotFound(response);
        }

        _dataContext.Remove(review);
        _dataContext.SaveChanges();

        return Ok(response);
    }
}