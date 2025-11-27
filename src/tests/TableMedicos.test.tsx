import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableMedicos from '../components/medicos/TableMedicos';
import { medicoService } from '../services/medicoService';
import "@testing-library/jest-dom/vitest"

// Mock del servicio
vi.mock('../../services/medicoService', () => ({
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

// Mock del FormMedicos
vi.mock('./FormMedicos', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="form-medicos">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
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
  });

  // 1. TEST DE RENDERIZADO INICIAL
  it('debe mostrar mensaje de carga inicialmente', () => {
    render(<TableMedicos />);
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('debe cambiar la disponibilidad de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    render(<TableMedicos />);

    

    const cambiarDisponibilidadBtn = screen.getAllByText('Cambiar disponibilidad')[0];
    await userEvent.click(cambiarDisponibilidadBtn);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { disponibilidad: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2); // Initial + after update
    });
  });

  // 7. TEST DE CAMBIAR ESTADO
  it('debe cambiar el estado de un médico', async () => {
    vi.mocked(medicoService.update).mockResolvedValue({} as any);

    render(<TableMedicos />);

    

    const cambiarEstadoBtn = screen.getAllByText('Cambiar estado')[0];
    await userEvent.click(cambiarEstadoBtn);

    await waitFor(() => {
      expect(medicoService.update).toHaveBeenCalledWith(1, { estado: false });
      expect(medicoService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  // 8. TEST DE ELIMINAR CON CONFIRMACIÓN
  it('debe eliminar un médico después de confirmar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(medicoService.remove).mockResolvedValue({} as any);

    render(<TableMedicos />);

    

    const deleteButtons = screen.getAllByTitle('Eliminar');
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(medicoService.remove).toHaveBeenCalledWith(1);
      expect(medicoService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  // 9. TEST DE CANCELAR ELIMINACIÓN
  it('no debe eliminar si se cancela la confirmación', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<TableMedicos />);

    

    const deleteButtons = screen.getAllByTitle('Eliminar');
    await userEvent.click(deleteButtons[0]);

    expect(medicoService.remove).not.toHaveBeenCalled();
  });
});