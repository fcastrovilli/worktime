ALTER TABLE "project" ADD COLUMN "amountpaid" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "status" varchar DEFAULT 'inactive' NOT NULL;