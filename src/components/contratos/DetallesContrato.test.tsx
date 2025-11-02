import { test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import DetallesContrato from "./DetallesContrato";
import "@testing-library/jest-dom/vitest"

test("muestra los detalles del contrato", () => {
  const contratoMock = {
    idMembresia: 1,
    firma: "John Doe",
    formaPago: "Tarjeta",
    numeroContrato: "C123",
    fechaInicio: "2025-01-01T00:00:00.000Z",
    fechaFin: "2025-12-31T00:00:00.000Z",
    planNombre: "Plan Premium",
    planId:1,
    estado: true,
    membresiaPaciente: []
  };

  render(<DetallesContrato contrato={contratoMock} setShowDetalles={vi.fn()} />);

  expect(screen.getByText("ID:")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("Firma:")).toBeInTheDocument();
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("Plan:")).toBeInTheDocument();
  expect(screen.getByText("Plan Premium")).toBeInTheDocument();
  expect(screen.getByText("Estado:")).toBeInTheDocument();
  expect(screen.getByText("Activo")).toBeInTheDocument();
});
