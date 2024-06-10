import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage, StorageEngine } from 'multer';

@Injectable()
export class UploadLocalService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const uploadPath = `./public/uploads/${randomName}${extname(file.originalname)}`;

    // Melakukan penyimpanan file menggunakan multer
    const storageEngine: StorageEngine = diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    });

    return new Promise((resolve, reject) => {
      storageEngine._handleFile(null, file, (error) => {
        if (error) {
          reject(error);
        } else {
          // Mengembalikan URL yang sesuai setelah upload selesai
          const url = `http://localhost:3000/uploads/${randomName}${extname(file.originalname)}`;
          resolve(url);
        }
      });
    });
  }
}
