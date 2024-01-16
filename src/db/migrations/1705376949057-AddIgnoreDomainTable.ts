import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIgnoreDomainTable1705376949057 implements MigrationInterface {
    name = 'AddIgnoreDomainTable1705376949057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ignore_domain_usefor_enum" AS ENUM('domainChecking')`);
        await queryRunner.query(`CREATE TABLE "ignore_domain" ("id" SERIAL NOT NULL, "domainName" character varying NOT NULL, "description" character varying NOT NULL, "useFor" "public"."ignore_domain_usefor_enum" NOT NULL, CONSTRAINT "PK_35eff72298356a798792101b326" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ignore_domain"`);
        await queryRunner.query(`DROP TYPE "public"."ignore_domain_usefor_enum"`);
    }

}
