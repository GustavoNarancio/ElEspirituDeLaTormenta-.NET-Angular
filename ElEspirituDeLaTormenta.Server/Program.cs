using ElEspirituDeLaTormenta.Server.Models;
using Microsoft.EntityFrameworkCore;





var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ElEspirituDeLaTormentaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configuración de CORS
// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirVercel",
        policy =>
        {
            policy.AllowAnyOrigin()  // <-- ESTA ES LA MAGIA: Deja entrar a cualquier URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PermitirVercel");
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
