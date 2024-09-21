import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSubElectionDto } from './dto/create-sub-election.dto';
import { UpdateSubElectionDto } from './dto/update-sub-election.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubElectionsService extends PrismaClient implements OnModuleInit{
  onModuleInit() {
    this.$connect();
    console.log("Data base connected");
  }

  create(createSubElectionDto: CreateSubElectionDto) {
    return this.subElections.create({
      data:createSubElectionDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const {page,limit} = paginationDto;

    const totalPages = await this.subElections.count();

    const lastPage = Math.ceil(totalPages / limit);

    const datasubelection = await this.subElections.findMany({
      skip: (page -1) * limit,
      take: limit,
      include:{
        election:true
      }
    });

    console.log(datasubelection)

    return{
      data: datasubelection
      ,
      meta:{
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const subelection = await this.subElections.findFirst({
      where: {id},
    });

    if(!subelection){
      throw new RpcException({
        message:`El voto con el id ${id} no existe`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return {
      data:subelection,
      status:HttpStatus.ACCEPTED
    }
  }

  async update(id: number, updateSubElectionDto: UpdateSubElectionDto) {
    const {id:_,...data} = updateSubElectionDto;

    await this.findOne(id);
    console.log(data)
    
    return this.subElections.update({
      where:{id},
      data:data,
    })



  }

  async remove(id: number) {
    await this.findOne(id);

    const subelection = await this.subElections.update({
      where:{id},
      data:{
        title:'Hola'
      }
    })

    return subelection;
  }

  async finAllSubElectionbyStatus(){
    const electionstatus = await this.elections.findFirst({
      where:{
        status:'P'
      }
    })



    const subElections = await this.subElections.findMany({
      where:{
        election_id: electionstatus.id
      }
    })

    return {
      status:HttpStatus.ACCEPTED,
      data:subElections
    }


  }
}
