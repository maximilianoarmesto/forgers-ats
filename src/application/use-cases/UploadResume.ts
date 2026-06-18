import { ResumeFile } from '@/domain/value-objects/ResumeFile';
import { FileStorage } from '../ports/FileStorage';
import { UploadedResumeDTO } from '../dtos/CandidateDTO';

/**
 * Use Case: store an uploaded résumé and return a reference to it.
 *
 * The PDF/size rules are enforced by the ResumeFile domain value object; the
 * actual persistence of bytes is delegated to the FileStorage port. The
 * returned reference is later attached to a candidate via create/update.
 */
export class UploadResume {
  constructor(private readonly storage: FileStorage) {}

  async execute(input: {
    data: Uint8Array;
    fileName: string;
    contentType: string;
  }): Promise<UploadedResumeDTO> {
    const resume = ResumeFile.create(input);

    const key = await this.storage.save({
      data: resume.data,
      contentType: resume.contentType,
      extension: 'pdf',
    });

    return { key, fileName: resume.fileName };
  }
}
