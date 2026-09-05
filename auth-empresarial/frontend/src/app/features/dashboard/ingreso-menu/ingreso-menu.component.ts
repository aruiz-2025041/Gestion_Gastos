import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingreso-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingreso-menu.component.html',
  styleUrls: ['./ingreso-menu.component.css']
})
export class IngresoMenuComponent {
  @Input() visible = true;
  @Output() cerrar = new EventEmitter<void>();
  @Output() seleccionar = new EventEmitter<'fijo' | 'extra' | 'variable'>();
  @Output() elegirTipo = new EventEmitter<'fijo' | 'extra' | 'variable'>();

  onCerrar() {
    this.cerrar.emit();
  }

  onSeleccionar(tipo: 'fijo' | 'extra' | 'variable') {
    this.seleccionar.emit(tipo);
    this.elegirTipo.emit(tipo);
  }
}