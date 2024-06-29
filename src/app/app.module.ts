import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { apiURL } from './services/config';

const config: SocketIoConfig = { url: apiURL, options: {} };

@NgModule({
  declarations: [],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
  providers: [SocketIoModule],
})
export class AppModule {}
