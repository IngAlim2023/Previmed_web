import { jsPDF } from 'jspdf'

type Usuario = {
  nombre?: string
  numeroDocumento?: string
  direccion?: string
  barrio?: string
  telefono?: string
  email?: string
  cupoMaximo?: string | number
}

type GenerarPDFResult =
  | {
      success: true
      mensaje: string
      archivo: string
      numeroContrato: string
    }
  | {
      success: false
      mensaje: string
      error?: string
    }

export const generarPDF = (usuario: Usuario): GenerarPDFResult => {
  try {
    const doc = new jsPDF()
    
    // Configuración básica
    const fecha = new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    
    let y = 20 // posición vertical
    
    // Función helper para campos con auto-llenado
    const agregarCampo = (etiqueta: string, valor: string | number | undefined, posY: number) => {
      // Etiqueta en negrita
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(etiqueta, 20, posY)
      
      // Valor o línea para llenar
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      const valorStr = typeof valor === 'number' ? String(valor) : (valor || '')
      const valorFinal = valorStr || '_'.repeat(30) // Si está vacío, pone línea
      doc.text(valorFinal, 20, posY + 5)
      
      return posY + 15 // retorna nueva posición Y
    }
    
    // === ENCABEZADO ===
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('CONTRATO DE AFILIACIÓN', 105, y, { align: 'center' })
    y += 15
    
    doc.setFontSize(12)
    doc.text('MEDIHOME TU MEDICO EN CASA S.A.S', 105, y, { align: 'center' })
    y += 10
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Popayán, ${fecha}`, 105, y, { align: 'center' })
    y += 20
    
    // === DATOS DEL USUARIO ===
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('DATOS DEL USUARIO:', 20, y)
    y += 15
    
    // Aquí es donde los campos se auto-llenan
    y = agregarCampo('Nombre completo:', usuario.nombre, y)
    y = agregarCampo('Número de documento:', usuario.numeroDocumento, y)
    y = agregarCampo('Dirección:', usuario.direccion, y)
    y = agregarCampo('Barrio:', usuario.barrio, y)
    y = agregarCampo('Teléfono:', usuario.telefono, y)
    y = agregarCampo('Email:', usuario.email, y)
    
    // === CONTENIDO DEL CONTRATO ===
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('CLÁUSULA PRIMERA - OBJETO DEL CONTRATO:', 20, y)
    y += 8
    
    // Texto que se auto-llena con datos del usuario
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const textoContrato = `Entre I.P.S. MEDIHOME TU MEDICO EN CASA S.A.S. (NIT: 900707920-1) domiciliada en Popayán, Cauca, y ${usuario.nombre || '[NOMBRE DEL USUARIO]'}, identificado(a) con documento ${usuario.numeroDocumento || '[NÚMERO DE DOCUMENTO]'}, domiciliado(a) en ${usuario.direccion || '[DIRECCIÓN]'}, se celebra el presente contrato para la prestación de servicios de medicina general domiciliaria.`
    
    const lineas = doc.splitTextToSize(textoContrato, 170)
    doc.text(lineas, 20, y)
    y += lineas.length * 5 + 20
    
    // === CAMPOS QUE SE AUTO-GENERAN ===
    // Número de contrato automático
    const numeroContrato = `CONT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    y = agregarCampo('Número de contrato:', numeroContrato, y)
    
    // Cupo con valor por defecto
    const cupoMaximo = usuario.cupoMaximo || '5'
    y = agregarCampo('Cupo máximo de beneficiarios:', cupoMaximo, y)
    
    // Vigencia automática (1 año desde hoy)
    const fechaVigencia = new Date()
    fechaVigencia.setFullYear(fechaVigencia.getFullYear() + 1)
    const vigencia = fechaVigencia.toLocaleDateString('es-CO')
    y = agregarCampo('Vigencia hasta:', vigencia, y)
    
    // === FIRMAS ===
    y += 30
    
    // Líneas para firmar
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('_'.repeat(25), 30, y)
    doc.text('_'.repeat(25), 130, y)
    y += 8
    
    // Etiquetas de firmas
    doc.setFontSize(10)
    doc.text('Firma del Usuario', 30, y)
    doc.text('Leandro Realpe Cisneros', 130, y)
    y += 5
    
    // Nombres bajo las firmas (auto-llenado)
    doc.text(usuario.nombre || '[Nombre del usuario]', 30, y)
    doc.text('Representante Legal', 130, y)
    y += 3
    doc.text(usuario.numeroDocumento || '[Documento]', 30, y)
    doc.text('MEDIHOME TU MEDICO EN CASA S.A.S', 130, y)
    
    // === GUARDAR PDF ===
    // Nombre de archivo seguro (sin caracteres especiales)
    const nombreSeguro = usuario.nombre ? 
      usuario.nombre.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') : 
      'Usuario'
    
    const nombreArchivo = `Contrato_${nombreSeguro}_${new Date().getFullYear()}.pdf`
    doc.save(nombreArchivo)
    
    // Retorna resultado exitoso
    return {
      success: true,
      mensaje: 'PDF generado correctamente',
      archivo: nombreArchivo,
      numeroContrato: numeroContrato
    }
    
  } catch (error: any) {
    // Mantener el console para depuración
    console.error('Error al generar PDF:', error)
    return {
      success: false,
      mensaje: 'Error al generar el PDF',
      error: error?.message
    }
  }
}

// === FUNCIÓN DE USO FÁCIL ===
export const generarContratoCompleto = (datosBasicos: Record<string, any>): GenerarPDFResult => {
  // Función que toma datos mínimos y completa el resto automáticamente
  const usuarioCompleto: Usuario = {
    nombre: datosBasicos.nombre,
    numeroDocumento: datosBasicos.cedula || datosBasicos.numeroDocumento,
    direccion: datosBasicos.direccion,
    barrio: datosBasicos.barrio,
    telefono: datosBasicos.telefono || '',
    email: datosBasicos.email || '',
    cupoMaximo: datosBasicos.cupoMaximo || '5'
  }
  
  return generarPDF(usuarioCompleto)
}