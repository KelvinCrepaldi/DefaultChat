import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRequesterAndAddresseed1705795354773 implements MigrationInterface {
    name = 'ChangeRequesterAndAddresseed1705795354773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_a771c552e4c21b59ea44580e3ec"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_509cbba2011d2c3e71b497b1f1d"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP COLUMN "requesterIdId"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP COLUMN "addresseeIdId"`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD "requesterId" uuid`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD "addresseeId" uuid`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_49fca182a1b1a17836b265ed04a" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_1db957d7b00dafaab4b36b850ff" FOREIGN KEY ("addresseeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_1db957d7b00dafaab4b36b850ff"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_49fca182a1b1a17836b265ed04a"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP COLUMN "addresseeId"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP COLUMN "requesterId"`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD "addresseeIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD "requesterIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_509cbba2011d2c3e71b497b1f1d" FOREIGN KEY ("addresseeIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_a771c552e4c21b59ea44580e3ec" FOREIGN KEY ("requesterIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
