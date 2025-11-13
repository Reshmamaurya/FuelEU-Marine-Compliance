import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BankingTab from "../adapters/ui/tabs/BankingTab";
import * as api from "../adapters/infrastructure/api/client";

vi.spyOn(api, "apiGet").mockImplementation(async (path) => {
  if (path === "/compliance/cb") return { shipId: "S1", year: 2024, cbGco2eq: 300 };
  if (path === "/banking/records") return [{ createdAt: new Date().toISOString(), amountGco2eq: 100 }];
  return [];
});

vi.spyOn(api, "apiPost").mockResolvedValue({});

describe("BankingTab", () => {
  it("calculates CB and displays results", async () => {
    render(<BankingTab />);

    fireEvent.change(screen.getByPlaceholderText("Ship ID"), { target: { value: "S1" } });
    fireEvent.change(screen.getByPlaceholderText("Year"), { target: { value: "2024" } });
    fireEvent.change(screen.getByPlaceholderText("Actual GHG (gCO₂e/MJ)"), { target: { value: "88" } });
    fireEvent.change(screen.getByPlaceholderText("Fuel Consumption (tonnes)"), { target: { value: "5000" } });

    fireEvent.click(screen.getByText("Calculate Compliance Balance"));

    await waitFor(() => screen.getByText("Compliance Result"));
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText(/300/)).toBeInTheDocument();
  });
});
