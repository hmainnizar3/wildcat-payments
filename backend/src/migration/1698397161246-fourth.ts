import { MigrationInterface, QueryRunner } from "typeorm";

export class Fourth1698397161246 implements MigrationInterface {
    name = 'Fourth1698397161246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentRefId" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "thirdParty" character varying NOT NULL, "customerId" uuid, CONSTRAINT "UQ_a51b6ca8352ba70c15bc770f874" UNIQUE ("paymentRefId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_967ae37468fd0c08ea0fec41720" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_967ae37468fd0c08ea0fec41720"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
