using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
        services.AddControllers();

        services.AddHsts(options =>
        {
            options.MaxAge = TimeSpan.MaxValue;
            options.Preload = true;
            options.IncludeSubDomains = true;
        });

        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddIdentity<User, Role>(
                options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 8;
                    options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                    options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                    options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
                })
            .AddEntityFrameworkStores<DataContext>();

        services.AddMvc();

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = "file", Format = "binary" });
        });

        services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "learning-starter-web/build";
        });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();
        
        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger(options =>
        {
            options.SerializeAsV2 = true;
        });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1");
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });
        
        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();

        SeedUsers(dataContext, userManager).Wait();
        SeedUniversity(dataContext);
        SeedDepartment(dataContext);
        SeedProfessors(dataContext);
        SeedCourses(dataContext);
        SeedTags(dataContext);
        SeedReviews(dataContext);
    }
    // ** SEEDED COURSES **
    private static void SeedCourses(DataContext dataContext)
    {
        if (dataContext.Set<Course>().Any())
        {
            return;
        }
        
        var course1 = new Course()
        {
            Name = "COMPUTER SCIENCE 285 - SOFTWARE ENGINEERING",
            Description = "A project based course where students collaborate to create a website.",
            DepartmentId = 1
        };
        
        var course2 = new Course()
        {
            Name = "MATH 200 - CALCULUS I",
            Description = "An introductory calculus course that builds the fundamentals of differential and integral calculus.",
            DepartmentId = 2
        };
        
        var course3 =  new Course()
        {
            Name = "ENGLISH 101 - FRESHMAN COMPOSITION",
            Description = "A course that introduces the basics of grammar, sentence structure, spelling, and punctuation to the student's writing.",
            DepartmentId = 3
        };
        
        var coursesToSeed = new List<Course>()
        {
            course1,
            course2,
            course3
        };
        
        var professorCoursesToSeed = new List<ProfessorCourse>()
        {
            new ()
            {
                Course = course1,
                ProfessorId = 1,
            },
            new ()
            {
                Course = course2,
                ProfessorId = 2,
            },
            new ()
            {
                Course = course3,
                ProfessorId = 3,
            }
        };
        
        dataContext.Set<Course>().AddRange(coursesToSeed);
        dataContext.Set<ProfessorCourse>().AddRange(professorCoursesToSeed);
        dataContext.SaveChanges();
    }
    
    // ** SEEDED TAGS **
    private static void SeedTags(DataContext dataContext)
    {
        var tagsToSeed = new List<Tag>()
        {
            new()
            {
                Name = "Easy class"
            },
            new()
            {
                Name = "Hard class"
            },
            new()
            {
                Name = "Nice professor"
            },
            new()
            {
                Name = "Mean professor"
            }
            
        };
        
        dataContext.Set<Tag>().AddRange(tagsToSeed);
        dataContext.SaveChanges();
    }
    
    // ** SEEDED PROFESSORS **
    public static void SeedProfessors(DataContext dataContext)
    {
        if (dataContext.Set<Professor>().Any())
        {
            return;
        }
        
        var professorsToSeed = new List<Professor>() 
        {
            new()
            {
                FirstName = "Ghassan",
                LastName = "Alkadi"
            },
            new()
            {
                FirstName = "Alvin", 
                LastName = "Appleseed"
            },
            new()
            {
                FirstName = "Billy",
                LastName = "Bobert"
            },
            new()
            {
                FirstName = "Cara",
                LastName = "Culver"
            }
        };
        
        dataContext.Set<Professor>().AddRange(professorsToSeed);
        dataContext.SaveChanges();
    }
    
    // ** SEEDED UNIVERSITY **
    private static void SeedUniversity(DataContext dataContext)
    {
        
        var universitiesToSeed = new List<University>()
        {
            new()
            {
                Name = "Southeastern Louisiana University"
            },
            new()
            {
                Name = "University of New Orleans"
            },
            new()
            {
                Name = "Louisiana State University"
            }
        };
        
        dataContext.Set<University>().AddRange(universitiesToSeed);
        dataContext.SaveChanges();
    }

    // ** SEEDED DEPARTMENTS **
    private static void SeedDepartment(DataContext dataContext)
    {
        if (dataContext.Set<Department>().Any())
        {
            return;
        }
        
        var seededDepartment1 = new Department
        {
            Name = "Computer Science",
        };
       
        var seededDepartment2 = new Department
        {
            Name = "Math",
        };
        var seededDepartment3 = new Department
        {
            Name = "English",
        };
        dataContext.Set<Department>().Add(seededDepartment1);
        dataContext.Set<Department>().Add(seededDepartment2);
        dataContext.Set<Department>().Add(seededDepartment3);
        dataContext.SaveChanges();
    }
    
    // ** SEEDED REVIEWS **
    private static void SeedReviews(DataContext dataContext)
    {
        if (dataContext.Set<Review>().Any()) 
        {
            return;
        }

        var seedReview1 = new Review
        {
            UserId = 1,
            ProfessorCourseId = 1,
            DateCreated = DateTime.Now,
            Rating = 50,
            Comment = "This professor is great! He taught skills that I still use today."
        };
        var seedReview2 = new Review
        {
            UserId = 1,
            ProfessorCourseId = 1, 
            DateCreated = DateTime.Now,
            Rating = 35,
            Comment = "The course is valuable, but I didn't find the professor that great."
        };
        var seedReview3 = new Review
        {
            UserId = 1,
            ProfessorCourseId = 1,
            DateCreated = DateTime.Now,
            Rating = 15,
            Comment = "The professor just makes you read out of a textbook and doesn't provide much help."
        };
        dataContext.Set<Review>().Add(seedReview1);
        dataContext.Set<Review>().Add(seedReview2);
        dataContext.Set<Review>().Add(seedReview3);
        dataContext.SaveChanges();
    }

    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
            var seededUser = new User
            {
                FirstName = "Seeded",
                LastName = "User",
                UserName = "admin",
            };

            await userManager.CreateAsync(seededUser, "Password");
            await dataContext.SaveChangesAsync();
        }
    }
}
