import { Component, OnInit } from '@angular/core';
import { ReportsellingService } from '../../services/reportselling.service';
import { AdminService } from '../../services/admin.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-sellingreports',
  providers: [ReportsellingService, AdminService],
  templateUrl: './sellingreports.component.html',
  styleUrls: ['./sellingreports.component.css']
})
export class SellingreportsComponent implements OnInit {
  public token;
  public identity;
  public beginDate;
  public finishDate;
  public dataChart = [];
  public dataLabel = [];
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions & { annotation ?: any }) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(35, 93, 219, 0.788)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  public isGetChartSelling = false;

  constructor( private reportSelligService: ReportsellingService, private adminService: AdminService) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
  }

  getDataChart() {
    this.reportSelligService.getDataChart(this.token).subscribe(
      response => {
        response.chart.map((current) =>{
          this.dataChart.push(current.sellsOfDay);
          this.dataLabel.push(current.date);
        });
        this.lineChartData =[
          { data: this.dataChart, label: 'Ventas Acumladas' },
        ];
        this.lineChartLabels = this.dataLabel;
        this.isGetChartSelling = true;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit(): void {
    this.getDataChart();
  }

}
