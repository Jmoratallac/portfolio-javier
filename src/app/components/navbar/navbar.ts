import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animationFrame: number | null = null;

  readonly activeSection = signal('hero');

  private readonly sectionIds = [
    'hero',
    'about',
    'experience',
    'projects',
    'skills',
    'contact',
  ];

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateActiveSection();
    window.addEventListener('scroll', this.handleViewportChange, { passive: true });
    window.addEventListener('resize', this.handleViewportChange);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    window.removeEventListener('scroll', this.handleViewportChange);
    window.removeEventListener('resize', this.handleViewportChange);

    if (this.animationFrame !== null) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  private readonly handleViewportChange = (): void => {
    if (this.animationFrame !== null) {
      return;
    }

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = null;
      this.updateActiveSection();
    });
  };

  private updateActiveSection(): void {
    const pageBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

    if (pageBottom) {
      this.activeSection.set('contact');
      return;
    }

    const activationLine = Math.min(window.innerHeight * 0.36, 280);
    const activeId = this.sectionIds.find((id) => {
      const section = document.getElementById(id);

      if (!section) {
        return false;
      }

      const rect = section.getBoundingClientRect();
      return rect.top <= activationLine && rect.bottom > activationLine;
    });

    if (activeId) {
      this.activeSection.set(activeId);
    }
  }
}
