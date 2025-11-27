import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"
import userEvent from "@testing-library/user-event";
import { vi, test, expect } from "vitest";
import DetallesPago from "../components/pagos/DetallesPago";

const pagoMock = {
  idRegistro: 123,
  foto: null,
  fechaInicio: "2025-01-01T00:00:00.000Z",
  fechaFin: "2025-01-31T00:00:00.000Z",
  formaPago: { tipoPago: "Tarjeta" },
  monto: 50000,
  membresia: {
    numeroContrato: "C123",
    membresiaPaciente: [
      {
        paciente: {
          usuario: {
            nombre: "Juan",
            segundoNombre: "Carlos",
            apellido: "Pérez",
            segundoApellido: "Gómez"
          }
        }
      }
    ]
  }
};

test("renderiza detalles del pago y funciona botón volver", async () => {
  const setPago = vi.fn();
  const setDetalles = vi.fn();

  render(
    <DetallesPago pago={pagoMock} setPago={setPago} setDetalles={setDetalles} />
  );

  expect(screen.getByText(`Recibo #${pagoMock.idRegistro}`)).toBeInTheDocument();
  expect(screen.getByText(`Contrato: #${pagoMock.membresia.numeroContrato}`)).toBeInTheDocument();
  expect(screen.getByText("Juan Carlos Pérez Gómez")).toBeInTheDocument();
  expect(screen.getByText("Tarjeta")).toBeInTheDocument();
  expect(screen.getByText(`$${pagoMock.monto}`)).toBeInTheDocument();
  expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Volver"));
  expect(setPago).toHaveBeenCalledWith(null);
  expect(setDetalles).toHaveBeenCalledWith(false);
});
