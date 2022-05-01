import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reliability-warning-dialog',
  templateUrl: './reliability-warning-dialog.component.html',
  styleUrls: ['./reliability-warning-dialog.component.css'],
})
export class ReliabilityWarningDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ReliabilityWarningDialogComponent>
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close({ action: 'close' });
  }
}
