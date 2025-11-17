declare module 'exif-js' {
  interface EXIFStatic {
    getData(img: string | HTMLImageElement, callback: (this: HTMLImageElement) => void): void
    getTag(img: HTMLImageElement | string, tag: string): unknown
    getAllTags(img: HTMLImageElement | string): Record<string, unknown>
    pretty(img: HTMLImageElement | string): string
  }

  const EXIF: EXIFStatic
  export default EXIF
}
