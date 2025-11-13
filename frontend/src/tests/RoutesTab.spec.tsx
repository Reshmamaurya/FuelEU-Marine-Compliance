import { render, screen, waitFor } from "@testing-library/react";
import RoutesTab from "../adapters/ui/tabs/RoutesTab";
import * as api from "../adapters/infrastructure/api/client";

vi.spyOn(api, "apiGet").mockResolvedValue([
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    isBaseline: true,
  },
]);

describe("RoutesTab", () => {
  it("renders routes table and shows baseline mark", async () => {
    render(<RoutesTab />);
    await waitFor(() => screen.getByText("R001"));
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByText("✔")).toBeInTheDocument();
  });
});
