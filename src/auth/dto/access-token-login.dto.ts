import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenLoginDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}
