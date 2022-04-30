import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

/**
 * @title Dialog launched from a menu
 */
@Component({
  selector: 'rpe-help-dialog',
  templateUrl: './rpe-help-dialog.component.html',
  styleUrls: ['./rpe-help-dialog.component.css'],
})
export class RpeHelpDialogComponent implements OnInit {
  mapRpeToText: any[] = [
    'Erittäin kevyt',
    'Kevyt',
    'Kohtalainen',
    'Melko kova',
    'Kova',
    '',
    'Todella kova',
    '',
    '',
    'Maksimaalinen'
  ]
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RpeHelpDialogComponent>
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close({ action: 'close' });
  }
}
