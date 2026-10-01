import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionPartnerDto } from './create-mission-partner.dto';

export class UpdateMissionPartnerDto extends PartialType(CreateMissionPartnerDto) {}
