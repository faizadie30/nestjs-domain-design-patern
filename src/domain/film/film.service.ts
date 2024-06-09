import { Injectable } from '@nestjs/common';
import { ConvertionHelper } from '../../infrastructure/helpers/convertion.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from '../../infrastructure/models/films.model';
import { GlobalHelper } from '../../infrastructure/helpers/global.helper';
import { AllListFilmsInterface } from '../../app/interface/allListFilm.interface';
import { FindAllFilmsDTO } from '../../app/dto/findAllFilms.dto';
import { FindFilmByIdInterface } from '../../app/interface/findFilmById.interface';

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
}
