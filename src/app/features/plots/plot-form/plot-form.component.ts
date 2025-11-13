import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Plot } from '../plot.model';
import { PlotService } from '../plot.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-plot-form',
  templateUrl: './plot-form.component.html',
  styleUrls: ['./plot-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PlotFormComponent implements OnInit {
  form!: FormGroup;
  plot?: Plot;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private plotService: PlotService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getPlot(id).subscribe(data => {
        if (!data) {
          alert('Lote no encontrado');
          this.router.navigate(['/plots']);
          return;
        }
        this.plot = data;
        this.form = this.fb.group({
          name: [data.name, Validators.required],
          cadastralNumber: [data.cadastralNumber, Validators.required],
          area: [data.area, [Validators.required, Validators.min(0.1)]],
          location: [data.location, Validators.required],
          status: [data.status, Validators.required],
          tasks: this.fb.array(data.tasks.map(task =>
            this.fb.group({
              type: [task.type, Validators.required],
              date: [task.date, Validators.required],
              inputs: this.fb.array(task.inputs.map(input =>
                this.fb.group({
                  name: [input.name, Validators.required],
                  type: [input.type, Validators.required],
                  quantity: [input.quantity, [Validators.required, Validators.min(0.1)]],
                  unit: [input.unit, Validators.required]
                })
              ))
            })
          )),
          rainfall: this.fb.array(data.rainfall.map(rain =>
            this.fb.group({
              date: [rain.date, Validators.required],
              millimeters: [rain.millimeters, [Validators.required, Validators.min(0)]]
            })
          ))
        });
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        cadastralNumber: ['', Validators.required],
        area: [0, [Validators.required, Validators.min(0.1)]],
        location: ['', Validators.required],
        status: ['free', Validators.required],
        tasks: this.fb.array([]),
        rainfall: this.fb.array([])
      });
    }
  }

  get tasks(): FormArray {
    return this.form.get('tasks') as FormArray;
  }

  get rainfall(): FormArray {
    return this.form.get('rainfall') as FormArray;
  }

  getInputs(taskIndex: number): FormArray {
    return this.tasks.at(taskIndex).get('inputs') as FormArray;
  }

  addTask(): void {
    this.tasks.push(this.fb.group({
      type: ['planting', Validators.required],
      date: [new Date(), Validators.required],
      inputs: this.fb.array([])
    }));
  }
  
  removeTask(index: number): void {
    this.tasks.removeAt(index);
  }
  
  addInput(taskIndex: number): void {
    this.getInputs(taskIndex).push(this.fb.group({
      name: ['', Validators.required],
      type: ['seed', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.1)]],
      unit: ['', Validators.required]
    }));
  }

  removeInput(taskIndex: number, inputIndex: number): void {
    this.getInputs(taskIndex).removeAt(inputIndex);
  }

  addRain(): void {
    this.rainfall.push(this.fb.group({
      date: [new Date(), Validators.required],
      millimeters: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeRain(index: number): void {
    this.rainfall.removeAt(index);
  }

  submit(): void {
    if (this.form.valid) {
      const updatedPlot: Plot = {
        ...this.form.value,
        id: this.plot?.id ?? crypto.randomUUID()
      };

      const action = this.plot
        ? this.plotService.updatePlot(this.plot.id, updatedPlot)
        : this.plotService.addPlot(updatedPlot);

      action.subscribe(() => this.router.navigate(['/plots']));
    }
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