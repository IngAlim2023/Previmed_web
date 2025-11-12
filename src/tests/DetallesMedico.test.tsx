import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, test, expect } from "vitest";
import { medicoService } from "../services/medicoService";
import DetallesMedico from "../components/medicos/DetallesMedico";

vi.mock("../../services/medicoService");

test("muestra mensaje cuando médico no encontrado", async () => {
  (medicoService.getById as any).mockRejectedValueOnce(new Error("Not found"));

  render(
    <MemoryRouter initialEntries={["/medicos/1"]}>
      <Routes>
        <Route path="/medicos/:id" element={<DetallesMedico />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findAllByText("Médico no encontrado.")).toHaveLength(1)
});
