import { Component, ViewChild, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './create_report_dialog/create_report_dialog.component';
import { DeleteReportDialogComponent } from './delete_report_dialog/delete-report-dialog.component';
import { MoreInfoDialogComponent } from './more-info-dialog/more_info_dialog.component';
import { MapComponent } from './map/map.component';
import { ApiService } from './pigTrackerService/api.service';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(MapComponent)
  Map!: MapComponent;
  title = 'Pig Tracker';
  displayedColumns: string[] = ['location', 'reported_by', 'time_reported', 'status', 'more-info', 'id'];
  dataSource!: MatTableDataSource<any>
  @ViewChild(MatSort) sort!: MatSort;
  sortedData: any = [];
  data: any = []

  constructor(public dialog:MatDialog, private app:ApiService){
    this.displayData()
    
  }
  ngOnInit(): void {
    // this.displayData()
    this.sortData(this.sort)
  }
  

  more_info_dialog(id:any):void{
    this.dialog.open(MoreInfoDialogComponent, {
      width: '30%',
      data:id
    });
  }

  delete_report_dialog(id:any):void{
    this.dialog.open(DeleteReportDialogComponent, {
      width: '30%',
      data:id
    }).afterClosed().subscribe(res=>{      
      this.displayData()
    })
  }

  create_report_dialog(): void {
    this.dialog.open(DialogComponent).afterClosed().subscribe(data =>{   
        this.Map.addMarker(data.data.name, parseFloat(data.data.latitude), parseFloat(data.data.longitude), data.data.location)
        this.displayData()
      });
    
  }
 
  displayData():void{    
    this.app.getPig().subscribe({next:(res)=>{
      this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(res.body)))
      this.dataSource.sort = this.sort
    },error:(err)=>{
      alert("Error when fetching data")
    }})
  }

  sortData(sort: Sort) {
    this.app.getPig().subscribe({
      next:(response)=>{
        this.data= response.body
      }
    })

    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data;
      return;
    }

    this.sortedData = this.data.sort((a:any, b:any) => {
      
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'location':
          return compare(a.data.location, b.data.location, isAsc);
        case 'reported_by':
          return compare(a.data.name, b.data.name, isAsc);
        case 'time_reported':
          return compare(a.data.time, b.data.time, isAsc);
        case 'status':
          return compare(a.data.status, b.data.status, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource = new MatTableDataSource(this.sortedData)
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}