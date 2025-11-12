import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import DetallesPlan from "../components/planes/DetallesPlan";
import { Plan } from "../interfaces/planes";

test("renderiza detalles del plan con beneficios", () => {
  const planMock: Plan = {
  idPlan: 1,
  tipoPlan: "Básico",
  descripcion: "Plan de prueba",
  precio: "100000",
  cantidadBeneficiarios: 2,
  estado: true
}


  const setShowDetalles = vi.fn();

  render(<DetallesPlan plan={planMock} setShowDetalles={setShowDetalles} />);

  expect(screen.getByText("Detalles del Plan")).toBeInTheDocument();
  expect(screen.getByText("ID:")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("Tipo de Plan:")).toBeInTheDocument();
  expect(screen.getByText("Básico")).toBeInTheDocument();
  expect(screen.getByText("Precio:")).toBeInTheDocument();
  expect(screen.getByText("Beneficios asociados:")).toBeInTheDocument();
});
