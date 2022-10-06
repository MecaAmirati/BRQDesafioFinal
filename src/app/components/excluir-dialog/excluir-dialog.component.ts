import { CarroInterface } from '../../model/carros.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-excluir-dialog',
  templateUrl: './excluir-dialog.component.html',
  styleUrls: ['./excluir-dialog.component.scss']
})
export class ExcluirDialogComponent implements OnInit {
  texto:string="Olar"
  constructor(
    public dialogRef: MatDialogRef<ExcluirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string
  ) { }

  ngOnInit(): void {
  }
  confirmExclude(){
    this.dialogRef.close(true);
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
