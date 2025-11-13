import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MachineryService } from '../machinery.service';
import { Machinery } from '../machinery.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-machinery-detail',
  standalone: true,
  imports: [CommonModule,
            MatCardModule,
            MatButtonModule,
            MatIconModule,
            MatTooltipModule],
  templateUrl: './machinery-detail.component.html',
  styleUrls: ['./machinery-detail.component.css']
})
export class MachineryDetailComponent implements OnInit {
  machinery?: Machinery;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private machineryService: MachineryService
  ) {}

  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineryService.getMachine(id).subscribe(data => this.machinery = data);
    }
  }

  translateStatus(status: Machinery['status']): string {
    switch (status) {
      case 'active': return 'Activa';
      case 'maintenance': return 'En mantenimiento';
      case 'retired': return 'Retirada';
      default: return status;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}