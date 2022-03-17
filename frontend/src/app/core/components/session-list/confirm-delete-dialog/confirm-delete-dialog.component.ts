import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
/**
 * @title Dialog launched from a menu
 */
@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  close(): void {
    this.dialogRef.close({ action: 'close' });
  }
}
