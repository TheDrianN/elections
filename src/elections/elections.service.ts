import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ElectionsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log("Data base connected");
  }

  create(createElectionDto: CreateElectionDto) {
    return this.elections.create({
      data: createElectionDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
  
    const totalPage = await this.elections.count();
    const lastPage = Math.ceil(totalPage / limit);
  
    // Mapeo de los códigos de estado a descripciones
    const statusMap = {
      'P': 'Pendiente',
      'E': 'En Proceso',
      'F': 'Finalizado'
    };
  
    const elections = await this.elections.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  
    // Transformar los resultados para reemplazar los códigos de estado
    const data = elections.map(election => ({
      ...election,
      status: statusMap[election.status] || election.status,
    }));
  
    return {
      data,
      meta: {
        total: totalPage,
        page,
        lastPage
      }
    };
  }

  async findOne(id: number) {
    const election = await this.elections.findFirst({
      where: {id}
    });

    if(!election){
      throw new RpcException({
        message:`El voto con el id ${id} no existe`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return {
      status:HttpStatus.ACCEPTED,
      data: election
    };

  }

  async update(id: number, updateElectionDto: UpdateElectionDto) {
    const {id:_,...data} = updateElectionDto;

    await this.findOne(id);

    return this.elections.update({
      where: {id},
      data: data
    });

  }

  async remove(id: number) {
    await this.findOne(id);

    const subelection = await this.subElections.findFirst({
      where:{
        election_id: id
      }
    });

    if(subelection){
      throw new RpcException({
        message:`Eleccion ${id} no se puede eliminar`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    const election = await this.elections.delete({
      where: {id},
    })

    return {
      status:HttpStatus.ACCEPTED,
      data: election
    };
  }

  async findAllsubelection(id:number){
    try{
      const subelection = await this.subElections.findMany({
        where:{
          election_id: id
        },include:{
          election:{
            
          }
        }
      })
  
      return {
        status:HttpStatus.ACCEPTED,
        data: subelection
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener las subelecciones',
      };
    }

    
  }
}
