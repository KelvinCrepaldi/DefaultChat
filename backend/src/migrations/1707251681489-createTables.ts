import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1707251681489 implements MigrationInterface {
    name = 'CreateTables1707251681489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "relationship" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "requesterId" uuid, "addresseeId" uuid, CONSTRAINT "PK_67eb56a3f16da3d901a8ae446a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "creator" character varying NOT NULL, "name" character varying, "admin" character varying, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userRooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL, "userId" uuid, "roomId" uuid, CONSTRAINT "PK_fd2ebc19263608ecd71e562b315" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_49fca182a1b1a17836b265ed04a" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_1db957d7b00dafaab4b36b850ff" FOREIGN KEY ("addresseeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRooms" ADD CONSTRAINT "FK_39d23f4ef4e11fa598cb52c00b7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRooms" ADD CONSTRAINT "FK_5a8c8679cb27549bb7744efb678" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userRooms" DROP CONSTRAINT "FK_5a8c8679cb27549bb7744efb678"`);
        await queryRunner.query(`ALTER TABLE "userRooms" DROP CONSTRAINT "FK_39d23f4ef4e11fa598cb52c00b7"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_1db957d7b00dafaab4b36b850ff"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_49fca182a1b1a17836b265ed04a"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "userRooms"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "relationship"`);
    }

}
