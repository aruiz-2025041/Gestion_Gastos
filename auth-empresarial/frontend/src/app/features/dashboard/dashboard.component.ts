import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ListaItem {
  nombre: string;
}

interface EventoProximo {
  fecha: string;
  descripcion: string;
}

interface SerieGrafica {
  nombre: string;
  color: string;
  valores: number[];
}

interface PuntoChart {
  x: number;
  y: number;
}

interface SerieChart {
  color: string;
  linePath: string;
  areaPath: string;
  points: PuntoChart[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sueldoFijo = 0.0;

  ingresos: ListaItem[] = [
    { nombre: 'Servicio de instalación de cable' },
    { nombre: 'Servicio de página web' }
  ];

  gastos: ListaItem[] = [
    { nombre: 'Pago de cable' },
    { nombre: 'Pago web' }
  ];

  proximosEventos: EventoProximo[] = [
    { fecha: '26/8/2026', descripcion: 'Pago de impuesto' }
  ];

  // --- Datos de la gráfica ---
  mesesGrafica = ['Ene', 'Feb', 'Mar'];

  seriesGrafica: SerieGrafica[] = [
    { nombre: 'Computadora', color: 'var(--c-cyan)', valores: [3800, 3200, 3600] },
    { nombre: 'Dispositivo móvil', color: 'var(--c-steel)', valores: [1800, 2100, 1900] }
  ];

  get maxValorGrafica(): number {
    const todos = this.seriesGrafica.flatMap(s => s.valores);
    return Math.max(...todos);
  }

  // --- Geometría de la gráfica de línea (SVG) ---
  private readonly chartWidth = 320;
  private readonly chartHeight = 170;
  private readonly paddingX = 24;
  private readonly paddingTop = 16;
  private readonly paddingBottom = 16;

  get chartPaths(): SerieChart[] {
    const n = this.mesesGrafica.length;
    const step = (this.chartWidth - this.paddingX * 2) / (n - 1);
    const max = this.maxValorGrafica;
    const alturaUtil = this.chartHeight - this.paddingTop - this.paddingBottom;

    return this.seriesGrafica.map(serie => {
      const points: PuntoChart[] = serie.valores.map((valor, i) => ({
        x: this.paddingX + step * i,
        y: this.paddingTop + (1 - valor / max) * alturaUtil
      }));

      const linePath = this.trazarCurvaSuave(points);
      const base = this.chartHeight - this.paddingBottom;
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${base} L ${points[0].x} ${base} Z`;

      return { color: serie.color, linePath, areaPath, points };
    });
  }

  // Genera una curva suave (Catmull-Rom → Bézier) entre puntos
  private trazarCurvaSuave(points: PuntoChart[]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  // --- Tarjetas de resumen ---
  totalAhorro = 600;
  fondosEmergencia = 10000;
  impuestosPagar = 45445;
  totalGastos = 10000;

  formatoQuetzal(valor: number): string {
    return 'Q' + valor.toLocaleString('es-GT');
  }
}