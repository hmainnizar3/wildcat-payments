import { MigrationInterface, QueryRunner } from "typeorm";

export class Second1698394210904 implements MigrationInterface {
    name = 'Second1698394210904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "active" boolean NOT NULL, "businessSegment" boolean NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "active" boolean NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_customers_customer" ("userId" uuid NOT NULL, "customerId" uuid NOT NULL, CONSTRAINT "PK_afc0da3c48110e7b19301cf17e0" PRIMARY KEY ("userId", "customerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52e2c3de109cbd23d97b2491e3" ON "user_customers_customer" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39cd28e0031884e624a88fdaab" ON "user_customers_customer" ("customerId") `);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_52e2c3de109cbd23d97b2491e3e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_39cd28e0031884e624a88fdaaba" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_39cd28e0031884e624a88fdaaba"`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_52e2c3de109cbd23d97b2491e3e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39cd28e0031884e624a88fdaab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52e2c3de109cbd23d97b2491e3"`);
        await queryRunner.query(`DROP TABLE "user_customers_customer"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
