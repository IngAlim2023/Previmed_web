import { render , screen} from "@testing-library/react";
import SolicitarVisitaPaciente from "../pages/general/SolicitarVisitaPaciente";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach } from 'vitest';

describe('Formulario para la solicitud de visita', ()=>{
  beforeEach(()=>{

  })

  it('Mostrar alertas de campos obligatorios', async () => {
    render(<SolicitarVisitaPaciente/>)
    const btnEnviar = screen.getAllByText('Solicitar Visita')[0];
    await userEvent.click(btnEnviar);  

    const alertas = screen.getAllByAltText('Campo obligatorio');
    expect(alertas).toHaveBeenCalledTimes(3)
  })
})