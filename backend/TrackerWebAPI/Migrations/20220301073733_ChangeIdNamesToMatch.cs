using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrackerWebAPI.Migrations
{
    public partial class ChangeIdNamesToMatch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Sessions",
                newName: "SessionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "SessionId",
                table: "Sessions",
                newName: "Id");
        }
    }
}
