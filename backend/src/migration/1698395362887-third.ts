import { MigrationInterface, QueryRunner } from "typeorm";

export class Third1698395362887 implements MigrationInterface {
    name = 'Third1698395362887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_39cd28e0031884e624a88fdaaba"`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_39cd28e0031884e624a88fdaaba" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_39cd28e0031884e624a88fdaaba"`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_39cd28e0031884e624a88fdaaba" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
