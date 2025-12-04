import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SideBar from '../components/navegation/SideBar';
import { AuthContext } from '../context/AuthContext';
import "@testing-library/jest-dom/vitest"

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de js-cookie
vi.mock('js-cookie', () => ({
  default: {
    remove: vi.fn(),
  },
}));

// Componente wrapper con contexto y router
const renderWithContext = (
  component: React.ReactElement,
  contextValue: any
) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('SideBar', () => {
  const mockSetUser = vi.fn();
  const mockSetIsAuthenticated = vi.fn();
  const mockSetCerrado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Renderizado según rol y cierre de sesión
  it('debe mostrar rutas según el rol del usuario y cerrar sesión correctamente', async () => {
    const user = userEvent.setup();
    
    const adminContext = {
      user: {
        id: 1,
        documento: '123456',
        nombre: 'Admin Test',
        rol: { nombreRol: 'Administrador' },
      },
      setUser: mockSetUser,
      setIsAuthenticated: mockSetIsAuthenticated,
    };

    renderWithContext(
      <SideBar cerrado={false} setCerrado={mockSetCerrado} />,
      adminContext
    );

    // Verificar que muestra el nombre y rol
    expect(screen.getByText('Admin Test')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();

    // Verificar que muestra rutas de administrador
    expect(screen.getByText('Asesores')).toBeInTheDocument();
    expect(screen.getByText('Médicos')).toBeInTheDocument();
    expect(screen.getByText('Pagos')).toBeInTheDocument();
    expect(screen.getByText('Planes')).toBeInTheDocument();
    expect(screen.getByText('Visitas')).toBeInTheDocument();
    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('EPS')).toBeInTheDocument();
    expect(screen.getByText('Barrios')).toBeInTheDocument();

    // Verificar que NO muestra rutas de otros roles
    expect(screen.queryByText('Solicitar Visita')).not.toBeInTheDocument();
    expect(screen.queryByText('Mis Visitas')).not.toBeInTheDocument();

    // Probar cierre de sesión
    const logoutButton = screen.getByText('Cerrar Sesión');
    await user.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    expect(mockSetUser).toHaveBeenCalledWith({
      id: null,
      documento: null,
      rol: null,
      nombre: null,
    });
  });


  // Filtrado de rutas para rol Médico
  it('debe mostrar solo las rutas del rol Médico', () => {
    const medicoContext = {
      user: {
        id: 2,
        documento: '789',
        nombre: 'Dr. Médico',
        rol: { nombreRol: 'Medico' },
      },
      setUser: mockSetUser,
      setIsAuthenticated: mockSetIsAuthenticated,
    };

    renderWithContext(
      <SideBar cerrado={false} setCerrado={mockSetCerrado} />,
      medicoContext
    );

    // Rutas que SÍ debe tener el médico
    expect(screen.getByText('Mis Visitas')).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
    
  });

    // Filtrado de rutas para rol paciente
  it('debe mostrar solo las rutas del rol paciente', () => {
    const medicoContext = {
      user: {
        id: 4,
        documento: '7243589',
        nombre: 'Juanito perez',
        rol: { nombreRol: 'Paciente' },
      },
      setUser: mockSetUser,
      setIsAuthenticated: mockSetIsAuthenticated,
    };

    renderWithContext(
      <SideBar cerrado={false} setCerrado={mockSetCerrado} />,
      medicoContext
    );

    // Rutas que SÍ debe tener el paciente
    expect(screen.getByText('Solicitar Visita')).toBeInTheDocument();
    expect(screen.getByText('Contrato')).toBeInTheDocument();
    expect(screen.getByText('Historial de Visitas')).toBeInTheDocument();
    expect(screen.getByText('Historial de pagos')).toBeInTheDocument();  
  });
});