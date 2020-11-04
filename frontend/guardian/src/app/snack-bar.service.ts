import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {
  }

  public warn(message): void {
    this.snackBar.open(message, undefined, {
      duration: 5000
    });
  }

  public info(message): void {
    this.snackBar.open(message);
  }
}
