import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlotService } from '../plot.service';
import { Plot } from '../plot.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-plot-detail',
  standalone: true,
  imports: [CommonModule,
            MatCardModule,
            MatButtonModule,
            MatIconModule,
            MatTooltipModule],
  templateUrl: './plot-detail.component.html',
  styleUrls: ['./plot-detail.component.css']
})
export class PlotDetailComponent implements OnInit {
  plot?: Plot;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private plotService: PlotService
  ) {}

  
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getPlot(id).subscribe(data => this.plot = data);
    }
  }

  translateStatus(status: Plot['status']): string {
    switch (status) {
      case 'free': return 'Libre';
      case 'planted': return 'Sembrado';
      case 'harvested': return 'Cosechado';
      default: return status;
    }
  }

  translateTask(type: 'planting' | 'spraying' | 'harvesting'): string {
    switch (type) {
      case 'planting': return 'Siembra';
      case 'spraying': return 'Fumigación';
      case 'harvesting': return 'Cosecha';
      default: return type;
    }
  }

  translateInput(type: 'seed' | 'fertilizer' | 'agrochemical'): string {
    switch (type) {
      case 'seed': return 'Semilla';
      case 'fertilizer': return 'Fertilizante';
      case 'agrochemical': return 'Agroquímico';
      default: return type;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}