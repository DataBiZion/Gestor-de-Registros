// src/components/forms/ScrapManagementSystem.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



// Tipos de datos
interface FormData {
  fecha: string;
  maquina: string;
  operador: string;
  turno: number;
  job: number;
  nivel_2_mermas: string;
  kilogramos_reportados: number;
  nivel_1_lean_manufacturing: string;
  nivel_3_defectos: string;
}

const initialFormState: FormData = {
  fecha: new Date().toISOString().split('T')[0],
  maquina: '',
  operador: '',
  turno: 1,
  job: 0,
  nivel_2_mermas: '',
  kilogramos_reportados: 0,
  nivel_1_lean_manufacturing: '',
  nivel_3_defectos: ''
};

interface RemisionFormData {    
  remision_key: string;
  fecha: string;
  proveedor_key: string;
  desperdicio_reportado: number;
  uds: string;
  material: string;
  clasificacion_scrap: string;
  precio_unitario: number;
  autoriza: string;
  responsable_proveedor: string;
  categoria: string;
}


interface Material {
  nombre: string;
  precio: number;
  unidad: string;
  clasificacion_scrap: string;
  categoria: string;
}

const materiales: Material[] = [
  { nombre: "papel revuelto", precio: 3, unidad: "kg", clasificacion_scrap: "operativo", categoria: "papel" },
  { nombre: "papel bond", precio: 3.8, unidad: "kg", clasificacion_scrap: "operativo", categoria: "papel" },
  { nombre: "primera blanca", precio: 5, unidad: "kg", clasificacion_scrap: "operativo", categoria: "papel" },
  { nombre: "tirilla", precio: 3, unidad: "kg", clasificacion_scrap: "estructural", categoria: "papel" },
  { nombre: "papel kraft", precio: 0.8, unidad: "kg", clasificacion_scrap: "no medible", categoria: "cartón" },
  { nombre: "corrugado", precio: 0.8, unidad: "kg", clasificacion_scrap: "no medible", categoria: "cartón" },
  { nombre: "playo", precio: 3.5, unidad: "kg", clasificacion_scrap: "no medible", categoria: "plastico" },
  { nombre: "confeti", precio: 6, unidad: "kg", clasificacion_scrap: "no medible", categoria: "papel" },
  { nombre: "pleca", precio: 2.5, unidad: "kg", clasificacion_scrap: "no medible", categoria: "metal" },
  { nombre: "lamina", precio: 25, unidad: "kg", clasificacion_scrap: "no medible", categoria: "metal" },
  { nombre: "revuelto obsoleto", precio: 3, unidad: "kg", clasificacion_scrap: "obsoleto", categoria: "papel" },
  { nombre: "corrugado obsoleto", precio: 0.8, unidad: "kg", clasificacion_scrap: "obsoleto", categoria: "papel" },
  { nombre: "blanco obsoleto", precio: 5, unidad: "kg", clasificacion_scrap: "obsoleto", categoria: "papel" },
  { nombre: "bond obsoleto", precio: 3.8, unidad: "kg", clasificacion_scrap: "obsoleto", categoria: "papel" },
  { nombre: "galletas mixtas", precio: 3, unidad: "kg", clasificacion_scrap: "estructural", categoria: "papel" },
  { nombre: "galletas primera blanca", precio: 5, unidad: "kg", clasificacion_scrap: "estructural", categoria: "papel" },
  { nombre: "tarima comercial", precio: 17.24, unidad: "pz", clasificacion_scrap: "madera", categoria: "madera" },
  { nombre: "tarima triplay", precio: 4.31, unidad: "pz", clasificacion_scrap: "madera", categoria: "madera" },
  { nombre: "tabla", precio: 4.31, unidad: "pz", clasificacion_scrap: "madera", categoria: "madera" },
  { nombre: "tarima desarme", precio: 12.93, unidad: "pz", clasificacion_scrap: "madera", categoria: "madera" }
].sort((a, b) => a.nombre.localeCompare(b.nombre));

const proveedores = [
  "reciclajes martinez", 
  "castillo pallets", 
  "megadestrucciones"
].sort();


const ScrapManagementSystem = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const [remisionFormData, setRemisionFormData] = useState<RemisionFormData>({
    remision_key: '',
    fecha: new Date().toISOString().split('T')[0],
    proveedor_key: '',
    desperdicio_reportado: 0,
    uds: '',
    material: '',
    clasificacion_scrap: '',
    precio_unitario: 0,
    autoriza: '',
    responsable_proveedor: '',
    categoria: ''
  });

  // Catálogos completos
  const machines = [
    "hamilton 6", "rotatek 1", "dg 8 uno", "magnum", "western 25.5", 
    "western 22", "kluge", "dg 5", "stevens", "schriber 1", "harris", 
    "hamilton", "flexo 1", "flexo 2", "colectora 2", "colectora 3", 
    "colectora 4", "colectora 5", "colectora 6", "colectora 7", 
    "off line", "mnr 01", "mnr 02", "mnr 03", "mnr 04", "mnr 05", 
    "mnr 06", "mnr 07", "mnr 08", "mnr 09", "mnr 10", "lemu 1", 
    "lemu 2", "fumagalli 1", "fumagalli 2", "fumagalli 3", "fumagalli 4", 
    "borche 1", "borche 2", "salvaje", "cortadora", "sobrante", 
    "obsoleto", "muller", "dg 8 dos"
  ].sort();

  const operators = [
    "agustin gonzalez", "alberto morales garcia", "alberto rodriguez lopez", 
    "alejandro espinosa saavedra", "alejandro estrada meneses", 
    "alejandro ixtepan mil", "alejandro mayen jimenez", 
    "alejandro romero aldama", "alexis tellez tirado", 
    "andrea marina lira obregon", "andrea mendoza ruiz", "andres galicia", 
    "andres viveros vazquez", "antoni jaret gomez valdovinos", 
    "antonio ovando sanabria", "armando aparicio clara", 
    "armando gutierrez monjaras", "arturo galicia martinez", 
    "beally yean araujo sanchez", "bernardo real vega", 
    "brayan axel hernandez velazquez", "carlos eduardo vazquez hernandez", 
    "carlos lopez bautista", "cristian mayte moreno rivera", 
    "dafne xuiscochea armada", "daniela chavez", 
    "david arturo garcia alvarez", "diana reyes cortes", 
    "edgar rivera gonzalez", "enrique diaz guzman", 
    "erick misael alvarado villordo", "fernandez rodriguez edgar", 
    "figueroa david lopez", "francisco hernandez jimenez", 
    "francisco mendoza valtierra", "georgina mejia", 
    "gerardo rodriguez juarez", "gregorio meza hernandez", 
    "guadalupe sedas benitez", "gustavo gonzalez", 
    "hector carlos garcia garcia", "heriberto garcia", 
    "isaac arisai morales", "ismael becerra carmelo", 
    "ivan de la torre albarran", "javier mendoza martinez", 
    "javier rivera sanchez", "jazmin berenice campos galvan", 
    "jesus alonso morales ramirez", "jesus manuel mondragon granados", 
    "jesus mayeya jimenez", "jesus perez borges", "jesus ramirez mejia", 
    "jesus romero hernandez", "joana lizbeth yanez ibanez", 
    "jonatan alejandro barrios uribe", "jonathan ismael vargas rodriguez", 
    "jorge granados aguirre", "jorge luis padilla", "jorge navarro aguilar", 
    "jose alberto garcia luis", "jose angel rodriguez gazpar", 
    "jose antonio dominguez conde", "jose antonio roman ramirez", 
    "jose de jesus galindo leon", "jose guadalupe medina garcia", 
    "jose luis gomez gonzalez", "jose luis rodriguez blancas", 
    "jose luis sanchez pineda", "jose noe rubio hernandez", 
    "juan carlos rosillo torres", "juan jesus sanchez garcia", 
    "julio cesar jimenez marquez", "kenia adamary perez garcia", 
    "luis angel garcia espinoza", "luis cortes villa", 
    "luis enrique hernandez feliciano", "luis fernando navarro aguilar", 
    "marco adan vergara guerrero", "marcos giovanny amador roa", 
    "marcos zaragoza navarro", "martha leticia perez castillo", 
    "martin rosales cruz", "miguel angel vazquez bautista", 
    "nicolas mujica reynosa", "norma patricia salgado garcia", 
    "octavio montano arteaga", "pablo martinez alvarez", 
    "rafael martinez silva", "rafael ricano bautista", 
    "raul velazquez martinez", "ricardo ovando zanabria", 
    "rosa maria paz cruz", "tania judith garcia vazques", "tania sharid", 
    "victor alfonso coyotzi vargas", "victor manuel guillermo medina", 
    "yovany daniel julian vazquez", "no entrega vale"
  ].sort();

  const nivel2Mermas = [
    "arreglo", "operativo", "maquinaria", "sobrante", "golpes de bobina", 
    "prensas", "obsoleto", "pruebas", "mantenimiento", "materia prima", 
    "vueltas de papel"
  ].sort();

  const nivel1Lean = [
    "inventario", "movimientos innecesarios", "esperas y retrasos", 
    "sobreproducción", "sobreprocesamiento", "defectos y rechazos", 
    "transporte de material"
  ].sort();

  const nivel3Defectos = [
    "calibracion de unidades", "vobo", "ajuste de ponchos", 
    "incumplimiento al procedimiento", "carretillas", "falla de presion", 
    "foliadoras", "limpieza", "manchas", "paros de maquina", "piojos", 
    "plecas", "postura del paquete", "programa de planeacion", 
    "reaccion del papel", "mal registro", "repinte", "solucion de la fuente", 
    "sustrato erroreno", "tensiones", "velo", "contras", "cuchillas", 
    "diametro erroreo", "etiquetas", "marca fin de rollo", "rollos cruzados", 
    "salida de rollo", "uniones de impresion","union de fabrica", "orden de los tantos", 
    "reaccion de tantos", "reposiciones", "tipo de forma", 
    "caldera carbonizado", "extractor de ponchos", "hojeadora", 
    "extractor de refin", "maceadora", "metraje erroneo", "termoselladora", 
    "bandas", "peines", "sobreproduccion", "golpe de almacen", 
    "golpe de origen", "banderas", "mal bobinado", "sustrato obsoleto", 
    "impresion", "mantenimiento", "sustrato", "cortadora", "anilina", 
    "tinta", "alcohol", "blankets", "carbon", "fleje", "grabados", 
    "sticky back", "centros", "goma", "producto terminado obsoleto", 
    "mal manejo del montacargas", "activacion del papel", "remosqueo", 
    "exceso de presion", "arrugas", "curado uv", "gramaje", 
    "exceso caolin", "gotas", "rayas", "taka", "tono frente", 
    "tono reverso", "tableteo", "diametro bajo", "orilla de refil", 
    "canto conico", "canto rayado", "desgaste de placa", "emulsión"
  ].sort();

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    // Si el campo es numérico y el valor está vacío, establece 0
    if (['job', 'turno', 'kilogramos_reportados'].includes(field) && value === '') {
      setFormData(prev => ({
        ...prev,
        [field]: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormState});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/scrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('Datos guardados correctamente');
        resetForm(); // Llamada al reseteo después de guardar
      } else {
        throw new Error(result.error || 'Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar los datos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

// Añade estas funciones antes del return
const handleMaterialChange = (materialNombre: string) => {
  const materialSeleccionado = materiales.find(m => m.nombre === materialNombre);
  if (materialSeleccionado) {
    setRemisionFormData(prev => ({
      ...prev,
      material: materialNombre,
      uds: materialSeleccionado.unidad,
      precio_unitario: materialSeleccionado.precio,
      clasificacion_scrap: materialSeleccionado.clasificacion_scrap,
      categoria: materialSeleccionado.categoria
    }));
  }
};

const resetRemisionForm = () => {
  setRemisionFormData({
    remision_key: '', // Se reinicia a vacío
    fecha: new Date().toISOString().split('T')[0],
    proveedor_key: '',
    desperdicio_reportado: 0,
    uds: '',
    material: '',
    clasificacion_scrap: '',
    precio_unitario: 0,
    autoriza: '',
    responsable_proveedor: '',
    categoria: ''
  });
};

const handleRemisionSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validar datos antes de enviar
  if (!remisionFormData.remision_key || 
      !remisionFormData.fecha || 
      !remisionFormData.proveedor_key ||
      !remisionFormData.material) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  try {
    // Crear objeto con los datos asegurándonos que todos los campos existan
    const formDataToSend = {
      remision_key: remisionFormData.remision_key.trim(),
      fecha: remisionFormData.fecha,
      proveedor_key: remisionFormData.proveedor_key,
      desperdicio_reportado: Number(remisionFormData.desperdicio_reportado) || 0,
      uds: remisionFormData.uds || '',
      material: remisionFormData.material,
      clasificacion_scrap: remisionFormData.clasificacion_scrap || '',
      precio_unitario: Number(remisionFormData.precio_unitario) || 0,
      autoriza: remisionFormData.autoriza || '',
      responsable_proveedor: remisionFormData.responsable_proveedor || '',
      categoria: remisionFormData.categoria || ''
    };

    console.log('Datos a enviar:', JSON.stringify(formDataToSend, null, 2));

    // Validar que el JSON sea válido antes de enviarlo
    const validJSON = JSON.stringify(formDataToSend);
    JSON.parse(validJSON); // Esto lanzará error si el JSON no es válido

    const response = await fetch('/api/remision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: validJSON
    });

    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Error al guardar los datos');
    }

    if (result.success) {
      alert('Datos guardados correctamente');
      resetRemisionForm();
    } else {
      throw new Error(result.error || 'Error al guardar los datos');
    }
  } catch (error) {
    console.error('Error completo:', error);
    alert('Error al guardar los datos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
};

// También necesitamos cargar el número de remisión inicial cuando el componente se monte
useEffect(() => {
  resetRemisionForm();
}, []);

  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">Sistema de Gestión de Registros</h1>
      
      <Tabs defaultValue="scrap">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scrap">Registro de Desperdicio</TabsTrigger>
          <TabsTrigger value="remision">Registro de Residuos</TabsTrigger>
          <TabsTrigger value="production">Registro de Producción</TabsTrigger>
        </TabsList>

        <TabsContent value="scrap">
  <Card>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {/* Primera fila: Fecha y Máquina */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Máquina</label>
            <Select
              value={formData.maquina}
              onValueChange={(value) => handleInputChange('maquina', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar máquina" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine} value={machine}>
                    {machine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda fila: Operador y Turno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Operador</label>
            <Select
              value={formData.operador}
              onValueChange={(value) => handleInputChange('operador', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operador" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Turno</label>
            <Select
              value={formData.turno.toString()}
              onValueChange={(value) => handleInputChange('turno', parseInt(value))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Turno 1</SelectItem>
                <SelectItem value="2">Turno 2</SelectItem>
                <SelectItem value="3">Turno 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tercera fila: Job y Kilogramos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job</label>
            <Input
              type="number"
              value={formData.job || ''}
              onChange={(e) => handleInputChange('job', e.target.value ? parseInt(e.target.value) : 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Kilogramos Reportados</label>
            <Input
              type="number"
              value={formData.kilogramos_reportados || ''}
              onChange={(e) => handleInputChange('kilogramos_reportados', e.target.value ? parseFloat(e.target.value) : 0)}
              required
              step="0.01"
            />
          </div>
        </div>

        {/* Cuarta fila: Tipo de Merma */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Merma</label>
          <Select
            value={formData.nivel_2_mermas}
            onValueChange={(value) => handleInputChange('nivel_2_mermas', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de merma" />
            </SelectTrigger>
            <SelectContent>
              {nivel2Mermas.map((merma) => (
                <SelectItem key={merma} value={merma}>
                  {merma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quinta fila: Tipo de Lean Manufacturing */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Lean Manufacturing</label>
          <Select
            value={formData.nivel_1_lean_manufacturing}
            onValueChange={(value) => handleInputChange('nivel_1_lean_manufacturing', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de Lean" />
            </SelectTrigger>
            <SelectContent>
              {nivel1Lean.map((lean) => (
                <SelectItem key={lean} value={lean}>
                  {lean}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sexta fila: Tipo de Defecto */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Defecto</label>
          <Select
            value={formData.nivel_3_defectos}
            onValueChange={(value) => handleInputChange('nivel_3_defectos', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de defecto" />
            </SelectTrigger>
            <SelectContent>
              {nivel3Defectos.map((defecto) => (
                <SelectItem key={defecto} value={defecto}>
                  {defecto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
          >
            Limpiar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</TabsContent>

        <TabsContent value="remision">
  <Card>
    <CardContent>
      <form onSubmit={handleRemisionSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Primera fila: Remisión y Fecha */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Número de Remisión</label>
            <Input
              type="text"
              value={remisionFormData.remision_key}
              onChange={(e) => setRemisionFormData(prev => ({
                ...prev,
                remision_key: e.target.value
              }))}
              placeholder="Ej: R00001"
              required
            />
          </div>
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              value={remisionFormData.fecha}
              onChange={(e) => setRemisionFormData(prev => ({
                ...prev,
                fecha: e.target.value
              }))}
              required
            />
          </div>

          {/* Segunda fila: Proveedor y Material */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Proveedor</label>
            <Select
              value={remisionFormData.proveedor_key}
              onValueChange={(value) => setRemisionFormData(prev => ({
                ...prev,
                proveedor_key: value
              }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedores.map((proveedor) => (
                  <SelectItem key={proveedor} value={proveedor}>
                    {proveedor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Material</label>
            <Select
              value={remisionFormData.material}
              onValueChange={handleMaterialChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar material" />
              </SelectTrigger>
              <SelectContent>
                {materiales.map((material) => (
                  <SelectItem key={material.nombre} value={material.nombre}>
                    {material.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tercera fila: Desperdicio y Unidades */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Desperdicio Reportado</label>
            <Input
              type="number"
              value={remisionFormData.desperdicio_reportado || ''}
              onChange={(e) => setRemisionFormData(prev => ({
                ...prev,
                desperdicio_reportado: e.target.value ? parseFloat(e.target.value) : 0
              }))}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Unidades</label>
            <Input
              value={remisionFormData.uds}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Cuarta fila: Precio y Clasificación */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Precio Unitario</label>
            <Input
              type="number"
              value={remisionFormData.precio_unitario || ''}
              disabled
              className="bg-gray-100"
              step="0.01"
            />
          </div>
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Clasificación Scrap</label>
            <Input
              value={remisionFormData.clasificacion_scrap}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Quinta fila: Categoría y Autoriza */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Input
              value={remisionFormData.categoria}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-medium">Autoriza</label>
            <Input
              type="text"
              value={remisionFormData.autoriza}
              onChange={(e) => setRemisionFormData(prev => ({
                ...prev,
                autoriza: e.target.value.toLowerCase()
              }))}
              required
            />
          </div>

          {/* Sexta fila: Responsable */}
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Responsable Proveedor</label>
            <Input
              type="text"
              value={remisionFormData.responsable_proveedor}
              onChange={(e) => setRemisionFormData(prev => ({
                ...prev,
                responsable_proveedor: e.target.value.toLowerCase()
              }))}
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetRemisionForm}
          >
            Limpiar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</TabsContent>

        <TabsContent value="production">
          <Card>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Registro de Producción</h3>
              {/* Aquí irá el formulario de la tercera sección */}
              <p className="text-muted-foreground">Esta sección está en desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScrapManagementSystem;