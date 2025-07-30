import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private overlayRef?: OverlayRef;

  constructor(private overlay: Overlay) {}

  show(
    message: string,
    type: 'success' | 'warn' | 'error' = 'success',
    duration: number = 3000
  ) {
    // Remove existing overlay
    this.overlayRef?.dispose();

    // Create overlay
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .bottom('32px'),
      hasBackdrop: false,
    });

    const snackbarPortal = new ComponentPortal(SnackbarComponent);
    const componentRef = this.overlayRef.attach(snackbarPortal);

    componentRef.instance.message = message;
    componentRef.instance.type = type;

    setTimeout(() => {
      this.overlayRef?.detach();
    }, duration);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  warn(message: string, duration?: number) {
    this.show(message, 'warn', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }
}
