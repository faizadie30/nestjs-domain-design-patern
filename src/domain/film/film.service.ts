import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { CreateFilmDto } from '../../app/dto/createFilm.dto';
import { FindAllFilmsDTO } from '../../app/dto/findAllFilms.dto';
import { UpdateFilmDTO } from '../../app/dto/updateFilm.dto';
import { AllListFilmsInterface } from '../../app/interface/allListFilm.interface';
import { FindFilmByIdInterface } from '../../app/interface/findFilmById.interface';
import { ConvertionHelper } from '../../infrastructure/helpers/convertion.helper';
import { GlobalHelper } from '../../infrastructure/helpers/global.helper';
import { Films } from '../../infrastructure/models/films.model';
import { CreateBodyFilmDto } from '../../app/dto/createBodyFilm.dto';
import { createFilmInterface } from '../../app/interface/createFilm.interface';
import { UpdateBodyFilmDTO } from '../../app/dto/updateBodyFilm.dto';
import { updateFilmInterface } from '../../app/interface/updateFilm.interface';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,
    private readonly convertionHelper: ConvertionHelper,
    private readonly globalHelper: GlobalHelper,
  ) {}

  async findAll(query: FindAllFilmsDTO): Promise<AllListFilmsInterface> {
    const { limit, page } = query;

    const setLimiter = !limit
      ? 10
      : this.convertionHelper.convertDataToNumber(limit);
    const setPage =
      !page || page == '1'
        ? 1
        : this.convertionHelper.convertDataToNumber(page);

    const offset = (setPage - 1) * setLimiter;

    const queryBuilder = await this.filmsRepository.createQueryBuilder('films');
    const data = await queryBuilder
      .orderBy('films.title', 'ASC')
      .skip(offset)
      .take(setLimiter)
      .cache(60000)
      .getMany();

    const countAll = await queryBuilder.cache(60000).getCount();
    const countPage = Math.ceil(countAll / setLimiter);

    const dataPaginate = this.globalHelper.generatePagination(
      'films',
      setPage,
      setLimiter,
      countPage,
      countAll,
      '',
    );

    return {
      status: 'success',
      data,
      paginate: dataPaginate,
    };
  }

  async findById(id: string): Promise<FindFilmByIdInterface> {
    const data = await this.filmsRepository.findOneBy({
      id: this.convertionHelper.convertDataToNumber(id),
    });

    if (data) {
      data.id = this.convertionHelper.convertDataToNumber(data.id);
    }

    return {
      status: 'success',
      data,
    };
  }

  async create(
    createBodyFilmDTO: CreateBodyFilmDto,
  ): Promise<createFilmInterface> {
    await this.filmsRepository.save(createBodyFilmDTO);
    return {
      status: 'Success',
      message: 'Created on success',
    };
  }

  async update(
    id: string,
    updateBodyFilmDTO: UpdateBodyFilmDTO,
  ): Promise<updateFilmInterface> {
    const getFilm = await this.filmsRepository.findOneBy({
      id: this.convertionHelper.convertDataToNumber(id),
    });

    if (!getFilm) {
      throw new NotFoundException('Film not found');
    }

    await this.filmsRepository
      .createQueryBuilder('user')
      .update(Films)
      .set(updateBodyFilmDTO)
      .where('id = :id', {
        id: this.convertionHelper.convertDataToNumber(id),
      })
      .execute();

    return {
      status: 'Success',
      message: 'Update on success',
    };
  }

  async createWithUploadFile(
    createFilmDTO: CreateFilmDto,
    imageThumbnail: Express.Multer.File,
  ): Promise<any> {
    console.log('createFilmDTO', createFilmDTO);
    console.log('imageThumbnail', imageThumbnail);
    return {
      status: 'success',
      message: 'create film successfully',
    };
  }

  async updateWithUploadFile(
    id: string,
    updateFilmDTO: UpdateFilmDTO,
    imageThumbnail: Express.Multer.File,
  ): Promise<any> {
    const getFilm = await this.filmsRepository.findOneBy({
      id: this.convertionHelper.convertDataToNumber(id),
    });

    if (!getFilm) {
      throw new NotFoundException('Film not found');
    }
    console.log('id', id);
    console.log('updateFilmDTO', updateFilmDTO);
    console.log('imageThumbnail', imageThumbnail);
    return {
      status: 'success',
      message: 'update film successfully',
    };
  }

  async deleteFilm(id: string): Promise<any> {
    const getFilm = await this.filmsRepository.findOneBy({
      id: this.convertionHelper.convertDataToNumber(id),
    });

    if (!getFilm) {
      throw new NotFoundException('Film not found');
    }

    return await this.filmsRepository
      .createQueryBuilder('films')
      .delete()
      .from(Films)
      .where('films.id = :id', { id })
      .execute();
  }

  private createFileName(fileName: string): string {
    return `${+new Date()}${this.getFileExtension(fileName)}`;
  }

  private getFileExtension(fileName: string): string {
    return extname(fileName);
  }

  private createFolder(folder: any): void {
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
  }
}
