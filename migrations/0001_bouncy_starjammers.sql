ALTER TABLE "client" ADD COLUMN "currency" text DEFAULT 'EUR' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "budget" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "pricehour" integer DEFAULT 0 NOT NULL;