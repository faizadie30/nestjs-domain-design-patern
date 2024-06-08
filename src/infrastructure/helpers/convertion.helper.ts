import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertionHelper {
  convertDataToNumber(value: string | number): number {
    if (typeof value === 'string') {
      return Number(value);
    } else if (typeof value === 'number') {
      return value;
    }
  }

  convertDataToString(value: string | number): string {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value.toString();
    }
  }

  convertDataTypeToFloat(value: string | number): number {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else if (typeof value === 'number') {
      return value;
    }
  }
}
