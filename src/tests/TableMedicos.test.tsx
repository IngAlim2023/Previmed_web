import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableMedicos from '../components/medicos/TableMedicos';
import { medicoService } from '../services/medicoService';
import "@testing-library/jest-dom/vitest"

// Mock del servicio
vi.mock('../services/medicoService', () => ({
  medicoService: {
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock de react-icons
vi.mock('react-icons/fi', () => ({
  FiTrash2: () => <div>TrashIcon</div>,
  FiPlus: () => <div>PlusIcon</div>,
}));

const mockMedicos = [
  {
    id_medico: 1,
    disponibilidad: true,
    estado: true,
    usuario: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
    },
  },
  {
    id_medico: 2,
    disponibilidad: false,
    estado: false,
    usuario: {
      nombre: 'María',
      apellido: 'González',
      email: 'maria@example.com',
    },
  },
];

describe('TableMedicos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(medicoService.getAll).mockResolvedValue({ data: mockMedicos } as any);
    render(<TableMedicos />);
  });

  it('debe cambiar la disponibilidad de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    const cambiarDisponibilidadBtn = await screen.findByText('Cambiar disponibilidad');
    await userEvent.click(cambiarDisponibilidadBtn);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { disponibilidad: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2); // Initial + after update
    });
  });

  // TEST DE CAMBIAR ESTADO
  it('debe cambiar el estado de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    const cambiarEstadoBtn = await screen.findByText('Cambiar estado');
    await userEvent.click(cambiarEstadoBtn);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { estado: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2);
    });
  });

});