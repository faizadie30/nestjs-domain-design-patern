import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FindAllFilmsDTO } from '../../../app/dto/findAllFilms.dto';
import { AllListFilmsInterface } from '../../../app/interface/allListFilm.interface';
import { FilmService } from '../../../domain/film/film.service';
import { PublicRoute } from '../../../infrastructure/decorator/public-route.decorator';
import { FindFilmByIdInterface } from '../../../app/interface/findFilmById.interface';

@ApiTags('Films')
@PublicRoute()
@Controller('api/films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  @HttpCode(200)
  async findAll(
    @Query() query: FindAllFilmsDTO,
  ): Promise<AllListFilmsInterface> {
    try {
      return await this.filmService.findAll(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', type: 'string' })
  async findByID(@Param('id') id: string): Promise<FindFilmByIdInterface> {
    try {
      return await this.filmService.findById(id);
    } catch (error) {
      throw error;
    }
  }
}
