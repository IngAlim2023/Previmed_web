import { render, screen, waitFor } from "@testing-library/react";
import Pacientes from "../pages/general/Pacientes";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as pacienteService from "../services/pacientes";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({ user: { rol: { nombreRol: "Administrador" } } }),
}));

describe("Pacientes component", () => {
  it("llama a readPacientes y muestra los datos en la tabla", async () => {
    const mockPacientes = [
      {
        id: 1,
        usuario: {
          nombre: "Juan",
          segundo_nombre: "Carlos",
          apellido: "Pérez",
          segundo_apellido: "Gómez",
          email: "juan@example.com",
          numero_documento: "123456789",
        },
      },
    ];

    vi.spyOn(pacienteService, "readPacientes").mockResolvedValue({
      data: mockPacientes,
    });

    render(<Pacientes />);

    await waitFor(() => {
      expect(pacienteService.readPacientes).toHaveBeenCalled();
    });

    expect(await screen.findByText("Juan Carlos")).toBeInTheDocument();
    expect(screen.getByText("juan@example.com")).toBeInTheDocument();
  });

  it("muestra 'No hay resultados' cuando no hay pacientes", async () => {
    vi.spyOn(pacienteService, "readPacientes").mockResolvedValue({
      data: [],
    });

    render(<Pacientes />);

    expect(await screen.findByText("No hay resultados")).toBeInTheDocument();
  });
});
