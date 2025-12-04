import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetallesMedico from '../components/medicos/DetallesMedico';
import { medicoService } from '../services/medicoService';
import type { MedicoResponse } from '../interfaces/medicoInterface';
import "@testing-library/jest-dom/vitest"


vi.mock('../services/medicoService');

describe('DetallesMedico', () => {
  const mockMedico: MedicoResponse = {
    id_medico: 1,
    disponibilidad: true,
    estado: true,
    usuario_id: '1',
    usuario: {
      id_usuario: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      numero_documento: '123456789',
    },
  };

  it('debe mostrar los detalles del médico si la carga es exitosa', async () => {
    vi.mocked(medicoService.getById).mockResolvedValue(mockMedico);
    render(
      <MemoryRouter initialEntries={['/medicos/1']}>
        <Routes>
          <Route path="/medicos/:id" element={<DetallesMedico />} />
        </Routes>
      </MemoryRouter>
    );

    // Espera a que aparezca el nombre completo (Juan Pérez)
    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Email: juan.perez@example.com')).toBeInTheDocument();
    expect(screen.getByText('Documento: 123456789')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
  });
});
