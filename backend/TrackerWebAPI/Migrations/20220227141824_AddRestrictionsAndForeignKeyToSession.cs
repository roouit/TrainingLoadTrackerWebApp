using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrackerWebAPI.Migrations
{
    public partial class AddRestrictionsAndForeignKeyToSession : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Sessions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Sessions");
        }
    }
}
