import { render, screen } from "@testing-library/react";
import DataTablePagos from "../components/pagos/DataTablePagos";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom/vitest'

describe('DataTablePagos', ()=>{
    it('renders a default datatable',()=>{
        render(<DataTablePagos/>);
        expect(screen.getByText('Pagos')).toBeInTheDocument()
    })
})