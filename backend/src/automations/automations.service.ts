import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation } from './automation.entity';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(Automation)
    private automationsRepository: Repository<Automation>,
  ) {}

  async create(createAutomationDto: CreateAutomationDto): Promise<Automation> {
    const automation = this.automationsRepository.create(createAutomationDto);
    return await this.automationsRepository.save(automation);
  }

  async findAll(): Promise<Automation[]> {
    return await this.automationsRepository.find({
      relations: [
        'tool',
        'modified_by',
        'people_roles',
        'people_roles.person',
        'environments',
        'metrics',
        'artifacts',
        'test_data',
        'test_data.spoc'
      ],
    });
  }

  async findOne(air_id: string): Promise<Automation> {
    return await this.automationsRepository.findOne({
      where: { air_id },
      relations: [
        'tool',
        'modified_by',
        'people_roles',
        'people_roles.person',
        'environments',
        'metrics',
        'artifacts',
        'test_data',
        'test_data.spoc'
      ],
    });
  }

  async update(air_id: string, updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    await this.automationsRepository.update(air_id, updateAutomationDto);
    return await this.findOne(air_id);
  }

  async remove(air_id: string): Promise<void> {
    await this.automationsRepository.delete(air_id);
  }

  async search(searchTerm: string): Promise<Automation[]> {
    return await this.automationsRepository
      .createQueryBuilder('automation')
      .leftJoinAndSelect('automation.tool', 'tool')
      .leftJoinAndSelect('automation.modified_by', 'modified_by')
      .leftJoinAndSelect('automation.people_roles', 'people_roles')
      .leftJoinAndSelect('people_roles.person', 'person')
      .leftJoinAndSelect('automation.environments', 'environments')
      .leftJoinAndSelect('automation.metrics', 'metrics')
      .leftJoinAndSelect('automation.artifacts', 'artifacts')
      .leftJoinAndSelect('automation.test_data', 'test_data')
      .leftJoinAndSelect('test_data.spoc', 'spoc')
      .where('automation.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('automation.type ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('automation.brief_description ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('automation.air_id ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('automation.name', 'ASC')
      .getMany();
  }
}
