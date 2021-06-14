import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
let app: INestApplication;
let mod: TestingModule;
let dbConnection: Connection;

const loadInitialData = async (sqlFileName: string) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures, sqlFileName'),
    'utf8',
  );
  const queryRunner = dbConnection.driver.createQueryRunner('master');
};

const emptyEventsList = {
  first: 1,
  last: 0,
  limit: 10,
  total: 0,
  data: [],
};

describe('Events (e2e)', () => {
  // create testing app module
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mod.createNestApplication();

    await app.init();

    dbConnection = app.get(Connection);
  });

  // close testing app after testing
  afterAll(async () => {
    await app.close();
  });

  it('should return an empty list of events', async () => {
    const eventsApp = request(app.getHttpServer());
    const response = await eventsApp.get('/events');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(emptyEventsList);
  });
});
