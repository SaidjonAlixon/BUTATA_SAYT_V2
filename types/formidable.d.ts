declare module "formidable" {
  import type { IncomingMessage } from "http";
  interface Options {
    maxFileSize?: number;
    maxFiles?: number;
    keepExtensions?: boolean;
    [key: string]: unknown;
  }
  interface File {
    filepath: string;
    originalFilename: string | null;
    newFilename?: string | null;
    mimetype?: string | null;
    size: number;
  }
  interface Fields {
    [key: string]: string[] | undefined;
  }
  interface Files {
    [key: string]: File | File[] | undefined;
  }
  interface FormidableInstance {
    parse(req: IncomingMessage): Promise<[Fields, Files]>;
  }
  function formidable(options?: Options): FormidableInstance;
  export default formidable;
}
