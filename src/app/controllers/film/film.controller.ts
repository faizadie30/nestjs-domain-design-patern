import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindAllFilmsDTO } from '../../../app/dto/findAllFilms.dto';
import { AllListFilmsInterface } from '../../../app/interface/allListFilm.interface';
import { FindFilmByIdInterface } from '../../../app/interface/findFilmById.interface';
import { FilmService } from '../../../domain/film/film.service';
import { PublicRoute } from '../../../infrastructure/decorator/public-route.decorator';
import { JWTAuthGuard } from '../../../infrastructure/guard/jwt.guard';

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

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(204)
  @ApiParam({ name: 'id', type: 'string' })
  async delete(@Param('id') id: string): Promise<any> {
    try {
      return await this.filmService.deleteFilm(id);
    } catch (error) {
      throw error;
    }
  }
}
