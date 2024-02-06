import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomsTables1705965270952 implements MigrationInterface {
    name = 'CreateRoomsTables1705965270952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "creator" character varying NOT NULL, "name" character varying, "admin" character varying, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userRooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL, "userId" uuid, "roomId" uuid, CONSTRAINT "PK_fd2ebc19263608ecd71e562b315" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "userRooms" ADD CONSTRAINT "FK_39d23f4ef4e11fa598cb52c00b7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRooms" ADD CONSTRAINT "FK_5a8c8679cb27549bb7744efb678" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userRooms" DROP CONSTRAINT "FK_5a8c8679cb27549bb7744efb678"`);
        await queryRunner.query(`ALTER TABLE "userRooms" DROP CONSTRAINT "FK_39d23f4ef4e11fa598cb52c00b7"`);
        await queryRunner.query(`DROP TABLE "userRooms"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
