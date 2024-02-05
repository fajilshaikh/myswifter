import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MenuJson } from '../_helper/Menu';
import { NavigationEnd, Router } from '@angular/router';
import { LoginSession } from '../_models/login';
import { isPlatformBrowser } from '@angular/common';
import { filter, first } from 'rxjs';
import { ApiService } from '../_services';
import * as SN from '../_services/Services';
import { apiResponse } from '../_models/apiResponse';


interface Tab {
  label: string;
  route: string;
  urls: string[];
}

@Component({
  selector: 'app-after-login',
  templateUrl: './after-login.component.html',
  styleUrl: './after-login.component.css'
})
export class AfterLoginComponent {
  menuItems = MenuJson;
  tabs: Tab[] = [];
  selectedPage: any = "";
  CurrentUrl = this.router.url;
  UserLogin: LoginSession | any;

  navbarVisible = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.checkScreenWidth(); // Initial check

    this.CurrentUrl = this.router.url;
    this.CurrentUrl = this.CurrentUrl.split('?')[0];
    const tabs = this.findMenuByRoute(this.CurrentUrl);
    if (tabs) this.tabs = tabs;
    this.findTabsByRoute();
    
    this.UserLogin = this.apiService.UserSession;
    console.log(this.UserLogin);

    if (!this.UserLogin) {
      localStorage.removeItem('loginUser');
      window.location.href = '/';
    }
  }
  ngAfterViewInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.CurrentUrl = this.router.url;
      this.CurrentUrl = this.CurrentUrl.split('?')[0];
      this.tabs = this.findMenuByRoute(this.CurrentUrl) || [];
      this.findTabsByRoute();
    });
  }
  findMenuByRoute(route: string): any[] | undefined {
    route = route.split('?')[0];

    const menuItem = this.menuItems.find(item =>
      item?.urls.includes(route)
    );

    return menuItem ? menuItem.tabs : undefined;
  }

  findTabsByRoute() {

    const tabs = [...this.tabs];
    const CurrentTabObject = tabs.find(item =>
      item?.urls.includes(this.CurrentUrl)
    );

    this.selectedPage = CurrentTabObject?.route;
  }
  isActive(item: any): boolean {
    item.route = item.route.split('?')[0];
    return this.router.isActive(item.route, true) || item.urls.includes(this.CurrentUrl);
  }

  sidebarMiniActive = false;

  onDropdownChange(event: any) {
    const selectedValue = event;
    this.router.navigate([selectedValue]);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  toggleHeader() {
    // Toggle the visibility on button click
    this.isHeaderVisible = !this.isHeaderVisible;
  }
  checkScreenWidth() {
    // Check the screen width and update visibility
    // this.isHeaderVisible = window.innerWidth <= this.maxWidth && this.isHeaderVisible;
    if (isPlatformBrowser(this.platformId)) {
      // Code that requires the window object can be safely executed here
      this.isHeaderVisible = window.innerWidth <= this.maxWidth && this.isHeaderVisible;
    }
  }

  toggleSidebar() {
    this.sidebarMiniActive = !this.sidebarMiniActive;

    // Toggle the class 'sidebar-mini' on the 'body' element
    if (this.sidebarMiniActive) {
      document.body.classList.add('sidebar-mini');
    } else {
      document.body.classList.remove('sidebar-mini');
    }

    // Trigger window resize event to adjust layout
    window.dispatchEvent(new Event('resize'));
  }

  toggleNavbar() {
    const body: any = document.querySelector('body');
    const toggle: any = document.querySelector('.navbar-toggle');

    if (this.navbarVisible) {
      body.classList.remove('nav-open');
      this.navbarVisible = false;
      setTimeout(() => {
        toggle.classList.remove('toggled');
        this.removeBodyClick();
      }, 550);
    } else {
      setTimeout(() => {
        toggle.classList.add('toggled');
      }, 580);

      const bodyClickDiv = document.createElement('div');
      bodyClickDiv.id = 'bodyClick';
      document.body.appendChild(bodyClickDiv);

      bodyClickDiv.addEventListener('click', () => {
        body.classList.remove('nav-open');
        this.navbarVisible = false;
        setTimeout(() => {
          toggle.classList.remove('toggled');
          this.removeBodyClick();
        }, 550);
      });

      body.classList.add('nav-open');
      this.navbarVisible = true;
    }
  }
  private removeBodyClick() {
    const bodyClickDiv = document.getElementById('bodyClick');
    if (bodyClickDiv) {
      bodyClickDiv.remove();
    }
  }

  isHeaderVisible = false; // Set default visibility to hidden
  maxWidth = 767.98;
  Logout() {
    const req = {
      'EmployeeId': this.UserLogin.EmployeeId
    }
    this.apiService.CallService(SN.UserLogout, req).pipe(first()).subscribe((resp: apiResponse) => {
      console.log(resp);
      if (resp.status == '1') {
        localStorage.removeItem('lgusr');
        this.router.navigate(['/login']);
      } else {

      }
    },
      (error: any) => {
      });
  }

}
