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
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatIconModule,
            MatTooltipModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  employee?: Employee;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployee(id).subscribe(data => {
        if (!data) {
          alert('Empleado no encontrado');
          this.router.navigate(['/employees']);
          return;
        }
        this.employee = data;
        this.form = this.fb.group({
          fullname: [data.fullname, Validators.required],
          role: [data.role, Validators.required],
          seniority: [data.seniority, [Validators.required, Validators.min(0)]],
          availablehours: [data.availablehours, [Validators.required, Validators.min(0)]],
          overtimehours: [data.overtimehours, [Validators.required, Validators.min(0)]],
          salary: [data.salary, [Validators.required, Validators.min(0)]],
          performancescore: [data.performancescore, [Validators.required, Validators.min(0), Validators.max(100)]],
          assignedtasks: this.fb.array(data.assignedtasks.map(task => this.fb.control(task, Validators.required)
          ))
        });
      });
    } else {
      this.form = this.fb.group({
        fullname: ['', Validators.required],
        role: ['', Validators.required],
        seniority: [0, [Validators.required, Validators.min(0)]],
        availablehours: [0, [Validators.required, Validators.min(0)]],
        overtimehours: [0, [Validators.required, Validators.min(0)]],
        salary: [0, [Validators.required, Validators.min(0)]],
        performancescore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        assignedtasks: this.fb.array([])
      });
    }
  }

  get assignedtasks(): FormArray {
    return this.form.get('assignedtasks') as FormArray;
  }

  addTask(): void {
    this.assignedtasks.push(this.fb.control('', Validators.required));
  }

  removeTask(index: number): void {
    this.assignedtasks.removeAt(index);
  }

  submit(): void {
  if (this.form.valid) {
    const updatedEmployee: Employee = {
      ...this.form.value,
      assignedtasks: this.assignedtasks.value,
      id: this.employee?.id ?? crypto.randomUUID()
    };

    const action = this.employee
      ? this.employeeService.updateEmployee(this.employee.id, updatedEmployee)
      : this.employeeService.addEmployee(updatedEmployee);

    action.subscribe(() => this.router.navigate(['/employees']));
  }
}

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}