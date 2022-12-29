import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as fsExtra from 'fs-extra';

@Processor('cleanup-operation')
export class BullFileConsumerService {
  @Process('cleanup-dir')
  async fileOperation(job: Job) {
    const dir = job.data;
    fsExtra.emptyDirSync(dir.path);
  }
}
