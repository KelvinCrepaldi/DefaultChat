import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1705787530564 implements MigrationInterface {
    name = 'CreateDatabase1705787530564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "relationship" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "requesterIdId" uuid, "addresseeIdId" uuid, CONSTRAINT "PK_67eb56a3f16da3d901a8ae446a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_a771c552e4c21b59ea44580e3ec" FOREIGN KEY ("requesterIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "relationship" ADD CONSTRAINT "FK_509cbba2011d2c3e71b497b1f1d" FOREIGN KEY ("addresseeIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_509cbba2011d2c3e71b497b1f1d"`);
        await queryRunner.query(`ALTER TABLE "relationship" DROP CONSTRAINT "FK_a771c552e4c21b59ea44580e3ec"`);
        await queryRunner.query(`DROP TABLE "relationship"`);
    }

}
