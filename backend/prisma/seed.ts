import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const routes = [
    {
      route_id: "R001",
      vessel_type: "Container",
      fuel_type: "HFO",
      year: 2024,
      ghg_intensity: 91.0,
      fuel_consumption: 5000,
      distance: 12000,
      total_emissions: 4500,
      is_baseline: true,
    },
    {
      route_id: "R002",
      vessel_type: "BulkCarrier",
      fuel_type: "LNG",
      year: 2024,
      ghg_intensity: 88.0,
      fuel_consumption: 4800,
      distance: 11500,
      total_emissions: 4200,
      is_baseline: false,
    },
    {
      route_id: "R003",
      vessel_type: "Tanker",
      fuel_type: "MGO",
      year: 2024,
      ghg_intensity: 93.5,
      fuel_consumption: 5100,
      distance: 12500,
      total_emissions: 4700,
      is_baseline: false,
    },
    {
      route_id: "R004",
      vessel_type: "RoRo",
      fuel_type: "HFO",
      year: 2025,
      ghg_intensity: 89.2,
      fuel_consumption: 4900,
      distance: 11800,
      total_emissions: 4300,
      is_baseline: false,
    },
    {
      route_id: "R005",
      vessel_type: "Container",
      fuel_type: "LNG",
      year: 2025,
      ghg_intensity: 90.5,
      fuel_consumption: 4950,
      distance: 11900,
      total_emissions: 4400,
      is_baseline: false,
    },
  ];

  // Seed Routes
  for (const route of routes) {
    await prisma.routes.upsert({
      where: { route_id: route.route_id },
      update: {},
      create: route,
    });
  }

  console.log("✅ Routes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
