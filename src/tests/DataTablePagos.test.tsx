import { render, screen, waitFor, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTablePagos from "../components/pagos/DataTablePagos";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import '@testing-library/jest-dom/vitest';
import * as pagosService from "../services/pagosService";
import { useAuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  cleanup();
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock del contexto
vi.mock("../context/AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

// Mock del servicio de pagos
vi.mock("../services/pagosService", () => ({
  getPagos: vi.fn(),
  deletePago: vi.fn(),
  setEstadoPago: vi.fn(),
}));

// Mock de react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('DataTablePagos', () => {
  const mockUserAdmin = {
    id: 1,
    rol: { nombreRol: "Administrador" }
  };

  const mockUserAsesor = {
    id: 2,
    rol: { nombreRol: "Asesor" }
  };

  const mockPagos = [
    {
      idRegistro: 1,
      numeroRecibo: "REC-001",
      monto: 50000,
      fechaPago: "2024-01-15",
      estado: "Aprobado",
      cobradorId: 1,
      formaPago: { tipoPago: "Efectivo" },
      membresia: {
        numeroContrato: "CONT-001",
        membresiaPaciente: [{
          paciente: {
            usuario: {
              nombre: "Juan",
              segundoNombre: "Carlos",
              apellido: "Pérez",
              segundoApellido: "Gómez"
            }
          }
        }]
      }
    },
    {
      idRegistro: 2,
      numeroRecibo: "REC-002",
      monto: 75000,
      fechaPago: "2024-01-20",
      estado: "Realizado",
      cobradorId: 2,
      formaPago: { tipoPago: "Transferencia" },
      membresia: {
        numeroContrato: "CONT-002",
        membresiaPaciente: [{
          paciente: {
            usuario: {
              nombre: "María",
              segundoNombre: null,
              apellido: "Rodríguez",
              segundoApellido: "López"
            }
          }
        }]
      }
    },
    {
      idRegistro: 3,
      numeroRecibo: "REC-003",
      monto: 100000,
      fechaPago: "2024-01-25",
      estado: "Asignado",
      cobradorId: 1,
      formaPago: { tipoPago: "Tarjeta" },
      membresia: {
        numeroContrato: "CONT-003",
        membresiaPaciente: [{
          paciente: {
            usuario: {
              nombre: "Pedro",
              segundoNombre: "Luis",
              apellido: "Martínez",
              segundoApellido: null
            }
          }
        }]
      }
    }
  ];

  beforeEach(() => {
    // reset limpio de mocks y timers
    vi.resetAllMocks();
    vi.clearAllTimers();
    // Por defecto, mockear como administrador
    vi.mocked(useAuthContext).mockReturnValue({ user: mockUserAdmin } as any);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  // Helper robusto para encontrar un texto dentro de la tabla (busca filas)
  const findInTable = async (text: string | RegExp) => {
    // Esperar a que la tabla aparezca y tenga filas
    const table = await screen.findByRole('table');
    await waitFor(() => {
      const rows = within(table).getAllByRole('row');
      // debe existir al menos la fila header + una fila de data
      expect(rows.length).toBeGreaterThan(1);
    });

    // Re-buscar filas ahora que seguro están montadas
    const rows = within(table).getAllByRole('row');
    for (const row of rows) {
      const match = within(row).queryByText(text);
      if (match) return { row, match };
    }
    // si no encontramos, fallamos para que el test lo muestre
    throw new Error(`No se encontró "${text}" en la tabla`);
  };

  // Carga y muestra los datos en la tabla
  it('carga y muestra los pagos en la tabla con todas las columnas', async () => {
    vi.mocked(pagosService.getPagos).mockResolvedValue({ data: mockPagos } as any);

    renderWithRouter(<DataTablePagos />);

    // Esperar a que getPagos sea llamado (puede llamarse varias veces dependiendo del componente)
    await waitFor(() => {
      expect(pagosService.getPagos).toHaveBeenCalled();
    });

    // Verificar que existen las columnas (estos están en el header, son texto plano)
    expect(await screen.findByText('N° Recibo')).toBeInTheDocument();
    expect(screen.getByText('N° Contrato')).toBeInTheDocument();
    expect(screen.getByText('Titular')).toBeInTheDocument();
    expect(screen.getByText('Fecha Cobro')).toBeInTheDocument();
    expect(screen.getByText('Monto')).toBeInTheDocument();
    expect(screen.getByText('Forma de pago')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();

    // Verificar que se muestran los datos del primer pago usando la tabla
    const { match: recibo1 } = await findInTable(/REC-001/i);
    expect(recibo1).toBeInTheDocument();

    const { match: contrato1 } = await findInTable(/CONT-001/i);
    expect(contrato1).toBeInTheDocument();

    const { match: titular1 } = await findInTable(/Juan Carlos Pérez Gómez/i);
    expect(titular1).toBeInTheDocument();

    const { match: monto1 } = await findInTable(/\$50000/);
    expect(monto1).toBeInTheDocument();

    const { match: forma1 } = await findInTable(/Efectivo/i);
    expect(forma1).toBeInTheDocument();

    // Verificar datos del segundo pago
    const { match: recibo2 } = await findInTable(/REC-002/i);
    expect(recibo2).toBeInTheDocument();

    const { match: titular2 } = await findInTable(/María Rodríguez López/i);
    expect(titular2).toBeInTheDocument();

    const { match: monto2 } = await findInTable(/\$75000/);
    expect(monto2).toBeInTheDocument();

    // Verificar datos del tercer pago
    const { match: recibo3 } = await findInTable(/REC-003/i);
    expect(recibo3).toBeInTheDocument();

    const { match: titular3 } = await findInTable(/Pedro Luis Martínez/i);
    expect(titular3).toBeInTheDocument();

    const { match: monto3 } = await findInTable(/\$100000/);
    expect(monto3).toBeInTheDocument();
  });

  // Funcionalidad de búsqueda
  it('filtra los pagos según el texto de búsqueda', async () => {
    const user = userEvent.setup();
    vi.mocked(pagosService.getPagos).mockResolvedValue({ data: mockPagos } as any);

    renderWithRouter(<DataTablePagos />);

    // Esperar a que la tabla muestre al menos el primer recibo
    await findInTable(/REC-001/i);

    // Verificar que inicialmente aparecen todos los pagos
    expect(await findInTable(/Juan Carlos Pérez Gómez/i)).toBeTruthy();
    expect(await findInTable(/María Rodríguez López/i)).toBeTruthy();
    expect(await findInTable(/Pedro Luis Martínez/i)).toBeTruthy();

    // Buscar por nombre — placeholder parcial para coincidir con el real
    const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
    await user.clear(searchInput);
    await user.type(searchInput, 'María');

    // Dar tiempo para que el filtro se aplique y validar
    await waitFor(async () => {
      // Debe existir María y NO Juan/Pedro
      const found = await findInTable(/María Rodríguez López/i);
      expect(found.match).toBeInTheDocument();
      // ahora comprobar que Juan y Pedro no aparecen en las filas visibles
      const table = screen.getByRole('table');
      expect(within(table).queryByText(/Juan Carlos Pérez Gómez/i)).not.toBeInTheDocument();
      expect(within(table).queryByText(/Pedro Luis Martínez/i)).not.toBeInTheDocument();
    });

    // Limpiar búsqueda y esperar a que todos vuelvan a aparecer
    await user.clear(searchInput);
    await waitFor(async () => {
      expect((await findInTable(/Juan Carlos Pérez Gómez/i)).match).toBeInTheDocument();
      expect((await findInTable(/María Rodríguez López/i)).match).toBeInTheDocument();
      expect((await findInTable(/Pedro Luis Martínez/i)).match).toBeInTheDocument();
    });

    // Buscar por número de contrato
    await user.type(searchInput, 'CONT-002');
    await waitFor(async () => {
      expect((await findInTable(/María Rodríguez López/i)).match).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(within(table).queryByText(/Juan Carlos Pérez Gómez/i)).not.toBeInTheDocument();
    });

    // Limpiar y buscar por monto
    await user.clear(searchInput);
    await waitFor(async () => {
      expect((await findInTable(/Juan Carlos Pérez Gómez/i)).match).toBeInTheDocument();
    });

    await user.type(searchInput, '100000');
    await waitFor(async () => {
      expect((await findInTable(/Pedro Luis Martínez/i)).match).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(within(table).queryByText(/María Rodríguez López/i)).not.toBeInTheDocument();
    });
  });

  // Permisos según rol de usuario
  it('muestra diferentes opciones según el rol del usuario', async () => {
    // Primero como Administrador
    vi.mocked(useAuthContext).mockReturnValue({ user: mockUserAdmin } as any);
    vi.mocked(pagosService.getPagos).mockResolvedValue({ data: mockPagos } as any);

    const { unmount } = renderWithRouter(<DataTablePagos />);

    // Esperar a que la tabla muestre los datos
    await findInTable(/REC-001/i);

    // El administrador debe ver el botón "Formas de pago" (buscar por role para estabilidad)
    expect(
      screen.getByRole("button", { name: /formas de pago/i })
    ).toBeInTheDocument();

    // El administrador debe ver botones de editar y eliminar (títulos en el DOM)
    const editButtons = screen.getAllByTitle('Editar');
    const deleteButtons = screen.getAllByTitle('Eliminar');
    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);

    unmount();

    // Preparar mock solo para servicio (filtrar por cobrador)
    vi.mocked(pagosService.getPagos).mockClear();
    vi.mocked(pagosService.getPagos).mockResolvedValue({ data: mockPagos.filter(p => p.cobradorId === 2) } as any);

    // Ahora como Asesor
    vi.mocked(useAuthContext).mockReturnValue({ user: mockUserAsesor } as any);

    renderWithRouter(<DataTablePagos />);

    // Esperar a que se cargue el pago del asesor
    await findInTable(/REC-002/i);

    // El asesor NO debe ver el botón "Formas de pago"
    expect(screen.queryByRole("button", { name: /formas de pago/i })).not.toBeInTheDocument();

    // El asesor NO debe ver botones de editar y eliminar
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Eliminar')).not.toBeInTheDocument();

    // Debe ver el botón de Ver detalles (tiene title)
    expect(screen.getByTitle('Ver detalles')).toBeInTheDocument();
  });

  // Mensaje cuando no hay datos
  it('muestra mensaje cuando no hay registros de pago', async () => {
    vi.mocked(pagosService.getPagos).mockResolvedValue({ data: [] } as any);

    renderWithRouter(<DataTablePagos />);

    await waitFor(() => {
      expect(pagosService.getPagos).toHaveBeenCalled();
    });

    // el noDataComponent contiene el texto "No hay registros de pago"
    expect(await screen.findByText('No hay registros de pago')).toBeInTheDocument();
  });
});
