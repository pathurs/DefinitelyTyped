// Type definitions for unzipper 0.8
// Project: https://github.com/ZJONSSON/node-unzipper#readme
// Definitions by: s73obrien <https://github.com/s73obrien>
//                 Nate <https://github.com/natemara>
//                 Bart <https://github.com/bartje321>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2
/// <reference types="node" />

import { Readable, Stream, PassThrough, Duplex } from 'stream';
import { ClientRequest, RequestOptions } from 'http';

export interface PullStream extends Duplex {
    stream(eof: number | string, includeEof: boolean): PassThrough;
    pull(eof: number | string, includeEof: boolean): Promise<Buffer>;
}

export interface EntryProps {
    path: string;
}

export interface EntryExtras {
    signature: number;
    partsize: number;
    uncompressedSize: number;
    compressedSize: number;
    offset: number;
    disknum: number;
}

export interface EntryVars {
    signature?: number;
    versionsNeededToExtract: number;
    flags: number;
    compressionMethod: number;
    lastModifiedTime: number;
    crc32: number;
    compressedSize: number;
    fileNameLength: number;
    extraFieldLength: number;
}

export interface Entry extends PassThrough {
    autodrain(): Promise<void>;
    buffer(): Promise<Buffer>;
    path: string;

    props: EntryProps;

    type: string;
    vars: EntryVars;

    extra: EntryExtras;
}

export interface UnzipSource {
    stream: Readable;
    size: () => Promise<number>;
}

export function unzip(source: UnzipSource, offset: number, _password: string): Entry;

export namespace Open {
    function file(filename: string): Promise<CentralDirectory>;
    function url(request: ClientRequest, opt: string | RequestOptions): Promise<CentralDirectory>;
    function s3(client: any, params: any): Promise<CentralDirectory>;
}

export function BufferStream(entry: Entry): Promise<Buffer>;

export interface CentralDirectoryFile {
    signature: number;
    versionMadeBy: number;
    versionsNeededToExtract: number;
    flags: number;
    compressionMethod: number;
    lastModifiedTime: number;
    lastModifiedDate: number;
    crc32: number;
    compressedSize: number;
    uncompressedSize: number;
    fileNameLength: number;
    extraFieldLength: number;
    fileCommentLength: number;
    diskNumber: number;
    internalFileAttributes: number;
    externalFileAttributes: number;
    offsetToLocalFileHeader: number;
    path: string;
    comment: string;
    stream: (password?: string) => Entry;
    buffer: (password?: string) => Promise<Buffer>;
}

export interface CentralDirectory {
    signature: number;
    diskNumber: number;
    diskStart: number;
    numberOfRecordsOnDisk: number;
    numberOfRecords: number;
    sizeOfCentralDirectory: number;
    offsetToStartOfCentralDirectory: number;
    commentLength: number;
    files: CentralDirectoryFile[];
}

export class ParseOptions {
    verbose?: boolean;
    path?: string;
    // more options?
}

export type ParseStream = PullStream & {
    promise(): Promise<void>;
};

export function Parse(opts?: ParseOptions): ParseStream;
export function ParseOne(match: RegExp, opts: ParseOptions): Duplex;
export function Extract(opts?: ParseOptions): ParseStream;
