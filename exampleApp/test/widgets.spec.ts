import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { JSDOM } from 'jsdom'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminCoreModuleFactory } from 'nestjs-admin'
import { UserModule } from '../src/user/user.module'
import { TestAuthModule } from './testAuth/testAuth.module'

describe('widgets', () => {
  let app: INestApplication
  let document: Document

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        UserModule,
        TestAuthModule,
        AdminCoreModuleFactory.createAdminCoreModule({}),
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  afterAll(async () => {
    await app.close()
  })

  it('renders all options for an enum', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get(`/admin/user/user/add`)

    expect(res.status).toBe(200)

    document.documentElement.innerHTML = res.text
    expect(document.querySelector('select[name="gender"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value=""]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="male"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="female"]')).toBeTruthy()
    expect(document.querySelector('select[name="gender"] option[value="other"]')).toBeTruthy()
  })
})
