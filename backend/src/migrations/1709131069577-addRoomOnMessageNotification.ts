import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomOnMessageNotification1709131069577 implements MigrationInterface {
    name = 'AddRoomOnMessageNotification1709131069577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messagesNotifications" ADD "roomId" uuid`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" ADD CONSTRAINT "FK_8dd5659564f66d2f46e75ab1844" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messagesNotifications" DROP CONSTRAINT "FK_8dd5659564f66d2f46e75ab1844"`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" DROP COLUMN "roomId"`);
    }

}
