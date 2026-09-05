import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingreso-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingreso-modal.component.html',
  styleUrls: ['./ingreso-modal.component.css']
})
export class IngresoModalComponent {
  @Input() visible = false;
  @Input() tipo: string = 'extra'; // Recibe el tipo seleccionado

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  monto: number | null = null;
  descripcion = '';
  fecha = '';
  categoria = '';
  metodoPago = '';
  estado = 'Pendiente';

  onCerrar() {
    this.limpiarFormulario();
    this.cerrar.emit();
  }

  onGuardar() {
    if (!this.monto || this.monto <= 0) {
      alert('Ingresa un monto válido.');
      return;
    }

    if (this.tipo === 'fijo') {
      this.guardar.emit({ monto: this.monto });
    } else {
      this.guardar.emit({
        monto: this.monto,
        categoria: this.categoria,
        fecha: this.fecha,
        metodoPago: this.metodoPago,
        estado: this.estado,
        descripcion: this.descripcion
      });
    }

    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.monto = null;
    this.descripcion = '';
    this.fecha = '';
    this.categoria = '';
    this.metodoPago = '';
    this.estado = 'Pendiente';
  }
}