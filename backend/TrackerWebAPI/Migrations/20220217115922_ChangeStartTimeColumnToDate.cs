using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrackerWebAPI.Migrations
{
    public partial class ChangeStartTimeColumnToDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Sessions",
                newName: "Date");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Sessions",
                newName: "StartTime");
        }
    }
}
