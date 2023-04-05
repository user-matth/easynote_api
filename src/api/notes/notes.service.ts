import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ResponseNoteDto } from './dto/create-note.dto';

interface NoteParams {
  title?: string;
  description?: string;
  status?: boolean;
  user_id?: number
}

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) { }

  async create({ title, description, status, user_id }: NoteParams) {
    try {
      const note = await this.prismaService.note.create({
        data: {
          title,
          description,
          status,
          user_id
        }
      })
      if (!note) throw new NotFoundException()
      return new ResponseNoteDto(note)
    } catch (error) {
      return new HttpException(error.status, error.message)
    }
  }

  async findAll() {
    try {
      const notes = await this.prismaService.note.findMany({})
      if (!notes) throw new NotFoundException()
      return notes.map((notes) => new ResponseNoteDto(notes))
    } catch (error) {
      return new HttpException(error.status, error.message)
    }
  }

  async findOne( id: number ) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: {
          id
        }
      })
      if (!note) throw new NotFoundException()
      return new ResponseNoteDto(note)
    } catch (error) {
      return new HttpException(error.status, error.message)
    }
  }

  async update( id: number, { title, description, status, user_id }: NoteParams ) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: {
          id
        }
      })
      if (!note) throw new NotFoundException()
      const note_update = await this.prismaService.note.update({
        where: {
          id
        }, data: {
          title, 
          description, 
          status, 
          user_id
        }
      })
      return new ResponseNoteDto(note_update)
    } catch (error) {
      return new HttpException(error.status, error.message)
    }
  }

  async remove( id: number ) {
    try {
      const note = await this.prismaService.note.delete({
        where: {
          id
        }
      })
      if (!note) throw new NotFoundException()
    } catch (error) {
      return new HttpException(error.status, error.message)
    }
  }
}
