import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Speciality } from '../speciality/entity/speciality.entity';
import { Service } from '../service/entity/service.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { UsualTimeslot } from '../time-slot/entity/usual-time-slot.entity';
import { SpecificTimeslot } from '../time-slot/entity/specific-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
          Speciality,
          Service,
          Appointment,
          UsualTimeslot,
          SpecificTimeslot,
        ],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
