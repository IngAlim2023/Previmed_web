import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import SolicitarVisitaPaciente from "../pages/general/SolicitarVisitaPaciente";
import { useAuthContext } from "../context/AuthContext";

import * as barriosModule from "../services/barrios";
import * as pacientesModule from "../services/pacientes";
import * as medicoModule from "../services/medicoService";
import * as visitasModule from "../services/visitasService";
import * as notificacionesModule from "../services/notificaciones";

import socket from "../services/socket";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

vi.mock("../services/barrios", () => ({
  getBarrios: vi.fn(),
}));

vi.mock("../services/pacientes", () => ({
  getPacientesId: vi.fn(),
}));

vi.mock("../services/medicoService", () => ({
  medicoService: {
    getDisponibles: vi.fn(),
  },
}));

vi.mock("../services/visitasService", () => ({
  createVisita: vi.fn(),
}));

vi.mock("../services/notificaciones", () => ({
  createNotificacionMedico: vi.fn(),
}));

vi.mock("../services/socket", () => ({
  __esModule: true,
  default: { emit: vi.fn() },
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <SolicitarVisitaPaciente />
    </BrowserRouter>
  );

describe("SolicitarVisitaPaciente", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock del usuario
    (useAuthContext as any).mockReturnValue({
      user: { id: "147852" },
    });

    // Mock barrios
    vi.spyOn(barriosModule, "getBarrios").mockResolvedValue([
      { idBarrio: 1, nombreBarrio: "Centro", habilitar: true },
    ]);

    // Mock médicos
    vi.spyOn(medicoModule.medicoService, "getDisponibles").mockResolvedValue([
      {
        id_medico: 99,
        estado: true,
        disponibilidad: true,
        usuario_id: "147852",
        usuario: {
          id_usuario: "147852",
          nombre: "Juan",
          apellido: "Médico",
          email: "jmedico@test.com",
          numero_documento: "123456789"
        }
      }
    ]);

    // Mock pacientes
    vi.spyOn(pacientesModule, "getPacientesId").mockResolvedValue([
      {
        activo: true,
        beneficiario: true,
        idPaciente: 55,
        usuario: { nombre: "Carlos", apellido: "Pérez" },
      },
    ]);

    // Mock visita
    vi.spyOn(visitasModule, "createVisita").mockResolvedValue({
      id_visita: 1,
      fecha_visita: "2025-01-01",
      descripcion: "Dolor fuerte",
      direccion: "Cra 10 # 20 - 30",
      estado: false,
      telefono: "3001234567",
      paciente_id: 55,
      medico_id: 99,
      barrio_id: 1,
    });


    // Mock notificación
    vi.spyOn(
      notificacionesModule,
      "createNotificacionMedico"
    ).mockResolvedValue({ ok: true });
  });

  it("envía el formulario correctamente", async () => {
    renderComponent();

    // Esperar carga inicial
    await screen.findByText("Carlos Pérez");

    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "Dolor fuerte" },
    });

    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Cra 10 # 20 - 30" },
    });

    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "3001234567" },
    });

    // Seleccionar Paciente
    fireEvent.keyDown(screen.getByLabelText("Paciente"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByLabelText("Paciente"), { key: "Enter" });

    // Seleccionar Médico
    fireEvent.keyDown(screen.getByLabelText("Médico"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByLabelText("Médico"), { key: "Enter" });

    // Seleccionar Barrio
    fireEvent.keyDown(screen.getByLabelText("Barrio"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByLabelText("Barrio"), { key: "Enter" });

    // Enviar formulario
    const submitBtn = screen.getByRole("button", {
      name: /Solicitar Visita/i,
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(visitasModule.createVisita).toHaveBeenCalledTimes(1);
    });

    expect(notificacionesModule.createNotificacionMedico).toHaveBeenCalledTimes(
      1
    );

    expect(socket.emit).toHaveBeenCalled();
  });
});
