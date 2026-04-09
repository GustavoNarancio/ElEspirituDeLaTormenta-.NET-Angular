        using ElEspirituDeLaTormenta.Server.Models;
        using Microsoft.EntityFrameworkCore;

        var builder = WebApplication.CreateBuilder(args);

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
        // --- INICIO DE CÓDIGO NUEVO: Auto-crear tablas en Supabase ---
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ElEspirituDeLaTormentaDbContext>();
            db.Database.EnsureCreated();
        }
        // --- FIN DEL CÓDIGO NUEVO ---

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
