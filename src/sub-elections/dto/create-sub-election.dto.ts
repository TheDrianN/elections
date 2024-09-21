import {  IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateSubElectionDto {

    @IsNumber()
    @Min(1)
    public election_id: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    public chapter_id: number;

    @IsString()
    public title: string;

    @IsString()
    public description: string;
}
