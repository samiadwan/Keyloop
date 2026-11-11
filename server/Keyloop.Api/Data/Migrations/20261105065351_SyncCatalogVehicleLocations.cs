using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keyloop.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SyncCatalogVehicleLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE vehicles SET "Location" = 'Sydney' WHERE "Id" IN ('v1', 'v2', 'v9');
                UPDATE vehicles SET "Location" = 'Melbourne' WHERE "Id" IN ('v3', 'v4');
                UPDATE vehicles SET "Location" = 'Brisbane' WHERE "Id" IN ('v5', 'v6');
                UPDATE vehicles SET "Location" = 'Perth' WHERE "Id" IN ('v7', 'v8');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
