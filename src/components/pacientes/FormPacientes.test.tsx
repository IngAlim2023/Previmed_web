import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormPacientes from './FormPacientes';
import "@testing-library/jest-dom/vitest"

describe('FormPacientes', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llenar el formulario, enviarlo correctamente y cerrar el modal', async () => {
    const user = userEvent.setup();

    render(
      <FormPacientes
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Verificar que el modal está abierto
    expect(screen.getByText('Registrar Paciente')).toBeInTheDocument();

    // Llenar el formulario
    await user.type(screen.getByPlaceholderText('Nombre'), 'Juan');
    await user.type(screen.getByPlaceholderText('Segundo nombre'), 'Carlos');
    await user.type(screen.getByPlaceholderText('Apellido'), 'Pérez');
    await user.type(screen.getByPlaceholderText('Segundo apellido'), 'García');
    await user.type(screen.getByPlaceholderText('Email'), 'juan@example.com');
    await user.type(screen.getByPlaceholderText('Teléfono'), '3001234567');
    await user.type(screen.getByPlaceholderText('Dirección'), 'Calle 123 #45-67');
    await user.type(screen.getByPlaceholderText('Número de documento'), '1234567890');
    await user.type(screen.getByPlaceholderText('Fecha de nacimiento'), '1990-01-15');
    await user.type(screen.getByPlaceholderText('Número de hijos'), '2');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    await user.type(screen.getByPlaceholderText('Estrato'), '3');

  });
});