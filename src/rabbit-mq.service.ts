import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('CARS_SERVICE_RMQ') private readonly client: ClientProxy,
  ) {}

  public send(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise();
  }
}
