import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Films {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  image_thumbnail: string;
}
