import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class ElectionsController {
  constructor(private readonly electionsService: ElectionsService) {}

  @MessagePattern('createElection')
  create(@Payload() createElectionDto: CreateElectionDto) {
    return this.electionsService.create(createElectionDto);
  }

  @MessagePattern('findAllElections')
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.electionsService.findAll(paginationDto);
  }

  @MessagePattern('findOneElection')
  findOne(@Payload('id',ParseIntPipe) id: number) {
    return this.electionsService.findOne(id);
  }

  @MessagePattern('updateElection')
  update(@Payload() updateElectionDto: UpdateElectionDto) {
    return this.electionsService.update(updateElectionDto.id, updateElectionDto);
  }

  @MessagePattern('removeElection')
  remove(@Payload('id',ParseIntPipe) id: number) {
    return this.electionsService.remove(id);
  }

  @MessagePattern('getallsubelections')
  findAllsubelections(@Payload('id',ParseIntPipe) id: number) {
    return this.electionsService.findAllsubelection(id);
  }
}
