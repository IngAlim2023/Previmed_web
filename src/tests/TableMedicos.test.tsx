import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom/vitest"
import { BrowserRouter } from 'react-router-dom';

// Mock del servicio ANTES de cualquier import
vi.mock('../services/medicoService', () => ({
  medicoService: {
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock de los componentes hijos
vi.mock('../botones/BtnAgregar', () => ({
  default: () => <button>Agregar</button>
}));

vi.mock('../botones/BtnTelefonos', () => ({
  default: () => <button>Teléfonos</button>
}));

vi.mock('./FormMedicos', () => ({
  default: () => <div>FormMedicos</div>
}));

// Mock de react-icons
vi.mock('react-icons/fi', () => ({
  FiTrash2: () => <div>TrashIcon</div>,
  FiPlus: () => <div>PlusIcon</div>,
}));

// Importar DESPUÉS de los mocks
import TableMedicos from '../components/medicos/TableMedicos';
import { medicoService } from '../services/medicoService';

const mockMedicos = [
  {
    id_medico: 1,
    disponibilidad: true,
    estado: true,
    usuario_id: 1,
    usuario: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      numero_documento: '12345678',
    },
  },
  {
    id_medico: 2,
    disponibilidad: false,
    estado: false,
    usuario_id: 2,
    usuario: {
      nombre: 'María',
      apellido: 'González',
      email: 'maria@example.com',
      numero_documento: '87654321',
    },
  },
];

describe('TableMedicos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(medicoService.getAll).mockResolvedValue({ data: mockMedicos } as any);
  });

  it('debe cambiar la disponibilidad de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    render(
      <BrowserRouter>
        <TableMedicos />
      </BrowserRouter>
    );

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Buscar el botón de cambiar disponibilidad
    const buttons = screen.getAllByText('Cambiar disponibilidad');
    await userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { disponibilidad: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2); // Initial + after update
    });
  });

  it('debe cambiar el estado de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    render(
      <BrowserRouter>
        <TableMedicos />
      </BrowserRouter>
    );

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Buscar el botón de cambiar estado
    const buttons = screen.getAllByText('Cambiar estado');
    await userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { estado: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});