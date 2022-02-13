var builder = WebApplication.CreateBuilder(args);
var corsAllowAll = "_corsAllowAll";
// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsAllowAll, builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


// UserRouting before this!
app.UseCors(corsAllowAll);

app.UseAuthorization();

app.MapControllers();

app.Run();
