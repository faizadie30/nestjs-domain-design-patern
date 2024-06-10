import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateFilmDto } from '../../../app/dto/createFilm.dto';
import { FindAllFilmsDTO } from '../../../app/dto/findAllFilms.dto';
import { UpdateFilmDTO } from '../../../app/dto/updateFilm.dto';
import { AllListFilmsInterface } from '../../../app/interface/allListFilm.interface';
import { FindFilmByIdInterface } from '../../../app/interface/findFilmById.interface';
import { FilmService } from '../../../domain/film/film.service';
import { PublicRoute } from '../../../infrastructure/decorator/public-route.decorator';
import { JWTAuthGuard } from '../../../infrastructure/guard/jwt.guard';
import { CustomUploadFileTypeValidator } from '../../../infrastructure/validators/image.validators';
import { imageOptions } from '../../../infrastructure/interceptor/image.interceptor';
import { CreateBodyFilmDto } from '../../../app/dto/createBodyFilm.dto';
import { createFilmInterface } from '../../../app/interface/createFilm.interface';
import { UpdateBodyFilmDTO } from '../../../app/dto/updateBodyFilm.dto';
import { updateFilmInterface } from '../../../app/interface/updateFilm.interface';

@ApiTags('Films')
@Controller('api/films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @PublicRoute()
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

  @PublicRoute()
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

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  async create(
    @Body() createBodyFilmDTO: CreateBodyFilmDto,
  ): Promise<createFilmInterface> {
    return await this.filmService.create(createBodyFilmDTO);
  }

  @UseGuards(JWTAuthGuard)
  @Put(':id')
  @HttpCode(201)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateBodyFilmDTO: UpdateBodyFilmDTO,
  ): Promise<updateFilmInterface> {
    return await this.filmService.update(id, updateBodyFilmDTO);
  }

  @UseGuards(JWTAuthGuard)
  @Post('create-with-upload-file')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_thumbnail', imageOptions))
  async createWithUploadFile(
    @Body() createFilmDTO: CreateFilmDto,
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    imageThumbnail: Express.Multer.File,
  ): Promise<any> {
    try {
      return await this.filmService.createWithUploadFile(
        createFilmDTO,
        imageThumbnail,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JWTAuthGuard)
  @Put('update-with-upload-file/:id')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_thumbnail'))
  @ApiParam({ name: 'id', type: 'string' })
  async updateWithUploadFile(
    @Param('id') id: string,
    @Body() updateFilmDTO: UpdateFilmDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: ['image/jpeg', 'image/png', 'image/jpg', 'image/svg'],
          }),
        )
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    imageThumbnail: Express.Multer.File,
  ): Promise<any> {
    try {
      return await this.filmService.updateWithUploadFile(
        id,
        updateFilmDTO,
        imageThumbnail,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
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
