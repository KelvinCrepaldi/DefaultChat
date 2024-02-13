import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomImage1707774966587 implements MigrationInterface {
    name = 'AddRoomImage1707774966587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "image"`);
    }

}
