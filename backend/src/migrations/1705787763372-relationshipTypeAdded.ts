import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationshipTypeAdded1705787763372 implements MigrationInterface {
    name = 'RelationshipTypeAdded1705787763372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationship" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationship" DROP COLUMN "type"`);
    }

}
