using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace QuizApiAws;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container
    public void ConfigureServices(IServiceCollection services)
    {

        services.AddControllers();
        services.AddSwaggerGen();
        services.AddDbContext<QuizDbContext>(options =>
        // options.UseNpgsql(Configuration.GetConnectionString("DevConnection")));
        options.UseNpgsql(Configuration.GetConnectionString("ProdConnection2")));
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            // app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseCors(options =>
        options.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
        );
        // app.UseStaticFiles(new StaticFileOptions
        // {
        //     FileProvider = new PhysicalFileProvider(
        //         Path.Combine(env.ContentRootPath, "Images")),
        //     RequestPath = "/images"
        // });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGet("/", async context =>
            {
                await context.Response.WriteAsync("Welcome to running ASP.NET Core on AWS Lambda");
            });
        });

    }
}