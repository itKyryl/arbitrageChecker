import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1705352902800 implements MigrationInterface {
    name = 'Init1705352902800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."telegram_user_mode_enum" AS ENUM('development', 'production')`);
        await queryRunner.query(`CREATE TYPE "public"."telegram_user_usefor_enum" AS ENUM('TT_URL_CHECK', 'TT_ACC_CHECK')`);
        await queryRunner.query(`CREATE TABLE "telegram_user" ("id" SERIAL NOT NULL, "chatId" character varying NOT NULL, "name" character varying NOT NULL, "mode" "public"."telegram_user_mode_enum" NOT NULL, "useFor" "public"."telegram_user_usefor_enum" NOT NULL, CONSTRAINT "PK_8e00b1def3edd3510248136f820" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "stopWrongTextAd" boolean NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ignore_account_accounttype_enum" AS ENUM('fb', 'tt')`);
        await queryRunner.query(`CREATE TYPE "public"."ignore_account_usefor_enum" AS ENUM('domainChecking')`);
        await queryRunner.query(`CREATE TABLE "ignore_account" ("id" SERIAL NOT NULL, "accountId" character varying NOT NULL, "accountType" "public"."ignore_account_accounttype_enum" NOT NULL, "useFor" "public"."ignore_account_usefor_enum" NOT NULL, CONSTRAINT "PK_fb906229dfda83d8197296fc708" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`DROP TABLE "ignore_account"`);
        await queryRunner.query(`DROP TYPE "public"."ignore_account_usefor_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ignore_account_accounttype_enum"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "telegram_user"`);
        await queryRunner.query(`DROP TYPE "public"."telegram_user_usefor_enum"`);
        await queryRunner.query(`DROP TYPE "public"."telegram_user_mode_enum"`);
    }

}
