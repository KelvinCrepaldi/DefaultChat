import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageNotificationTable1708623078024 implements MigrationInterface {
    name = 'MessageNotificationTable1708623078024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messagesNotifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "viewed" boolean NOT NULL, "userId" uuid, "messageId" uuid, CONSTRAINT "PK_5396d8c72665b74f247dd1207ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "messageNotificationsId" uuid`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" ADD CONSTRAINT "FK_ba5baf8d3a20ab4debc65cd1ee7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" ADD CONSTRAINT "FK_8c5ec628a78c79b9dd052431126" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_83021c60373a678f49522141507" FOREIGN KEY ("messageNotificationsId") REFERENCES "messagesNotifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_83021c60373a678f49522141507"`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" DROP CONSTRAINT "FK_8c5ec628a78c79b9dd052431126"`);
        await queryRunner.query(`ALTER TABLE "messagesNotifications" DROP CONSTRAINT "FK_ba5baf8d3a20ab4debc65cd1ee7"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "messageNotificationsId"`);
        await queryRunner.query(`DROP TABLE "messagesNotifications"`);
    }

}
