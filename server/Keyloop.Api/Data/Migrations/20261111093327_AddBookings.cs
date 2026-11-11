using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keyloop.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    VehicleId = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    VehicleName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    VehicleImageUrl = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    PickupLocation = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    PickupDate = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    ReturnDate = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Status = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InsuranceTier = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    DailyPriceUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    RentalDays = table.Column<int>(type: "integer", nullable: true),
                    BaseUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    InsuranceUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    PlatformFeeUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    TotalUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    StripeSessionId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings");
        }
    }
}
