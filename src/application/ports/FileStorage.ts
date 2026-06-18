/**
 * Port: an abstraction over binary file storage. The application stores and
 * retrieves files (e.g. résumés) through this contract without knowing whether
 * they live on local disk, S3, or anywhere else. The concrete implementation
 * lives in the infrastructure layer.
 */

export interface StoredFile {
  data: Uint8Array;
  contentType: string;
}

export interface FileStorage {
  /**
   * Persist the given bytes and return an opaque storage key that can later be
   * passed to {@link read}.
   */
  save(params: {
    data: Uint8Array;
    contentType: string;
    /** File extension (without the dot) used when deriving the storage key. */
    extension: string;
  }): Promise<string>;

  /**
   * Read the bytes previously stored under `key`, or null if it is absent.
   */
  read(key: string): Promise<StoredFile | null>;
}
