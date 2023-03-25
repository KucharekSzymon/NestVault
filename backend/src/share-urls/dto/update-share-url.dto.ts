import { PartialType } from '@nestjs/swagger';
import { CreateShareLinkDto } from './create-share-url.dto';

export class UpdateFileDto extends PartialType(CreateShareLinkDto) {}
