export interface BlockSerializer {
  stringify: (blockData: any) => string;
  parse: (str: string) => any;
}