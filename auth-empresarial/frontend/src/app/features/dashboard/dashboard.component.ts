import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoModalComponent } from './ingreso-modal.component';
import { IngresoMenuComponent } from './ingreso-menu/ingreso-menu.component';
import { IngresoService } from '../../core/services/ingreso.service';
import { CrearIngresoRequest, SueldoFijoRequest } from '../../core/models/ingreso.model';

interface ListaItem {
  nombre: string;
}

interface Evento {
  nombre?: string;
  descripcion?: string;
  fecha?: string;
  monto?: number;
}

interface SerieGrafica {
  nombre: string;
  color: string;
}

interface Bar {
  x: number;
  y: number;
  height: number;
  color: string;
}

interface BarGroup {
  bars: Bar[];
}

interface GridLine {
  y: number;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IngresoModalComponent, IngresoMenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private ingresoService = inject(IngresoService);

  // Estados de modales
  menuIngresoVisible = false;
  modalIngresoVisible = false;
  tipoIngresoSeleccionado: 'fijo' | 'extra' | 'variable' = 'extra';

  // Datos
  sueldoFijo = 0.0;
  ingresos: ListaItem[] = [];
  gastos: ListaItem[] = [];
  proximosEventos: Evento[] = [];

  // Métricas
  totalAhorro = 600;
  fondosEmergencia = 10000;
  impuestosPagar = 45445;
  totalGastos = 10000;

  // Propiedades Gráfica SVG
  svgWidth = 320;
  svgHeight = 200;
  axisX1 = 30;
  axisX2 = 300;
  barWidth = 20;
  yAxisLabelWidth = 30;

  seriesGrafica: SerieGrafica[] = [
    { nombre: 'Ingresos', color: '#3b82f6' }
  ];

  mesesGrafica: string[] = ['Ene', 'Feb', 'Mar'];

  yGridLines: GridLine[] = [
    { y: 20, label: '100' },
    { y: 60, label: '75' },
    { y: 100, label: '50' },
    { y: 140, label: '25' },
    { y: 180, label: '0' }
  ];

  barGroups: BarGroup[] = [
    { bars: [{ x: 50, y: 50, height: 130, color: '#3b82f6' }] },
    { bars: [{ x: 130, y: 80, height: 100, color: '#3b82f6' }] },
    { bars: [{ x: 210, y: 110, height: 70, color: '#3b82f6' }] }
  ];

  ngOnInit() {
    this.cargarSueldoFijo();
    this.cargarIngresos();
  }

  abrirMenuIngreso() {
    this.menuIngresoVisible = true;
  }

  cerrarMenuIngreso() {
    this.menuIngresoVisible = false;
  }

  onElegirTipoIngreso(tipo: 'fijo' | 'extra' | 'variable') {
    this.tipoIngresoSeleccionado = tipo;
    this.menuIngresoVisible = false; // Se oculta el menú previo
    this.modalIngresoVisible = true;  // Muestra el formulario
  }

  cerrarModalIngreso() {
    this.modalIngresoVisible = false;
  }

  cargarSueldoFijo() {
    this.ingresoService.obtenerSueldoFijo().subscribe({
      next: (res) => {
        if (res && res.monto) {
          this.sueldoFijo = res.monto;
        }
      },
      error: (err) => console.error('Error al cargar sueldo fijo:', err)
    });
  }

  cargarIngresos() {
    this.ingresoService.listarIngresos().subscribe({
      next: (res) => {
        if (res) {
          this.ingresos = res.map(i => ({
            nombre: `${i.descripcion || 'Ingreso'} (${i.tipo}) - Q${i.monto}`
          }));
        }
      },
      error: (err) => console.error('Error al cargar ingresos:', err)
    });
  }

  guardarIngreso(datosFormulario: any) {
    if (this.tipoIngresoSeleccionado === 'fijo') {
      const payload: SueldoFijoRequest = { monto: datosFormulario.monto };
      this.ingresoService.guardarSueldoFijo(payload).subscribe({
        next: () => {
          this.sueldoFijo = datosFormulario.monto;
          this.cerrarModalIngreso();
        },
        error: (err) => alert('Error al guardar sueldo fijo')
      });
    } else {
      const payload: CrearIngresoRequest = {
        tipo: this.tipoIngresoSeleccionado,
        monto: datosFormulario.monto,
        categoria: datosFormulario.categoria,
        fechaIngreso: datosFormulario.fecha,
        metodoPago: datosFormulario.metodoPago,
        estado: datosFormulario.estado,
        descripcion: datosFormulario.descripcion
      };

      this.ingresoService.crearIngreso(payload).subscribe({
        next: () => {
          this.cerrarModalIngreso();
          this.cargarIngresos();
        },
        error: (err) => alert('Error al guardar ingreso')
      });
    }
  }

  formatoQuetzal(valor: number): string {
    return 'Q' + (valor ? valor.toLocaleString('es-GT') : '0');
  }
}