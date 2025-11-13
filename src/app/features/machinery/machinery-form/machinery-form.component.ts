import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Machinery } from '../machinery.model';
import { MachineryService } from '../machinery.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-machinery-form',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatCardModule,
            MatFormFieldModule, 
            MatInputModule, 
            MatButtonModule, 
            MatSelectModule,
            MatIcon,
            MatTooltipModule,
            MatDatepickerModule,
            MatNativeDateModule],
  templateUrl: './machinery-form.component.html',
  styleUrls: ['./machinery-form.component.css']
})
export class MachineryFormComponent implements OnInit {
  form!: FormGroup;
  machinery?: Machinery;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private machineryService: MachineryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineryService.getMachine(id).subscribe(data => {
        if (!data) {
          alert('Maquinaria no encontrada');
          this.router.navigate(['/machinery']);
          return;
        }
        this.machinery = data;
        this.form = this.fb.group({
          name: [data.name, Validators.required],
          brand: [data.brand, Validators.required],
          model: [data.model, Validators.required],
          status: [data.status, Validators.required],
          hours_used: [data.hours_used, [Validators.required, Validators.min(0)]],
          purchase_date: [this.toDateInputValue(data.purchase_date), Validators.required],
        });
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        brand: ['', Validators.required],
        model: ['', Validators.required],
        status: ['active', Validators.required],
        hours_used: [0, [Validators.required, Validators.min(0)]],
        purchase_date: [this.toDateInputValue(new Date()), Validators.required],
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      const updatedMachinery: Machinery = {
        ...this.form.value,
        id: this.machinery?.id ?? crypto.randomUUID()
      };

      const action = this.machinery
        ? this.machineryService.updateMachine(this.machinery.id, updatedMachinery)
        : this.machineryService.addMachine(updatedMachinery);

      action.subscribe(() => this.router.navigate(['/machinery']));
    }
  }

  toDateInputValue(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  preventTyping(event: KeyboardEvent): void {
  event.preventDefault();
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}