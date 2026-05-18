using Yeboekun.API.Configuration;
using Yeboekun.API.Middleware;
using Yeboekun.Core.Interfaces;
using Yeboekun.Infrastructure.Data;
using Yeboekun.Infrastructure.Repositories;
using Yeboekun.Services.Interfaces;
using Yeboekun.Services.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDataProtection();
builder.Services.Configure<FamilyAccessOptions>(
    builder.Configuration.GetSection(FamilyAccessOptions.SectionName));

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Yeboekun API", 
        Version = "v1",
        Description = "API pour la gestion d'arbres généalogiques"
    });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=yeboekun;Uid=root;Pwd=password;Port=3306;";

builder.Services.AddDbContext<YeboekunContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IDataNormalizationService, DataNormalizationService>();
builder.Services.AddScoped<IDuplicateDetectionService, DuplicateDetectionService>();
builder.Services.AddScoped<ITreeTraversalService, TreeTraversalService>();
builder.Services.AddScoped<IRiverViewService, RiverViewService>();
builder.Services.AddScoped<IStatsService, StatsService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Yeboekun.Services.Mappings.MappingProfile));

// CORS — WithCredentials exige des origines explicites (cookies d'accès familial).
var corsOrigins = builder.Configuration["Cors:Origins"]?.Split(
    ',',
    StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

if (corsOrigins is not { Length: > 0 })
{
    corsOrigins =
    [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ];
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Yeboekun API V1");
        c.RoutePrefix = string.Empty; // Swagger UI at root
    });
}

// Désactiver HTTPS redirection en développement (le backend écoute en HTTP)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");
app.UseMiddleware<FamilyAccessMiddleware>();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<YeboekunContext>();
    context.Database.EnsureCreated();
}

app.Run();
