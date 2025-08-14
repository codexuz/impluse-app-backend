import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { Movie } from './entities/movie.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie)
    private movieModel: typeof Movie,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieModel.create({
      ...createMovieDto,
      views: 0, // Initialize views to 0
    });
  }

  async findAll(query?: { genre?: string; type?: string; level?: string }): Promise<Movie[]> {
    const where: any = {};
    
    if (query?.genre) {
      where.genre = query.genre;
    }
    if (query?.type) {
      where.type = query.type;
    }
    if (query?.level) {
      where.level = query.level;
    }

    return await this.movieModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async search(searchTerm: string): Promise<Movie[]> {
    return await this.movieModel.findAll({
      where: {
        title: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      order: [['title', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    
    // Increment view count and return updated movie
    return this.incrementViewCount(id);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    await movie.update(updateMovieDto);
    return movie;
  }

  async remove(id: string): Promise<void> {
    const movie = await this.findOne(id);
    await movie.destroy(); // This will be a soft delete since paranoid is true
  }

  async restore(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByPk(id, { paranoid: false });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await movie.restore();
    return movie;
  }

  async hardRemove(id: string): Promise<void> {
    const movie = await this.findOne(id);
    await movie.destroy({ force: true }); // This will be a permanent delete
  }

  async incrementViewCount(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByPk(id);
    
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    
    await movie.increment('views');
    
    return movie.reload();
  }
}
