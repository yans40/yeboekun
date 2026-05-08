using GegeDot.Core.Interfaces;
using GegeDot.Infrastructure.Data;
using GegeDot.Infrastructure.Repositories;
using GegeDot.Services.Interfaces;
using GegeDot.Services.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

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
        Title = "GegeDot API", 
        Version = "v1",
        Description = "API pour la gestion d'arbres généalogiques"
    });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=gegeDot;Uid=root;Pwd=password;Port=3306;";

builder.Services.AddDbContext<GegeDotContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IDataNormalizationService, DataNormalizationService>();
builder.Services.AddScoped<IDuplicateDetectionService, DuplicateDetectionService>();
builder.Services.AddScoped<ITreeTraversalService, TreeTraversalService>();
builder.Services.AddScoped<IStatsService, StatsService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(GegeDot.Services.Mappings.MappingProfile));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // En développement, autoriser toutes les origines pour faciliter les tests
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // En production, restreindre aux origines spécifiques
            policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GegeDot API V1");
        c.RoutePrefix = string.Empty; // Swagger UI at root
    });
}

// Désactiver HTTPS redirection en développement (le backend écoute en HTTP)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<GegeDotContext>();
    context.Database.EnsureCreated();
}

app.Run();
