import { InvalidResumeFileError } from '../errors/DomainError';

/**
 * ResumeFile — a Value Object capturing the business rules for an uploaded
 * résumé: it must be a PDF and must not exceed the maximum allowed size. The
 * raw bytes are carried as a Uint8Array so the domain stays free of any
 * runtime-specific type (e.g. Node's Buffer).
 */
export class ResumeFile {
  static readonly ALLOWED_CONTENT_TYPE = 'application/pdf';
  static readonly MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  private constructor(
    readonly data: Uint8Array,
    readonly fileName: string,
    readonly contentType: string,
  ) {}

  static create(params: { data: Uint8Array; fileName: string; contentType: string }): ResumeFile {
    const fileName = params.fileName.trim();

    const looksLikePdf =
      params.contentType === ResumeFile.ALLOWED_CONTENT_TYPE &&
      fileName.toLowerCase().endsWith('.pdf');
    if (!looksLikePdf) {
      throw new InvalidResumeFileError('Résumé must be a PDF file.');
    }

    if (params.data.byteLength === 0) {
      throw new InvalidResumeFileError('Résumé file is empty.');
    }

    if (params.data.byteLength > ResumeFile.MAX_SIZE_BYTES) {
      throw new InvalidResumeFileError(
        `Résumé exceeds the maximum size of ${ResumeFile.MAX_SIZE_BYTES} bytes.`,
      );
    }

    return new ResumeFile(params.data, fileName, params.contentType);
  }
}
