import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubElectionsService } from './sub-elections.service';
import { CreateSubElectionDto } from './dto/create-sub-election.dto';
import { UpdateSubElectionDto } from './dto/update-sub-election.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class SubElectionsController {
  constructor(private readonly subElectionsService: SubElectionsService) {}

  @MessagePattern('createSubElection')
  create(@Payload() createSubElectionDto: CreateSubElectionDto) {
    return this.subElectionsService.create(createSubElectionDto);
  }

  @MessagePattern('findAllSubElections')
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.subElectionsService.findAll(paginationDto);
  }

  @MessagePattern('findOneSubElection')
  findOne(@Payload('id',ParseIntPipe) id: number) {
    return this.subElectionsService.findOne(id);
  }

  @MessagePattern('updateSubElection')
  update(@Payload() updateSubElectionDto: UpdateSubElectionDto) {
    return this.subElectionsService.update(updateSubElectionDto.id, updateSubElectionDto);
  }

  @MessagePattern('removeSubElection')
  remove(@Payload('id',ParseIntPipe) id: number) {
    return this.subElectionsService.remove(id);
  }

  @MessagePattern('finAllSubElectionbyStatus')
  finAllSubElectionbyStatus() {
    return this.subElectionsService.finAllSubElectionbyStatus();
  }

}
