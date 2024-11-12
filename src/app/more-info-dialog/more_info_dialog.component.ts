import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../pigTrackerService/api.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StatusChangeComponent } from '../status-change/status-change.component';

@Component({
  selector: 'app_more_info_dialog',
  templateUrl: './more-info-dialog.component.html',
  styleUrls: ['./more-info-dialog.component.css']
})
export class MoreInfoDialogComponent implements OnInit{
  dataSource;
  displayedColumns: string[] = [];
  constructor(private api:ApiService, private dialogRef: MatDialogRef<MoreInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any, public dialog: MatDialog){
    this.dataSource = (this.data)
    console.log("datasource: "+this.data.key)
    
  }
  
  ngOnInit(): void {
    console.log(this.dataSource)
  }
  
  cancel(){
    this.dialogRef.close();
  }

  save(){
    this.dialogRef.close();
  }

  openDialog(id:any): void {
    this.dialog.open(StatusChangeComponent, {
      width: '40%',
      data:id
    });
  }
}
