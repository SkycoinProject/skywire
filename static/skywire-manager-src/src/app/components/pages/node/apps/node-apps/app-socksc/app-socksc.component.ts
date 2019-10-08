import { Component, Input } from '@angular/core';
import { SockscStartupComponent } from './socksc-startup/socksc-startup.component';
import { SockscConnectComponent } from './socksc-connect/socksc-connect.component';
import { Keypair } from '../../../../../../app.datatypes';
import {MenuItem, NodeAppButtonComponent} from '../node-app-button/node-app-button.component';

@Component({
  selector: 'app-app-socksc',
  templateUrl: '../node-app-button/node-app-button.component.html',
  styleUrls: ['./app-socksc.component.css', '../node-app-button/node-app-button.component.scss']
})
export class AppSockscComponent extends NodeAppButtonComponent {
  @Input() nodeInfo;

  title = 'apps.socksc.title';
  name = 'socksc';

  startApp(): void {
    this.connect();
  }

  connect() {
    this.dialog
      .open(SockscConnectComponent, {
        data: {
          discoveries: [],
        },
        width: '800px'
      })
      .afterClosed()
      .subscribe((keypair: Keypair) => {
        if (keypair) {
          this.setLoading();
          // this.appsService.startSocksc(keypair.nodeKey, keypair.appKey).subscribe(undefined, () => {
          //   this.setLoading(false);
          // });
        }
      });
  }

  showStartupConfig() {
    this.dialog.open(SockscStartupComponent);
  }

  protected getMenuItems(): MenuItem[] {
    return [{
      name: 'apps.menu.startup-config',
      callback: this.showStartupConfig.bind(this),
      enabled: true
    }, {
      name: 'apps.menu.log',
      callback: this.showLog.bind(this),
      enabled: this.isRunning
    }];
  }
}
