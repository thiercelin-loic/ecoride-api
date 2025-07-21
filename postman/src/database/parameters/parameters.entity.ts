import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Parameters {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50 })
  property: string;
  @Column({ type: 'varchar', length: 50 })
  value: string;
}
